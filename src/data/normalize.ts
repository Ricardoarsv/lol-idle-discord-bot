import type { ChampionData } from '../types/index';


const ALIAS: Record<string, string[]> = {
	wukong: ['monkey king', 'mk', 'kong', 'mono'],
	'jarvan iv': ['jarvan', 'j4', 'jarvan 4'],
	"kog'maw": ['kogmaw', 'kog'],
	"kai'sa": ['kaisa'],
	"kha'zix": ['khazix', 'kha'],
	"cho'gath": ['chogath', 'cho'],
	"vel'koz": ['velkoz', 'vel'],
	"rek'sai": ['reksai', 'rek'],
	'master yi': ['yi', 'master'],
	'miss fortune': ['mf'],
	'twisted fate': ['tf'],
	'lee sin': ['lee'],
	'dr. mundo': ['mundo', 'dr mundo'],
	'aurelion sol': ['asol', 'aurelion'],
	'tahm kench': ['tahm'],
	'renata glasc': ['renata'],
	"bel'veth": ['belveth'],
	"k'sante": ['ksante'],
	'nunu y willump': ['nunu', 'willump', 'nunu y willump'],
	'xin zhao': ['xin'],
	sejuani: ['sej'],
	cassiopeia: ['cass', 'cassio']
};

/**
 * Normaliza un nombre removiendo acentos, caracteres especiales y convirtiendo a lowercase
 * @param s - String a normalizar
 * @returns String normalizado
 */
export function normalizeName(s: string): string {
	return s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') 
		.replace(/[^a-z0-9\s']/g, '') 
		.trim();
}

/**
 * Verifica si el texto del usuario coincide con el nombre del campeón
 * @param userText - Texto ingresado por el usuario
 * @param champName - Nombre del campeón
 * @returns True si coincide
 */
export function matchesChampion(userText: string, champName: string): boolean {
	const normalizedUserText = normalizeName(userText);
	const normalizedChampName = normalizeName(champName);

	
	if (normalizedUserText === normalizedChampName) {
		return true;
	}

	
	const aliases = ALIAS[normalizedChampName];
	return aliases ? aliases.includes(normalizedUserText) : false;
}

/**
 * Obtiene sugerencias de campeones basadas en entrada parcial
 * @param partialInput - Entrada parcial del usuario
 * @param championList - Lista de campeones
 * @param maxSuggestions - Máximo número de sugerencias
 * @returns Lista de sugerencias
 */
export function getChampionSuggestions(
	partialInput: string,
	championList: ChampionData[],
	maxSuggestions: number = 5
): string[] {
	const normalizedInput = normalizeName(partialInput);

	if (normalizedInput.length < 2) {
		return [];
	}

	const suggestions = championList
		.filter(champion => {
			const normalizedName = normalizeName(champion.name);
			return normalizedName.includes(normalizedInput);
		})
		.slice(0, maxSuggestions)
		.map(champion => champion.name);

	return suggestions;
}

/**
 * Calcula la similitud entre dos strings (distancia de Levenshtein simplificada)
 * @param str1 - Primer string
 * @param str2 - Segundo string
 * @returns Puntuación de similitud (0-1)
 */
export function calculateSimilarity(str1: string, str2: string): number {
	const normalized1 = normalizeName(str1);
	const normalized2 = normalizeName(str2);

	if (normalized1 === normalized2) return 1.0;

	const maxLength = Math.max(normalized1.length, normalized2.length);
	if (maxLength === 0) return 1.0;

	const distance = levenshteinDistance(normalized1, normalized2);
	return 1 - distance / maxLength;
}

/**
 * Calcula la distancia de Levenshtein entre dos strings
 * @param a - Primer string
 * @param b - Segundo string
 * @returns Distancia de Levenshtein
 */
function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = [];

	
	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= a.length; j++) {
		matrix[0]![j] = j;
	}

	
	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i]![j] = matrix[i - 1]![j - 1]!;
			} else {
				matrix[i]![j] = Math.min(
					matrix[i - 1]![j]! + 1, 
					matrix[i]![j - 1]! + 1, 
					matrix[i - 1]![j - 1]! + 1 
				);
			}
		}
	}

	return matrix[b.length]![a.length]!;
}

/**
 * Busca un campeón en la lista por nombre o alias
 * @param userInput - Entrada del usuario
 * @param championList - Lista de campeones
 * @returns Campeón encontrado o null
 */
export function findChampionByName(
	userInput: string,
	championList: ChampionData[]
): ChampionData | null {
	const normalizedInput = normalizeName(userInput);

	
	for (const champion of championList) {
		if (matchesChampion(userInput, champion.name)) {
			return champion;
		}
	}

	
	for (const champion of championList) {
		const normalizedName = normalizeName(champion.name);
		if (normalizedName.includes(normalizedInput) && normalizedInput.length >= 3) {
			return champion;
		}
	}

	return null;
}

/**
 * Obtiene los mejores matches para un input del usuario
 * @param userInput - Entrada del usuario
 * @param championList - Lista de campeones
 * @param threshold - Umbral mínimo de similitud
 * @returns Lista de campeones ordenada por similitud
 */
export function getBestMatches(
	userInput: string,
	championList: ChampionData[],
	threshold: number = 0.3
): Array<{ champion: ChampionData; similarity: number }> {
	return championList
		.map(champion => ({
			champion,
			similarity: calculateSimilarity(userInput, champion.name)
		}))
		.filter(match => match.similarity >= threshold)
		.sort((a, b) => b.similarity - a.similarity)
		.slice(0, 10); 
}