import { useStore } from '../store/useStore'

/**
 * Every sound effect is synthesized with the Web Audio API, so there are no audio files
 * to download or license. Sounds only play when the visitor has turned sound on.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null

/** Must be called from a user gesture (the "Enter my room" button) to satisfy autoplay rules. */
export function unlockAudio() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.6
    master.connect(ctx.destination)
  }
  void ctx.resume()
}

function audio() {
  if (!ctx || !master || !useStore.getState().sound) return null
  return { ctx, out: master, t: ctx.currentTime }
}

interface ToneOpts {
  freq: number
  to?: number
  dur: number
  type?: OscillatorType
  vol?: number
  delay?: number
}

function tone({ freq, to, dur, type = 'sine', vol = 0.2, delay = 0 }: ToneOpts) {
  const a = audio()
  if (!a) return
  const t = a.t + delay
  const osc = a.ctx.createOscillator()
  const gain = a.ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.015, dur / 4))
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(a.out)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

let noiseBuffer: AudioBuffer | null = null

function noise(dur: number, vol: number, freq: number, q = 1, sweepTo?: number) {
  const a = audio()
  if (!a) return
  if (!noiseBuffer) {
    noiseBuffer = a.ctx.createBuffer(1, a.ctx.sampleRate, a.ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  const src = a.ctx.createBufferSource()
  src.buffer = noiseBuffer
  const filter = a.ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(freq, a.t)
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, a.t + dur)
  filter.Q.value = q
  const gain = a.ctx.createGain()
  gain.gain.setValueAtTime(vol, a.t)
  gain.gain.exponentialRampToValueAtTime(0.0001, a.t + dur)
  src.connect(filter).connect(gain).connect(a.out)
  src.start(a.t, Math.random() * 0.5)
  src.stop(a.t + dur)
}

function meow() {
  const a = audio()
  if (!a) return
  const { t } = a
  const osc = a.ctx.createOscillator()
  const formant = a.ctx.createBiquadFilter()
  const gain = a.ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(520, t)
  osc.frequency.linearRampToValueAtTime(820, t + 0.18)
  osc.frequency.linearRampToValueAtTime(460, t + 0.6)
  formant.type = 'bandpass'
  formant.Q.value = 4
  formant.frequency.setValueAtTime(900, t)
  formant.frequency.linearRampToValueAtTime(1800, t + 0.2)
  formant.frequency.linearRampToValueAtTime(700, t + 0.6)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.35, t + 0.06)
  gain.gain.setValueAtTime(0.35, t + 0.4)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.65)
  osc.connect(formant).connect(gain).connect(a.out)
  osc.start(t)
  osc.stop(t + 0.7)
}

export const sfx = {
  pop: () => tone({ freq: 420, to: 880, dur: 0.1, vol: 0.22 }),
  click: () => tone({ freq: 1300, to: 900, dur: 0.035, type: 'triangle', vol: 0.12 }),
  step: () => noise(0.06, 0.08, 700, 0.8),
  type: () => noise(0.025, 0.05, 3200, 2),
  open: () => {
    tone({ freq: 523, dur: 0.12, type: 'triangle', vol: 0.16 })
    tone({ freq: 659, dur: 0.12, type: 'triangle', vol: 0.16, delay: 0.07 })
    tone({ freq: 784, dur: 0.18, type: 'triangle', vol: 0.16, delay: 0.14 })
  },
  close: () => {
    tone({ freq: 784, dur: 0.1, type: 'triangle', vol: 0.12 })
    tone({ freq: 523, dur: 0.14, type: 'triangle', vol: 0.12, delay: 0.07 })
  },
  toggle: () => tone({ freq: 900, to: 450, dur: 0.07, type: 'square', vol: 0.06 }),
  sparkle: () => {
    for (let i = 0; i < 4; i++)
      tone({ freq: 1400 + i * 260, dur: 0.12, vol: 0.07, delay: i * 0.06 })
  },
  boing: () => tone({ freq: 180, to: 520, dur: 0.35, type: 'sine', vol: 0.25 }),
  sip: () => noise(0.35, 0.12, 900, 3, 400),
  whoosh: () => noise(0.35, 0.1, 400, 0.7, 2400),
  meow,
}
