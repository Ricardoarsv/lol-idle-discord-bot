import { DifficultyLevel, DIFFICULTY_CONFIG, Language, Locale } from '../../shared/enums';
import type { UserId, ChannelId } from '../../shared/types';
import { Champion } from './champion.entity';
import { 
	EntityValidationError, 
	NoAttemptsLeftError, 
	InvalidGuessError 
} from '../../shared/errors';

/**
 * Entidad de Sesión de Juego
 * Representa una partida activa de adivinanza de campeón
 */
export class GameSession {
	private constructor(
		public readonly userId: UserId,
		public readonly channelId: ChannelId,
		public readonly targetChampion: Champion,
		public readonly difficulty: DifficultyLevel,
		public readonly language: Language,
		public readonly locale: Locale,
		public readonly maxAttempts: number,
		public readonly startTime: number,
		public readonly isDaily: boolean,
		private _guesses: string[],
		private _hints: string[],
		private _hintsUsed: number,
		private _attemptsLeft: number,
		private _isActive: boolean,
		private _endTime?: number
	) {}

	/**
	 * Crea una nueva sesión de juego
	 */
	static create(props: {
		userId: UserId;
		channelId: ChannelId;
		targetChampion: Champion;
		difficulty: DifficultyLevel;
		language: Language;
		locale: Locale;
		isDaily?: boolean;
	}): GameSession {
		if (!props.userId || props.userId.trim().length === 0) {
			throw new EntityValidationError('GameSession', 'User ID cannot be empty');
		}

		if (!props.channelId || props.channelId.trim().length === 0) {
			throw new EntityValidationError('GameSession', 'Channel ID cannot be empty');
		}

		if (!props.targetChampion) {
			throw new EntityValidationError('GameSession', 'Target champion is required');
		}

		const difficultyConfig = DIFFICULTY_CONFIG[props.difficulty];
		const maxAttempts = difficultyConfig.maxAttempts;

		return new GameSession(
			props.userId,
			props.channelId,
			props.targetChampion,
			props.difficulty,
			props.language,
			props.locale,
			maxAttempts,
			Date.now(),
			props.isDaily ?? false,
			[],
			[],
			0,
			maxAttempts,
			true
		);
	}

	/**
	 * Getters para propiedades privadas
	 */
	get guesses(): readonly string[] {
		return [...this._guesses];
	}

	get hints(): readonly string[] {
		return [...this._hints];
	}

	get hintsUsed(): number {
		return this._hintsUsed;
	}

	get attemptsLeft(): number {
		return this._attemptsLeft;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	get endTime(): number | undefined {
		return this._endTime;
	}

	/**
	 * Añade una adivinanza a la sesión
	 */
	addGuess(guess: string): GameSession {
		if (!this._isActive) {
			throw new InvalidGuessError('Game session is not active');
		}

		if (this._attemptsLeft <= 0) {
			throw new NoAttemptsLeftError();
		}

		if (!guess || guess.trim().length === 0) {
			throw new InvalidGuessError('Guess cannot be empty');
		}

		const normalizedGuess = guess.toLowerCase().trim();
		
		// Verificar si ya se intentó este nombre
		if (this._guesses.includes(normalizedGuess)) {
			throw new InvalidGuessError('You already tried this champion');
		}

		this._guesses.push(normalizedGuess);
		this._attemptsLeft--;

		// Verificar si adivinó correctamente
		const isCorrect = this.targetChampion.matchesName(normalizedGuess);
		
		if (isCorrect) {
			this._isActive = false;
			this._endTime = Date.now();
		} else if (this._attemptsLeft === 0) {
			this._isActive = false;
			this._endTime = Date.now();
		}

		return this;
	}

	/**
	 * Añade una pista
	 */
	addHint(hint: string): GameSession {
		if (!hint || hint.trim().length === 0) {
			throw new InvalidGuessError('Hint cannot be empty');
		}

		this._hints.push(hint);
		this._hintsUsed++;

		return this;
	}

	/**
	 * Finaliza la sesión (dar por perdida)
	 */
	giveUp(): GameSession {
		this._isActive = false;
		this._endTime = Date.now();
		return this;
	}

	/**
	 * Verifica si adivinó correctamente
	 */
	isWon(): boolean {
		if (this._guesses.length === 0) return false;
		return !this._isActive && 
		       this.targetChampion.matchesName(this._guesses[this._guesses.length - 1]!);
	}

	/**
	 * Obtiene la duración de la sesión en segundos
	 */
	getDuration(): number {
		const endTime = this._endTime ?? Date.now();
		return Math.floor((endTime - this.startTime) / 1000);
	}

	/**
	 * Obtiene la puntuación basada en el rendimiento
	 */
	getScore(): number {
		if (!this.isWon()) {
			return 0;
		}

		const baseScore = 1000;
		const attemptPenalty = (this.maxAttempts - this._attemptsLeft) * 50;
		const hintPenalty = this._hintsUsed * 100;
		const timePenalty = Math.min(this.getDuration() * 2, 500);

		return Math.max(0, baseScore - attemptPenalty - hintPenalty - timePenalty);
	}

	/**
	 * Obtiene el número máximo de pistas disponibles
	 */
	getMaxHints(): number {
		return DIFFICULTY_CONFIG[this.difficulty].maxHints;
	}

	/**
	 * Verifica si puede usar más pistas
	 */
	canUseMoreHints(): boolean {
		return this._hintsUsed < this.getMaxHints();
	}

	/**
	 * Serializa a objeto plano
	 */
	toObject() {
		return {
			userId: this.userId,
			channelId: this.channelId,
			targetChampion: this.targetChampion.toObject(),
			targetId: this.targetChampion.id,
			difficulty: this.difficulty,
			language: this.language,
			locale: this.locale,
			maxAttempts: this.maxAttempts,
			startTime: this.startTime,
			isDaily: this.isDaily,
			guesses: [...this._guesses],
			hints: [...this._hints],
			hintsUsed: this._hintsUsed,
			attemptsLeft: this._attemptsLeft,
			isActive: this._isActive,
			endTime: this._endTime,
			score: this.getScore(),
			version: '1.0',
			startedAt: this.startTime
		};
	}

	/**
	 * Reconstruye una sesión desde un objeto plano
	 */
	static fromObject(obj: any): GameSession {
		const champion = Champion.create(obj.targetChampion);
		
		const session = new GameSession(
			obj.userId,
			obj.channelId,
			champion,
			obj.difficulty,
			obj.language,
			obj.locale,
			obj.maxAttempts,
			obj.startTime,
			obj.isDaily,
			[...obj.guesses],
			[...obj.hints],
			obj.hintsUsed,
			obj.attemptsLeft,
			obj.isActive,
			obj.endTime
		);

		return session;
	}
}
