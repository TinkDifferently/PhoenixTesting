import {Element, Interaction} from "../elements";
import {preventNever} from "../utils";
import context from "../context/context";
import {ThenableWebDriver, WebDriver} from "selenium-webdriver";

export type PageInteraction = (interaction: Interaction) => void;

export type PageElement<T extends string> = (elementName: T) => PageInteraction;

export interface Page<T extends string> {
    title: string;
    content: readonly Element[];
    get: PageElement<T>;
}

function bindPage<T extends string>(title: string, content: readonly Element[], switchAction?:()=>Promise<boolean>): Page<T> {
    return {
        get: (displayName: T) => {
            const element = content.find(element => element.elementName === displayName);
            console.log(`\n[action]\n[element] ${title}->${element.elementName}`)
            return async (interaction: Interaction) => {
                console.log(`[interaction] ${interaction.action}`)
                const current=context.get("current.page");
                const {wait}: WebDriver = context.get('driver');
                await wait(()=>"return document.readyState === 'complete'")
                if (current!==title) {
                    if (switchAction != undefined) {
                        const result = await switchAction();
                        if (!result) {
                            throw Error('Page could not be loaded');
                        }
                    }
                    context.push("current.page",title);
                }
                  switch (interaction.action) {
                    case "click":
                    case "нажать":
                        await element['click']();
                        return;
                    case "get text":
                    case "получить текст":
                        await element['getText']();
                        return;
                    case "set text":
                    case "установить текст":
                        await element['setText'](interaction.text);
                        return;
                    case "set date":
                    case "установить дату":
                        await element['setText'](interaction.date);
                        return;
                    case "check text":
                    case "проверить текст":
                        await element['checkText'](interaction.expectedText)
                        return;
                    default:
                        preventNever(interaction);
                }
            }
        },
        title,
        content,
    }
}


export function page<T extends readonly Element[], Y extends string>(title: string): (content: readonly Element[], switchAction?: () => Promise<boolean>) => Page<Y> {
    return (content: readonly Element[], switchAction?: () => Promise<boolean>) => {
        const elemNames: string[] = content.map(({elementName}) => elementName);
        type elemTypes = typeof elemNames[number];
        return bindPage<elemTypes>(title, content,switchAction);
    };
}
