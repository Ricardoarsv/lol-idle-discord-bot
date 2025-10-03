import { GameSession } from '../../entities/game-session.entity';
import type { IChampionRepository } from '../../repositories/champion.repository';
import type { IGameSessionRepository } from '../../repositories/game-session.repository';
import type { IUserConfigRepository } from '../../repositories/user-config.repository';
import type { UserId, ChannelId } from '../../../shared/types';

/**
 * Caso de uso: Iniciar una nueva partida
 */
export class StartGameUseCase {
	constructor(
		private readonly championRepository: IChampionRepository,
		private readonly gameSessionRepository: IGameSessionRepository,
		private readonly userConfigRepository: IUserConfigRepository
	) {}

	async execute(input: {
		userId: UserId;
		channelId: ChannelId;
		isDaily?: boolean;
	}): Promise<GameSession> {
		// Obtener configuración del usuario
		const userConfig = this.userConfigRepository.findByUserId(input.userId);

		// Obtener campeones disponibles
		const champions = await this.championRepository.getAll(userConfig.locale);

		if (champions.length === 0) {
			throw new Error('No champions available');
		}

		// Seleccionar campeón aleatorio
		const targetChampion = await this.championRepository.getRandom(userConfig.locale);

		// Crear nueva sesión de juego
		const gameSession = GameSession.create({
			userId: input.userId,
			channelId: input.channelId,
			targetChampion,
			difficulty: userConfig.difficulty,
			language: userConfig.language,
			locale: userConfig.locale,
			isDaily: input.isDaily ?? false
		});

		// Guardar sesión
		this.gameSessionRepository.save(gameSession);

		return gameSession;
	}
}
