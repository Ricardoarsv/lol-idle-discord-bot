import { LRUCache } from 'lru-cache';
import { fetch } from 'undici';
import { API_URLS, CACHE_DURATIONS, DEFAULT_CONFIG } from './enums';

const versionCache = new LRUCache<string, string>({ max: 1, ttl: CACHE_DURATIONS.VERSION });

/**
 * Obtiene la versión más reciente de Data Dragon
 * @returns Versión más reciente
 */
export async function getLatestVersion(): Promise<string> {
	const cacheKey = 'latest-version';

	if (versionCache.has(cacheKey)) {
		return versionCache.get(cacheKey)!;
	}

	try {
		console.log('🔄 Obteniendo versión más reciente de Data Dragon...');

		const response = await fetch(API_URLS.VERSIONS, {
			headers: {
				'User-Agent': 'LoL-Guesser-Bot/1.0'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const versions = await response.json() as string[];

		if (!Array.isArray(versions) || versions.length === 0) {
			throw new Error('No se encontraron versiones disponibles');
		}

		const latestVersion = versions[0];
		if (!latestVersion) {
			throw new Error('No se encontró versión válida');
		}
		
		versionCache.set(cacheKey, latestVersion);
		console.log(`✅ Versión más reciente obtenida: ${latestVersion}`);
		
		return latestVersion;
	} catch (error) {
		console.error('Error obteniendo versión más reciente:', error);
		console.warn(`Usando versión de fallback: ${DEFAULT_CONFIG.VERSION_FALLBACK}`);
		
		
		versionCache.set(cacheKey, DEFAULT_CONFIG.VERSION_FALLBACK, { ttl: 60000 }); 
		return DEFAULT_CONFIG.VERSION_FALLBACK;
	}
}

/**
 * Valida si una versión específica existe
 * @param version - Versión a validar
 * @returns True si la versión existe
 */
export async function validateVersion(version: string): Promise<boolean> {
	try {
		const versions = await getAllVersions();
		return versions.includes(version);
	} catch (error) {
		console.error('Error validando versión:', error);
		return false;
	}
}

/**
 * Obtiene todas las versiones disponibles
 * @returns Lista de versiones disponibles
 */
export async function getAllVersions(): Promise<string[]> {
	try {
		const response = await fetch(API_URLS.VERSIONS, {
			headers: { 'User-Agent': 'LoL-Guesser-Bot/1.0' }
		});
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		return await response.json() as string[];
	} catch (error) {
		console.error('Error obteniendo versiones:', error);
		return [DEFAULT_CONFIG.VERSION_FALLBACK];
	}
}

/**
 * Compara dos versiones de LoL
 * @param version1 - Primera versión
 * @param version2 - Segunda versión
 * @returns -1 si version1 < version2, 0 si iguales, 1 si version1 > version2
 */
export function compareVersions(version1: string, version2: string): number {
	const v1Parts = version1.split('.').map(Number);
	const v2Parts = version2.split('.').map(Number);

	for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
		const v1Part = v1Parts[i] || 0;
		const v2Part = v2Parts[i] || 0;
		
		if (v1Part < v2Part) return -1;
		if (v1Part > v2Part) return 1;
	}

	return 0;
}

/**
 * Obtiene información sobre la versión actual
 * @returns Información de la versión
 */
export async function getVersionInfo(): Promise<{
	latest: string;
	available: string[];
	region: string;
	lastUpdated: number;
}> {
	try {
		const latest = await getLatestVersion();
		const available = await getAllVersions();
		
		return {
			latest,
			available: available.slice(0, 10), 
			region: 'global',
			lastUpdated: Date.now()
		};
	} catch (error) {
		console.error('Error obteniendo información de versión:', error);
		return {
			latest: DEFAULT_CONFIG.VERSION_FALLBACK,
			available: [DEFAULT_CONFIG.VERSION_FALLBACK],
			region: 'global',
			lastUpdated: Date.now()
		};
	}
}