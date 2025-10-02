
export * from './store';
export * from './user-config';


export { 
  getSession, 
  setSession, 
  clearSession, 
  updateSession,
  addGuess,
  incrementHints,
  getSessionStats,
  getAllSessions,
  getGlobalStats,
  cleanupOldSessions
} from './store';

export { 
  getUserConfig, 
  updateUserConfig, 
  setUserLanguage, 
  setUserDifficulty,
  getUserConfigStats,
  cleanupInactiveUsers,
  exportUserConfigs,
  importUserConfigs,
  getUsersByLanguage,
  getUsersByDifficulty 
} from './user-config';

import type { GameSession, ChampionData, UserConfig, ChannelId } from '../types/index';
import { setSession } from './store';

export function createGameSession(
  userId: string, 
  champions: ChampionData[], 
  userConfig: UserConfig,
  channelId?: ChannelId
): GameSession {
  if (!champions || champions.length === 0) {
    throw new Error('No hay campeones disponibles para crear una sesión de juego');
  }
  
  const targetChampion = champions[Math.floor(Math.random() * champions.length)];
  
  if (!targetChampion) {
    throw new Error('Error al seleccionar campeón aleatorio');
  }
  
  const maxAttempts = userConfig.difficulty === 'easy' ? 6 : 
                     userConfig.difficulty === 'normal' ? 5 :
                     userConfig.difficulty === 'hard' ? 4 : 3;
  
  const gameSession: GameSession = {
    userId,
    channelId: channelId || 'default',
    startTime: Date.now(),
    isActive: true,
    targetChampion,
    targetId: targetChampion.id,
    guesses: [],
    hints: [],
    hintsUsed: 0,
    difficulty: userConfig.difficulty,
    attemptsLeft: maxAttempts,
    maxAttempts,
    score: 0,
    language: userConfig.language,
    locale: userConfig.locale,
    version: '1.0',
    startedAt: Date.now(),
    isDaily: false
  };
  
  if (channelId) {
    setSession(channelId, gameSession);
  }
  
  return gameSession;
}