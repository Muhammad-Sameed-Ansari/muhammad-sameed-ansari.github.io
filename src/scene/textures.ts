import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import { portfolio } from '../content/portfolio'

/** Small canvas-drawn textures, generated at runtime so there is nothing to download. */

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  draw(canvas.getContext('2d')!)
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

let floorTex: CanvasTexture | undefined
export function floorTexture() {
  floorTex ??= canvasTexture(512, 512, (ctx) => {
    const planks = 8
    const h = 512 / planks
    const tones = ['#ecc092', '#e6b787', '#efc69a', '#e9bb8c']
    for (let i = 0; i < planks; i++) {
      // Stagger plank joints row by row.
      const offset = (i * 197) % 512
      for (let k = -1; k < 2; k++) {
        ctx.fillStyle = tones[(i + k + 4) % tones.length]
        ctx.fillRect(offset + k * 512, i * h, 512, h)
        ctx.fillStyle = '#c99466'
        ctx.fillRect(offset + k * 512 - 2, i * h, 4, h)
      }
      ctx.fillStyle = '#c99466'
      ctx.fillRect(0, i * h - 2, 512, 4)
    }
  })
  floorTex.wrapS = floorTex.wrapT = RepeatWrapping
  floorTex.repeat.set(2.5, 2)
  return floorTex
}

const CODE_LINES = [
  ['kw', 'const '],
  ['fn', 'room'],
  ['tx', ' = '],
  ['fn', 'useRoom'],
  ['tx', '()'],
  null,
  ['kw', 'function '],
  ['fn', 'brewCoffee'],
  ['tx', '(cups: '],
  ['ty', 'number'],
  ['tx', ') {'],
  null,
  ['tx', '  '],
  ['kw', 'return '],
  ['st', "'☕'"],
  ['tx', '.repeat(cups)'],
  null,
  ['tx', '}'],
  null,
  null,
  ['cm', '// TODO: fix bug before coffee runs out'],
  null,
  ['kw', 'export default '],
  ['fn', 'App'],
  null,
  ['kw', 'if '],
  ['tx', '(tests.'],
  ['fn', 'pass'],
  ['tx', '()) '],
  ['fn', 'ship'],
  ['tx', '()'],
  null,
  ['kw', 'await '],
  ['fn', 'deploy'],
  ['tx', '({ env: '],
  ['st', "'prod'"],
  ['tx', ' })'],
  null,
  null,
] as const

const CODE_COLORS = {
  kw: '#ff9ac1',
  fn: '#8be9fd',
  tx: '#f8f8f2',
  ty: '#ffd166',
  st: '#a6e3a1',
  cm: '#8f88b5',
}

let codeTex: CanvasTexture | undefined
/** Tall strip of fake code for the second monitor; scroll it via texture.offset.y. */
export function codeTexture() {
  codeTex ??= canvasTexture(256, 512, (ctx) => {
    ctx.fillStyle = '#2b2640'
    ctx.fillRect(0, 0, 256, 512)
    ctx.font = 'bold 15px ui-monospace, Menlo, monospace'
    ctx.textBaseline = 'top'
    let x = 28
    let y = 10
    let line = 1
    const drawLineNumber = () => {
      ctx.fillStyle = '#5d5680'
      ctx.fillText(String(line).padStart(2, ' '), 2, y)
    }
    drawLineNumber()
    for (let pass = 0; pass < 2; pass++) {
      for (const tok of CODE_LINES) {
        if (!tok) {
          y += 21
          line++
          x = 28
          if (y > 500) break
          drawLineNumber()
          continue
        }
        ctx.fillStyle = CODE_COLORS[tok[0]]
        ctx.fillText(tok[1], x, y)
        x += ctx.measureText(tok[1]).width
      }
    }
  })
  codeTex.wrapT = RepeatWrapping
  codeTex.repeat.set(1, 0.55)
  return codeTex
}

let laptopTex: CanvasTexture | undefined
/** Mini version of the cartoon OS desktop, shown on the laptop in the 3D scene. */
export function laptopTexture() {
  laptopTex ??= canvasTexture(512, 320, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 512, 320)
    g.addColorStop(0, '#ffd6e0')
    g.addColorStop(1, '#c9e4ff')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 320)
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fillRect(0, 0, 512, 26)
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    portfolio.projects.slice(0, 6).forEach((p, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      const x = 70 + col * 110
      const y = 80 + row * 110
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.roundRect(x - 36, y - 36, 72, 72, 18)
      ctx.fill()
      ctx.lineWidth = 4
      ctx.strokeStyle = '#2d2541'
      ctx.stroke()
      ctx.fillStyle = '#2d2541'
      ctx.fillText(p.icon, x, y + 2)
    })
  })
  return laptopTex
}
