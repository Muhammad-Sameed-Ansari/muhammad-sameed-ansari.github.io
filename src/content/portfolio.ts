import type { Portfolio } from './types.ts'

/**
 * ALL personal content for the site lives here. The 3D room, the panels and the
 * classic view read from this object, so you never need to touch 3D code to update it.
 *
 * Everything below is placeholder data. Search for "TODO: replace" and swap in your own.
 */
export const portfolio: Portfolio = {
  name: 'Alex Rivera', // TODO: replace
  title: 'Full-Stack Developer', // TODO: replace
  location: 'Somewhere with good coffee ☕', // TODO: replace

  // TODO: replace — one string per paragraph.
  bio: [
    "Hi! I'm Alex, a developer who loves building things that feel good to use. I care about the tiny details: snappy interactions, friendly copy and code that the next person can read.",
    'Lately I have been working on web apps with React and TypeScript, playing with 3D on the web, and drinking far too much coffee.',
  ],

  // TODO: replace
  funFacts: [
    'Has refactored the same side project 4 times',
    'Can name every Pokémon from Gen 1',
    'Makes a mean cardamom latte',
    'Keyboard collection: 3 (and counting)',
  ],

  resumeUrl: '/resume.pdf', // TODO: replace the file in /public
  email: 'hello@example.com', // TODO: replace

  // TODO: replace — make the avatar look like you.
  avatar: {
    skin: '#e8b48f',
    hairStyle: 'short', // 'short' | 'curly' | 'long' | 'bun' | 'spiky' | 'buzz'
    hairColor: '#2e2420',
    eyeColor: '#2d2541',
    glasses: true,
    glassesColor: '#2d2541',
    facialHair: 'none', // 'none' | 'beard' | 'mustache'
    headphones: false,
    hoodie: '#7c9cff',
    pants: '#45406b',
    shoes: '#fffaf0',
  },

  // TODO: replace
  socials: [
    {
      label: 'GitHub',
      handle: '@alexrivera',
      url: 'https://github.com/',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      handle: 'in/alexrivera',
      url: 'https://www.linkedin.com/',
      icon: 'linkedin',
    },
    {
      label: 'Email',
      handle: 'hello@example.com',
      url: 'mailto:hello@example.com',
      icon: 'email',
    },
  ],

  // TODO: replace — 3 to 6 projects work best on the laptop desktop.
  projects: [
    {
      id: 'taskbloom',
      title: 'TaskBloom',
      tagline: 'A to-do app where finished tasks grow a little garden',
      description:
        'A playful productivity app. Every completed task plants a flower, and streaks grow your garden over time. Built with offline-first sync so it works on a plane.',
      tech: ['React', 'TypeScript', 'IndexedDB', 'Vite', 'Workbox'],
      images: ['/projects/taskbloom-1.svg', '/projects/taskbloom-2.svg'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com/',
      year: '2026',
      icon: '🌷',
      color: '#ffb3c1',
    },
    {
      id: 'pixelpost',
      title: 'PixelPost',
      tagline: 'Collaborative pixel-art canvas in real time',
      description:
        'A shared 128×128 canvas where everyone can place one pixel every few seconds. Uses WebSockets with a Redis-backed rate limiter and renders with a single WebGL texture.',
      tech: ['Node.js', 'WebSockets', 'Redis', 'WebGL', 'Docker'],
      images: ['/projects/pixelpost-1.svg', '/projects/pixelpost-2.svg'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com/',
      year: '2025',
      icon: '🎨',
      color: '#a0e7e5',
    },
    {
      id: 'brewlog',
      title: 'BrewLog',
      tagline: 'A coffee journal with brew-ratio calculators',
      description:
        'Track beans, grind size and taste notes, then get suggestions for your next brew. Includes a timer with haptic cues and charts of your favorite roasts.',
      tech: ['React Native', 'Expo', 'SQLite', 'Victory Charts'],
      images: ['/projects/brewlog-1.svg', '/projects/brewlog-2.svg'],
      repoUrl: 'https://github.com/',
      year: '2025',
      icon: '☕',
      color: '#ffd6a5',
    },
    {
      id: 'shipit',
      title: 'ShipIt CLI',
      tagline: 'Zero-config deploys for static sites',
      description:
        'A tiny command-line tool that detects your framework, builds your site and deploys it to a CDN with one command. Ships with friendly error messages and a progress spinner shaped like a rocket.',
      tech: ['Go', 'Cobra', 'AWS S3', 'CloudFront', 'GitHub Actions'],
      images: ['/projects/shipit-1.svg', '/projects/shipit-2.svg'],
      repoUrl: 'https://github.com/',
      year: '2024',
      icon: '🚀',
      color: '#bdb2ff',
    },
  ],

  // TODO: replace — each category becomes a shelf on the bookshelf.
  skills: [
    {
      name: 'Languages',
      color: '#ff8a80',
      skills: [
        { name: 'TypeScript', level: 5 },
        { name: 'JavaScript', level: 5 },
        { name: 'Python', level: 4 },
        { name: 'Go', level: 3 },
        { name: 'SQL', level: 4 },
      ],
    },
    {
      name: 'Frontend',
      color: '#7ec4f5',
      skills: [
        { name: 'React', level: 5 },
        { name: 'Next.js', level: 4 },
        { name: 'Three.js', level: 3 },
        { name: 'CSS', level: 5 },
        { name: 'Accessibility', level: 4 },
      ],
    },
    {
      name: 'Backend',
      color: '#7fd6b4',
      skills: [
        { name: 'Node.js', level: 4 },
        { name: 'PostgreSQL', level: 4 },
        { name: 'Redis', level: 3 },
        { name: 'GraphQL', level: 3 },
      ],
    },
    {
      name: 'Tools',
      color: '#c3a6f0',
      skills: [
        { name: 'Git', level: 5 },
        { name: 'Docker', level: 4 },
        { name: 'Figma', level: 3 },
        { name: 'AWS', level: 3 },
        { name: 'Vitest', level: 4 },
      ],
    },
  ],

  // TODO: replace — newest first.
  experience: [
    {
      title: 'Software Engineer',
      org: 'Cloudberry Labs',
      start: '2024',
      end: 'Present',
      location: 'Remote',
      highlights: [
        'Led the rebuild of the customer dashboard in React + TypeScript',
        'Cut page load time by 45% with code splitting and caching',
      ],
    },
    {
      title: 'Frontend Developer',
      org: 'Pixel & Pine Studio',
      start: '2022',
      end: '2024',
      location: 'Toronto, CA',
      highlights: [
        'Shipped 12 marketing sites and two web apps for clients',
        'Built the studio’s shared component library',
      ],
    },
    {
      title: 'Software Engineering Intern',
      org: 'Northwind Health',
      start: 'Summer 2021',
      end: '',
      highlights: ['Built internal tools for scheduling appointments'],
    },
  ],

  // TODO: replace — newest first.
  education: [
    {
      title: 'B.Sc. Computer Science',
      org: 'University of Somewhere',
      start: '2018',
      end: '2022',
      highlights: ['Capstone: real-time multiplayer drawing game', "Dean's list ×3"],
    },
    {
      title: 'AWS Certified Developer – Associate',
      org: 'Amazon Web Services',
      start: '2023',
      end: '',
      highlights: ['Certification'],
    },
  ],

  petName: 'Mochi', // TODO: replace

  seo: {
    description:
      'Explore my cartoon developer room: walk around, open my laptop to see projects, browse the bookshelf for skills and say hi.', // TODO: replace
    siteUrl: 'https://example.com', // TODO: replace with your deployed URL
  },
}
