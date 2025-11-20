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

export const useFestivalEditions = () =>
  useApiQuery<FestivalEdition[]>({
    queryKey: buildQueryKey('festival-editions'),
    path: '/festival-editions.json',
    placeholderData: emptyArray,
  });

export const useShows = () =>
  useApiQuery<Show[]>({
    queryKey: buildQueryKey('shows'),
    path: '/shows.json',
    placeholderData: emptyArray,
  });

export const useArticles = () =>
  useApiQuery<Article[]>({
    queryKey: buildQueryKey('articles'),
    path: '/articles.json',
    placeholderData: emptyArray,
  });

export const useSymposia = () =>
  useApiQuery<Symposium[]>({
    queryKey: buildQueryKey('symposia'),
    path: '/symposia.json',
    placeholderData: emptyArray,
  });

export const useCreativityEntries = () =>
  useApiQuery<CreativitySubmission[]>({
    queryKey: buildQueryKey('creativity'),
    path: '/creativity.json',
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
