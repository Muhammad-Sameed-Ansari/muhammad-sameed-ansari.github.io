/**
 * Who the link was sent to. The plain URL is for recruiters and hides everything about
 * freelance plans; add ?for=clients (or ?for=client) to show the "Hire me" button, the
 * Plans section and the enquiry form. Switching to the classic view keeps the query
 * string, so the choice holds for the whole visit.
 */
const audience = new URLSearchParams(window.location.search).get('for')?.trim().toLowerCase()
export const forClients = audience === 'clients' || audience === 'client'
