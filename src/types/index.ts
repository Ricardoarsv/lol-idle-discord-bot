/**
 * Tipos TypeScript para el bot de League of Legends Guesser
 */

import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

// ================== ENUMS Y CONSTANTES ==================

export const SupportedLocales = {
  SPANISH: 'es_ES',
  ENGLISH: 'en_US',
  LATIN_AMERICA: 'es_MX'
} as const;

export const LanguageCodes = {
  ES: 'es',
  EN: 'en',
  MX: 'mx'
} as const;

export const DifficultyLevels = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  EXPERT: 'expert'
} as const;

export const AttackTypes = {
  MELEE: 'melee',
  RANGED: 'ranged'
} as const;

export const ResourceTypes = {
  MANA: 'Mana',
  ENERGY: 'Energy',
  FURY: 'Fury',
  RAGE: 'Rage',
  FLOW: 'Flow',
  HEAT: 'Heat',
  FEROCITY: 'Ferocity',
  BLOOD_WELL: 'BloodWell',
  NONE: 'None'
} as const;

export const ChampionTags = {
  ASSASSIN: 'Assassin',
  FIGHTER: 'Fighter',
  MAGE: 'Mage',
  MARKSMAN: 'Marksman',
  SUPPORT: 'Support',
  TANK: 'Tank'
} as const;

export type SupportedLocales = typeof SupportedLocales[keyof typeof SupportedLocales];
export type LanguageCodes = typeof LanguageCodes[keyof typeof LanguageCodes];
export type DifficultyLevels = typeof DifficultyLevels[keyof typeof DifficultyLevels];
export type AttackTypes = typeof AttackTypes[keyof typeof AttackTypes];
export type ResourceTypes = typeof ResourceTypes[keyof typeof ResourceTypes];
export type ChampionTags = typeof ChampionTags[keyof typeof ChampionTags];

// ================== INTERFACES DE DATOS ==================

export interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: (typeof ChampionTags)[keyof typeof ChampionTags][];
  partype: string;
  stats: {
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
  };
}

export interface ChampionDetail extends ChampionData {
  lore: string;
  allytips: string[];
  enemytips: string[];
  spells: ChampionSpell[];
  passive: ChampionPassive;
  recommended: any[];
}

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
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  resource: string;
}

export interface ChampionPassive {
  name: string;
  description: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

// ================== INTERFACES DE JUEGO ==================

export interface GameSession {
  userId: UserId;
  channelId: string;
  startTime: number;
  endTime?: number;
  isActive: boolean;
  targetChampion: ChampionData;
  targetId: string;
  guesses: string[];
  hints: string[];
  hintsUsed: number;
  difficulty: DifficultyLevels;
  attemptsLeft: number;
  maxAttempts: number;
  score: number;
  language: LanguageCodes;
  locale: SupportedLocales;
  version: string;
  startedAt: number;
  isDaily: boolean;
}

export interface UserConfig {
  language: LanguageCodes;
  locale: SupportedLocales;
  difficulty: DifficultyLevels;
  autoHints: boolean;
  lastUsed: number;
}

export interface GameClues {
  name: string;
  title: string;
  role: string;
  resource: string;
  rangeType: string;
  difficulty: string;
  attackRange: number;
  movementSpeed: number;
  passiveName: string;
  qSpellName: string;
  manaCostRange: string;
  lore?: string;
  region?: string;
  releaseYear?: string;
}

export interface GuessResult {
  correct: boolean;
  message: string;
  similarity: number;
  suggestions?: string[];
}

export interface SessionStats {
  attempts: number;
  hintsUsed: number;
  duration: number; // en segundos
  startedAt: number;
}

// ================== INTERFACES DE COMANDOS ==================

export interface BotCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// ================== INTERFACES DE CONFIGURACIÓN ==================

export interface HintConfig {
  maxHints: number;
  baseHints: number;
  name: string;
}

export interface CacheDurations {
  CHAMPIONS: number;
  DETAILS: number;
  VERSION: number;
  TRANSLATIONS: number;
}

export interface ApiUrls {
  VERSIONS: string;
  CHAMPIONS: string;
  CHAMPION_DETAIL: string;
  SPLASH_ART: string;
  ICON: string;
}

export interface DefaultConfig {
  VERSION_FALLBACK: string;
  LOCALE: SupportedLocales;
  LANGUAGE: LanguageCodes;
  DIFFICULTY: DifficultyLevels;
}

// ================== INTERFACES DE TRADUCCIONES ==================

export interface TranslationVariables {
  [key: string]: string | number;
}

export interface TranslationFunction {
  (language: LanguageCodes, key: string, variables?: TranslationVariables, fallback?: string): string;
}

export interface Translations {
  [language: string]: {
    [key: string]: string | Translations;
  };
}

// ================== INTERFACES DE CACHE ==================

export interface CacheStats {
  size: number;
  maxSize: number;
  hitRate?: number;
  keys: string[];
}

// ================== INTERFACES DE VERSIÓN ==================

export interface VersionInfo {
  latest: string;
  available: string[];
  region: string;
  lastUpdated: number;
}

// ================== TIPOS DE UTILIDAD ==================

export type LocaleKey = keyof typeof SupportedLocales;
export type LanguageKey = keyof typeof LanguageCodes;
export type DifficultyKey = keyof typeof DifficultyLevels;

export type ChampionId = string;
export type ChannelId = string;
export type UserId = string;

// ================== TIPOS DE RESPUESTA API ==================

export interface DataDragonResponse<T> {
  type: string;
  format: string;
  version: string;
  data: { [key: string]: T };
}

export interface VersionsResponse extends Array<string> {}

// ================== INTERFACES DE ERROR ==================

export interface BotError extends Error {
  code?: string;
  channel?: string;
  user?: string;
  command?: string;
}

// ================== TIPOS DE EVENTOS ==================

export type EventName = 'gameStart' | 'gameEnd' | 'correctGuess' | 'wrongGuess' | 'hintUsed' | 'giveUp';

export interface GameEvent {
  type: EventName;
  channelId: ChannelId;
  userId: UserId;
  timestamp: number;
  data?: any;
}

// ================== EXPORTS POR DEFECTO ==================

export default {
  SupportedLocales,
  LanguageCodes,
  DifficultyLevels,
  AttackTypes,
  ResourceTypes,
  ChampionTags
};