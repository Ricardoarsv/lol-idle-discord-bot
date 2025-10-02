
export * from './ddragon';
export * from './normalize';


export { 
  getChampionIndex, 
  getChampionDetail, 
  getChampionSplashUrl,
  getChampionIconUrl,
  getRandomChampion,
  clearCache,
  getCacheStats
} from './ddragon';

export { 
  normalizeName, 
  matchesChampion, 
  getChampionSuggestions,
  calculateSimilarity,
  findChampionByName,
  getBestMatches
} from './normalize';


export { getChampionIndex as getDragonData } from './ddragon';