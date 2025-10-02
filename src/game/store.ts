import type { GameSession, ChannelId, SessionStats } from '../types/index';


const sessions = new Map<ChannelId, GameSession>();

/**
 * Obtiene la sesión de juego para un canal
 * @param channelId - ID del canal de Discord
 * @returns Sesión del juego o undefined si no existe
 */
export function getSession(channelId: ChannelId): GameSession | undefined {
	return sessions.get(channelId);
}

/**
 * Establece la sesión de juego para un canal
 * @param channelId - ID del canal de Discord
 * @param data - Datos de la sesión (pueden ser parciales para actualizar)
 */
export function setSession(channelId: ChannelId, data: GameSession): void {
	sessions.set(channelId, data);
	console.log(`💾 Sesión establecida para canal: ${channelId}`);
}

/**
 * Actualiza una sesión existente
 * @param channelId - ID del canal
 * @param updates - Actualizaciones parciales
 * @returns true si se actualizó, false si no existía la sesión
 */
export function updateSession(channelId: ChannelId, updates: Partial<GameSession>): boolean {
	const existing = sessions.get(channelId);
	if (!existing) {
		return false;
	}
	
	Object.assign(existing, updates);
	sessions.set(channelId, existing);
	console.log(`📝 Sesión actualizada para canal: ${channelId}`);
	return true;
}

/**
 * Elimina la sesión de juego de un canal
 * @param channelId - ID del canal de Discord
 * @returns true si se eliminó, false si no existía
 */
export function clearSession(channelId: ChannelId): boolean {
	const deleted = sessions.delete(channelId);
	if (deleted) {
		console.log(`🗑️ Sesión eliminada para canal: ${channelId}`);
	}
	return deleted;
}

/**
 * Agrega una adivinanza a la sesión
 * @param channelId - ID del canal
 * @param guess - Adivinanza del usuario
 * @returns true si se agregó exitosamente
 */
export function addGuess(channelId: ChannelId, guess: string): boolean {
	const session = sessions.get(channelId);
	if (!session) {
		return false;
	}
	
	session.guesses.push(guess.toLowerCase());
	console.log(`🤔 Nueva adivinanza en ${channelId}: ${guess}`);
	return true;
}

/**
 * Incrementa el contador de pistas de una sesión
 * @param channelId - ID del canal
 * @returns Número total de pistas usadas, o -1 si no existe la sesión
 */
export function incrementHints(channelId: ChannelId): number {
	const session = sessions.get(channelId);
	if (!session) {
		return -1;
	}
	
	session.hintsUsed++;
	console.log(`💡 Pista #${session.hintsUsed} solicitada en canal: ${channelId}`);
	return session.hintsUsed;
}

/**
 * Obtiene estadísticas de una sesión específica
 * @param channelId - ID del canal
 * @returns Estadísticas de la sesión o null si no existe
 */
export function getSessionStats(channelId: ChannelId): SessionStats | null {
	const session = sessions.get(channelId);
	if (!session) {
		return null;
	}
	
	return {
		attempts: session.guesses.length,
		hintsUsed: session.hintsUsed,
		duration: session.endTime ? 
			Math.floor((session.endTime - session.startTime) / 1000) : 
			Math.floor((Date.now() - session.startTime) / 1000),
		startedAt: session.startTime
	};
}

/**
 * Obtiene todas las sesiones activas
 * @returns Mapa de todas las sesiones
 */
export function getAllSessions(): Map<ChannelId, GameSession> {
	return new Map(sessions);
}

/**
 * Obtiene estadísticas globales del juego
 * @returns Estadísticas generales
 */
export function getGlobalStats(): {
	activeSessions: number;
	totalChannels: string[];
	oldestSession: number | null;
	averageGuesses: number;
	averageHints: number;
} {
	const activeSessions = sessions.size;
	const totalChannels = Array.from(sessions.keys());
	
	let oldestSession: number | null = null;
	let totalGuesses = 0;
	let totalHints = 0;
	
	for (const session of sessions.values()) {
		if (oldestSession === null || session.startedAt < oldestSession) {
			oldestSession = session.startedAt;
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

/**
 * Limpia sesiones antiguas basado en tiempo de inactividad
 * @param maxAgeHours - Edad máxima en horas antes de limpiar
 * @returns Número de sesiones limpiadas
 */
export function cleanupOldSessions(maxAgeHours: number = 24): number {
	const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
	let cleaned = 0;
	
	for (const [channelId, session] of sessions.entries()) {
		
		const sessionAge = Date.now() - session.startTime;
		const isOld = sessionAge > (maxAgeHours * 60 * 60 * 1000);
		const isInactive = !session.isActive;
		
		if (isOld || isInactive) {
			sessions.delete(channelId);
			cleaned++;
			console.log(`🧹 Sesión antigua limpiada: ${channelId} (edad: ${Math.floor(sessionAge / 60000)}min)`);
		}
	}
	
	if (cleaned > 0) {
		console.log(`✨ Limpieza completada: ${cleaned} sesiones eliminadas`);
	}
	
	return cleaned;
}