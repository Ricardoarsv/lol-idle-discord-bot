import { LRUCache } from 'lru-cache';
import { CACHE_DURATIONS, DEFAULT_CONFIG, getLocaleFromLanguage, isValidLanguage, isValidDifficulty } from '../util/enums';
import type { UserConfig, UserId, LanguageCodes, DifficultyLevels, SupportedLocales } from '../types/index';


const userConfigCache = new LRUCache<UserId, UserConfig>({
	max: 1000,
	ttl: CACHE_DURATIONS.TRANSLATIONS
});

/**
 * Obtiene la configuración de un usuario
 * @param userId - ID del usuario de Discord
 * @returns Configuración del usuario
 */
export function getUserConfig(userId: UserId): UserConfig {
	
	if (userConfigCache.has(userId)) {
		const config = userConfigCache.get(userId)!;
		
		config.lastUsed = Date.now();
		return config;
	}

	
	const defaultConfig: UserConfig = {
		language: DEFAULT_CONFIG.LANGUAGE as LanguageCodes,
		locale: getLocaleFromLanguage(DEFAULT_CONFIG.LANGUAGE as LanguageCodes),
		difficulty: DEFAULT_CONFIG.DIFFICULTY as DifficultyLevels,
		autoHints: false,
		lastUsed: Date.now()
	};

	userConfigCache.set(userId, defaultConfig);
	console.log(`👤 Nueva configuración creada para usuario: ${userId}`);
	
	return defaultConfig;
}

/**
 * Actualiza la configuración de un usuario
 * @param userId - ID del usuario
 * @param updates - Actualizaciones a aplicar
 * @returns Configuración actualizada
 */
export function updateUserConfig(userId: UserId, updates: Partial<UserConfig>): UserConfig {
	const currentConfig = getUserConfig(userId);
	
	
	const newConfig: UserConfig = { ...currentConfig };
	
	if (updates.language && isValidLanguage(updates.language)) {
		newConfig.language = updates.language;
		newConfig.locale = getLocaleFromLanguage(updates.language);
	}
	
	if (updates.difficulty && isValidDifficulty(updates.difficulty)) {
		newConfig.difficulty = updates.difficulty;
	}
	
	if (updates.autoHints !== undefined) {
		newConfig.autoHints = updates.autoHints;
	}
	
	newConfig.lastUsed = Date.now();
	
	userConfigCache.set(userId, newConfig);
	console.log(`⚙️ Configuración actualizada para usuario: ${userId}`);
	
	return newConfig;
}

/**
 * Cambia el idioma de un usuario
 * @param userId - ID del usuario
 * @param languageCode - Nuevo código de idioma
 * @returns Configuración actualizada
 */
export function setUserLanguage(userId: UserId, languageCode: LanguageCodes): UserConfig {
	if (!isValidLanguage(languageCode)) {
		throw new Error(`Código de idioma inválido: ${languageCode}`);
	}
	
	return updateUserConfig(userId, { 
		language: languageCode,
		locale: getLocaleFromLanguage(languageCode)
	});
}

/**
 * Cambia la dificultad preferida de un usuario
 * @param userId - ID del usuario
 * @param difficulty - Nuevo nivel de dificultad
 * @returns Configuración actualizada
 */
export function setUserDifficulty(userId: UserId, difficulty: DifficultyLevels): UserConfig {
	if (!isValidDifficulty(difficulty)) {
		throw new Error(`Nivel de dificultad inválido: ${difficulty}`);
	}
	
	return updateUserConfig(userId, { difficulty });
}

/**
 * Obtiene estadísticas de configuraciones de usuarios
 * @returns Estadísticas
 */
export function getUserConfigStats(): {
	totalUsers: number;
	languageDistribution: Record<string, number>;
	difficultyDistribution: Record<string, number>;
	cacheSize: number;
	cacheMaxSize: number;
} {
	const allConfigs = Array.from(userConfigCache.values());
	
	const languageDistribution: Record<string, number> = {};
	const difficultyDistribution: Record<string, number> = {};
	
	for (const config of allConfigs) {
		languageDistribution[config.language] = (languageDistribution[config.language] || 0) + 1;
		difficultyDistribution[config.difficulty] = (difficultyDistribution[config.difficulty] || 0) + 1;
	}
	
	return {
		totalUsers: allConfigs.length,
		languageDistribution,
		difficultyDistribution,
		cacheSize: userConfigCache.size,
		cacheMaxSize: userConfigCache.max
	};
}

/**
 * Limpia configuraciones de usuarios inactivos
 * @param daysInactive - Días de inactividad para limpiar
 * @returns Número de configuraciones eliminadas
 */
export function cleanupInactiveUsers(daysInactive: number = 30): number {
	const cutoffTime = Date.now() - (daysInactive * 24 * 60 * 60 * 1000);
	let cleaned = 0;
	
	for (const [userId, config] of userConfigCache.entries()) {
		if (config.lastUsed < cutoffTime) {
			userConfigCache.delete(userId);
			cleaned++;
		}
	}
	
	console.log(`🧹 Limpiadas ${cleaned} configuraciones de usuarios inactivos`);
	return cleaned;
}

/**
 * Exporta todas las configuraciones de usuarios (para backup)
 * @returns Todas las configuraciones
 */
export function exportUserConfigs(): Record<UserId, UserConfig> {
	const configs: Record<UserId, UserConfig> = {};
	
	for (const [userId, config] of userConfigCache.entries()) {
		configs[userId] = { ...config };
	}
	
	return configs;
}

/**
 * Importa configuraciones de usuarios (desde backup)
 * @param configs - Configuraciones a importar
 * @returns Número de configuraciones importadas
 */
export function importUserConfigs(configs: Record<UserId, UserConfig>): number {
	let imported = 0;
	
	for (const [userId, config] of Object.entries(configs)) {
		
		if (isValidLanguage(config.language) && isValidDifficulty(config.difficulty)) {
			userConfigCache.set(userId, config);
			imported++;
		} else {
			console.warn(`Configuración inválida para usuario ${userId}, omitiendo...`);
		}
	}
	
	console.log(`📥 Importadas ${imported} configuraciones de usuarios`);
	return imported;
}

/**
 * Obtiene usuarios por idioma
 * @param language - Código de idioma
 * @returns Array de IDs de usuarios
 */
export function getUsersByLanguage(language: LanguageCodes): UserId[] {
	const userIds: UserId[] = [];
	
	for (const [userId, config] of userConfigCache.entries()) {
		if (config.language === language) {
			userIds.push(userId);
		}
	}
	
	return userIds;
}

/**
 * Obtiene usuarios por dificultad
 * @param difficulty - Nivel de dificultad
 * @returns Array de IDs de usuarios
 */
export function getUsersByDifficulty(difficulty: DifficultyLevels): UserId[] {
	const userIds: UserId[] = [];
	
	for (const [userId, config] of userConfigCache.entries()) {
		if (config.difficulty === difficulty) {
			userIds.push(userId);
		}
	}
	
	return userIds;
}