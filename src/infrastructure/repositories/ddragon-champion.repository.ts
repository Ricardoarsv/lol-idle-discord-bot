import { LRUCache } from 'lru-cache';
import { Champion } from '../../domain/entities/champion.entity';
import type { IChampionRepository } from '../../domain/repositories/champion.repository';
import type { Locale } from '../../shared/enums';
import { CACHE_DURATIONS } from '../../shared/constants';
import { ChampionNotFoundError } from '../../shared/errors';
import { DataDragonClient } from '../external/ddragon.client';

interface DataDragonChampionsResponse {
	type: string;
	format: string;
	version: string;
	data: Record<string, any>;
}

interface DataDragonChampionDetailResponse {
	type: string;
	format: string;
	version: string;
	data: Record<string, any>;
}

/**
 * Implementación del repositorio de campeones usando Data Dragon
 */
export class DataDragonChampionRepository implements IChampionRepository {
	private cache: LRUCache<string, any>;

	constructor(
		private readonly client: DataDragonClient
	) {
		this.cache = new LRUCache<string, any>({
			max: 20,
			ttl: CACHE_DURATIONS.CHAMPIONS
		});
	}

	async getAll(locale: Locale, version?: string): Promise<Champion[]> {
		const actualVersion = version ?? await this.client.getLatestVersion();
		const cacheKey = `champions-${actualVersion}-${locale}`;

		// Verificar caché
		if (this.cache.has(cacheKey)) {
			console.log(`📋 Cache hit para campeones: ${cacheKey}`);
			return this.cache.get(cacheKey) as Champion[];
		}

		try {
			const url = this.client.buildChampionsUrl(actualVersion, locale);
			console.log(`🔄 Fetching champions from: ${url}`);

			const data = await this.client.get<DataDragonChampionsResponse>(url);

			if (!data.data || typeof data.data !== 'object') {
				throw new Error('Invalid response format: no champion data');
			}

			// Convertir los datos a entidades Champion
			const champions = Object.values(data.data).map(championData => 
				Champion.create({
					id: championData.id,
					key: championData.key,
					name: championData.name,
					title: championData.title,
					blurb: championData.blurb,
					info: championData.info,
					image: championData.image,
					tags: championData.tags,
					partype: championData.partype,
					stats: championData.stats
				})
			);

			if (champions.length === 0) {
				throw new Error('No champions found in response');
			}

			// Cachear los resultados
			this.cache.set(cacheKey, champions);
			console.log(`✅ Cached ${champions.length} champions for ${cacheKey}`);

			return champions;
		} catch (error) {
			console.error('Error fetching champions:', error);
			throw new Error(`Failed to load champions: ${error}`);
		}
	}

	async getById(id: string, locale: Locale, version?: string): Promise<Champion | null> {
		const actualVersion = version ?? await this.client.getLatestVersion();
		const cacheKey = `champion-detail-${id}-${actualVersion}-${locale}`;

		// Verificar caché
		if (this.cache.has(cacheKey)) {
			console.log(`📋 Cache hit para detalles de ${id}`);
			return this.cache.get(cacheKey) as Champion;
		}

		try {
			const url = this.client.buildChampionDetailUrl(actualVersion, locale, id);
			const data = await this.client.get<DataDragonChampionDetailResponse>(url);

			if (!data.data || typeof data.data !== 'object') {
				throw new Error('Invalid response format: no champion data');
			}

			// Obtener el primer (y único) campeón de la respuesta
			const championData = Object.values(data.data)[0];

			if (!championData) {
				return null;
			}

			const champion = Champion.create({
				id: championData.id,
				key: championData.key,
				name: championData.name,
				title: championData.title,
				blurb: championData.blurb,
				info: championData.info,
				image: championData.image,
				tags: championData.tags,
				partype: championData.partype,
				stats: championData.stats,
				lore: championData.lore,
				passive: championData.passive,
				spells: championData.spells
			});

			// Cachear el resultado
			this.cache.set(cacheKey, champion);
			console.log(`✅ Detalles obtenidos para ${champion.name} (${actualVersion}-${locale})`);

			return champion;
		} catch (error) {
			console.error(`Error fetching champion details for ${id}:`, error);
			return null;
		}
	}

	async findByName(name: string, locale: Locale): Promise<Champion | null> {
		const champions = await this.getAll(locale);
		const normalized = name.toLowerCase().trim();

		return champions.find(champion => 
			champion.matchesName(normalized)
		) ?? null;
	}

	async getRandom(locale: Locale): Promise<Champion> {
		const champions = await this.getAll(locale);

		if (champions.length === 0) {
			throw new ChampionNotFoundError('No champions available');
		}

		const randomIndex = Math.floor(Math.random() * champions.length);
		return champions[randomIndex]!;
	}

	clearCache(): void {
		this.cache.clear();
		console.log('🧹 Champion cache cleared');
	}
}
