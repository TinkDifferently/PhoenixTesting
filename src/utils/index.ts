import {searchFiles} from './files-searcher'
import {Page} from '../page'

interface FilePathMapperOptions {
    startDirectory: string
}

export type PageManager = Map<string, Page<string>>;

export async function filePathMapper({startDirectory}: FilePathMapperOptions): Promise<PageManager> {
    const pages = new Map<string, Page<string>>();
    const regex: RegExp = new RegExp(`.*\\\\(.*).ts`);
    await searchFiles(startDirectory).then(files => {
        files.map(file => file.toString()).map(filePath => '../pages/' + regex.exec(filePath)[1])
            .filter(group => !group.includes('index'))
            .map(id => require(id).default)
            .forEach(page => pages.set(page.title, page))
    });
    return pages;
}

export async function buildPages(options: FilePathMapperOptions = {startDirectory: '/pages'}): Promise<PageManager> {
    return filePathMapper(options);
}

export function preventNever(val: never) {
    throw Error(val);
}

interface Period {
    millis?: number,
    seconds?: number,
    minutes?: number,
    hours?: number,
    days?: number,
    months?: number,
    years?: number,
}

type randomDate = {
    baseDate: Date,
    period: Period
}

export function createRandomDate({baseDate = new Date(), period}: randomDate) {

}

export function isLeapYear(currentYear: number) {
    return currentYear % 4 == 0 && currentYear % 100 != 0 || currentYear % 400 == 0;
}

export function addDate(date: Date, {millis = 0, seconds = 0, minutes = 0, hours = 0, days = 0, months = 0, years = 0}: Period) {
    return new Date(date.getFullYear() + years, date.getMonth() + months, date.getDate() + days)
}
