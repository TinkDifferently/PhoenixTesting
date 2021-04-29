import context from "../context/context";
import {Locator, WebDriver, WebElement, WebElementPromise} from "selenium-webdriver";
import {elementTextMatches} from "selenium-webdriver/lib/until";

export type click = 'click' | 'нажать';
export type setText = 'set text' | 'установить текст';
export type setDate = 'set date' | 'установить дату';
export type getText = 'get text' | 'получить текст';
export type checkText = 'check text' | 'проверить текст';

type elementAction = click | setText | getText | setDate | checkText;

interface Action<T extends elementAction> {
    action: T;
}

interface ClickAction extends Action<click> {

}

interface AssertTextAction extends Action<checkText> {
    expectedText: string
}

interface SetTextAction extends Action<setText> {
    text: string;
}

interface SetDateAction extends Action<setDate> {
    date: string;
}

interface GetTextAction extends Action<getText> {
    key: string;
}

export type Interaction = ClickAction | SetTextAction | GetTextAction | SetDateAction | AssertTextAction;

export type Element<T extends string = string> = {
    locator: Locator;
    elementName: T;
}

export interface HasText {
    getText: () => Promise<string>;
}

export interface IAssertText extends HasText {
    checkText: (expectedText: string) => Promise<boolean>;
}

export interface IInputText extends HasText {
    setText: (text: string) => void;
}

export interface IInputDate extends HasText {
    setText: (text: string) => void;
}

export interface HasTitle {
    getTitle: () => string;
}

export type Provider = {
    elementName?: string,
}


export interface Clickable {
    click: (input?: object) => void;
}

export type ButtonProvider = Provider & HasTitle & Clickable;

export type InputProvider = Provider & IInputText & Clickable;

export type Button = Element & ButtonProvider;

export type Input = Element & InputProvider;

export const WebButton: ButtonProvider = {
    getTitle: () => '',
    click: () => {

    },
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

export class LocatableLabel<T extends string> extends LocatableElement<T> implements IAssertText {
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

export class LocatableInput<T extends string> extends LocatableElement<T> implements IInputText {
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

export class LocatableCalendar<T extends string> extends LocatableElement<T> implements IInputDate {
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







