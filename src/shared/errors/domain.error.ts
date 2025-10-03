/**
 * Errores de dominio
 */

export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DomainError';
	}
}

export class EntityValidationError extends DomainError {
	constructor(entityName: string, message: string) {
		super(`${entityName} validation failed: ${message}`);
		this.name = 'EntityValidationError';
	}
}

export class GameSessionNotFoundError extends DomainError {
	constructor(channelId: string) {
		super(`Game session not found for channel: ${channelId}`);
		this.name = 'GameSessionNotFoundError';
	}
}

export class InvalidGuessError extends DomainError {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidGuessError';
	}
}

export class NoAttemptsLeftError extends DomainError {
	constructor() {
		super('No attempts left in this game session');
		this.name = 'NoAttemptsLeftError';
	}
}

export class ChampionNotFoundError extends DomainError {
	constructor(championId: string) {
		super(`Champion not found: ${championId}`);
		this.name = 'ChampionNotFoundError';
	}
}
