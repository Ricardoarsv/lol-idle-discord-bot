import type { GameSession } from '../../entities/game-session.entity';
import type { IGameSessionRepository } from '../../repositories/game-session.repository';
import type { ChannelId } from '../../../shared/types';
import { GameSessionNotFoundError } from '../../../shared/errors';

/**
 * Resultado de una adivinanza
 */
export interface GuessResult {
	session: GameSession;
	isCorrect: boolean;
	isGameOver: boolean;
	isWon: boolean;
}

/**
 * Caso de uso: Hacer una adivinanza
 */
export class MakeGuessUseCase {
	constructor(
		private readonly gameSessionRepository: IGameSessionRepository
	) {}

	execute(input: {
		channelId: ChannelId;
		guess: string;
	}): GuessResult {
		// Obtener sesión activa
		const session = this.gameSessionRepository.findByChannelId(input.channelId);

		if (!session) {
			throw new GameSessionNotFoundError(input.channelId);
		}

		// Verificar que esté activa
		if (!session.isActive) {
			throw new Error('Game session is not active');
		}

		// Hacer la adivinanza
		const isCorrect = session.targetChampion.matchesName(input.guess);
		
		session.addGuess(input.guess);

		// Actualizar sesión en el repositorio
		this.gameSessionRepository.save(session);

		// Si el juego terminó, limpiar la sesión
		const isGameOver = !session.isActive;
		if (isGameOver) {
			// La sesión se mantiene para mostrar resultados
		}

		return {
			session,
			isCorrect,
			isGameOver,
			isWon: session.isWon()
		};
	}
}
