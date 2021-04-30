import {Element, handlers} from "../elements";
import context from "../context/context";
import {WebDriver} from "selenium-webdriver";
import {Interaction} from "../elements/actions";

export type PageInteraction = (interaction: Interaction) => void;

export type PageElement<T extends string> = (elementName: T) => PageInteraction;

export interface Page<T extends string> {
    title: string;
    content: readonly Element[];
    get: PageElement<T>;
}

function bindPage<T extends string>(title: string, content: readonly Element[], switchAction?: () => Promise<boolean>): Page<T> {
    return {
        get: (displayName: T) => {
            const element = content.find(element => element.elementName === displayName);
            console.log(`\n[action]\n[element] ${title}->${element.elementName}`)
            return async (interaction: Interaction) => {
                console.log(`[interaction] ${interaction.action}`)
                const current = context.get("current.page");
                const {wait}: WebDriver = context.get('driver');
                await wait(() => "return document.readyState === 'complete'")
                if (current !== title) {
                    if (switchAction != undefined) {
                        const result = await switchAction();
                        if (!result) {
                            throw Error('Page could not be loaded');
                        }
                    }
                    context.push("current.page", title);
                }
                for (let i=handlers.length-1;i>-1;i--) {
                    if (await handlers[i](element, interaction)) {
                        return;
                    }
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
        return bindPage<elemTypes>(title, content, switchAction);
    };
}
