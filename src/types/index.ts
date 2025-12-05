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
  organizer?: string;
  logo?: string;
  organizingTeam?: ShowDetailEntry[];
  juryList?: string[];
  awards?: ShowDetailEntry[];
  extraDetails?: (string | ShowDetailEntry)[];
};

export type ShowDetailEntry = {
  text: string;
  value?: string | string[];
  children?: ShowDetailEntry[];
  link?: string;
};

export type Show = {
  id: string;
  slug: string;
  name: string;
  editionYear: number;
  festivalId?: string;
  festivalSlug?: string;
  festivalName?: string;
  director: string;
  author?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  cast?: ShowDetailEntry[];
  crew?: ShowDetailEntry[];
  notes?: ShowDetailEntry[];
  castWord?: string | null;
  showDescription: string | string[];
  date: string;
  time: string;
  venueName: string;
  venueLocation?: string | null;
  poster?: string;
  bookingUrl?: string;
  reservedSeats?: number;
  allowedSeats?: number;
  allowedWaiting?: number;
  isOpenForReservation: string;
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
  festivalId?: string;
  createdAt: string;
  contentAr: string;
  contentEn?: string;
  attachments?: string[];
};

export type CreativitySubmission = {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  author: string;
  type: "story" | "essay" | "poem" | "other";
  editionYear?: number;
  showId?: string;
  festivalId?: string;
  createdAt: string;
  content: string;
  contentAr?: string;
  contentEn?: string;
  attachments?: string[];
};

export type Comment = {
  id: string;
  content: string;
  author?: string;
  createdAt: string;
  showId: string;
  isApproved?: boolean;
};

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';
