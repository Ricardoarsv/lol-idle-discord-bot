import { fetch } from 'undici';
import { LRUCache } from 'lru-cache';
import { API_URLS, CACHE_DURATIONS, DEFAULT_CONFIG } from '../util/enums';
import { getLatestVersion } from '../util/version-manager';
import type { ChampionData, ChampionDetail, SupportedLocales } from '../types/index';

interface DataDragonChampionsResponse {
	type: string;
	format: string;
	version: string;
	data: Record<string, ChampionData>;
}

interface DataDragonChampionDetailResponse {
	type: string;
	format: string;
	version: string;
	data: Record<string, ChampionDetail>;
}

const cache = new LRUCache<string, any>({ max: 20, ttl: CACHE_DURATIONS.CHAMPIONS });

/**
 * Obtiene la versión a usar (automáticamente la más reciente o fallback)
 * @param requestedVersion - Versión solicitada (opcional)
 * @returns Versión a usar
 */
async function getVersionToUse(requestedVersion: string | null = null): Promise<string> {
	if (requestedVersion) {
		return requestedVersion;
	}
	
	try {
		return await getLatestVersion();
	} catch (error) {
		console.warn('Using fallback version due to error:', error);
		return DEFAULT_CONFIG.VERSION_FALLBACK;
	}
}

/**
 * Obtiene la lista de campeones desde Data Dragon
 * @param version - Versión de Data Dragon (opcional, usa la más reciente si no se especifica)
 * @param locale - Idioma (es_ES, en_US, etc.)
 * @returns Lista de campeones
 */
export async function getChampionIndex(
	version: string | null = null,
	locale: string = DEFAULT_CONFIG.LOCALE
): Promise<ChampionData[]> {
	const actualVersion = await getVersionToUse(version);
	const cacheKey = `${actualVersion}-${locale}`;

	
	if (cache.has(cacheKey)) {
		console.log(`📋 Cache hit para campeones: ${cacheKey}`);
		return cache.get(cacheKey) as ChampionData[];
	}

	try {
		const url = API_URLS.CHAMPIONS
			.replace('{version}', actualVersion)
			.replace('{locale}', locale);

		console.log(`🔄 Fetching champions from: ${url}`);

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'LoL-Guesser-Bot/1.0'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json() as DataDragonChampionsResponse;

		if (!data.data || typeof data.data !== 'object') {
			throw new Error('Formato de respuesta inválido: sin datos de campeones');
		}

		
		const champions = Object.values(data.data);

		
		if (champions.length === 0) {
			throw new Error('No se encontraron campeones en la respuesta');
		}

		
		cache.set(cacheKey, champions);
		console.log(`✅ Cached ${champions.length} champions for ${cacheKey}`);

		return champions;
	} catch (error) {
		console.error('Error fetching champions:', error);
		throw new Error(`Error cargando campeones: ${error}`);
	}
}

/**
 * Obtiene los detalles específicos de un campeón
 * @param idOrKey - ID del campeón (ej: "Aatrox") o key numérica
 * @param version - Versión de Data Dragon (opcional, usa la más reciente si no se especifica)
 * @param locale - Idioma
 * @returns Datos detallados del campeón
 */
export async function getChampionDetail(
	idOrKey: string,
	version: string | null = null,
	locale: string = DEFAULT_CONFIG.LOCALE
): Promise<ChampionDetail | null> {
	const actualVersion = await getVersionToUse(version);
	const cacheKey = `detail-${idOrKey}-${actualVersion}-${locale}`;

	
	if (cache.has(cacheKey)) {
		console.log(`📋 Cache hit para detalles de ${idOrKey}`);
		return cache.get(cacheKey) as ChampionDetail;
	}

	try {
		
		let championId = idOrKey;

		
		if (/^\d+$/.test(idOrKey)) {
			const champions = await getChampionIndex(actualVersion, locale);
			const champion = champions.find(champ => champ.key === idOrKey);
			if (!champion) {
				throw new Error(`No se encontró campeón con key: ${idOrKey}`);
			}
			championId = champion.id;
		}

		const url = API_URLS.CHAMPION_DETAIL
			.replace('{version}', actualVersion)
			.replace('{locale}', locale)
			.replace('{champion}', championId);

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'LoL-Guesser-Bot/1.0'
			}
		});

		if (!response.ok) {
			if (response.status === 404) {
				console.warn(`Champion ${championId} not found for ${actualVersion}-${locale}`);
				return null;
			}
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json() as DataDragonChampionDetailResponse;

		if (!data.data || typeof data.data !== 'object') {
			throw new Error('Formato de respuesta inválido: sin datos de campeón');
		}

		
		const championData = Object.values(data.data)[0];

		if (!championData) {
			throw new Error(`No se encontraron datos para el campeón: ${championId}`);
		}

		
		cache.set(cacheKey, championData);
		console.log(`✅ Detalles obtenidos para ${championData.name} (${actualVersion}-${locale})`);

		return championData;
	} catch (error) {
		console.error(`Error fetching champion details for ${idOrKey}:`, error);
		throw new Error(`Error cargando detalles del campeón: ${error}`);
	}
}

/**
 * Obtiene la URL de la imagen splash de un campeón
 * @param championId - ID del campeón
 * @param skinNum - Número de skin (0 = default)
 * @returns URL de la imagen
 */
export function getChampionSplashUrl(championId: string, skinNum: number = 0): string {
	return API_URLS.SPLASH_ART
		.replace('{champion}', championId)
		.replace('{skin}', skinNum.toString());
}

/**
 * Obtiene la URL del icono de un campeón
 * @param championId - ID del campeón
 * @param version - Versión de Data Dragon (opcional)
 * @returns URL del icono
 */
export function getChampionIconUrl(championId: string, version: string | null = null): string {
	const actualVersion = version || DEFAULT_CONFIG.VERSION_FALLBACK;
	return API_URLS.ICON
		.replace('{version}', actualVersion)
		.replace('{champion}', championId);
}

/**
 * Obtiene información del cache actual
 * @returns Estadísticas del cache
 */
export function getCacheStats(): {
	size: number;
	maxSize: number;
	keys: string[];
} {
	return {
		size: cache.size,
		maxSize: cache.max,
		keys: Array.from(cache.keys())
	};
}

/**
 * Limpia el cache de campeones
 */
export function clearCache(): void {
	cache.clear();
	console.log('🧹 Cache de campeones limpiado');
}

/**
 * Función de utilidad para obtener un campeón aleatorio
 * @param version - Versión de Data Dragon
 * @param locale - Idioma
 * @returns Campeón aleatorio
 */
export async function getRandomChampion(
	version: string | null = null,
	locale: string = DEFAULT_CONFIG.LOCALE
): Promise<ChampionData> {
	const champions = await getChampionIndex(version, locale);
	const randomIndex = Math.floor(Math.random() * champions.length);
	return champions[randomIndex]!;
}