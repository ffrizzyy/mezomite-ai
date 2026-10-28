import type { Copy } from './types';

/**
 * English is written for the director who takes board papers in English.
 * Same structure as `id.ts`, same plain voice, no literal translation.
 */
export const en = {
  site: {
    name: 'Mezomite.ai',
    tagline: 'Process audits, workflow mapping, and automation for Indonesian businesses.',
    email: 'halo@mezomite.ai',
    whatsappDisplay: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    responseTime: 'We reply within 1 business day.',
    currencyNote: 'Prices are in Indonesian rupiah and exclude VAT.',
    lastUpdated: 'Updated 24 October 2026',
  },

  nav: {
    skip: 'Skip to main content',
    mainNav: 'Main navigation',
    home: 'Home',
    services: 'Services',
    method: 'Audit method',
    pricing: 'Pricing',
    glossary: 'Glossary',
    cases: 'Case studies',
    contact: 'Contact',
    book: 'Book a call',
    menu: 'Open menu',
    close: 'Close menu',
    themeLight: 'Switch to light theme',
    themeDark: 'Switch to dark theme',
    languageLabel: 'Language',
    languageSwitch: 'Read this page in Indonesian',
    currentLanguage: 'English',
  },

  pages: {
    home: {
      title: 'Mezomite.ai — Process audits and automation for Indonesian businesses',
      description:
        'A two-week process audit, workflow mapping, and automation for Indonesian SMEs and mid-size companies. The entry price, IDR 1,500,000, is published before you contact us.',
    },
    services: {
      title: 'Services — audit, mapping, and roadmap | Mezomite.ai',
      description:
        'Three services with the deliverable, duration, and price stated: process audit IDR 1,500,000, mapping and automation IDR 6,000,000, 12-month roadmap IDR 15,000,000.',
    },
    method: {
      title: 'Audit method — five steps you can inspect | Mezomite.ai',
      description:
        'Five audit steps: intake, process mapping, measurement, opportunity scoring, and reporting. Each step names its inputs, outputs, and duration.',
    },
    pricing: {
      title: 'Pricing — three packages with published prices | Mezomite.ai',
      description:
        'Mezomite.ai pricing: entry package IDR 1,500,000, build package IDR 6,000,000, roadmap package IDR 15,000,000. Scope and exclusions are written on every package.',
    },
    contact: {
      title: 'Contact Mezomite.ai',
      description:
        'Tell us which process costs you the most time. We reply within one business day, and the first call is free.',
    },
    booking: {
      title: 'Book a 30-minute call | Mezomite.ai',
      description:
        'Pick a time for a free 30-minute call. Slots open Monday to Friday, 09:00–16:00 WIB, and are confirmed by email.',
    },
    glossary: {
      title: 'Glossary — audit and automation terms | Mezomite.ai',
      description:
        'Ten terms we use in audit reports, defined in plain language, each with an Indonesian equivalent.',
    },
    cases: {
      title: 'Case studies | Mezomite.ai',
      description:
        'Case studies are published only with the client’s written consent. This page stays empty until the first consent exists.',
    },
    privacy: {
      title: 'Privacy policy | Mezomite.ai',
      description:
        'What this site collects, why, how long it is kept, and how to ask for deletion.',
    },
    terms: {
      title: 'Terms and conditions | Mezomite.ai',
      description:
        'Scope of work, payment, confidentiality, and limits of liability for every Mezomite.ai package.',
    },
    cookies: {
      title: 'Cookie policy | Mezomite.ai',
      description:
        'Every cookie and storage key this site uses, with its category and lifetime.',
    },
    notFound: {
      title: 'Page not found | Mezomite.ai',
      description: 'That address does not exist. Here are links to the pages people usually want.',
    },
  },

  common: {
    bookCall: 'Book a call',
    freeDiagnostic: 'Free 30-minute diagnostic session',
    freeDiagnosticShort: 'Free 30-minute diagnostic',
    startingFrom: 'From',
    entryPackage: 'Entry package',
    duration: 'Duration',
    deliverable: 'Deliverable',
    bestFor: 'Best for',
    includes: 'Included',
    excludes: 'Not included',
    nextStep: 'Next step',
    viewServices: 'View all services',
    viewPricing: 'View pricing',
    viewMethod: 'See the audit method',
    viewAll: 'View all',
    back: 'Back',
    loading: 'Loading',
    retry: 'Try again',
    required: 'required',
    optional: 'optional',
    updated: 'Last updated',
    minutes: 'minutes',
    close: 'Close',
    priceVatNote: 'Excludes VAT.',
    usdNote:
      'USD figures use IDR 18,100 per dollar, checked 24 October 2026. Invoices are always issued in rupiah.',
    or: 'or',
  },

  home: {
    eyebrow: 'Process audit · Automation · AI agents',
    title: 'We audit how your business runs, then automate the repetitive parts.',
    lead: 'Two weeks, one report: your workflow map, what each process costs, and a ranked list of opportunities.',
    priceLabel: 'Entry package',
    priceNote: 'One process area, the report, and a findings session.',
    primaryCta: 'Book a 30-minute call',
    secondaryCta: 'See the audit method',
    specTitle: 'Package summary',
    specRows: [
      { key: 'Package', value: 'Process audit, one area' },
      { key: 'Duration', value: '2 weeks' },
      { key: 'Deliverable', value: 'Report + presentation' },
      { key: 'Diagnostic', value: '30 minutes, free' },
    ],
    specNote: 'Call slots open Monday to Friday, 09:00–16:00 WIB.',
    proofTitle: 'A short record',
    proofNote: 'Figures updated October 2026. We will bring the industry breakdown to the call.',
    proofEmpty:
      'There are no numbers we can publish yet. What we do have: a method you can check, and a price on this page.',
    servicesEyebrow: 'Services',
    servicesTitle: 'Three ways to work with us',
    servicesLead:
      'Start with the audit. Move to implementation only when the findings actually justify it — and that call is yours, not ours.',
    servicesCta: 'View all services',
    whyEyebrow: 'Why this is different',
    whyTitle: 'We sell the method, not a promise',
    whyItems: [
      {
        index: '01',
        title: 'You see the price before you talk to us',
        body: 'The entry package has its price and scope on this page. No quote that appears after three calls.',
      },
      {
        index: '02',
        title: 'The method is the product',
        body: 'Every audit step has an input, an output, and a measure. You can compare us with another firm without asking us first.',
      },
      {
        index: '03',
        title: 'Process first, software second',
        body: 'Automation bought before the process is mapped usually ends up unused. We reverse the order: map first, tools later.',
      },
    ],
    methodEyebrow: 'Method',
    methodTitle: 'An audit whose steps you can check',
    methodLead:
      'Five steps, each with a stated input and output. Nothing is hidden behind a “discovery session”.',
    methodCta: 'Read the audit method',
    ctaEyebrow: 'Next step',
    ctaTitle: 'Tell us which process costs you the most time.',
    ctaLead:
      'One 30-minute call, free. If an audit is not the right next step for you, we will say it plainly on that call.',
    ctaPrimary: 'Book a call',
    ctaSecondary: 'Send a message',
  },

  services: {
    eyebrow: 'Services',
    title: 'Three services, one order',
    lead: 'We don’t sell all three at once. The audit comes first, because implementation without a process map usually ends up as software nobody opens.',
    orderNote: 'Ordered from lowest price to highest.',
    priceLabel: 'Starting price',
    ctaTitle: 'Not sure where to start?',
    ctaLead:
      'Start with the free 30-minute diagnostic. We will ask three things: which process costs the most time, who does the work, and what data you already have.',
  },

  method: {
    eyebrow: 'Audit method',
    title: 'Five steps, each with an output',
    lead: 'This is not a sales summary. It is the work sequence, including what you need to prepare and how long each step takes.',
    stepLabel: 'Step',
    consultantLabel: 'What we do',
    clientLabel: 'What you prepare',
    outputLabel: 'What you receive',
    reportEyebrow: 'Report contents',
    reportTitle: 'Four sections, no more',
    reportLead: 'Each section answers one question a process owner actually asks.',
    prepareTitle: 'What you need to prepare',
    prepareItems: [
      'Access to 3–5 key people for two weeks, about two hours each.',
      'Monthly transaction volumes and average salary per role, where those exist.',
      'One hour for the opening session and one hour for the findings presentation.',
    ],
    excludesTitle: 'What is not included',
    excludesBody:
      'The audit package does not include automation, software licences, or support after the presentation. If the findings justify building, we send a separate quote with the price stated.',
    ctaTitle: 'Already know which process to examine?',
    ctaLead:
      'Bring one process to the first call. In 30 minutes we can tell you whether a two-week audit makes sense, or whether a cheaper step comes first.',
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Published prices, written scope',
    lead: 'Three packages. The price on this page is the price on the invoice. Nothing new appears after a sales call.',
    entryLabel: 'Start here',
    chooseTitle: 'How to choose',
    chooseItems: [
      {
        title: 'Choose the entry package if',
        body: 'You know a process is expensive but not which part. This package produces a diagnosis, not software.',
      },
      {
        title: 'Choose the build package if',
        body: 'The audit is done, one fix is chosen, and you need a single automation in production this month.',
      },
      {
        title: 'Choose the roadmap package if',
        body: 'The decision needs board approval, and you need a staged document with a price per phase.',
      },
    ],
    freeTitle: 'Not ready to buy?',
    freeBody:
      'Take the free 30-minute diagnostic. We will tell you plainly if an audit is not needed yet, or if another vendor fits your problem better.',
    freeCta: 'Book a diagnostic session',
    paymentTitle: 'How payment works',
    paymentBody:
      '50% when the package is approved, 50% when the report is handed over. Bank transfer or QRIS. No payment is taken on this site.',
    faqTitle: 'Questions we get asked',
    faq: [
      {
        q: 'Can the price change mid-engagement?',
        a: 'The price is fixed for the scope on this page. If the scope changes, we send a new quote before the extra work starts. No surprise lines on the invoice.',
      },
      {
        q: 'What if our data is a mess?',
        a: 'That is the normal case. We use estimates from interviews and observation, then flag every estimate in the report so you know what needs checking.',
      },
      {
        q: 'Can we start with the diagnostic only?',
        a: 'Yes. The 30-minute session is free, and you are under no obligation to continue to any package.',
      },
      {
        q: 'How soon can work start?',
        a: 'Usually 5–10 business days after the package is approved and the first payment clears. You get a written start date before you pay.',
      },
      {
        q: 'Will you sign an NDA?',
        a: 'Yes, where one is needed. We also never name a client on this site without written consent.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us which process you want to fix',
    lead: 'The more specific you are, the more useful our answer can be. We reply within one business day.',
    formTitle: 'Contact form',
    name: 'Full name',
    namePlaceholder: 'Your name',
    email: 'Work email',
    emailPlaceholder: 'name@company.com',
    company: 'Company name',
    companyPlaceholder: 'Acme Manufacturing',
    employees: 'Number of employees',
    employeesPlaceholder: 'Select a range',
    employeeOptions: ['1–10 people', '11–50 people', '51–200 people', '201–500 people', 'More than 500 people'],
    message: 'Describe the problem',
    messagePlaceholder:
      'For example: purchasing runs across three spreadsheets and WhatsApp. Approvals wait two days, and stock records drift from reality.',
    consent: 'I agree that my data is processed under the',
    consentLink: 'privacy policy',
    submit: 'Send message',
    submitting: 'Sending message',
    asideTitle: 'What happens next',
    asideSteps: [
      { index: '01', title: 'We read your message', body: 'Within one business day, from the person who would do the work, not a sales team.' },
      { index: '02', title: 'A 30-minute call', body: 'Where it is useful, we offer a free diagnostic session to narrow the problem down.' },
      { index: '03', title: 'A written summary', body: 'After the call you get a short summary: what we recommend next, and what it costs.' },
    ],
    asideChannels: 'Or reach us directly',
    asideEmailLabel: 'Email',
    asideWhatsappLabel: 'WhatsApp',
    asideResponse: 'Business hours Monday–Friday, 09:00–17:00 WIB.',
    successTitle: 'Your message is on its way.',
    successBody:
      'We reply within one business day to the address you gave us. If this is urgent, use WhatsApp below.',
    successRef: 'Reference number',
    successNext: 'While you wait, you can read the pricing detail or pick a call time.',
    successPricing: 'View pricing',
    successBook: 'Book a call',
    privacyNote: 'Your data is used only to answer this message, then deleted after 12 months.',
    turnstileNote: 'This form is protected by Turnstile. There is no puzzle to solve.',
  },

  booking: {
    eyebrow: 'Schedule',
    title: 'A 30-minute call, free',
    lead: 'Pick a time that suits you. We send the invitation to your email, and you can cancel from the same link.',
    dayLabel: 'Pick a day',
    timeLabel: 'Pick a time',
    detailsLabel: 'Your details',
    selectionLabel: 'Your selection',
    asideTitle: 'Call details',
    hoursLabel: 'Available hours',
    metaTimezone: 'Timezone',
    metaFee: 'Fee',
    name: 'Full name',
    email: 'Work email',
    company: 'Company name',
    notes: 'Notes',
    notesPlaceholder: 'Your timezone, the process you want to discuss, or anything we should prepare.',
    submit: 'Confirm booking',
    submitting: 'Saving booking',
    loading: 'Loading times',
    empty: 'No times are open in the next 14 days. Contact us for an arrangement outside these hours.',
    holidayNote: 'Indonesian public holidays are closed.',
    timezoneNote: 'Times are shown in WIB (GMT+7). Add your timezone in the notes if it differs.',
    successTitle: 'Your booking is confirmed.',
    successBody:
      'The invitation is in your inbox. We send a reminder one day before the call, and the cancellation link is in that email.',
    successRef: 'Reference number',
    successCancel: 'Need another time? Cancel from the email link, then pick again.',
    stepOne: 'Pick a day',
    stepTwo: 'Pick a time',
    stepThree: 'Your details',
  },

  cancel: {
    title: 'Cancel a booking',
    lead: 'Confirm first, then we release the slot. Once cancelled, the time opens up for someone else.',
    referenceLabel: 'Reference number',
    slotLabel: 'Booking',
    confirm: 'Cancel this booking',
    confirming: 'Cancelling',
    keep: 'Keep my booking',
    successTitle: 'The booking is cancelled.',
    successBody:
      'The slot is released and a cancellation confirmation is on its way to your email. If you change your mind, pick a new time whenever you like.',
    missingTitle: 'This link is incomplete.',
    missingBody:
      'Open the cancellation link straight from your confirmation email. If you cannot find it, reply from the same address and we will sort it out.',
    errorTitle: 'The booking could not be cancelled.',
    errorBody:
      'The link may have expired, or this booking was already cancelled. Reload the page and try again.',
    backToBooking: 'Pick another time',
    contact: 'Contact us',
    noScript: 'Cancelling needs JavaScript. Reply to your confirmation email and we will cancel it for you.',
  },

  glossary: {
    eyebrow: 'Glossary',
    title: 'The terms we use, explained',
    lead: 'Every term in an audit report has one definition, written in plain language, with the Indonesian equivalent.',
    search: 'Search terms',
    count: 'terms',
    empty: 'No terms match that. Try another word.',
    enLabel: 'English',
    idLabel: 'Indonesian',
  },

  cases: {
    eyebrow: 'Case studies',
    title: 'Evidence, once permission exists',
    lead: 'We publish a case study only when the client has given written consent. Until the first one exists, this page stays empty on purpose.',
    emptyTitle: 'No case studies published yet',
    emptyBody:
      'We won’t fill this page with invented examples. If you want to see the work, we can walk through it on a call, with a confidentiality agreement in place first.',
    cta: 'Discuss it on a call',
  },

  notFound: {
    code: '404',
    title: 'This page does not exist',
    body: 'The address may be mistyped, or the page has moved. Here is what people usually want:',
    linksTitle: 'Available pages',
  },

  footer: {
    tagline: 'Process audits, workflow mapping, and automation. Published prices, open method.',
    servicesTitle: 'Services',
    companyTitle: 'Company',
    legalTitle: 'Legal',
    contactTitle: 'Contact',
    consentSettings: 'Cookie settings',
    whatsapp: 'WhatsApp',
    rights: 'All rights reserved.',
    built: 'Built with Astro, hosted on Cloudflare.',
    locationLabel: 'Location',
  },

  consent: {
    title: 'Cookies and measurement',
    body: 'We use storage that is strictly necessary to remember your language and theme. Analytics only runs if you agree.',
    acceptAll: 'Accept all',
    rejectOptional: 'Reject optional',
    customise: 'Choose categories',
    save: 'Save choices',
    necessaryTitle: 'Strictly necessary',
    necessaryBody: 'Stores your language, theme, and this cookie answer. Cannot be turned off.',
    analyticsTitle: 'Analytics',
    analyticsBody: 'Counts page views without cookies and without personal data.',
    policyLink: 'Read the cookie policy',
    saved: 'Your choice is saved.',
    error: 'Your choice was not saved. Try again.',
    preferencesTitle: 'Cookie settings',
    close: 'Close',
  },

  errors: {
    nameRequired: 'Your name is missing. We need to know who to ask for.',
    emailRequired: 'Your email is missing. Without it we cannot reply.',
    emailInvalid: 'That email address does not look right. Check it and try again.',
    messageShort: 'Tell us a little more, at least 20 characters, so we can answer properly.',
    consentRequired: 'Tick the consent box so we are allowed to process your data.',
    submitFailed: 'Your message did not send. Try again in a few moments.',
    rateLimited: 'Too many attempts from this network. Try again in a minute.',
    slotRequired: 'Pick a date and a time first.',
    slotTaken: 'That time was just taken. Pick another.',
    bookingFailed: 'Your booking was not saved. Try again, or send a message from the contact page.',
    network: 'The connection dropped. Check your network and try again.',
    summary: 'Some fields need fixing.',
  },

  a11y: {
    external: 'External link',
    requiredMark: 'required',
    copied: 'Copied',
  },
} satisfies Copy;
