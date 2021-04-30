import context from "../context/context";
import {Locator, WebDriver, WebElementPromise} from "selenium-webdriver";
import {elementTextMatches} from "selenium-webdriver/lib/until";
import {Action, Interaction} from "./actions";

export type Element<T extends string = string> = {
    locator: Locator;
    elementName: T;
}

export interface HasText {
    getText: () => Promise<string>;
}

export interface AssertText extends HasText {
    checkText: (expectedText: string) => Promise<boolean>;
}

export interface InputText extends HasText {
    setText: (text: string) => void;
}

export interface InputDate extends HasText {
    setText: (text: string) => void;
}

export interface HasTitle {
    getTitle: () => string;
}


export interface Clickable {
    click: (input?: object) => Promise<void>;
}

function find(locator: Locator): WebElementPromise {
    const driver: WebDriver = context.get('driver');
    return driver.findElement(locator);
}

abstract class LocatableElement<T extends string> implements Element<T> {

    protected constructor(title: T, locator: Locator) {
        this.locator = locator;
        this.elementName = title;
    }

    find = () => find(this.locator);

    elementName: T;

    locator: Locator;
}

export class LocatableButton<T extends string> extends LocatableElement<T> implements Clickable {
    constructor(title: T, locator: Locator) {
        super(title, locator);
    }

    async click(): Promise<void> {
        const element = this.find();
        await element.click();
    }
}

export class LocatableLabel<T extends string> extends LocatableElement<T> implements AssertText {
    constructor(title: T, locator: Locator) {
        super(title, locator);
    }

    async checkText(expectedText: string): Promise<boolean> {
        const actual = await this.getText();
        if (actual !== expectedText) {
            throw Error(`Actual text: '${actual}' does not fit expected '${expectedText}'`)
        }
        return true;
    }

    async getText(): Promise<string> {
        const driver: WebDriver = await context.get('driver');
        const el = await this.find();
        driver.wait(elementTextMatches(el, /.+/))
        return await el.getText();
    }
}

export class LocatableInput<T extends string> extends LocatableElement<T> implements InputText {
    constructor(title: T, locator: Locator) {
        super(title, locator);
    }

    async getText(): Promise<string> {
        return await this.find().getText();
    }

    async setText(text: string): Promise<void> {
        const el = this.find();
        await el.click();
        await el.sendKeys(text);
    }
}

export class LocatableCalendar<T extends string> extends LocatableElement<T> implements InputDate {
    constructor(title: T, locator: Locator) {
        super(title, locator);
    }

    async getText(): Promise<string> {
        return await this.find().getText();
    }

    async setText(date: string = new Date().toDateString()): Promise<void> {
        const dateBox = new Date(Date.parse(date))
        const month = new Intl.DateTimeFormat('ru', {month: 'long'}).format(dateBox).substr(1);
        const day = new Intl.DateTimeFormat('ru', {day: 'numeric'}).format(dateBox)
        const monthSelect = this.find().findElement({xpath: `.//select[@class='calendar-caption__select']`});
        await monthSelect.click()
        const monthValue = this.find().findElement({xpath: `.//option[contains(text(),'${month}')]`});
        await monthValue.click();
        const dayValue = this.find().findElement({xpath: `.//div[@class='calendar-day__date'][text()='${day}']`});
        await dayValue.click();
    }
}


type handler = (element: Element, action: Action<string>) => Promise<boolean>;
export let handlers: handler[] = [];

function initHandlers() {

    handlers.push(async (element, {action}) => {
        throw Error(`Не зарегестрирован хендл для '${action}'`)
    })

    handlers.push(async (element, {action}: Interaction) => {
        if (action === 'click' || action == 'нажать') {
            const clickable = element as unknown as Clickable;
            await clickable.click();
            return true;
        }
        return false;
    })

    handlers.push(async (element, {action}) => {
        if (action === 'get text' || action === 'получить текст') {
            const hasText = element as unknown as HasText;
            await hasText.getText();
            return true;
        }
        return false;
    })

    handlers.push(async (element, action: Interaction) => {
        if (action.action === 'set text' || action.action == 'установить текст') {
            const inputText = element as unknown as InputText;
            await inputText.setText(action.text);
            return true;
        }
        return false;
    })

    handlers.push(async (element, action: Interaction) => {
        if (action.action === 'set date' || action.action == 'установить дату') {
            const inputDate = element as unknown as InputDate;
            await inputDate.setText(action.date);
            return true;
        }
        return false;
    })

    handlers.push(async (element, action: Interaction) => {
        if (action.action === 'check text' || action.action == 'проверить текст') {
            const assertText = element as unknown as AssertText;
            await assertText.checkText(action.expectedText);
            return true;
        }
        return false;
    })
}

export function refreshHandlers() {
    handlers = [];
    initHandlers();
}

export function pushHandler(handler: handler) {
    handlers.push(handler)
}







