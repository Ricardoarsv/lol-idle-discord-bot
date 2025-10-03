/**
 * Constantes de configuración
 */

import { Language, Locale, DifficultyLevel } from '../enums';

export const DEFAULT_CONFIG = {
	VERSION_FALLBACK: '14.20.1',
	LOCALE: Locale.SPANISH,
	LANGUAGE: Language.ES,
	DIFFICULTY: DifficultyLevel.NORMAL
} as const;

export const CACHE_DURATIONS = {
	CHAMPIONS: 1000 * 60 * 60, // 1 hora
	DETAILS: 1000 * 60 * 30, // 30 minutos
	VERSION: 1000 * 60 * 10, // 10 minutos
	TRANSLATIONS: 1000 * 60 * 60 * 24, // 24 horas
	USER_CONFIG: 1000 * 60 * 60 * 24 // 24 horas
} as const;
