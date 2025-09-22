#!/usr/bin/env node
import dotenv from 'dotenv'
import readline from 'node:readline'
import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

dotenv.config({ path: '.env' })

const headers = {
  'X-Yandex-Weather-Key': process.env.API_YANDEX_WEATHER
}

const windDirectionDescriptions = {
  nw: 'Северо-западный',
  n: 'Северный',
  ne: 'Северо-восточный',
  e: 'Восточный',
  se: 'Юго-восточный',
  s: 'Южный',
  sw: 'Юго-западный',
  w: 'Западный',
  c: 'Штиль (штиль или слабый ветер)'
}

const getGeoCoordinatesFromAddress = async (address) => {
  const encodedAddress = encodeURIComponent(address)
  const url = `https://geocode-maps.yandex.ru/v1/?apikey=${process.env.API_YANDEX_GEOCODER}&geocode=${encodedAddress}&format=json`

  const res = await fetch(url, { headers })
  const data = await res.json()
  const geoPos = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos

  const [longitude, latitude] = geoPos.split(' ')

  return { longitude, latitude }
}

const getWeatherFromCoord = async ({ longitude, latitude }) => {
  const url = `https://api.weather.yandex.ru/v2/forecast?lat=${latitude}&lon=${longitude}`
 
  const res = await fetch(url, { headers })
  const data = await res.json()

  return data
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getWeatherCommand = async () => {
  rl.question('Напишите адрес:', async (answer) => {
    const { longitude, latitude } = await getGeoCoordinatesFromAddress(answer)
    const data = await getWeatherFromCoord({ longitude, latitude })

    const temperature = data.fact.temp
    const windSpeed = data.fact.wind_speed
    const windDirection = data.fact.wind_dir

    const dateUtc = new Date(data.now * 1000)
    const dateLocal = new Date(dateUtc.getTime()).toString()

    const timeText = ` * Время: ${dateLocal}\n`
    const tempText = `* Температура: ${temperature}°\n`
    const weatherText = `* Ветер: ${windDirectionDescriptions[windDirection]} ${windSpeed} м/с\n`

    console.log(timeText, tempText, weatherText)
    rl.close()
  })
}

yargs(hideBin(process.argv))
  .command('getWeather', 'Получить погоду', getWeatherCommand)
  .help()
  .parse()
