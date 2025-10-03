import { LRUCache } from 'lru-cache';
import { fetch } from 'undici';
import { API_URLS, CACHE_DURATIONS, DEFAULT_CONFIG, API_CONFIG } from '../../shared/constants';
import { ExternalApiError } from '../../shared/errors';

/**
 * Cliente para la API de Data Dragon de Riot Games
 */
export class DataDragonClient {
	private versionCache: LRUCache<string, string>;

	constructor() {
		this.versionCache = new LRUCache<string, string>({
			max: 1,
			ttl: CACHE_DURATIONS.VERSION
		});
	}

	/**
	 * Obtiene la versión más reciente de Data Dragon
	 */
	async getLatestVersion(): Promise<string> {
		const cacheKey = 'latest-version';

		if (this.versionCache.has(cacheKey)) {
			return this.versionCache.get(cacheKey)!;
		}

		try {
			console.log('🔄 Obteniendo versión más reciente de Data Dragon...');

			const response = await fetch(API_URLS.VERSIONS, {
				headers: {
					'User-Agent': API_CONFIG.USER_AGENT
				},
				signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
			});

			if (!response.ok) {
				throw new ExternalApiError(
					'Data Dragon',
					`Failed to fetch versions: ${response.statusText}`,
					response.status
				);
			}

			const versions = await response.json() as string[];

			if (!Array.isArray(versions) || versions.length === 0) {
				throw new ExternalApiError('Data Dragon', 'No versions available');
			}

			const latestVersion = versions[0];
			if (!latestVersion) {
				throw new ExternalApiError('Data Dragon', 'Invalid version returned');
			}

			this.versionCache.set(cacheKey, latestVersion);
			console.log(`✅ Versión más reciente obtenida: ${latestVersion}`);

			return latestVersion;
		} catch (error) {
			console.error('Error obteniendo versión más reciente:', error);
			console.warn(`Usando versión de fallback: ${DEFAULT_CONFIG.VERSION_FALLBACK}`);

			// Cachear el fallback por 1 minuto
			this.versionCache.set(cacheKey, DEFAULT_CONFIG.VERSION_FALLBACK, { ttl: 60000 });
			return DEFAULT_CONFIG.VERSION_FALLBACK;
		}
	}

	/**
	 * Realiza una petición GET a Data Dragon
	 */
	async get<T>(url: string): Promise<T> {
		try {
			const response = await fetch(url, {
				headers: {
					'User-Agent': API_CONFIG.USER_AGENT
				},
				signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
			});

			if (!response.ok) {
				throw new ExternalApiError(
					'Data Dragon',
					`HTTP ${response.status}: ${response.statusText}`,
					response.status
				);
			}

			return await response.json() as T;
		} catch (error) {
			if (error instanceof ExternalApiError) {
				throw error;
			}
			throw new ExternalApiError('Data Dragon', `Request failed: ${error}`);
		}
	}

	/**
	 * Construye URL de campeones
	 */
	buildChampionsUrl(version: string, locale: string): string {
		return API_URLS.CHAMPIONS
			.replace('{version}', version)
			.replace('{locale}', locale);
	}

	/**
	 * Construye URL de detalle de campeón
	 */
	buildChampionDetailUrl(version: string, locale: string, championId: string): string {
		return API_URLS.CHAMPION_DETAIL
			.replace('{version}', version)
			.replace('{locale}', locale)
			.replace('{champion}', championId);
	}

	/**
	 * Construye URL de imagen splash
	 */
	buildSplashUrl(championId: string, skinNum: number = 0): string {
		return API_URLS.SPLASH_ART
			.replace('{champion}', championId)
			.replace('{skin}', skinNum.toString());
	}

	/**
	 * Construye URL de icono
	 */
	buildIconUrl(championId: string, version: string): string {
		return API_URLS.ICON
			.replace('{version}', version)
			.replace('{champion}', championId);
	}
}
