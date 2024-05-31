import { parseArgs } from 'node:util'
import { getVoices, ttsSave } from 'edge-tts'

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    gender: { type: 'string' }, // Male | Female
    locale: { type: 'string' }, // en | en-US | es | fr | fr-CA - new Set(await getVoices().then(a=>a.map(v=>v.Locale)))
    text: { type: 'string' },
  },
  allowPositionals: true,
})
if (values.gender === undefined) throw new Error('Must specify gender (Male || Female)')
if (values.locale === undefined) throw new Error('Must specify locale')
if (values.text === undefined) throw new Error('Must specify text')

const voices = await getVoices()
const selectedVoices = voices.filter(voice => voice.Gender === values.gender! && voice.Locale.startsWith(values.locale!))

for (let i = 0; i < selectedVoices.length; i++) {
  const voice = selectedVoices[i]
  const name = voice.ShortName
  console.log(`Sampling ${name} ${i + 1}/${selectedVoices.length}`)
  await ttsSave(values.text, `./development/samples/${name}.mp3`, { voice: name })
}
