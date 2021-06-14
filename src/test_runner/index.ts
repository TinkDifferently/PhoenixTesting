import {buildPages} from "../utils";
import {PageElement} from "../page";
import context from "../context/context";
import {Builder} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import logger from "../logger";
import {refreshHandlers} from "../elements";
import {Test} from "../test";
import {AutotestError, handleError, initErrorHandlers, SUCCESS} from "../exceptions";
import {Action, Interaction} from "../elements/actions";

export type PageSource<Y extends Action<string>=Interaction> = (title: string) => PageElement<string,Y>;

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

interface TestResult {
    name: string,
    status?: number,
    reason?: string,
}

export async function runTest(test: Test | Test[]): Promise<void> {
    let tests: Test[];
    if (!(test instanceof Array)) {
        tests = [];
        tests.push(test);
    } else {
        tests = test;
    }

    if (tests.length == 0) {
        return;
    }

    const pagePath: string = context.get("page.path");
    const manager = await buildPages({startDirectory: pagePath});
    refreshHandlers();


    const extractor = (pageTitle: string) => manager.get(pageTitle).get;

    const results: TestResult[] = []

    for (const {name, run} of tests) {
        const driver = await initDriver();
        console.log(`Начало теста '${name}'`)
        await run(extractor)
            .then(() => results.push({name: name, status: SUCCESS}))
            .catch((reason:AutotestError) => {
                results.push({
                    name,
                    status: reason['statusCode'],
                    reason:reason.message
                })
                logger.error(reason)
            })
        await driver.quit();
    }

    initErrorHandlers()
    const groups: Set<number | undefined> = new Set(results.map(({status}) => status));
    groups.forEach(group => {
        handleError(new AutotestError(group))
        results.filter(({status}) => status == group)
            .forEach(({name,reason}) => console.log(`${name}${reason? `: ${reason}`:""}`))
    })
}

