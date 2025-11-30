import {useMemo} from 'react';
import {buildQueryKey, useApiMutation, useApiQuery, withQueryParams} from './reactQueryClient';
import type {
    Article,
    CreativitySubmission,
    FestivalEdition,
    Show,
    ShowDetailEntry,
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
    totalShows: number
};

type FestivalApiResponse = {
    count: number;
    totalPages: number;
    currentPage: number;
    next: string | null;
    previous: string | null;
    results: FestivalApiResult[];
};

type ShowDetailFieldApi = {
    text: string;
    value?: string | null;
    children?: Array<ShowDetailFieldApi | string> | null;
};

type ShowApiResult = {
    id: number;
    name: string;
    link?: string | null;
    poster?: string | null;
    author?: string;
    director?: string | null;
    reservedSeats: number;
    status?: string | null;
    createdAt?: string;
    updatedAt?: string;
    notes?: ShowDetailFieldApi[] | string | null;
    cast?: ShowDetailFieldApi[] | string | null;
    crew?: ShowDetailFieldApi[] | string | null;
    castWord?: string | null;
    showDescription?: string | string[] | null;
    date?: string | null;
    time?: string | null;
    festivalSlug?: number | null;
    festivalName?: string | null;
    venueName?: string | null;
    venueLocation?: string | null;
    isOpenForReservation: string;
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
        totalShows: festival.totalShows,
        numberOfArticles: 0,
    };
};

const parseStructuredField = (field?: ShowDetailFieldApi[] | string | null): ShowDetailFieldApi[] | undefined => {
    if (!field) {
        return undefined;
    }

    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : undefined;
        } catch {
            return undefined;
        }
    }

    return Array.isArray(field) ? field : undefined;
};

const mapStructuredItem = (item?: ShowDetailFieldApi | null): ShowDetailEntry | null => {
    if (!item || typeof item.text !== 'string' || item.text.trim() === '') {
        return null;
    }

    const children = mapChildren(item.children);

    const baseEntry: ShowDetailEntry = {
        text: item.text,
        ...(item.value ? {value: mapItemValue(item.value)} : {}),
        ...(children && children.length > 0 ? {children} : {}),
    };

    return baseEntry;
};

const mapItemValue = (value?: string | null): string | string[] | undefined => {
    if (!value) {
        return undefined;
    }

    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string') {
            return parsed;
        }
        if (Array.isArray(parsed)) {
            const strings = parsed.filter(item => typeof item === 'string');
            return strings.length > 0 ? strings : undefined;
        }
    } catch {
        // fallback to raw string
    }

    return value;
};

const mapChildren = (children?: Array<ShowDetailFieldApi | string> | null): ShowDetailEntry[] | undefined => {
    if (!children) {
        return undefined;
    }

    const mapped = children
        .map(child => {
            if (typeof child === 'string') {
                return {text: child};
            }
            return mapStructuredItem(child);
        })
        .filter((child): child is ShowDetailEntry => Boolean(child));

    return mapped.length > 0 ? mapped : undefined;
};

const mapStructuredField = (
    field?: ShowDetailFieldApi[] | string | null,
    fallbackLabel?: string,
): ShowDetailEntry[] | undefined => {
    if (typeof field === 'string') {
        const mappedValue = mapItemValue(field);
        if (mappedValue) {
            return [
                {
                    text: fallbackLabel ?? '',
                    value: mappedValue,
                },
            ];
        }
    }

    const rawItems = parseStructuredField(field);
    if (!rawItems) {
        return undefined;
    }

    const mapped = rawItems
        .map(mapStructuredItem)
        .filter((item): item is ShowDetailEntry => Boolean(item));

    return mapped.length > 0 ? mapped : undefined;
};

const parseDescriptionField = (description?: string | string[] | null): string | string[] => {
    if (!description) {
        return '';
    }

    if (Array.isArray(description)) {
        return description;
    }

    try {
        const parsed = JSON.parse(description);
        if (typeof parsed === 'string' || Array.isArray(parsed)) {
            return parsed;
        }
    } catch {
        // ignore, fallback to raw string
    }

    return description;
};

const mapShowApiResultToShow = (show: ShowApiResult): Show => {
    const datePart = show.date ?? '';
    const timePart = show.time ?? '';
    const editionYear = datePart ? new Date(datePart).getFullYear() : new Date().getFullYear();
    const title = show.name ?? 'عرض مسرحي';

    return {
        id: String(show.id),
        slug: `show-${show.id}`,
        name: title,
        editionYear,
        festivalSlug: show.festivalSlug ? String(show.festivalSlug) : undefined,
        festivalName: show.festivalName ?? undefined,
        director: show.director ?? 'غير معروف',
        author: show.author ?? undefined,
        cast: mapStructuredField(show.cast, show.castWord ?? undefined),
        crew: mapStructuredField(show.crew, undefined),
        notes: mapStructuredField(show.notes, undefined),
        date: datePart,
        time: timePart,
        venueName: show.venueName ?? '',
        showDescription: parseDescriptionField(show.showDescription),
        poster: show.poster ?? undefined,
        bookingUrl: show.link ?? undefined,
        venueLocation: show.venueLocation,
        reversedSeats: show.reservedSeats,
        isOpenForReservation: show.isOpenForReservation,
        castWord: show.castWord
    };
};

export const useFestivalEditions = () =>
    useApiQuery<FestivalApiResponse, FestivalEdition[]>({
        queryKey: buildQueryKey('festival-editions'),
        path: '/hita_arab_festival/festivals',
        select: data => (data.results ?? []).map(mapFestivalApiResultToEdition),
    });

export const useFestivalEditionById = (festivalId?: string | number, options?: UseSingleEntityOptions) =>
    useApiQuery<FestivalApiResult, FestivalEdition>({
        queryKey: buildQueryKey('festival-edition', festivalId ?? 'detail'),
        path: () => `/hita_arab_festival/festivals/${festivalId}`,
        select: data => mapFestivalApiResultToEdition(data),
        enabled: Boolean(festivalId) && (options?.enabled ?? true),
    });

type UseShowsOptions = {
    enabled?: boolean;
};
type UseSingleEntityOptions = {
    enabled?: boolean;
};

export const useShows = (festivalId?: string | number, options?: UseShowsOptions) =>
    useApiQuery<PaginatedResponse<ShowApiResult>, Show[]>({
        queryKey: buildQueryKey('shows', festivalId ?? 'all'),
        path: festivalId
            ? withQueryParams('/hita_arab_festival/shows', {festival: festivalId})
            : '/hita_arab_festival/shows',
        select: data => (data.results ?? []).map(mapShowApiResultToShow),
        enabled: options?.enabled,
    });

export const useShow = (showId?: string | number, options?: UseSingleEntityOptions) =>
    useApiQuery<ShowApiResult, Show>({
        queryKey: buildQueryKey('show', showId ?? 'detail'),
        path: () => `/hita_arab_festival/shows/${showId}`,
        select: data => mapShowApiResultToShow(data),
        enabled: Boolean(showId) && (options?.enabled ?? true),
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

    return {...query, data};
};

type ReserveShowVariables = {
    showId: string;
    name: string;
    email: string;
};

export type ReserveShowResponse = {
    id: number;
    name: string;
    reservationNumber: number | string;
    reservationStatus: string;
};

export const useReserveShow = () =>
    useApiMutation<ReserveShowResponse, ReserveShowVariables>({
        path: ({showId}) => `/hita_arab_festival/shows/${showId}/reserve`,
        method: 'POST',
        expectedStatus: 201,
        bodySerializer: ({name, email}) =>
            JSON.stringify({
                name: name,
                email,
            }),
    });
