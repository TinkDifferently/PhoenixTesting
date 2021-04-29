import {addDate} from "../utils";

function testAddDateYearCommon() {
    const date = new Date(2005, 3, 22)
    const actual = addDate(date, {years: 4, months: 12, days: 60}).toDateString()
    const expected = 'Mon Jun 21 2010'
    if (actual !== expected) {
        throw Error(`Expected:'${expected}' Actual:'${actual}'`)
    }
}

function testAddDateYearLeap() {
    const date = new Date(1995, 2, 28)
    const actual = addDate(date, {years: 4, months: 11, days: 1}).toDateString()
    const expected = 'Tue Feb 29 2000'
    if (actual !== expected) {
        throw Error(`Expected:'${expected}' Actual:'${actual}'`)
    }
}

function testAddDate() {
    testAddDateYearCommon();
    testAddDateYearLeap();
}

function testUtils() {
    testAddDate();
}

testUtils();
