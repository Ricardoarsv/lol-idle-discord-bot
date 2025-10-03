import { LRUCache } from 'lru-cache';
import { UserConfig } from '../../domain/entities/user-config.entity';
import type { IUserConfigRepository, UserConfigStats } from '../../domain/repositories/user-config.repository';
import type { UserId } from '../../shared/types';
import type { Language, DifficultyLevel } from '../../shared/enums';
import { CACHE_DURATIONS } from '../../shared/constants';

/**
 * Implementación con caché LRU del repositorio de configuraciones de usuario
 */
export class LRUUserConfigRepository implements IUserConfigRepository {
	private cache: LRUCache<UserId, UserConfig>;

	constructor(maxSize: number = 1000) {
		this.cache = new LRUCache<UserId, UserConfig>({
			max: maxSize,
			ttl: CACHE_DURATIONS.USER_CONFIG
		});
	}

	findByUserId(userId: UserId): UserConfig {
		// Si existe en caché, actualizarla y devolverla
		if (this.cache.has(userId)) {
			const config = this.cache.get(userId)!;
			const touched = config.touch();
			this.cache.set(userId, touched);
			return touched;
		}

		// Si no existe, crear una configuración por defecto
		const defaultConfig = UserConfig.createDefault(userId);
		this.cache.set(userId, defaultConfig);
		console.log(`👤 Nueva configuración creada para usuario: ${userId}`);
		
		return defaultConfig;
	}

	save(config: UserConfig): void {
		this.cache.set(config.userId, config);
		console.log(`⚙️ Configuración guardada para usuario: ${config.userId}`);
	}

	findByLanguage(language: Language): UserId[] {
		const userIds: UserId[] = [];
		
		for (const [userId, config] of this.cache.entries()) {
			if (config.language === language) {
				userIds.push(userId);
			}
		}
		
		return userIds;
	}

	findByDifficulty(difficulty: DifficultyLevel): UserId[] {
		const userIds: UserId[] = [];
		
		for (const [userId, config] of this.cache.entries()) {
			if (config.difficulty === difficulty) {
				userIds.push(userId);
			}
		}
		
		return userIds;
	}

	getStats(): UserConfigStats {
		const allConfigs = Array.from(this.cache.values());
		
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
			cacheSize: this.cache.size,
			cacheMaxSize: this.cache.max
		};
	}

	cleanupInactive(daysInactive: number = 30): number {
		let cleaned = 0;
		
		for (const [userId, config] of this.cache.entries()) {
			if (config.isInactive(daysInactive)) {
				this.cache.delete(userId);
				cleaned++;
			}
		}
		
		console.log(`🧹 Limpiadas ${cleaned} configuraciones de usuarios inactivos`);
		return cleaned;
	}

	exportAll(): Record<UserId, UserConfig> {
		const configs: Record<UserId, UserConfig> = {};
		
		for (const [userId, config] of this.cache.entries()) {
			configs[userId] = config;
		}
		
		return configs;
	}

	importAll(configs: Record<UserId, UserConfig>): number {
		let imported = 0;
		
		for (const [userId, configData] of Object.entries(configs)) {
			try {
				// Reconstruir la entidad UserConfig
				const config = UserConfig.create({
					userId,
					language: configData.language,
					difficulty: configData.difficulty,
					autoHints: configData.autoHints,
					lastUsed: configData.lastUsed
				});
				
				this.cache.set(userId, config);
				imported++;
			} catch (error) {
				console.warn(`Configuración inválida para usuario ${userId}, omitiendo...`, error);
			}
		}
		
		console.log(`📥 Importadas ${imported} configuraciones de usuarios`);
		return imported;
	}
}
