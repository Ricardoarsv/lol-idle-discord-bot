/**
 * Enumeraciones y constantes del sistema
 */


export const SUPPORTED_LOCALES = {
	SPANISH: 'es_ES',
	ENGLISH: 'en_US',
	LATIN_AMERICA: 'es_MX'
} as const;


export const LANGUAGE_CODES = {
	ES: 'es',
	EN: 'en',
	MX: 'mx'
} as const;


export const DIFFICULTY_LEVELS = {
	EASY: 'easy',
	NORMAL: 'normal',
	HARD: 'hard',
	EXPERT: 'expert'
} as const;


export const HINTS_CONFIG = {
	easy: {
		maxHints: 8,
		baseHints: 4,
		name: 'Fácil'
	},
	normal: {
		maxHints: 6,
		baseHints: 3,
		name: 'Normal'
	},
	hard: {
		maxHints: 4,
		baseHints: 2,
		name: 'Difícil'
	},
	expert: {
		maxHints: 2,
		baseHints: 1,
		name: 'Experto'
	}
} as const;


export const RESOURCE_TYPES = {
	MANA: 'Mana',
	ENERGY: 'Energy',
	FURY: 'Fury',
	RAGE: 'Rage',
	FLOW: 'Flow',
	HEAT: 'Heat',
	FEROCITY: 'Ferocity',
	BLOOD_WELL: 'BloodWell',
	NONE: 'None'
} as const;


export const CHAMPION_TAGS = {
	ASSASSIN: 'Assassin',
	FIGHTER: 'Fighter',
	MAGE: 'Mage',
	MARKSMAN: 'Marksman',
	SUPPORT: 'Support',
	TANK: 'Tank'
} as const;


export const ATTACK_TYPES = {
	MELEE: 'melee',
	RANGED: 'ranged'
} as const;


export const ATTACK_RANGE_THRESHOLD = 200;


export const CACHE_DURATIONS = {
	CHAMPIONS: 1000 * 60 * 60, 
	DETAILS: 1000 * 60 * 30, 
	VERSION: 1000 * 60 * 10, 
	TRANSLATIONS: 1000 * 60 * 60 * 24 
} as const;


export const API_URLS = {
	VERSIONS: 'https://ddragon.leagueoflegends.com/api/versions.json',
	CHAMPIONS: 'https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/champion.json',
	CHAMPION_DETAIL: 'https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/champion/{champion}.json',
	SPLASH_ART: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{champion}_{skin}.jpg',
	ICON: 'https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champion}.png'
} as const;


export const DEFAULT_CONFIG = {
	VERSION_FALLBACK: '14.20.1',
	LOCALE: 'es_ES',
	LANGUAGE: 'es',
	DIFFICULTY: 'normal'
} as const;


export const LANGUAGE_TO_LOCALE_MAP = {
	es: 'es_ES',
	en: 'en_US',
	mx: 'es_MX'
} as const;


export type SupportedLocales = typeof SUPPORTED_LOCALES[keyof typeof SUPPORTED_LOCALES];
export type LanguageCodes = typeof LANGUAGE_CODES[keyof typeof LANGUAGE_CODES];
export type DifficultyLevels = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];


export const isValidLanguage = (lang: string): lang is LanguageCodes => {
	return Object.values(LANGUAGE_CODES).includes(lang as LanguageCodes);
};

export const isValidDifficulty = (diff: string): diff is DifficultyLevels => {
	return Object.values(DIFFICULTY_LEVELS).includes(diff as DifficultyLevels);
};

export const isValidLocale = (locale: string): locale is SupportedLocales => {
	return Object.values(SUPPORTED_LOCALES).includes(locale as SupportedLocales);
};


export const getLocaleFromLanguage = (language: LanguageCodes): SupportedLocales => {
	const mapping = LANGUAGE_TO_LOCALE_MAP as Record<LanguageCodes, SupportedLocales>;
	return mapping[language] ?? SUPPORTED_LOCALES.SPANISH;
};

export const getLanguageFromLocale = (locale: SupportedLocales): LanguageCodes => {
	const entry = Object.entries(LANGUAGE_TO_LOCALE_MAP).find(([, loc]) => loc === locale);
	return entry ? (entry[0] as LanguageCodes) : LANGUAGE_CODES.ES;
};