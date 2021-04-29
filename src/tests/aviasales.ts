import {PageSource} from "../test_runner";

export async function successTest(page: PageSource) {

    const when = new Date(Date.now());

    const year = when.getFullYear();

    const days = Math.floor(Math.random() * (((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) ? 366 : 365));

    when.setDate(when.getDate() + days);

    console.log(when.toDateString())

    await page('Aviasales')('Откуда')({action: 'установить текст', text: 'Токио'})

    await page('Aviasales')('Куда')({action: 'установить текст', text: 'Каир'})

    await page('Aviasales')('Когда')({action: 'нажать'})

    await page('Aviasales')('C')({action: 'установить дату', date: when.toDateString()})

    await page('Aviasales')('Обратный билет не нужен')({action: 'нажать'})

    await page('Aviasales')('Найти')({action: 'нажать'})

    await page('Subscribe for price')('Откуда')({action: 'проверить текст', expectedText: 'Токио'})

    await page('Subscribe for price')('Куда')({action: 'проверить текст', expectedText: 'Каир'})
}

export async function failTest(page: PageSource) {

    const when = new Date(Date.now());

    const year = when.getFullYear();

    const days = Math.floor(Math.random() * (((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) ? 366 : 365));

    when.setDate(when.getDate() + days);

    console.log(when.toDateString())

    await page('Aviasales')('Откуда')({action: 'установить текст', text: 'Стамбул'})

    await page('Aviasales')('Куда')({action: 'установить текст', text: 'Исламабад'})

    await page('Aviasales')('Когда')({action: 'нажать'})

    await page('Aviasales')('C')({action: 'установить дату', date: when.toDateString()})

    await page('Aviasales')('Обратный билет не нужен')({action: 'нажать'})

    await page('Aviasales')('Найти')({action: 'нажать'})

    await page('Subscribe for price')('Откуда')({action: 'проверить текст', expectedText: 'Токио'})

    await page('Subscribe for price')('Куда')({action: 'проверить текст', expectedText: 'Каир'})
}
