#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().toLocaleString('ru-RU', { month: 'long' })
const CURRENT_DATE = new Date().getDate()

const getCurrentYearText = (year) => year ? `Текущий год: ${CURRENT_YEAR}` : null
const getCurrentMonthText = (month) => month ? `Текущий месяц: ${CURRENT_MONTH}` : null
const getCurrentDayText = (day) => day ? `Текущая календарная дата в месяце: ${CURRENT_DATE}` : null

export const getFutureDate = ({ addDay, addMonth, addYear }) => {
  const date = new Date()

  if (addDay) {
    date.setDate(date.getDate() + addDay)
  }

  if (addMonth) {
    date.setMonth(date.getMonth() + addMonth)
  }

  if (addYear) {
    date.setFullYear(date.getFullYear() + addYear)
  }

  return date.toISOString()
}

export const getPastDate = ({ subtractDay, subtractMonth, subtractYear }) => {
  const date = new Date();

  if (subtractDay) {
    date.setDate(date.getDate() - subtractDay)
  }

  if (subtractMonth) {
    date.setMonth(date.getMonth() - subtractMonth)
  }

  if (subtractYear) {
    date.setFullYear(date.getFullYear() - subtractYear)
  }

  return date.toISOString()
}

const argv = yargs(hideBin(process.argv))
  .option('year', {
    type: 'boolean',
    describe: 'Показать текущий год',
  })
  .option('month', {
    type: 'boolean',
    describe: 'Показать текущий месяц',
  })
  .option('date', {
    type: 'boolean',
    describe: 'Показать дату в календарном месяце',
  })
  .command('add', 'Добавить время к текущей дате -y {num} -m {num} -d {num}', (yargs) => {
    return yargs
      .option('d', {
        type: 'number',
        describe: 'Количество дней для добавления',
      })
      .option('m', {
        type: 'number',
        describe: 'Количество месяцев для добавления',
      })
      .option('y', {
        type: 'number',
        describe: 'Количество лет для добавления',
      })
    }, ({ d, m, y }) => {
      const futureDate = getFutureDate({ 
        addDay: d, 
        addMonth: m, 
        addYear: y 
      })

      console.log(futureDate)
    })
  .command('sub', 'Отнять время от текущей даты -y {num} -m {num} -d {num}', (yargs) => {
    return yargs
      .option('d', {
        type: 'number',
        describe: 'Количество дней для добавления',
      })
      .option('m', {
        type: 'number',
        describe: 'Количество месяцев для добавления',
      })
      .option('y', {
        type: 'number',
        describe: 'Количество лет для добавления',
      })
    }, ({ d, m, y }) => {
      const pastDate = getPastDate({ 
        subtractDay: d, 
        subtractMonth: m, 
        subtractYear: y 
      })

      console.log(pastDate)
    })
  .help()
  .parse()

  const currentYearText = getCurrentYearText(argv.year)
  const currentMonthText = getCurrentMonthText(argv.month)
  const currentDayText =  getCurrentDayText(argv.date)

  if (currentYearText) {
    console.log(currentYearText)
  }

  if (currentMonthText) {
    console.log(currentMonthText)
  }

  if (currentDayText) {
    console.log(currentDayText)
  }
