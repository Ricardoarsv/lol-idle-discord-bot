import { DifficultyLevel, Language, Locale, getLocaleFromLanguage } from '../../shared/enums';
import type { UserId } from '../../shared/types';
import { EntityValidationError } from '../../shared/errors';

/**
 * Entidad de Configuración de Usuario
 * Representa las preferencias de un usuario
 */
export class UserConfig {
	private constructor(
		public readonly userId: UserId,
		public readonly language: Language,
		public readonly locale: Locale,
		public readonly difficulty: DifficultyLevel,
		public readonly autoHints: boolean,
		public readonly lastUsed: number
	) {}

	/**
	 * Crea una configuración de usuario con valores por defecto
	 */
	static createDefault(userId: UserId): UserConfig {
		if (!userId || userId.trim().length === 0) {
			throw new EntityValidationError('UserConfig', 'User ID cannot be empty');
		}

		return new UserConfig(
			userId,
			Language.ES,
			Locale.SPANISH,
			DifficultyLevel.NORMAL,
			false,
			Date.now()
		);
	}

	/**
	 * Crea una configuración de usuario con valores específicos
	 */
	static create(props: {
		userId: UserId;
		language: Language;
		difficulty: DifficultyLevel;
		autoHints?: boolean;
		lastUsed?: number;
	}): UserConfig {
		if (!props.userId || props.userId.trim().length === 0) {
			throw new EntityValidationError('UserConfig', 'User ID cannot be empty');
		}

		return new UserConfig(
			props.userId,
			props.language,
			getLocaleFromLanguage(props.language),
			props.difficulty,
			props.autoHints ?? false,
			props.lastUsed ?? Date.now()
		);
	}

	/**
	 * Actualiza el idioma
	 */
	updateLanguage(language: Language): UserConfig {
		return new UserConfig(
			this.userId,
			language,
			getLocaleFromLanguage(language),
			this.difficulty,
			this.autoHints,
			Date.now()
		);
	}

	/**
	 * Actualiza la dificultad
	 */
	updateDifficulty(difficulty: DifficultyLevel): UserConfig {
		return new UserConfig(
			this.userId,
			this.language,
			this.locale,
			difficulty,
			this.autoHints,
			Date.now()
		);
	}

	/**
	 * Actualiza el estado de auto-pistas
	 */
	updateAutoHints(autoHints: boolean): UserConfig {
		return new UserConfig(
			this.userId,
			this.language,
			this.locale,
			this.difficulty,
			autoHints,
			Date.now()
		);
	}

	/**
	 * Actualiza la fecha de último uso
	 */
	touch(): UserConfig {
		return new UserConfig(
			this.userId,
			this.language,
			this.locale,
			this.difficulty,
			this.autoHints,
			Date.now()
		);
	}

	/**
	 * Verifica si la configuración está inactiva
	 */
	isInactive(daysThreshold: number): boolean {
		const cutoffTime = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
		return this.lastUsed < cutoffTime;
	}

	/**
	 * Serializa a objeto plano
	 */
	toObject() {
		return {
			userId: this.userId,
			language: this.language,
			locale: this.locale,
			difficulty: this.difficulty,
			autoHints: this.autoHints,
			lastUsed: this.lastUsed
		};
	}
}
