export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalDocs = {
  draft: boolean;
  draftNote: string;
  privacy: LegalDoc;
  terms: LegalDoc;
  cookies: LegalDoc;
};
