export const clickDef = ['click', 'нажать'] as const
export const setTextDef = ['set text', 'установить текст'] as const
export const getTextDef = ['get text', 'получить текст'] as const
export const setDateDef = ['set date', 'установить дату'] as const
export const checkTextDef = ['check text', 'проверить текст'] as const

export type click = typeof clickDef[number];
export type setText = typeof setTextDef[number];
export type setDate = typeof setDateDef[number];
export type getText = typeof getTextDef[number];
export type checkText = typeof checkTextDef[number];

export interface Action<T extends string> {
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
