import type { Portfolio } from './types.ts'

/**
 * ALL personal content for the site lives here. The 3D room, the panels and the
 * classic view read from this object, so you never need to touch 3D code to update it.
 */
export const portfolio: Portfolio = {
  name: 'Muhammad Sameed Ansari',
  shortName: 'Sameed',
  title: 'Full-Stack Mobile & Web Developer',
  location: 'Islamabad, Pakistan',

  // One string per paragraph.
  bio: [
    "Hi! I'm Sameed. I build apps end to end: native iOS and Android, Flutter, the admin dashboards and operations tools that run the business behind them, and the backends and APIs that tie it all together.",
    "For 4+ years I've shipped production software for clients in Canada, Australia and beyond: food-rescue logistics, a tutoring marketplace, a pickup-soccer platform with payments, and an iPad field-service app that runs jobs, work orders, finance and inventory. Some I built solo from the first commit; others I joined mid-flight and ended up owning.",
    'I like the unglamorous parts that make products trustworthy: payments that never double-charge, offline sync that survives bad signal, role-based access, push notifications that reach the right person, and release test suites. I use AI tools every day to learn new stacks fast, whether that is an ERP-style platform, an enterprise API or a codebase someone else wrote.',
  ],

  funFacts: [
    'Built SmileApp four times: iOS, Android, Flutter and the backend',
    'Looks after five B12Give codebases on my own: Angular, Node, Flutter, Kotlin and Swift',
    'Petomie packs 2,000+ pages of animal anatomy into one app',
    'WriteAI exists because I got tired of copy → ChatGPT → paste',
    'Joined Sofit as an intern and was promoted to iOS developer',
  ],

  resumeUrl: '/resume.pdf',
  email: 'sameedanxari@gmail.com',

  // Matched to my photo. Options are listed in src/content/types.ts.
  avatar: {
    skin: '#e3ab87',
    hairStyle: 'swept', // 'short' | 'swept' | 'curly' | 'long' | 'bun' | 'spiky' | 'buzz'
    hairColor: '#2b2522',
    eyeColor: '#3b2a24',
    glasses: true,
    glassesShape: 'rectangle', // 'round' | 'rectangle'
    glassesColor: '#1c1a22',
    facialHair: 'stubble', // 'none' | 'stubble' | 'beard' | 'mustache'
    headphones: false,
    hoodie: '#9fb0c8',
    pants: '#45406b',
    shoes: '#fffaf0',
  },

  socials: [
    {
      label: 'GitHub',
      handle: '@Muhammad-Sameed-Ansari',
      url: 'https://github.com/Muhammad-Sameed-Ansari',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      handle: 'in/sameedansari',
      url: 'https://www.linkedin.com/in/sameedansari',
      icon: 'linkedin',
    },
    {
      label: 'Email',
      handle: 'sameedanxari@gmail.com',
      url: 'mailto:sameedanxari@gmail.com',
      icon: 'email',
    },
  ],

  projects: [
    {
      id: 'b12give',
      title: 'B12Give',
      tagline: 'Food-rescue logistics across a web dashboard, Flutter, iOS and Android',
      role: 'Rebuilt the admin dashboard; now sole developer on all five codebases',
      description:
        'A Canadian platform that moves surplus food from retailers to shelters through a volunteer driver network. I rebuilt the Angular admin dashboard from scratch: four-role access control (admin, city mayor, retailer, shelter), impact analytics by city with food rescued, meals and CO₂e saved, reports and QR labels. I now run the Node.js API, the Flutter partners app and the native Kotlin and Swift driver apps on my own. Recent work includes a restart-safe pickup-timeout sweep, a rewritten FCM/APNs push service, soft deletes that keep donation history intact, and pre-release test suites on every app.',
      tech: [
        'Angular 21',
        'TypeScript',
        'Chart.js',
        'Node.js',
        'Express',
        'MongoDB',
        'Flutter',
        'Kotlin',
        'Swift',
        'FCM & APNs',
        'Google Maps',
        'Playwright',
      ],
      images: ['/projects/b12give.webp'],
      liveUrl: 'https://www.b12give.ca',
      stores: [
        {
          app: 'Partners',
          store: 'app-store',
          url: 'https://apps.apple.com/ca/app/partners/id6723881772',
        },
        {
          app: 'Partners',
          store: 'google-play',
          url: 'https://play.google.com/store/apps/details?id=com.b12give.partners',
        },
        {
          app: 'Driver',
          store: 'app-store',
          url: 'https://apps.apple.com/ca/app/drivers/id1545707201',
        },
        {
          app: 'Driver',
          store: 'google-play',
          url: 'https://play.google.com/store/apps/details?id=com.b12give.driver_partner',
        },
      ],
      year: '2024 – now',
      icon: '🥕',
      color: '#b8f2d4',
    },
    {
      id: 'tutorshub',
      title: 'TutorsHub',
      tagline: 'On-demand tutoring marketplace: mobile app, admin dashboard and backend',
      role: 'Solo build: mobile app, admin dashboard, backend and website',
      description:
        'Students find nearby tutors on a map, book and pay; tutors manage availability, jobs and payouts, all in one role-aware Flutter app. I designed and built every part: the app, a React + TypeScript admin dashboard for bookings, payments, users and analytics, and a Firebase Cloud Functions backend. It holds slots inside Firestore transactions so nobody can double-book, verifies sessions with rotating hashed start codes, pays tutors on a schedule through Stripe Connect, and searches by geohash.',
      tech: [
        'Flutter',
        'Dart',
        'React 18',
        'TypeScript',
        'Tailwind CSS',
        'Recharts',
        'Cloud Functions',
        'Firestore',
        'Stripe Connect',
        'FCM',
        'OpenStreetMap',
      ],
      images: ['/projects/tutorshub.webp'],
      liveUrl: 'https://tutorshub.ca',
      stores: [
        { store: 'app-store', url: 'https://apps.apple.com/ca/app/tutorhub/id6782578875' },
        {
          store: 'google-play',
          url: 'https://play.google.com/store/apps/details?id=ca.tutorshub.android',
        },
      ],
      year: '2026',
      icon: '🎓',
      color: '#d9c8ff',
    },
    {
      id: 'sport12',
      title: 'Sport12',
      tagline: 'Find, join and pay for local pickup soccer games',
      role: 'Developed the mobile app; now building the admin dashboard',
      description:
        'Players find and join pickup games near them and pay by card, in-app wallet or cash, while organizers run the games and settle up. On the Flutter app and its TypeScript Cloud Functions I focused on money and reliability: charge-at-join with race-safe seat locking, Stripe card holds that are always captured or released, a wallet balance that stays correct under concurrent updates, WhatsApp one-time codes, and a full Flutter, Firebase and Stripe upgrade. I am now building the Flutter Web operations dashboard, starting with wallet review and payment tools.',
      tech: [
        'Flutter',
        'BLoC',
        'go_router',
        'Firebase',
        'Cloud Functions',
        'TypeScript',
        'Stripe',
        'Google Maps',
        'Flutter Web',
      ],
      images: ['/projects/sport12.webp'],
      liveUrl: 'https://sport-12.com',
      stores: [
        {
          store: 'app-store',
          url: 'https://apps.apple.com/mx/app/sport12-pickup-soccer/id1441021234',
        },
        { store: 'google-play', url: 'https://play.google.com/store/apps/details?id=com.sport12' },
      ],
      year: '2026',
      icon: '⚽',
      color: '#a8d8ff',
    },
    {
      id: 'steamatic',
      title: 'Steamatic',
      tagline: 'iPad app that runs a field-service business',
      role: 'Team project: built the Schedule module and much of offline mode',
      description:
        'An internal, ERP-style iPad app for dispatch, jobs, work orders, finance and warehouse inventory. I built the Schedule module from scratch: a custom UICollectionView layout with crews as columns and time as rows, drag-and-drop rescheduling across runs, dragging jobs from the sidebar onto the board, sticky headers, overlap resolution and map route overlays, all synced live with the REST API. Since then I have built much of the offline mode, which downloads jobs, lets crews work without signal and syncs everything back.',
      tech: [
        'Swift',
        'UIKit',
        'RxSwift',
        'Alamofire',
        'RealmSwift',
        'MapKit',
        'Crashlytics',
        'Mixpanel',
      ],
      images: ['/projects/steamatic.webp'],
      year: '2025 – now',
      icon: '🗓️',
      color: '#ffd6a5',
    },
    {
      id: 'smileapp',
      title: 'SmileApp',
      tagline: 'Send an anonymous smile to a random person anywhere in the world',
      role: 'Solo build: iOS, Android, Flutter and backend',
      description:
        'One tap sends a smile to a random stranger, who gets a push notification and can smile back. I built native iOS (SwiftUI) and Android (Jetpack Compose) apps, the TypeScript Cloud Functions backend, and a Flutter rebuild that will replace both native apps on the same Firebase project. Highlights: guest accounts that upgrade without losing history, a scheduled bot system so new users never land in an empty app, atomic counters, and careful push-token handling.',
      tech: [
        'Swift',
        'SwiftUI',
        'Kotlin',
        'Jetpack Compose',
        'Flutter',
        'Cloud Functions',
        'TypeScript',
        'Firestore',
        'FCM & APNs',
        'Sign in with Apple',
      ],
      images: ['/projects/smileapp.webp'],
      year: '2025',
      icon: '😊',
      color: '#ffe08a',
    },
    {
      id: 'petomie',
      title: 'Petomie',
      tagline: 'Animal anatomy and holistic-health reference, by subscription',
      role: 'Solo build',
      description:
        'A Flutter app for iOS, Android and the web where vets, therapists and owners look up anatomy, energy systems and holistic remedies for horses, dogs, cats and birds. It packs 2,000+ content pages into a deep, fast category tree, with a paywall overlay on premium sections and RevenueCat subscriptions across the App Store, Google Play and Stripe on the web, all tied to the user’s Firebase account.',
      tech: [
        'Flutter',
        'Dart',
        'Provider',
        'Firebase Auth',
        'Firestore',
        'RevenueCat',
        'StoreKit',
        'Play Billing',
      ],
      images: ['/projects/petomie.webp'],
      year: '2025',
      icon: '🐴',
      color: '#bfe3ff',
    },
    {
      id: 'writeai',
      title: 'WriteAI',
      tagline: 'An iOS keyboard that rewrites or translates your text in any app',
      role: 'My own idea, built solo',
      description:
        'Instead of copy → ChatGPT → paste, tap Professionalize or Translate right on the keyboard, in any app. It is a full custom QWERTY keyboard extension in SwiftUI with an AI toolbar and a choice of OpenAI (GPT-4o mini) or Groq (Llama 3.3, free tier). API keys live in a Keychain shared with the extension, setup is a guided checklist with a live connection test, and text only leaves the phone when you tap a button.',
      tech: [
        'Swift',
        'SwiftUI',
        'UIKit',
        'Keyboard extension',
        'Keychain',
        'App Groups',
        'OpenAI API',
        'Groq API',
      ],
      images: ['/projects/writeai.webp'],
      year: '2026',
      icon: '✨',
      color: '#e3d6ff',
    },
  ],

  // Each category becomes a shelf; the first four are shown on the 3D bookshelf.
  skills: [
    {
      name: 'Mobile',
      color: '#ff8a80',
      skills: [
        { name: 'Swift', level: 5 },
        { name: 'SwiftUI', level: 5 },
        { name: 'UIKit', level: 5 },
        { name: 'Flutter', level: 5 },
        { name: 'Kotlin', level: 4 },
        { name: 'Jetpack Compose', level: 3 },
        { name: 'RxSwift', level: 4 },
        { name: 'React Native', level: 3 },
      ],
    },
    {
      name: 'Web & Dashboards',
      color: '#7ec4f5',
      skills: [
        { name: 'TypeScript', level: 5 },
        { name: 'Angular', level: 4 },
        { name: 'React', level: 4 },
        { name: 'Flutter Web', level: 4 },
        { name: 'Tailwind CSS', level: 4 },
        { name: 'Chart.js', level: 4 },
        { name: 'Recharts', level: 4 },
      ],
    },
    {
      name: 'Backend & APIs',
      color: '#7fd6b4',
      skills: [
        { name: 'REST APIs', level: 5 },
        { name: 'Node.js', level: 4 },
        { name: 'Express', level: 4 },
        { name: 'Cloud Functions', level: 5 },
        { name: 'Firestore', level: 5 },
        { name: 'MongoDB', level: 4 },
        { name: 'Stripe', level: 4 },
        { name: 'FCM & APNs', level: 5 },
      ],
    },
    {
      name: 'Tools & AI',
      color: '#c3a6f0',
      skills: [
        { name: 'Git', level: 5 },
        { name: 'Firebase', level: 5 },
        { name: 'Realm', level: 4 },
        { name: 'OpenAI API', level: 4 },
        { name: 'Xcode', level: 5 },
        { name: 'Android Studio', level: 4 },
        { name: 'Playwright', level: 3 },
      ],
    },
    {
      name: 'Architecture',
      color: '#ffd166',
      skills: [
        { name: 'MVVM', level: 5 },
        { name: 'Clean Architecture', level: 4 },
        { name: 'Offline-first', level: 4 },
        { name: 'RBAC', level: 4 },
        { name: 'State machines', level: 4 },
        { name: 'Serverless', level: 5 },
      ],
    },
  ],

  // Newest first.
  experience: [
    {
      title: 'Senior Application Developer',
      org: 'Creatrixe Solution Limited',
      start: 'May 2023',
      end: 'Present',
      location: 'Canada (remote)',
      highlights: [
        'Own client products end to end across iOS, Android, Flutter, web dashboards and Node.js / Firebase backends',
        'Built TutorsHub solo and rebuilt the B12Give admin dashboard; now the sole developer across B12Give',
        'Built the drag-and-drop scheduling board and offline sync for Steamatic’s iPad field-service app',
        'Work on Sport12’s payments and wallet, and now building its admin dashboard',
        'Earlier: Best In Town (loyalty) and Premier UK Business (document uploads) iOS apps',
        'Review code and mentor junior developers on API integration and app architecture',
      ],
    },
    {
      title: 'Junior iOS Developer',
      org: 'Sofit',
      start: 'Feb 2022',
      end: 'Apr 2023',
      location: 'Islamabad',
      highlights: [
        'Joined as an intern and was promoted to junior iOS developer',
        'Shipped ShopDev, an iPad app for hiring developers, with Firebase real-time sync',
        'Built a SwiftUI nurse scheduling app with shift booking and push notifications',
      ],
    },
  ],

  // Newest first.
  education: [
    {
      title: 'B.S. Computer Science',
      org: 'FAST National University (NUCES)',
      start: '2018',
      end: '2022',
      location: 'Islamabad',
      highlights: [
        'Final-year project: a blockchain app that lets organizations run their own internal currency (React Native + Go smart contracts)',
      ],
    },
  ],

  petName: 'Mochi',

  seo: {
    description:
      'Muhammad Sameed Ansari, full-stack mobile and web developer: iOS, Android, Flutter, admin dashboards, backends and API integrations. Walk around my cartoon developer room to see my work.',
    siteUrl: 'https://muhammad-sameed-ansari.github.io',
  },
}
