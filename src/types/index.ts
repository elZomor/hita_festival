export type FestivalEdition = {
  totalShows: number;
  year: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  startDate: string;
  endDate: string;
  numberOfArticles: number;
};

export type Show = {
  isOpenForReservation: string;
  id: string;
  slug: string;
  name: string;
  editionYear: number;
  director: string;
  author?: string;
  cast?: string[];
  date: string;
  time: string;
  venueName: string;
  venueLocation?: string | null;
  showDescription: string;
  poster?: string;
  bookingUrl?: string;
  link?: string;
  reversedSeats: number;
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
