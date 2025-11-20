export type FestivalEdition = {
  year: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  startDate: string;
  endDate: string;
  numberOfShows: number;
  numberOfArticles: number;
};

export type Show = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  editionYear: number;
  groupName: string;
  country: string;
  director: string;
  dramaturg?: string;
  cast?: string[];
  dateTime: string;
  venue: string;
  synopsisAr: string;
  synopsisEn: string;
  posterUrl?: string;
  bookingUrl?: string;
};

export type ArticleType = "review" | "symposium_coverage" | "analysis" | "general";

export type Article = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  author: string;
  editionYear: number;
  type: ArticleType;
  showId?: string;
  createdAt: string;
  contentAr: string;
  contentEn?: string;
};

export type Symposium = {
  id: string;
  editionYear: number;
  titleAr: string;
  titleEn: string;
  dateTime: string;
  hall: string;
  panelists: string[];
  moderator?: string;
  summaryAr: string;
  relatedShowIds?: string[];
};

export type CreativitySubmission = {
  id: string;
  title: string;
  author: string;
  type: "story" | "essay" | "poem" | "other";
  editionYear?: number;
  createdAt: string;
  content: string;
};

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';
