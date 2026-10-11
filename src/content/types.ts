export type HairStyle = 'short' | 'swept' | 'curly' | 'long' | 'bun' | 'spiky' | 'buzz'
export type FacialHair = 'none' | 'stubble' | 'beard' | 'mustache'

/** Everything that controls how the cartoon "you" looks. Colors are any CSS hex string. */
export interface AvatarConfig {
  skin: string
  hairStyle: HairStyle
  hairColor: string
  eyeColor: string
  glasses: boolean
  glassesShape: 'round' | 'rectangle'
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

export interface StoreLink {
  store: 'app-store' | 'google-play'
  url: string
  /** Which app, when a project ships more than one, e.g. "Driver". */
  app?: string
}

export type Platform = 'web' | 'ios' | 'android' | 'ipad'

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
  /** Portrait phone screenshots (about 9:19.5) under /public. Shown inside a phone frame. */
  phoneShots?: string[]
  /** Landscape iPad screenshots (4:3) under /public. Shown inside a tablet frame. */
  tabletShots?: string[]
  /** Where it runs. The first entry is the main platform and decides which view a project opens in. */
  platforms: Platform[]
  liveUrl?: string
  repoUrl?: string
  /** App Store and Google Play listings. */
  stores?: StoreLink[]
  year: string
  /** Emoji used as the app icon on the laptop desktop. */
  icon: string
  /** Optional real logo under /public (SVG or PNG). Shown instead of the emoji wherever it fits. */
  logo?: string
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

/** A monthly plan on the "Hire me" panel and the classic view's Plans section. */
export interface Plan {
  name: string
  /** Shown large, e.g. "$400". */
  price: string
  /** Shown after the price, e.g. "/month". */
  cadence: string
  /** One line on who it's for. */
  forWho: string
  includes: string[]
  /** Highlighted as the recommended plan. Use on one plan at most. */
  featured?: boolean
}

export interface Hire {
  headline: string
  intro: string
  plans: Plan[]
  /** Short reassurances under the plans: trial, pausing, new builds. */
  notes: string[]
  /**
   * Booking page for "Book a free 15-min call". A cal.com link opens as a popup on the site;
   * any other link (e.g. Calendly) opens in a new tab. Without it, the button opens the form.
   */
  bookingUrl?: string
  /**
   * Where the enquiry form sends, via formsubmit.co. Defaults to `email`. After you activate
   * the form, FormSubmit emails you a random ID: put it here to keep your address out of the code.
   */
  formSubmitId?: string
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
  /** The "Hire me" offer: monthly plans for clients. */
  hire: Hire
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
