import type { GameSession } from '../../entities/game-session.entity';
import type { IGameSessionRepository } from '../../repositories/game-session.repository';
import type { ChannelId } from '../../../shared/types';
import { GameSessionNotFoundError } from '../../../shared/errors';
import { ChampionTag, AttackType, DIFFICULTY_CONFIG } from '../../../shared/enums';

/**
 * Tipo de pista
 */
export enum HintType {
	ROLE = 'role',
	RESOURCE = 'resource',
	RANGE = 'range',
	TITLE = 'title',
	DIFFICULTY = 'difficulty',
	FIRST_LETTER = 'firstLetter',
	NAME_LENGTH = 'nameLength',
	PARTIAL_NAME = 'partialName'
}

/**
 * Resultado de obtener una pista
 */
export interface HintResult {
	session: GameSession;
	hint: string;
	hintType: HintType;
	canGetMore: boolean;
}

/**
 * Caso de uso: Obtener una pista
 */
export class GetHintUseCase {
	constructor(
		private readonly gameSessionRepository: IGameSessionRepository
	) {}

	execute(input: {
		channelId: ChannelId;
	}): HintResult {
		// Obtener sesión activa
		const session = this.gameSessionRepository.findByChannelId(input.channelId);

		if (!session) {
			throw new GameSessionNotFoundError(input.channelId);
		}

		// Verificar que esté activa
		if (!session.isActive) {
			throw new Error('Game session is not active');
		}

		// Verificar si puede obtener más pistas
		if (!session.canUseMoreHints()) {
			throw new Error('No more hints available');
		}

		// Generar pista basada en el número de pistas usadas
		const { hint, hintType } = this.generateHint(session);

		// Añadir pista a la sesión
		session.addHint(hint);

		// Actualizar sesión en el repositorio
		this.gameSessionRepository.save(session);

		return {
			session,
			hint,
			hintType,
			canGetMore: session.canUseMoreHints()
		};
	}

	/**
	 * Genera una pista basada en el progreso del juego
	 */
	private generateHint(session: GameSession): { hint: string; hintType: HintType } {
		const hintsUsed = session.hintsUsed;
		const champion = session.targetChampion;

		// Orden de pistas según el número usado
		switch (hintsUsed) {
			case 0:
				return {
					hint: `Rol: ${champion.getPrimaryRole()}`,
					hintType: HintType.ROLE
				};

			case 1:
				return {
					hint: `Recurso: ${champion.partype}`,
					hintType: HintType.RESOURCE
				};

			case 2:
				const attackType = champion.getAttackType();
				return {
					hint: `Rango: ${attackType === 'ranged' ? 'A distancia' : 'Cuerpo a cuerpo'}`,
					hintType: HintType.RANGE
				};

			case 3:
				return {
					hint: `Título: ${champion.title}`,
					hintType: HintType.TITLE
				};

			case 4:
				return {
					hint: `Primera letra: ${champion.name[0]}`,
					hintType: HintType.FIRST_LETTER
				};

			case 5:
				return {
					hint: `Longitud del nombre: ${champion.name.length} caracteres`,
					hintType: HintType.NAME_LENGTH
				};

			case 6:
				const partial = champion.name.substring(0, Math.ceil(champion.name.length / 2));
				return {
					hint: `Comienza con: ${partial}`,
					hintType: HintType.PARTIAL_NAME
				};

			default:
				// Última pista: dar el nombre casi completo
				const almostComplete = champion.name.substring(0, champion.name.length - 1);
				return {
					hint: `El nombre es: ${almostComplete}...`,
					hintType: HintType.PARTIAL_NAME
				};
		}
	}
}
