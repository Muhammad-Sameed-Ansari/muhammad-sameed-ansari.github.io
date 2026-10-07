import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { portfolio } from './src/content/portfolio'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Fills `%PORTFOLIO_*%` placeholders in index.html from src/content/portfolio.ts, so the
 * page title, meta description and Open Graph tags always match your content.
 * It also writes a plain-text summary into <noscript> for crawlers and no-JS visitors.
 */
function portfolioHtml(): Plugin {
  const p = portfolio
  const vars: Record<string, string> = {
    PAGE_TITLE: `${p.name} · ${p.title} · Interactive Portfolio`,
    NAME: p.name,
    DESCRIPTION: p.seo.description,
    SITE_URL: p.seo.siteUrl,
    OG_IMAGE: new URL('/og.png', p.seo.siteUrl).href,
  }
  const noscript = [
    `<h1>${escapeHtml(p.name)}: ${escapeHtml(p.title)}</h1>`,
    ...p.bio.map((para) => `<p>${escapeHtml(para)}</p>`),
    '<h2>Projects</h2><ul>',
    ...p.projects.map(
      (proj) =>
        `<li><strong>${escapeHtml(proj.title)}</strong>: ${escapeHtml(proj.tagline)}</li>`,
    ),
    '</ul>',
    `<p>Contact: <a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></p>`,
  ].join('')

  return {
    name: 'portfolio-html',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replace('<!--noscript-content-->', noscript)
          .replace(/%PORTFOLIO_(\w+)%/g, (match, key: string) =>
            key in vars ? escapeHtml(vars[key]) : match,
          ),
    },
  }
}

export default defineConfig({
  plugins: [react(), portfolioHtml()],
})
