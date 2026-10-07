import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { portfolio } from '../content/portfolio'
import { sfx } from '../lib/sound'
import { SIT_SPOT } from '../scene/layout'
import { moveWithCollision } from '../scene/nav'
import { OBJECTS, type ObjectId } from '../scene/objects'
import { getAnchor } from '../scene/anchors'
import { spawnPuff } from '../scene/puffPool'
import { marker, now, view } from '../scene/runtime'
import { useStore } from '../store/useStore'
import { Avatar } from './Avatar'
import { arrive, noteActivity, playIdleFun, wave } from './commands'
import { emptyRig, type AvatarRig } from './rig'
import { CLIPS, blendPoses, clips, emptyPose, type Clip } from './poses'
import { char } from './runtime'

const WALK_SPEED = 2.6
const STRIDE = 5.4 // stride phase (radians) per unit walked
const NEAR_RADIUS = 1.05
const IDLE_FUN_AFTER = 20

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
const damp = (from: number, to: number, lambda: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-lambda * dt))

const speechAnchor = getAnchor('speech')
const INTERACTIVE = Object.values(OBJECTS).filter((o) => o.interact)

function nearestObject(): ObjectId | null {
  let best: ObjectId | null = null
  let bestD = NEAR_RADIUS
  for (const o of INTERACTIVE) {
    const d = Math.hypot(char.x - o.interact!.x, char.z - o.interact!.z)
    if (d < bestD) {
      bestD = d
      best = o.id
    }
  }
  return best
}

export function Character() {
  const root = useRef<Group>(null)
  const rig = useRef<AvatarRig>(emptyRig())
  const anim = useRef({
    weights: Object.fromEntries(CLIPS.map((c) => [c, c === 'idle' ? 1 : 0])) as Record<
      Clip,
      number
    >,
    pose: emptyPose(),
    phase: 0,
    lastContact: 0,
    nextBlink: 2,
    nextType: 0,
  })

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const st = useStore.getState()
    const a = anim.current
    const r = rig.current
    const prevX = char.x
    const prevZ = char.z

    // --- Locomotion ---
    const input = char.keys.x || char.keys.y ? char.keys : char.stick
    const steering = st.entered && !st.panel && (input.x !== 0 || input.y !== 0)

    if (steering) {
      if (char.sitting) {
        char.sitting = false
        st.closePanel()
      }
      char.path = []
      char.pending = null
      char.oneShot = null
      marker.active = false
      const yaw = Math.PI / 4 + view.yaw
      const fx = -Math.sin(yaw)
      const fz = -Math.cos(yaw)
      const rx = Math.cos(yaw)
      const rz = -Math.sin(yaw)
      let dx = fx * input.y + rx * input.x
      let dz = fz * input.y + rz * input.x
      const len = Math.hypot(dx, dz)
      const mag = Math.min(1, Math.hypot(input.x, input.y))
      dx = (dx / len) * mag
      dz = (dz / len) * mag
      Object.assign(char, moveWithCollision(char, dx * WALK_SPEED * dt, dz * WALK_SPEED * dt))
      char.targetHeading = Math.atan2(dx, dz)
      noteActivity()
      st.markMoved()
    } else if (char.path.length) {
      const wp = char.path[0]
      const dx = wp.x - char.x
      const dz = wp.z - char.z
      const dist = Math.hypot(dx, dz)
      const step = Math.min(dist, WALK_SPEED * dt)
      if (dist > 0.001) {
        char.x += (dx / dist) * step
        char.z += (dz / dist) * step
        char.targetHeading = Math.atan2(dx, dz)
      }
      if (dist - step < 0.01) {
        char.path.shift()
        if (!char.path.length) {
          marker.active = false
          const pending = char.pending
          char.pending = null
          if (pending) arrive(pending)
        }
      }
    } else if (char.sitting) {
      char.x = damp(char.x, SIT_SPOT.x, 8, dt)
      char.z = damp(char.z, SIT_SPOT.z, 8, dt)
      char.targetHeading = Math.PI
    }

    const moved = Math.hypot(char.x - prevX, char.z - prevZ)
    char.speed = damp(char.speed, moved / Math.max(dt, 1e-4), 12, dt)
    char.heading += wrapAngle(char.targetHeading - char.heading) * (1 - Math.exp(-12 * dt))

    // --- One-shots and idle fun ---
    const time = now()
    if (char.oneShot && time > char.oneShotUntil) {
      char.oneShot = null
      const after = char.afterOneShot
      char.afterOneShot = null
      after?.()
    }
    const idle = !char.sitting && !char.path.length && !char.oneShot && !steering
    if (idle && st.entered && !st.panel && time - char.lastActivity > IDLE_FUN_AFTER) {
      playIdleFun()
    }

    // --- Proximity ---
    const near = char.sitting || st.panel ? null : nearestObject()
    if (near !== st.nearId) st.setNear(near)

    // --- Animation ---
    const walking = char.speed > 0.25 && !char.sitting
    const clip: Clip = char.sitting
      ? 'sit'
      : char.oneShot && !walking
        ? char.oneShot
        : walking
          ? 'walk'
          : 'idle'
    if (walking) a.phase += moved * STRIDE
    for (const c of CLIPS) a.weights[c] = damp(a.weights[c], c === clip ? 1 : 0, 10, dt)

    const active = CLIPS.filter((c) => a.weights[c] > 0.001)
    const pose = blendPoses(
      active.map((c) => clips[c](t, a.phase)),
      active.map((c) => a.weights[c]),
      a.pose,
    )

    // Footsteps: a puff and a soft tap every time a foot lands.
    const contact = Math.abs(Math.sin(a.phase))
    if (walking && a.lastContact < 0.97 && contact >= 0.97) {
      const side = Math.sin(a.phase) > 0 ? 1 : -1
      const fx = char.x + Math.cos(char.heading) * 0.1 * side
      const fz = char.z - Math.sin(char.heading) * 0.1 * side
      spawnPuff(fx, 0.05, fz, { count: 2, size: 0.05, spread: 0.3, rise: 0.25, life: 0.5 })
      sfx.step()
    }
    a.lastContact = contact

    if (char.sitting && !st.panel && t > a.nextType) {
      sfx.type()
      a.nextType = t + 0.07 + Math.random() * 0.12
    }

    // --- Apply to the rig ---
    const rootNode = root.current
    if (rootNode) {
      rootNode.position.set(char.x, 0, char.z)
      rootNode.rotation.y = char.heading
    }
    const body = r.body
    if (body) {
      const sx = 1 / Math.sqrt(pose.squash)
      body.position.y = pose.y
      body.scale.set(sx, pose.squash, sx)
    }
    r.torso?.rotation.set(pose.lean, pose.twist, pose.sway)
    r.head?.rotation.set(pose.headX, pose.headY, pose.headZ)
    r.armL?.rotation.set(pose.armLX, 0, pose.armLZ)
    r.armR?.rotation.set(pose.armRX, 0, pose.armRZ)
    r.legL?.rotation.set(pose.legLX, 0, 0)
    r.legR?.rotation.set(pose.legRX, 0, 0)
    if (r.phone) r.phone.visible = a.weights.phone > 0.4
    if (r.mug) r.mug.visible = a.weights.sip > 0.4

    // Blink every few seconds.
    if (t > a.nextBlink) a.nextBlink = t + 2 + Math.random() * 3.5
    const blink = a.nextBlink - t < 0.12 ? 0.1 : 1
    r.eyes?.scale.set(1, damp(r.eyes.scale.y, blink, 40, dt), 1)

    speechAnchor.pos.set(char.x, 1.62 + pose.y, char.z)
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (e.delta > 8) return
    wave(
      ['Hi there! 👋', 'Hey hey! 😄', 'Thanks for visiting!', 'Boop! 🫵'][
        Math.floor(Math.random() * 4)
      ],
    )
    spawnPuff(char.x, 1.5, char.z, {
      count: 5,
      color: '#ffd166',
      size: 0.05,
      spread: 0.6,
      rise: 0.8,
    })
  }

  return (
    <group ref={root} onClick={onClick}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.32, 24]} />
        <meshBasicMaterial color="#2d2541" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <Avatar config={portfolio.avatar} rig={rig} />
    </group>
  )
}
