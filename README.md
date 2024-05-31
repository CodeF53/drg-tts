# drg-tts
A TTS for Dystopian Robot Girlfriend

1. install [tesseract (optical character recognition)](https://github.com/UB-Mannheim/tesseract/wiki) and [VLC (audio player)](https://www.videolan.org/)
2. add `C:\Program Files\Tesseract-OCR` and `C:\Program Files (x86)\VideoLAN\VLC` to your path file [instructions for how to add shit to path](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/)
3. [install bun](https://bun.sh/)
4. install npm packages `bun install`
5. `bun start`

## Development tools
`bun .\development\createSamples.ts --gender Male --locale en --sample "Example text to be said matching voices"`
