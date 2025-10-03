import type { UserConfig } from '../entities/user-config.entity';
import type { UserId } from '../../shared/types';
import type { Language, DifficultyLevel } from '../../shared/enums';

/**
 * Estadísticas de configuraciones de usuario
 */
export interface UserConfigStats {
	totalUsers: number;
	languageDistribution: Record<string, number>;
	difficultyDistribution: Record<string, number>;
	cacheSize: number;
	cacheMaxSize: number;
}

/**
 * Interfaz del repositorio de configuraciones de usuario
 * Define el contrato para la persistencia de preferencias de usuario
 */
export interface IUserConfigRepository {
	/**
	 * Obtiene la configuración de un usuario
	 */
	findByUserId(userId: UserId): UserConfig;

	/**
	 * Guarda o actualiza la configuración de un usuario
	 */
	save(config: UserConfig): void;

	/**
	 * Obtiene usuarios por idioma
	 */
	findByLanguage(language: Language): UserId[];

	/**
	 * Obtiene usuarios por dificultad
	 */
	findByDifficulty(difficulty: DifficultyLevel): UserId[];

	/**
	 * Obtiene estadísticas de configuraciones
	 */
	getStats(): UserConfigStats;

	/**
	 * Limpia configuraciones de usuarios inactivos
	 */
	cleanupInactive(daysInactive: number): number;

	/**
	 * Exporta todas las configuraciones
	 */
	exportAll(): Record<UserId, UserConfig>;

	/**
	 * Importa configuraciones
	 */
	importAll(configs: Record<UserId, UserConfig>): number;
}
