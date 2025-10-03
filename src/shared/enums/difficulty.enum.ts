/**
 * Niveles de dificultad del juego
 */

export enum DifficultyLevel {
	EASY = 'easy',
	NORMAL = 'normal',
	HARD = 'hard',
	EXPERT = 'expert'
}

export const DIFFICULTY_CONFIG = {
	[DifficultyLevel.EASY]: {
		maxHints: 8,
		baseHints: 4,
		maxAttempts: 6,
		name: 'Fácil'
	},
	[DifficultyLevel.NORMAL]: {
		maxHints: 6,
		baseHints: 3,
		maxAttempts: 5,
		name: 'Normal'
	},
	[DifficultyLevel.HARD]: {
		maxHints: 4,
		baseHints: 2,
		maxAttempts: 4,
		name: 'Difícil'
	},
	[DifficultyLevel.EXPERT]: {
		maxHints: 2,
		baseHints: 1,
		maxAttempts: 3,
		name: 'Experto'
	}
} as const;
