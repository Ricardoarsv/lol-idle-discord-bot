import type { UserConfig } from '../../entities/user-config.entity';
import type { IUserConfigRepository } from '../../repositories/user-config.repository';
import type { UserId } from '../../../shared/types';
import type { Language, DifficultyLevel } from '../../../shared/enums';

/**
 * Caso de uso: Actualizar configuración de usuario
 */
export class UpdateUserConfigUseCase {
	constructor(
		private readonly userConfigRepository: IUserConfigRepository
	) {}

	execute(input: {
		userId: UserId;
		language?: Language;
		difficulty?: DifficultyLevel;
		autoHints?: boolean;
	}): UserConfig {
		// Obtener configuración actual
		let config = this.userConfigRepository.findByUserId(input.userId);

		// Aplicar actualizaciones
		if (input.language !== undefined) {
			config = config.updateLanguage(input.language);
		}

		if (input.difficulty !== undefined) {
			config = config.updateDifficulty(input.difficulty);
		}

		if (input.autoHints !== undefined) {
			config = config.updateAutoHints(input.autoHints);
		}

		// Guardar configuración actualizada
		this.userConfigRepository.save(config);

		return config;
	}
}
