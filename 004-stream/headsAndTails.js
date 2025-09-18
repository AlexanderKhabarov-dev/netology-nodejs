#!/usr/bin/env node
import readline from 'node:readline'
import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const HEADS_NUM = 1
const TAILS_NUM = 2

const ANSWER_TEXT = {
  1: 'Орёл',
  2: 'Решка'
}

const rightAnswer = Math.floor(Math.random() * (HEADS_NUM - TAILS_NUM + 1)) + HEADS_NUM

const handleAppendFile = ({ filePath, content }) => {
  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.error('Ошибка при добавлении текста:', err)
      return
    }

    console.log(`${filePath} обновлён!`)
  })
}

const handleCreateFile = ({ filePath, content }) => {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Ошибка при создании файла:', err)
      return
    }
    
    console.log(`${filePath} создан!`)
  })
}

const parseFile = (content) => {
  const rightRegex = new RegExp(/(?:^|[\s.,—\-!?])Вы отгадали(?:$|[\s.,—\-!?])/gi)
  const wrongRegex = new RegExp(/(?:^|[\s.,—\-!?])Вы не отгадали(?:$|[\s.,—\-!?])/gi)

  const winCount = content.match(rightRegex)?.length ?? 0 
  const lossCount = content.match(wrongRegex)?.length ?? 0

  const totalCount = winCount + lossCount

  const totalPercent = 100 / totalCount 
  const winPercent = (totalPercent * winCount).toFixed(1)
  const lossPercent = (totalPercent * lossCount).toFixed(1)

  return { winCount, lossCount, totalCount, winPercent, lossPercent }
}

const handleReadFile = (fileName) => {
  const filePath = path.join(__dirname, 'logs', fileName)

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const { winCount, lossCount, totalCount, winPercent, lossPercent } = parseFile(data)

    const totalMatchesText = ` * Общее количество партий — ${totalCount}\n`
    const winLossCountsText = `* Количество выигранных партий — ${winCount}, проигранных — ${lossCount}\n`
    const winLossPercentText = `* Процент выигранных игр — ${winPercent}%, проигранных — ${lossPercent}%\n`

    console.log(totalMatchesText, winLossCountsText, winLossPercentText)
  })
}

const handleCreateFileFromReadline = ({ name, content, extension = 'txt'}) => {
  const fileName = `${name}.${extension}`
  const filePath = path.join(__dirname, 'logs', fileName) 

  const isFileExist = fs.existsSync(filePath)

  if (isFileExist) {
    return handleAppendFile({ filePath, content })
  } 

  return handleCreateFile({ filePath, content })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ask = () => {
  rl.question(`Орёл или решка? \n${HEADS_NUM} — Орёл \n${TAILS_NUM} — Решка \n----------\n`, (answer) => {
    const guess = Number(answer.trim())
    const isValidNum = guess === HEADS_NUM || guess === TAILS_NUM

    if (!isValidNum) {
      console.log('Пожалуйста, введите число 1 или 2.')
      ask()
      return
    }

    rl.question('Введите имя файла без расширения, чтобы сохранить статистику: \n', (answer) => {
      const localizeText = ANSWER_TEXT[rightAnswer]

      const winText = `${new Date()}. Вы отгадали, правильный ответ — ${localizeText}.\n`
      const lossText = `${new Date()}. Вы не отгадали, правильный ответ — ${localizeText}.\n`

      const fileContent = guess === rightAnswer ? winText : lossText
      
      console.log(fileContent)
      handleCreateFileFromReadline({ name: answer, content: fileContent  })

      rl.close()
    })
  })
}

yargs(hideBin(process.argv))
  .command('start', 'Начать игру', ask)
  .command('stats', 'Показать статистику игры', (yargs) => yargs.option('fileName', {
    type: 'string',
    describe: 'Имя файла',
  }), 
  ({ fileName }) => {
    if (!fileName) {
      console.log('Введите имя файла.') 
      rl.close()
    }

    handleReadFile(fileName)
    rl.close()
  })
  .help()
  .parse()

