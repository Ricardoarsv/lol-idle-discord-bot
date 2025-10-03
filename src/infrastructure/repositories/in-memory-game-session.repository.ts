import type { GameSession } from '../../domain/entities/game-session.entity';
import type { IGameSessionRepository, GlobalStats } from '../../domain/repositories/game-session.repository';
import type { ChannelId } from '../../shared/types';

/**
 * Implementación en memoria del repositorio de sesiones de juego
 */
export class InMemoryGameSessionRepository implements IGameSessionRepository {
	private sessions: Map<ChannelId, GameSession> = new Map();

	findByChannelId(channelId: ChannelId): GameSession | null {
		return this.sessions.get(channelId) ?? null;
	}

	save(session: GameSession): void {
		this.sessions.set(session.channelId, session);
		console.log(`💾 Sesión guardada para canal: ${session.channelId}`);
	}

	delete(channelId: ChannelId): boolean {
		const deleted = this.sessions.delete(channelId);
		if (deleted) {
			console.log(`🗑️ Sesión eliminada para canal: ${channelId}`);
		}
		return deleted;
	}

	getAll(): Map<ChannelId, GameSession> {
		return new Map(this.sessions);
	}

	getGlobalStats(): GlobalStats {
		const activeSessions = this.sessions.size;
		const totalChannels = Array.from(this.sessions.keys());
		
		let oldestSession: number | null = null;
		let totalGuesses = 0;
		let totalHints = 0;
		
		for (const session of this.sessions.values()) {
			if (oldestSession === null || session.startTime < oldestSession) {
				oldestSession = session.startTime;
			}
			totalGuesses += session.guesses.length;
			totalHints += session.hintsUsed;
		}
		
		return {
			activeSessions,
			totalChannels,
			oldestSession,
			averageGuesses: activeSessions > 0 ? totalGuesses / activeSessions : 0,
			averageHints: activeSessions > 0 ? totalHints / activeSessions : 0
		};
	}

	cleanupOldSessions(maxAgeHours: number = 24): number {
		const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
		let cleaned = 0;
		
		for (const [channelId, session] of this.sessions.entries()) {
			const sessionAge = Date.now() - session.startTime;
			const isOld = sessionAge > (maxAgeHours * 60 * 60 * 1000);
			const isInactive = !session.isActive;
			
			if (isOld || isInactive) {
				this.sessions.delete(channelId);
				cleaned++;
				console.log(`🧹 Sesión antigua limpiada: ${channelId} (edad: ${Math.floor(sessionAge / 60000)}min)`);
			}
		}
		
		if (cleaned > 0) {
			console.log(`✨ Limpieza completada: ${cleaned} sesiones eliminadas`);
		}
		
		return cleaned;
	}
}
