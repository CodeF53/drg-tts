import { unlinkSync } from 'node:fs'
import { type Image, Window } from 'node-screenshots'
import tesseract from 'node-tesseract-ocr'
import _ from 'lodash'
import { ttsSave } from 'edge-tts'
import { $ } from 'bun'

const voices = await Bun.file('config/voices.json').text().then(JSON.parse)

const gameWindow = Window.all().find(w => w.appName === 'My Dystopian Robot Girlfriend.exe') as Window
if (gameWindow === undefined)
  throw new Error('Could not find game window')

async function getDialogue(): Promise<{ name: string, text: string }> {
  async function getImageText(img: Image): Promise<string> {
    const imgBuffer = await img.toPng() // TODO: 1/4 resolution to speed up OCR
    const res = await tesseract.recognize(imgBuffer, { lang: 'eng' })
    return res.trim().replaceAll('|', 'I').replaceAll('\r\n', ' ')
  }
  const capture = await gameWindow.captureImage()
  let [name, text] = await Promise.all([
    capture.crop(300, 729, 335, 40).then(getImageText),
    capture.crop(300, 807, 1315, 240).then(getImageText),
  ])
  if (name === '') name = 'thought'
  name = name.toLowerCase().match(/^[\w\s]*/)![0].trim()
  return { name, text }
}

const playDialogue = _.debounce(async (name, text) => {
  console.log({ name, text })
  const filename = `./tempAudio/${name}-${Math.random()}.mp3`
  console.log(voices[name])
  await ttsSave(text, filename, { voice: voices[name] })
  await $`vlc -I dummy --dummy-quiet ${filename} vlc://quit`.quiet()
  unlinkSync(filename)
}, 500)

let lastSeen = ''
while (true) {
  const { name, text } = await getDialogue()
  if (text === '') continue
  if (lastSeen === `${name}:${text}`) continue
  lastSeen = `${name}:${text}`
  await playDialogue(name, text)
}
