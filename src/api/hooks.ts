import {useMemo} from 'react';
import {buildQueryKey, useApiMutation, useApiQuery, withQueryParams} from './reactQueryClient';
import type {Article, ArticleType, Comment, CreativitySubmission, FestivalEdition, Show, ShowDetailEntry} from '../types';

const emptyArray: never[] = [];

type FestivalApiResult = {
    id: number;
    name: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    extraDetails?: (string | ShowDetailFieldApi)[] | string | null;
    logo?: string | null;
    totalShows: number;
    organizer?: string | null;
    organizingTeam?: ShowDetailFieldApi[] | null;
    juryList?: string[] | null;
    awards?: ShowDetailFieldApi[] | null;
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
    name?: string | null;
    slug?: string | null;
    link?: string | null;
    poster?: string | null;
    author?: string | null;
    director?: string | null;
    reservedSeats?: number | null;
    status?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    notes?: ShowDetailFieldApi[] | string | null;
    cast?: ShowDetailFieldApi[] | string | null;
    crew?: ShowDetailFieldApi[] | string | null;
    castWord?: string | null;
    showDescription?: string | string[] | null;
    date?: string | null;
    time?: string | null;
    festivalSlug?: number | string | null;
    festivalName?: string | null;
    festival?: number | null;
    venueName?: string | null;
    venueLocation?: string | null;
    isOpenForReservation: string;
    allowedSeats?: number | null;
    allowedWaiting?: number | null;
};

type PaginatedResponse<T> = {
    count: number;
    totalPages: number;
    currentPage: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

type ArticleApiResult = {
    id: number;
    slug?: string | null;
    title?: string | null;
    titleAr?: string | null;
    titleEn?: string | null;
    content?: string | null;
    contentAr?: string | null;
    contentEn?: string | null;
    author?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    tag?: string | null;
    show?: number | null;
    festival?: number | null;
    festivalYear?: number | null;
    articleAttachmentsList?: string[] | null;
};

const mapExtraDetails = (
    extraDetails?: (string | ShowDetailFieldApi)[] | string | null
): (string | ShowDetailEntry)[] | undefined => {
    if (!extraDetails) {
        return undefined;
    }

    if (typeof extraDetails === 'string') {
        try {
            const parsed = JSON.parse(extraDetails);
            if (Array.isArray(parsed)) {
                return parsed
                    .map(item => {
                        if (typeof item === 'string') {
                            return item;
                        }
                        return mapStructuredItem(item);
                    })
                    .filter((item): item is string | ShowDetailEntry => Boolean(item));
            }
        } catch {
            return [extraDetails];
        }
        return [extraDetails];
    }

    if (Array.isArray(extraDetails)) {
        return extraDetails
            .map(item => {
                if (typeof item === 'string') {
                    return item;
                }
                return mapStructuredItem(item);
            })
            .filter((item): item is string | ShowDetailEntry => Boolean(item));
    }

    return undefined;
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
        organizer: festival.organizer ?? undefined,
        logo: festival.logo ?? undefined,
        organizingTeam: mapStructuredField(festival.organizingTeam, undefined),
        juryList: festival.juryList ?? undefined,
        awards: mapStructuredField(festival.awards, undefined),
        extraDetails: mapExtraDetails(festival.extraDetails),
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
    const fallbackYearSource = show.createdAt ?? datePart;
    const editionYear = fallbackYearSource
        ? new Date(fallbackYearSource).getFullYear()
        : new Date().getFullYear();
    const title = show.name ?? 'عرض مسرحي';

    return {
        id: String(show.id),
        slug: show.slug ?? `show-${show.id}`,
        name: title,
        editionYear,
        festivalId: show.festival ? String(show.festival) : undefined,
        festivalSlug: show.festivalSlug ? String(show.festivalSlug) : undefined,
        festivalName: show.festivalName ?? undefined,
        director: show.director ?? 'غير معروف',
        author: show.author ?? undefined,
        status: show.status ?? undefined,
        createdAt: show.createdAt ?? undefined,
        updatedAt: show.updatedAt ?? undefined,
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
        reservedSeats: show.reservedSeats ?? undefined,
        allowedSeats: show.allowedSeats ?? undefined,
        allowedWaiting: show.allowedWaiting ?? undefined,
        isOpenForReservation: show.isOpenForReservation ?? 'CLOSED',
        castWord: show.castWord && show.castWord.trim() !== '' ? show.castWord : undefined,
    };
};

const mapArticleTagToType = (tag?: string | null): ArticleType => {
    if (!tag) {
        return 'general';
    }

    switch (tag.toUpperCase()) {
        case 'SHOW':
            return 'review';
        case 'SYMPOSIUM':
            return 'symposium_coverage';
        case 'ANALYSIS':
            return 'analysis';
        default:
            return 'general';
    }
};

const mapArticleApiResultToArticle = (article: ArticleApiResult): Article => {
    const createdAt = article.createdAt ?? new Date().toISOString();
    const editionYear =
        article.festivalYear ??
        (article.createdAt ? new Date(article.createdAt).getFullYear() : new Date().getFullYear());

    const baseTitle = article.title ?? 'مقال نقدي';

    return {
        id: String(article.id),
        slug: article.slug ?? `article-${article.id}`,
        titleAr: article.titleAr ?? baseTitle,
        titleEn: article.titleEn ?? baseTitle,
        author: article.author ?? 'غير معروف',
        editionYear,
        type: mapArticleTagToType(article.tag),
        ...(article.show ? {showId: String(article.show)} : {}),
        ...(article.festival ? {festivalId: String(article.festival)} : {}),
        createdAt,
        contentAr: article.contentAr ?? article.content ?? '',
        contentEn: article.contentEn ?? article.content ?? article.contentAr ?? undefined,
        attachments: Array.isArray(article.articleAttachmentsList)
            ? article.articleAttachmentsList.filter((path): path is string => typeof path === 'string' && path.trim() !== '')
            : undefined,
    };
};

const mapCreativityTagToType = (tag?: string | null): CreativitySubmission['type'] => {
    if (!tag) {
        return 'other';
    }

    switch (tag.toUpperCase()) {
        case 'STORY':
            return 'story';
        case 'ESSAY':
            return 'essay';
        case 'POEM':
            return 'poem';
        default:
            return 'other';
    }
};

const mapArticleApiResultToCreativity = (article: ArticleApiResult): CreativitySubmission => {
    const baseTitleAr = article.titleAr ?? article.title ?? 'عمل إبداعي';
    const baseTitleEn = article.titleEn ?? article.title ?? 'Creative Work';
    const attachments = Array.isArray(article.articleAttachmentsList)
        ? article.articleAttachmentsList.filter((path): path is string => typeof path === 'string' && path.trim() !== '')
        : undefined;

    return {
        id: String(article.id),
        slug: article.slug ?? `creativity-${article.id}`,
        title: baseTitleAr,
        titleAr: baseTitleAr,
        titleEn: baseTitleEn,
        author: article.author ?? 'غير معروف',
        type: mapCreativityTagToType(article.tag),
        editionYear:
            article.festivalYear ??
            (article.createdAt ? new Date(article.createdAt).getFullYear() : undefined),
        ...(article.show ? {showId: String(article.show)} : {}),
        ...(article.festival ? {festivalId: String(article.festival)} : {}),
        createdAt: article.createdAt ?? new Date().toISOString(),
        content: article.contentAr ?? article.contentEn ?? article.content ?? '',
        contentAr: article.contentAr ?? article.content ?? '',
        contentEn: article.contentEn ?? article.content ?? undefined,
        attachments,
    };
};

const emptyArticleResponse: PaginatedResponse<ArticleApiResult> = {
    count: 0,
    totalPages: 0,
    currentPage: 1,
    next: null,
    previous: null,
    results: [],
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

type ArticleQueryType = 'ARTICLE' | 'SYMPOSIA' | 'CREATIVITY';

const buildArticlesPath = (contentType: ArticleQueryType) =>
    withQueryParams('/hita_arab_festival/articles', {type: contentType});

export const useArticles = (contentType: ArticleQueryType = 'ARTICLE') =>
    useApiQuery<PaginatedResponse<ArticleApiResult>, Article[]>({
        queryKey: buildQueryKey('articles', contentType.toLowerCase()),
        path: () => buildArticlesPath(contentType),
        select: data => (data.results ?? []).map(mapArticleApiResultToArticle),
        placeholderData: emptyArticleResponse,
    });

export const useArticle = (articleId?: string | number, options?: UseSingleEntityOptions) =>
    useApiQuery<ArticleApiResult, Article>({
        queryKey: buildQueryKey('article', articleId ?? 'detail'),
        path: () => `/hita_arab_festival/articles/${articleId}`,
        select: data => mapArticleApiResultToArticle(data),
        enabled: Boolean(articleId) && (options?.enabled ?? true),
    });

export const useSymposia = () => useArticles('SYMPOSIA');

export const useCreativityEntries = () =>
    useApiQuery<PaginatedResponse<ArticleApiResult>, CreativitySubmission[]>({
        queryKey: buildQueryKey('creativity'),
        path: () => buildArticlesPath('CREATIVITY'),
        select: data => (data.results ?? []).map(mapArticleApiResultToCreativity),
        placeholderData: emptyArticleResponse,
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

export type ReserveShowResponseData = {
    data: ReserveShowResponse;
};



export const useReserveShow = () =>
    useApiMutation<ReserveShowResponseData, ReserveShowVariables>({
        path: ({showId}) => `/hita_arab_festival/shows/${showId}/reserve`,
        method: 'POST',
        expectedStatus: 201,
        bodySerializer: ({name, email}) =>
            JSON.stringify({
                name: name,
                email,
            }),
    });

type CommentApiResult = {
    id: number;
    content?: string | null;
    author?: string | null;
    createdAt?: string | null;
    show?: number | null;
    isApproved?: boolean | null;
};

const mapCommentApiResultToComment = (comment: CommentApiResult): Comment => ({
    id: String(comment.id),
    content: comment.content ?? '',
    author: comment.author ?? undefined,
    createdAt: comment.createdAt ?? new Date().toISOString(),
    showId: comment.show ? String(comment.show) : '',
    isApproved: comment.isApproved ?? false,
});

export const useComments = (showId?: string | number) =>
    useApiQuery<PaginatedResponse<CommentApiResult>, Comment[]>({
        queryKey: buildQueryKey('comments', showId ?? 'all'),
        path: showId
            ? withQueryParams('/hita_arab_festival/comments', {show: showId})
            : '/hita_arab_festival/comments',
        select: data => (data.results ?? []).map(mapCommentApiResultToComment),
        enabled: Boolean(showId),
    });

type SubmitCommentVariables = {
    content: string;
    show: string;
};

export type SubmitCommentResponse = {
    id: number;
    content: string;
    show: number;
    createdAt: string;
};

export const useSubmitComment = () =>
    useApiMutation<SubmitCommentResponse, SubmitCommentVariables>({
        path: '/hita_arab_festival/comments',
        method: 'POST',
        expectedStatus: 201,
        bodySerializer: ({content, show}) =>
            JSON.stringify({
                content,
                show,
            }),
    });
