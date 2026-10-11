import type { Hire } from './types.ts'

/**
 * The "Hire me" offer: monthly plans for clients. Change prices freely.
 *
 * Only shown when the link has ?for=clients (see src/lib/audience.ts), and kept out of
 * portfolio.ts so the prices load in their own chunk, never on the plain link you send
 * to recruiters.
 */
export const hire: Hire = {
  headline: 'Your app, looked after every month',
  intro:
    'I maintain and grow mobile apps, websites, admin dashboards and ERP-style platforms on a flat monthly plan. One senior developer who learns your codebase and stays with it, without hiring or agency overhead.',
  plans: [
    {
      name: 'Care',
      price: '$400',
      cadence: '/month',
      forWho: 'Your app is live and needs to stay healthy',
      includes: [
        'Bug fixes and small tweaks',
        'iOS, Android and library updates',
        'App Store and Google Play compliance',
        'Crash and uptime monitoring',
        'A short health report every month',
      ],
    },
    {
      name: 'Growth',
      price: '$950',
      cadence: '/month',
      forWho: 'You want new features shipped every month',
      includes: [
        'Everything in Care',
        'About 60–80 hours of feature work',
        'Mobile app, website, admin dashboard or backend',
        'Weekly progress updates',
        'Store releases handled for you',
      ],
      featured: true,
    },
    {
      name: 'Dedicated',
      price: '$2,500',
      cadence: '/month',
      forWho: 'You need a developer on your team',
      includes: [
        'Everything in Growth',
        'Close to full-time on your product',
        'Works in your Slack, Jira and GitHub',
        'Architecture, code reviews and planning',
      ],
    },
  ],
  notes: [
    'Pause or cancel any month. No long contracts.',
    'Want to see how I work first? Start with a one-off App Health Audit: I review your app and send a prioritised fix list.',
    'Building something new? I quote new builds as a fixed project, and a plan keeps it running after launch.',
  ],
  // Free Cal.com page for "Book a free 15-min call", e.g. 'https://cal.com/your-name/15min'.
  // bookingUrl: 'https://cal.com/your-name/15min',
}
