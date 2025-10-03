/**
 * Constantes de APIs externas
 */

export const API_URLS = {
	VERSIONS: 'https://ddragon.leagueoflegends.com/api/versions.json',
	CHAMPIONS: 'https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/champion.json',
	CHAMPION_DETAIL: 'https://ddragon.leagueoflegends.com/cdn/{version}/data/{locale}/champion/{champion}.json',
	SPLASH_ART: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{champion}_{skin}.jpg',
	ICON: 'https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champion}.png'
} as const;

export const API_CONFIG = {
	USER_AGENT: 'LoL-Guesser-Bot/1.0',
	TIMEOUT: 10000, // 10 segundos
	MAX_RETRIES: 3
} as const;
