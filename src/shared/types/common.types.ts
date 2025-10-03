import type { 
	SlashCommandBuilder, 
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	SlashCommandOptionsOnlyBuilder 
} from 'discord.js';
import type { ChampionTag } from '../enums';

/**
 * Tipos base para IDs
 */
export type UserId = string;
export type ChannelId = string;
export type ChampionId = string;

/**
 * Información de imagen
 */
export interface ImageInfo {
	full: string;
	sprite: string;
	group: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * Estadísticas de campeón
 */
export interface ChampionStats {
	hp: number;
	hpperlevel: number;
	mp: number;
	mpperlevel: number;
	movespeed: number;
	armor: number;
	armorperlevel: number;
	spellblock: number;
	spellblockperlevel: number;
	attackrange: number;
	hpregen: number;
	hpregenperlevel: number;
	mpregen: number;
	mpregenperlevel: number;
	crit: number;
	critperlevel: number;
	attackdamage: number;
	attackdamageperlevel: number;
	attackspeedperlevel: number;
	attackspeed: number;
}

/**
 * Información básica del campeón
 */
export interface ChampionInfo {
	attack: number;
	defense: number;
	magic: number;
	difficulty: number;
}

/**
 * Habilidad de campeón
 */
export interface ChampionSpell {
	id: string;
	name: string;
	description: string;
	tooltip: string;
	leveltip?: {
		label: string[];
		effect: string[];
	};
	maxrank: number;
	cooldown: number[];
	cooldownBurn: string;
	cost: number[];
	costBurn: string;
	datavalues: Record<string, any>;
	effect: (number[] | null)[];
	effectBurn: (string | null)[];
	vars: any[];
	costType: string;
	maxammo: string;
	range: number[];
	rangeBurn: string;
	image: ImageInfo;
	resource: string;
}

/**
 * Pasiva de campeón
 */
export interface ChampionPassive {
	name: string;
	description: string;
	image: ImageInfo;
}

/**
 * Comando de Discord Bot
 */
export interface BotCommand {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	execute(interaction: ChatInputCommandInteraction): Promise<void>;
	autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
}

/**
 * Estadísticas de sesión
 */
export interface SessionStats {
	attempts: number;
	hintsUsed: number;
	duration: number;
	startedAt: number;
}
