import { useMemo } from 'react';
import { buildQueryKey, useApiQuery } from './reactQueryClient';
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

export const useFestivalEditions = () =>
  useApiQuery<FestivalApiResponse, FestivalEdition[]>({
    queryKey: buildQueryKey('festival-editions'),
    path: '/hita_arab_festival/festivals',
    select: data => (data.results ?? []).map(mapFestivalApiResultToEdition),
  });

export const useShows = () =>
  useApiQuery<Show[]>({
    queryKey: buildQueryKey('shows'),
    path: '/api/shows.json',
    useBaseUrl: false,
    placeholderData: emptyArray,
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
