/**
 * Idiomas y locales soportados
 */

export enum Language {
	ES = 'es',
	EN = 'en',
	MX = 'mx'
}

export enum Locale {
	SPANISH = 'es_ES',
	ENGLISH = 'en_US',
	LATIN_AMERICA = 'es_MX'
}

export const LANGUAGE_TO_LOCALE: Record<Language, Locale> = {
	[Language.ES]: Locale.SPANISH,
	[Language.EN]: Locale.ENGLISH,
	[Language.MX]: Locale.LATIN_AMERICA
};

export const LOCALE_TO_LANGUAGE: Record<Locale, Language> = {
	[Locale.SPANISH]: Language.ES,
	[Locale.ENGLISH]: Language.EN,
	[Locale.LATIN_AMERICA]: Language.MX
};

export function getLocaleFromLanguage(language: Language): Locale {
	return LANGUAGE_TO_LOCALE[language] ?? Locale.SPANISH;
}

export function getLanguageFromLocale(locale: Locale): Language {
	return LOCALE_TO_LANGUAGE[locale] ?? Language.ES;
}
