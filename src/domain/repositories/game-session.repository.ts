import type { GameSession } from '../entities/game-session.entity';
import type { ChannelId } from '../../shared/types';

/**
 * Estadísticas globales del repositorio
 */
export interface GlobalStats {
	activeSessions: number;
	totalChannels: string[];
	oldestSession: number | null;
	averageGuesses: number;
	averageHints: number;
}

/**
 * Interfaz del repositorio de sesiones de juego
 * Define el contrato para la persistencia de sesiones activas
 */
export interface IGameSessionRepository {
	/**
	 * Obtiene una sesión por ID de canal
	 */
	findByChannelId(channelId: ChannelId): GameSession | null;

	/**
	 * Guarda o actualiza una sesión
	 */
	save(session: GameSession): void;

	/**
	 * Elimina una sesión
	 */
	delete(channelId: ChannelId): boolean;

	/**
	 * Obtiene todas las sesiones activas
	 */
	getAll(): Map<ChannelId, GameSession>;

	/**
	 * Obtiene estadísticas globales
	 */
	getGlobalStats(): GlobalStats;

	/**
	 * Limpia sesiones antiguas basadas en tiempo de inactividad
	 */
	cleanupOldSessions(maxAgeHours: number): number;
}
