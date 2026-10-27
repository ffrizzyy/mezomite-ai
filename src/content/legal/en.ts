import type { LegalDocs } from './types';

/**
 * Draft legal copy, English. Same notice logic as the Indonesian version:
 * a lawyer reviews all three before `draft` becomes false.
 */
export const legalEn: LegalDocs = {
  draft: true,
  draftNote:
    'Draft for legal review. This text has not been reviewed by counsel and is not yet the final document.',
  privacy: {
    title: 'Privacy policy',
    updated: '24 October 2026',
    intro:
      'Mezomite.ai is a consulting practice based in Jakarta. This policy explains what the mezomite.ai site collects, why, how long it is kept, and how to ask for deletion.',
    sections: [
      {
        heading: 'Who controls the data',
        paragraphs: [
          'The data controller is Mezomite.ai, Jakarta, Indonesia. Questions about this policy go to halo@mezomite.ai. We reply within one business day.',
        ],
      },
      {
        heading: 'What we collect',
        paragraphs: [
          'We collect two groups of data: what you send through the forms, and the minimum technical data required to run the site.',
        ],
        list: [
          'Contact form: name, email address, company name, headcount, and the message itself.',
          'Booking form: name, email address, company name, chosen time, and any notes.',
          'Consent record: the categories you chose, the policy version, the time, and a truncated IP address.',
          'Bot check: a Turnstile token and IP address, processed by Cloudflare to confirm a person sent the form.',
          'Server logs: request time, IP address, and status code, held by Cloudflare for 90 days.',
        ],
      },
      {
        heading: 'Why we process it',
        paragraphs: [
          'We process form data because you asked us to, either to answer a message or to confirm a booking. The lawful basis is your consent and, once work is agreed, performance of a contract.',
          'We do not use your data for advertising, we do not sell it, and we do not send a newsletter without a separate sign-up.',
        ],
      },
      {
        heading: 'Who receives it',
        paragraphs: ['Data reaches only the parties needed to run the site:'],
        list: [
          'Cloudflare, for hosting, the database, and the bot check. Data may be processed outside Indonesia.',
          'Resend, to deliver the notification email to our inbox.',
          'The domain registrar, for domain registration records.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'Form messages and booking data are kept for 12 months, then deleted. Consent records are kept for 24 months because we have to be able to show our lawful basis. Server logs expire automatically after 90 days. Data that has reached our email inbox follows the internal email retention policy.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You may ask for a copy of your data, ask for correction, ask for deletion, withdraw consent, and object to processing. Send the request to halo@mezomite.ai with the subject “Data request”. We answer within 14 calendar days.',
          'If our answer is not satisfactory, you may complain to the Indonesian data protection authority.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'The site runs HTTPS with HSTS, API keys live in environment variables, and database access is limited to the server functions that need it. We do not write personal data to application logs.',
        ],
      },
      {
        heading: 'Children',
        paragraphs: [
          'This site is written for business owners and managers. We do not knowingly collect data from anyone under 18.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'If this policy changes, the date at the top of the page changes with it, and any change affecting the lawful basis is announced through a banner on the site.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms and conditions',
    updated: '24 October 2026',
    intro:
      'These terms cover use of the mezomite.ai site and the basis of work for the packages sold here. By sending a form or approving a package you confirm you have read them.',
    sections: [
      {
        heading: 'Scope of the site',
        paragraphs: [
          'This site is information. There are no accounts, no client portal, and no payments processed here. Sending a form is not an agreement; the agreement is created by a written proposal signed by both parties.',
        ],
      },
      {
        heading: 'Packages and prices',
        paragraphs: [
          'Published prices are in Indonesian rupiah and exclude VAT. A price applies to the scope written on the package page. A change of scope beyond that requires a new quote approved before the extra work begins.',
          'US dollar figures are a convenience and are not binding. Invoices are always issued in rupiah.',
        ],
      },
      {
        heading: 'Payment',
        paragraphs: [
          'Payment is split in two: 50% when the package is approved and 50% when the report is handed over. Payment is by bank transfer or QRIS to the account on the invoice. Work starts after the first payment clears.',
        ],
      },
      {
        heading: 'Client obligations',
        paragraphs: [
          'The client provides access to key people, the data requested, and time for scheduled sessions. Delays in providing access can move the completion date, and any move is confirmed in writing.',
        ],
      },
      {
        heading: 'Confidentiality and intellectual property',
        paragraphs: [
          'We keep client information confidential and sign an NDA where one is requested. The audit report belongs to the client once paid in full. Our method, templates, and internal tools remain the property of Mezomite.ai and are not transferred.',
        ],
      },
      {
        heading: 'Limits of liability',
        paragraphs: [
          'An audit report contains recommendations, not a guarantee of financial outcome. Business decisions remain the client’s. Our liability for claims arising from one package is limited to the value of that package, to the extent the applicable law allows.',
        ],
      },
      {
        heading: 'Cancellation and termination',
        paragraphs: [
          'The client may stop work with 7 days written notice. Payment for work already performed remains due. We may stop work where there is a conflict of interest or a request that would break the law.',
        ],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          'These terms are governed by the laws of the Republic of Indonesia. Disputes go to discussion first and, failing that, to the competent court in Jakarta.',
        ],
      },
    ],
  },

  cookies: {
    title: 'Cookie policy',
    updated: '24 October 2026',
    intro:
      'This site uses as little storage as it can. There are no advertising cookies, no cross-site trackers, and analytics runs without cookies.',
    sections: [
      {
        heading: 'Strictly necessary',
        paragraphs: ['This storage keeps the site working and remembers your choices. It cannot be turned off.'],
        list: [
          'mz-lang, local storage, 12 months: remembers your language choice.',
          'mz-theme, local storage, 12 months: remembers light or dark theme.',
          'mz-consent, local storage, 24 months: stores the categories you approved, the policy version, and the time.',
          'cf_clearance, cookie, 30 minutes: set by Cloudflare when the bot check runs on a form page.',
        ],
      },
      {
        heading: 'Analytics',
        paragraphs: [
          'If you approve this category, the site loads Cloudflare Web Analytics. It sets no cookie, builds no profile, and records only the page path, referrer, user agent, and an approximate region. If you reject it, the script is never loaded.',
        ],
      },
      {
        heading: 'What we do not use',
        paragraphs: [
          'No Google Analytics, no advertising pixels, no session heatmaps, no third-party chat widget, and no fonts from a third-party CDN.',
        ],
      },
      {
        heading: 'Changing your choice',
        paragraphs: [
          'Open “Cookie settings” in the footer of any page. A new choice applies as soon as it is saved. Clearing browser storage returns the site to an unset state and the banner appears again.',
        ],
      },
    ],
  },
};
