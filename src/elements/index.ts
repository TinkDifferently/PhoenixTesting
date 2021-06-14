import context from "../context/context";
import {Locator, WebDriver, WebElement, WebElementPromise} from "selenium-webdriver";
import {elementTextMatches} from "selenium-webdriver/lib/until";
import {Action, Interaction} from "./actions";
import {AutotestFailed} from "../exceptions";

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

export interface SelectByValue {
    selectByValue: (value: string) => void;
}

export interface SelectByIndex {
    selectByIndex: (index: number) => void;
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

export abstract class LocatableElement<T extends string> implements Element<T> {

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
        console.log(actual)
        if (actual !== expectedText) {
            throw new AutotestFailed(`Actual text: '${actual}' does not fit expected '${expectedText}'`)
        }
        return true;
    }

    async getText(): Promise<string> {
        const driver: WebDriver = await context.get('driver');
        let el = await this.find();
        await driver.wait(elementTextMatches(el, /.+/))
        el = this.find()
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

export class LocatableSelect<T extends string> extends LocatableElement<T> implements SelectByValue, SelectByIndex {
    constructor(title: T, locator: Locator, itemLocator: Locator) {
        super(title, locator);
        this.itemLocator = itemLocator;
    }

    itemLocator: Locator;

    async getOptions(): Promise<WebElement[]> {
        return await this.find().findElements(this.itemLocator)
    }

    async selectByIndex(index: number): Promise<void> {
        const options = await this.getOptions();
        if (options.length === 0) {
            throw new AutotestFailed("Пустой список");
        }
        if (options.length <= --index) {
            throw new AutotestFailed(`В списке только '${index}' опций`);
        }
        await options[index].click()
    }

    async selectByValue(value: string): Promise<void> {
        const options = await this.getOptions();
        if (options.length === 0) {
            throw new AutotestFailed("Пустой список");
        }
        for (const option of options) {
            const item = await option;
            const actual = await item.getText();
            if (actual === value) {
                await item.click()
                return;
            }
        }
        throw new AutotestFailed(`В списке нет элемента со значением '${value}'`)
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

    handlers.push(async (element, action: Interaction) => {
        if (action.action === 'select item' || action.action === 'выбрать элемент') {
            if (action['text']) {
                const select = element as unknown as SelectByValue;
                await select.selectByValue(action['text'])
            } else {
                const select = element as unknown as SelectByIndex;
                await select.selectByIndex(action['index'])
            }
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







