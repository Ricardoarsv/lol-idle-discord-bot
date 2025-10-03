import { ChampionTag } from '../../shared/enums';
import type { 
	ChampionId, 
	ChampionInfo, 
	ChampionStats, 
	ChampionPassive, 
	ChampionSpell,
	ImageInfo 
} from '../../shared/types';
import { EntityValidationError } from '../../shared/errors';

/**
 * Entidad de Campeón (Champion)
 * Representa un campeón de League of Legends con toda su información
 */
export class Champion {
	private constructor(
		public readonly id: ChampionId,
		public readonly key: string,
		public readonly name: string,
		public readonly title: string,
		public readonly blurb: string,
		public readonly info: ChampionInfo,
		public readonly image: ImageInfo,
		public readonly tags: ChampionTag[],
		public readonly partype: string,
		public readonly stats: ChampionStats,
		public readonly lore?: string,
		public readonly passive?: ChampionPassive,
		public readonly spells?: ChampionSpell[]
	) {}

	/**
	 * Crea una instancia de Champion con validación
	 */
	static create(props: {
		id: ChampionId;
		key: string;
		name: string;
		title: string;
		blurb: string;
		info: ChampionInfo;
		image: ImageInfo;
		tags: ChampionTag[];
		partype: string;
		stats: ChampionStats;
		lore?: string;
		passive?: ChampionPassive;
		spells?: ChampionSpell[];
	}): Champion {
		// Validaciones
		if (!props.id || props.id.trim().length === 0) {
			throw new EntityValidationError('Champion', 'ID cannot be empty');
		}

		if (!props.name || props.name.trim().length === 0) {
			throw new EntityValidationError('Champion', 'Name cannot be empty');
		}

		if (!props.key || props.key.trim().length === 0) {
			throw new EntityValidationError('Champion', 'Key cannot be empty');
		}

		if (!props.tags || props.tags.length === 0) {
			throw new EntityValidationError('Champion', 'Champion must have at least one tag');
		}

		return new Champion(
			props.id,
			props.key,
			props.name,
			props.title,
			props.blurb,
			props.info,
			props.image,
			props.tags,
			props.partype,
			props.stats,
			props.lore,
			props.passive,
			props.spells
		);
	}

	/**
	 * Obtiene el rol principal del campeón
	 */
	getPrimaryRole(): ChampionTag {
		return this.tags[0]!;
	}

	/**
	 * Verifica si el campeón tiene un rol específico
	 */
	hasRole(role: ChampionTag): boolean {
		return this.tags.includes(role);
	}

	/**
	 * Obtiene el tipo de ataque basado en el rango
	 */
	getAttackType(): 'melee' | 'ranged' {
		return this.stats.attackrange > 200 ? 'ranged' : 'melee';
	}

	/**
	 * Verifica si el nombre coincide (case-insensitive)
	 */
	matchesName(name: string): boolean {
		const normalized = name.toLowerCase().trim();
		return this.name.toLowerCase() === normalized || 
		       this.id.toLowerCase() === normalized;
	}

	/**
	 * Serializa a objeto plano (para DTOs)
	 */
	toObject() {
		return {
			id: this.id,
			key: this.key,
			name: this.name,
			title: this.title,
			blurb: this.blurb,
			info: this.info,
			image: this.image,
			tags: this.tags,
			partype: this.partype,
			stats: this.stats,
			lore: this.lore,
			passive: this.passive,
			spells: this.spells
		};
	}
}
