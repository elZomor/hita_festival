import { useMemo } from 'react';
import { buildQueryKey, useApiQuery, withQueryParams } from './reactQueryClient';
import type {
  Article,
  CreativitySubmission,
  FestivalEdition,
  Show,
  Symposium,
} from '../types';

const emptyArray: never[] = [];

type FestivalApiResult = {
  id: number;
  name: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  extraDetails?: string | null;
  logo?: string | null;
};

type FestivalApiResponse = {
  count: number;
  totalPages: number;
  currentPage: number;
  next: string | null;
  previous: string | null;
  results: FestivalApiResult[];
};

type ShowApiResult = {
  id: number;
  name: string;
  link?: string | null;
  poster?: string | null;
  author?: string | null;
  director?: string | null;
  reservedSeats?: number | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  notes?: string | null;
  cast?: string | null;
  crew?: string | null;
  castWord?: string | null;
  showDescription?: string | null;
  date?: string | null;
  time?: string | null;
  festival?: number | null;
};

type PaginatedResponse<T> = {
  count: number;
  totalPages: number;
  currentPage: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const mapFestivalApiResultToEdition = (festival: FestivalApiResult): FestivalEdition => {
  const startDate = festival.startDate ?? festival.endDate ?? '';
  const endDate = festival.endDate ?? festival.startDate ?? '';
  const year = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();

  return {
    year,
    slug: String(festival.id),
    titleAr: festival.name,
    titleEn: festival.name,
    descriptionAr: festival.description ?? '',
    descriptionEn: festival.description ?? '',
    startDate,
    endDate,
    numberOfShows: 0,
    numberOfArticles: 0,
  };
};

const mapShowApiResultToShow = (show: ShowApiResult): Show => {
  const datePart = show.date ?? '';
  const timePart = show.time ?? '';
  const dateTime = datePart ? `${datePart}${timePart ? `T${timePart}` : ''}` : '';
  const editionYear = datePart ? new Date(datePart).getFullYear() : new Date().getFullYear();
  const title = show.name ?? 'عرض مسرحي';

  return {
    id: String(show.id),
    slug: `show-${show.id}`,
    titleAr: title,
    titleEn: title,
    editionYear,
    groupName: show.castWord || 'غير محدد',
    country: '',
    director: show.director ?? 'غير معروف',
    dramaturg: undefined,
    cast: show.cast
      ? show.cast.split(',').map(member => member.trim()).filter(Boolean)
      : undefined,
    dateTime,
    venue: show.notes ?? '',
    synopsisAr: show.showDescription ?? '',
    synopsisEn: show.showDescription ?? '',
    posterUrl: show.poster ?? undefined,
    bookingUrl: show.link ?? undefined,
  };
};

export const useFestivalEditions = () =>
  useApiQuery<FestivalApiResponse, FestivalEdition[]>({
    queryKey: buildQueryKey('festival-editions'),
    path: '/hita_arab_festival/festivals',
    select: data => (data.results ?? []).map(mapFestivalApiResultToEdition),
  });

type UseShowsOptions = {
  enabled?: boolean;
};

export const useShows = (festivalId?: string | number, options?: UseShowsOptions) =>
  useApiQuery<PaginatedResponse<ShowApiResult>, Show[]>({
    queryKey: buildQueryKey('shows', festivalId ?? 'all'),
    path: festivalId
      ? withQueryParams('/hita_arab_festival/shows', { festival: festivalId })
      : '/hita_arab_festival/shows',
    select: data => (data.results ?? []).map(mapShowApiResultToShow),
    enabled: options?.enabled,
  });

export const useArticles = () =>
  useApiQuery<Article[]>({
    queryKey: buildQueryKey('articles'),
    path: '/api/articles.json',
    useBaseUrl: false,
    placeholderData: emptyArray,
  });

export const useSymposia = () =>
  useApiQuery<Symposium[]>({
    queryKey: buildQueryKey('symposia'),
    path: '/api/symposia.json',
    useBaseUrl: false,
    placeholderData: emptyArray,
  });

export const useCreativityEntries = () =>
  useApiQuery<CreativitySubmission[]>({
    queryKey: buildQueryKey('creativity'),
    path: '/api/creativity.json',
    useBaseUrl: false,
    placeholderData: emptyArray,
  });

export const useLatestArticles = (limit = 3) => {
  const query = useArticles();
  const data = useMemo(
    () =>
      (query.data ?? emptyArray)
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit),
    [query.data, limit],
  );

  return { ...query, data };
};
