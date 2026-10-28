/**
 * The shape every locale must satisfy. `id.ts` and `en.ts` both declare
 * `satisfies Copy`, so a missing translation or an extra key is a type error
 * at build time rather than a page that silently renders English in Indonesian.
 */

export type PageKey =
  | 'home'
  | 'services'
  | 'method'
  | 'pricing'
  | 'contact'
  | 'booking'
  | 'glossary'
  | 'cases'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'notFound';

export type PageMeta = {
  title: string;
  description: string;
};

export type SpecRow = { key: string; value: string };

export type Feature = { index: string; title: string; body: string };

export type FaqItem = { q: string; a: string };

export type NextStep = { index: string; title: string; body: string };

export type Copy = {
  site: {
    name: string;
    tagline: string;
    email: string;
    whatsappDisplay: string;
    location: string;
    responseTime: string;
    currencyNote: string;
    lastUpdated: string;
  };
  nav: {
    skip: string;
    mainNav: string;
    home: string;
    services: string;
    method: string;
    pricing: string;
    glossary: string;
    cases: string;
    contact: string;
    book: string;
    menu: string;
    close: string;
    themeLight: string;
    themeDark: string;
    languageLabel: string;
    languageSwitch: string;
    currentLanguage: string;
  };
  pages: Record<PageKey, PageMeta>;
  common: {
    bookCall: string;
    freeDiagnostic: string;
    freeDiagnosticShort: string;
    startingFrom: string;
    entryPackage: string;
    duration: string;
    deliverable: string;
    bestFor: string;
    includes: string;
    excludes: string;
    nextStep: string;
    viewServices: string;
    viewPricing: string;
    viewMethod: string;
    viewAll: string;
    back: string;
    loading: string;
    retry: string;
    required: string;
    optional: string;
    updated: string;
    minutes: string;
    close: string;
    priceVatNote: string;
    usdNote: string;
    or: string;
  };
  home: {
    eyebrow: string;
    title: string;
    lead: string;
    priceLabel: string;
    priceNote: string;
    primaryCta: string;
    secondaryCta: string;
    specTitle: string;
    specRows: SpecRow[];
    specNote: string;
    /** The four stages drawn by the hero process graph, in order. */
    graphTitle: string;
    graphNodes: string[];
    proofTitle: string;
    proofNote: string;
    proofEmpty: string;
    servicesEyebrow: string;
    servicesTitle: string;
    servicesLead: string;
    servicesCta: string;
    whyEyebrow: string;
    whyTitle: string;
    whyItems: Feature[];
    methodEyebrow: string;
    methodTitle: string;
    methodLead: string;
    methodCta: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaLead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    orderNote: string;
    priceLabel: string;
    ctaTitle: string;
    ctaLead: string;
  };
  method: {
    eyebrow: string;
    title: string;
    lead: string;
    stepLabel: string;
    /** Copy for the draggable order diagram at the top of the method page. */
    orderTitle: string;
    orderHint: string;
    orderValid: string;
    orderInvalid: string;
    consultantLabel: string;
    clientLabel: string;
    outputLabel: string;
    reportEyebrow: string;
    reportTitle: string;
    reportLead: string;
    prepareTitle: string;
    prepareItems: string[];
    excludesTitle: string;
    excludesBody: string;
    ctaTitle: string;
    ctaLead: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    entryLabel: string;
    chooseTitle: string;
    chooseItems: { title: string; body: string }[];
    freeTitle: string;
    freeBody: string;
    freeCta: string;
    paymentTitle: string;
    paymentBody: string;
    faqTitle: string;
    faq: FaqItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    formTitle: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    company: string;
    companyPlaceholder: string;
    employees: string;
    employeesPlaceholder: string;
    employeeOptions: string[];
    message: string;
    messagePlaceholder: string;
    consent: string;
    consentLink: string;
    submit: string;
    submitting: string;
    asideTitle: string;
    asideSteps: NextStep[];
    asideChannels: string;
    asideEmailLabel: string;
    asideWhatsappLabel: string;
    asideResponse: string;
    successTitle: string;
    successBody: string;
    successRef: string;
    successNext: string;
    successPricing: string;
    successBook: string;
    privacyNote: string;
    turnstileNote: string;
  };
  booking: {
    eyebrow: string;
    title: string;
    lead: string;
    dayLabel: string;
    timeLabel: string;
    detailsLabel: string;
    selectionLabel: string;
    asideTitle: string;
    hoursLabel: string;
    metaTimezone: string;
    metaFee: string;
    name: string;
    email: string;
    company: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
    submitting: string;
    loading: string;
    empty: string;
    holidayNote: string;
    timezoneNote: string;
    successTitle: string;
    successBody: string;
    successRef: string;
    successCancel: string;
    stepOne: string;
    stepTwo: string;
    stepThree: string;
  };
  cancel: {
    title: string;
    lead: string;
    referenceLabel: string;
    slotLabel: string;
    confirm: string;
    confirming: string;
    keep: string;
    successTitle: string;
    successBody: string;
    missingTitle: string;
    missingBody: string;
    errorTitle: string;
    errorBody: string;
    backToBooking: string;
    contact: string;
    noScript: string;
  };
  glossary: {
    eyebrow: string;
    title: string;
    lead: string;
    search: string;
    count: string;
    empty: string;
    enLabel: string;
    idLabel: string;
  };
  cases: {
    eyebrow: string;
    title: string;
    lead: string;
    emptyTitle: string;
    emptyBody: string;
    cta: string;
  };
  notFound: {
    code: string;
    title: string;
    body: string;
    linksTitle: string;
  };
  footer: {
    tagline: string;
    servicesTitle: string;
    companyTitle: string;
    legalTitle: string;
    contactTitle: string;
    consentSettings: string;
    whatsapp: string;
    rights: string;
    built: string;
    locationLabel: string;
  };
  consent: {
    title: string;
    body: string;
    acceptAll: string;
    rejectOptional: string;
    customise: string;
    save: string;
    necessaryTitle: string;
    necessaryBody: string;
    analyticsTitle: string;
    analyticsBody: string;
    policyLink: string;
    saved: string;
    error: string;
    preferencesTitle: string;
    close: string;
  };
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageShort: string;
    consentRequired: string;
    submitFailed: string;
    rateLimited: string;
    slotRequired: string;
    slotTaken: string;
    bookingFailed: string;
    network: string;
    summary: string;
  };
  a11y: {
    external: string;
    requiredMark: string;
    copied: string;
  };
};
