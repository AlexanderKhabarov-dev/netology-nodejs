#!/usr/bin/env node
import readline from 'node:readline'
import process from 'node:process'

const minNum = 0
const maxNum = 100

const rightAnswer = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ask = () => {
  rl.question(`Загадай число от ${minNum} до ${maxNum} \n`, (answer) => {
    const guess = Number(answer.trim())

    if (isNaN(guess)) {
      console.log('Пожалуйста, введите число.')
      ask()
      return
    }

    if (guess === rightAnswer) {
      console.log(`Отгадано число ${rightAnswer}`)
      rl.close()
    } else if (guess < rightAnswer) {
      console.log('Больше')
      ask()
    } else {
      console.log('Меньше')
      ask()
    }
  })
}

ask()