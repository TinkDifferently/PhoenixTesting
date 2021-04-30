import {buildPages} from "../utils";
import {PageElement} from "../page";
import context from "../context/context";
import {Builder} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import logger from "../logger";
import {refreshHandlers} from "../elements";

export type PageSource = (title: string) => PageElement<string>;

async function initDriver() {
    const path = require('chromedriver').path;
    const driver = new Builder().forBrowser('chrome')
        .build()
    context.push('driver', driver)
    context.push('current.page', "")
    driver.manage().setTimeouts({implicit: 30000, pageLoad: 30000, script: 30000})
        .then(() => driver.get(context.get("base.url")))
    return driver;
}

export type test = (page: PageSource) => Promise<void>;

export async function runTest(test: test | test[]): Promise<void> {

    let tests: test[];
    if (!(test instanceof Array)) {
        tests = [];
        tests.push(test);
    } else {
        tests = test;
    }

    if (tests.length == 0) {
        return;
    }

    const manager = await buildPages();
    refreshHandlers();


    const extractor = (pageTitle: string) => manager.get(pageTitle).get;

    for (const item of tests) {
        const driver = await initDriver();
        await item(extractor)
            .catch(any => {
                logger.error(any)
            })
        await driver.quit();
    }
}

