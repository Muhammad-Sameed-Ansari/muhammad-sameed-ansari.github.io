export type HairStyle = 'short' | 'curly' | 'long' | 'bun' | 'spiky' | 'buzz'
export type FacialHair = 'none' | 'beard' | 'mustache'

/** Everything that controls how the cartoon "you" looks. Colors are any CSS hex string. */
export interface AvatarConfig {
  skin: string
  hairStyle: HairStyle
  hairColor: string
  eyeColor: string
  glasses: boolean
  glassesColor: string
  facialHair: FacialHair
  headphones: boolean
  hoodie: string
  pants: string
  shoes: string
}

export interface Social {
  label: string
  url: string
  /** Short handle shown next to the label, e.g. "@your-handle". */
  handle: string
  icon: 'github' | 'linkedin' | 'email' | 'x' | 'globe' | 'dribbble' | 'youtube'
}

export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  /** What you did on it, e.g. "Solo build" or "Team project: built the Schedule module". */
  role?: string
  tech: string[]
  /** Paths under /public, e.g. "/projects/my-app-1.webp". The first one is the cover. */
  images: string[]
  liveUrl?: string
  repoUrl?: string
  year: string
  /** Emoji used as the app icon on the laptop desktop. */
  icon: string
  /** Icon tile background color. */
  color: string
}

export interface Skill {
  name: string
  /** 1 (learning) to 5 (expert). */
  level: 1 | 2 | 3 | 4 | 5
}

export interface SkillCategory {
  name: string
  /** Book spine color for this shelf. */
  color: string
  skills: Skill[]
}

export interface TimelineEntry {
  title: string
  org: string
  start: string
  end: string
  location?: string
  highlights: string[]
}

export interface Portfolio {
  name: string
  /** The name you go by, used in greetings and the laptop OS, e.g. "Alex". */
  shortName: string
  /** Shown in the HUD, e.g. "Frontend Developer". */
  title: string
  location: string
  /** Each string is one paragraph. */
  bio: string[]
  funFacts: string[]
  /** Path under /public. */
  resumeUrl: string
  email: string
  avatar: AvatarConfig
  socials: Social[]
  projects: Project[]
  skills: SkillCategory[]
  experience: TimelineEntry[]
  education: TimelineEntry[]
  /** Name of the cat sleeping in the room. */
  petName: string
  seo: {
    description: string
    /** Absolute URL where the site is deployed. Used for Open Graph tags. */
    siteUrl: string
  }
}
