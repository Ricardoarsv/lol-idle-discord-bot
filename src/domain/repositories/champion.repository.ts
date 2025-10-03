import type { Champion } from '../entities/champion.entity';
import type { Locale } from '../../shared/enums';

/**
 * Interfaz del repositorio de campeones
 * Define el contrato para acceder a los datos de campeones
 */
export interface IChampionRepository {
	/**
	 * Obtiene todos los campeones
	 * @param locale - Locale para la traducción
	 * @param version - Versión de Data Dragon (opcional)
	 */
	getAll(locale: Locale, version?: string): Promise<Champion[]>;

	/**
	 * Obtiene un campeón por ID
	 * @param id - ID del campeón
	 * @param locale - Locale para la traducción
	 * @param version - Versión de Data Dragon (opcional)
	 */
	getById(id: string, locale: Locale, version?: string): Promise<Champion | null>;

	/**
	 * Busca un campeón por nombre
	 * @param name - Nombre del campeón
	 * @param locale - Locale para la traducción
	 */
	findByName(name: string, locale: Locale): Promise<Champion | null>;

	/**
	 * Obtiene un campeón aleatorio
	 * @param locale - Locale para la traducción
	 */
	getRandom(locale: Locale): Promise<Champion>;

	/**
	 * Limpia la caché de campeones
	 */
	clearCache(): void;
}
