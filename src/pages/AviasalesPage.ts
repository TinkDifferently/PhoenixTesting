import {LocatableButton, LocatableCalendar, LocatableInput} from "../elements";
import {page} from "../page";
import {ThenableWebDriver} from "selenium-webdriver";
import context from "../context/context";

const
    from = new LocatableInput("Откуда", {
        xpath: "//input[@placeholder='Откуда']"
    }),

    destination = new LocatableInput("Куда", {
        xpath: "//input[@placeholder='Куда']"
    }),

    find = new LocatableButton('Найти', {
        xpath: '//div[@class="avia-form__submit"]',
    }),

    when = new LocatableButton('Когда', {
        xpath: "//div[@class='trip-duration__input-wrapper --departure']"
    }),

    since = new LocatableCalendar('C', {
        xpath: "//div[@class='calendar__month'][1]"
    }),

    oneWayTravel = new LocatableButton('Обратный билет не нужен', {
        xpath: "//span[text()='Обратный билет не нужен']"
    });

const switchAction: () => Promise<boolean> = async () => {
    const driver: ThenableWebDriver = context.get("driver");
    const result: unknown = await driver.wait(() => driver.executeScript("return document.getElementsByTagName('html')[0].className==='page --home --ru wf-inter-n4-inactive wf-inter-n6-active wf-active'"));
    return result as boolean;
}


export default page('Aviasales')([from, destination, when, find, since, oneWayTravel], switchAction)
