import type { GameSession } from '../../entities/game-session.entity';
import type { IGameSessionRepository } from '../../repositories/game-session.repository';
import type { ChannelId } from '../../../shared/types';
import { GameSessionNotFoundError } from '../../../shared/errors';

/**
 * Resultado de rendirse
 */
export interface GiveUpResult {
	session: GameSession;
	championName: string;
}

/**
 * Caso de uso: Rendirse en una partida
 */
export class GiveUpUseCase {
	constructor(
		private readonly gameSessionRepository: IGameSessionRepository
	) {}

	execute(input: {
		channelId: ChannelId;
	}): GiveUpResult {
		// Obtener sesión activa
		const session = this.gameSessionRepository.findByChannelId(input.channelId);

		if (!session) {
			throw new GameSessionNotFoundError(input.channelId);
		}

		// Verificar que esté activa
		if (!session.isActive) {
			throw new Error('Game session is not active');
		}

		// Rendirse
		session.giveUp();

		// Actualizar sesión en el repositorio
		this.gameSessionRepository.save(session);

		return {
			session,
			championName: session.targetChampion.name
		};
	}
}
