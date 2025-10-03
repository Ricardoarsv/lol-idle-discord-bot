/**
 * Contenedor de dependencias simple
 * Maneja la creación e inyección de dependencias
 */

import { DataDragonClient } from './infrastructure/external/ddragon.client';
import { CommunityDragonClient } from './infrastructure/external/community-dragon.client';
import { 
	DataDragonChampionRepository, 
	InMemoryGameSessionRepository, 
	LRUUserConfigRepository 
} from './infrastructure/repositories';
import { CommunityDragonBuildRepository } from './infrastructure/repositories/community-dragon-build.repository';
import { 
	StartGameUseCase,
	MakeGuessUseCase,
	GetHintUseCase,
	GiveUpUseCase,
	UpdateUserConfigUseCase
} from './domain/use-cases';
import { GetChampionBuildUseCase } from './domain/use-cases/champion';
import type { IChampionRepository } from './domain/repositories/champion.repository';
import type { IGameSessionRepository } from './domain/repositories/game-session.repository';
import type { IUserConfigRepository } from './domain/repositories/user-config.repository';
import type { IChampionBuildRepository } from './domain/repositories/champion-build.repository';

/**
 * Contenedor singleton de dependencias
 */
class DependencyContainer {
	private static instance: DependencyContainer;

	// Infraestructura
	public readonly dataDragonClient: DataDragonClient;
	public readonly communityDragonClient: CommunityDragonClient;
	
	// Repositorios
	public readonly championRepository: IChampionRepository;
	public readonly gameSessionRepository: IGameSessionRepository;
	public readonly userConfigRepository: IUserConfigRepository;
	public readonly championBuildRepository: IChampionBuildRepository;

	// Casos de uso
	public readonly startGameUseCase: StartGameUseCase;
	public readonly makeGuessUseCase: MakeGuessUseCase;
	public readonly getHintUseCase: GetHintUseCase;
	public readonly giveUpUseCase: GiveUpUseCase;
	public readonly updateUserConfigUseCase: UpdateUserConfigUseCase;
	public readonly getChampionBuildUseCase: GetChampionBuildUseCase;

	private constructor() {
		// Crear clientes externos
		this.dataDragonClient = new DataDragonClient();
		this.communityDragonClient = new CommunityDragonClient();

		// Crear repositorios
		this.championRepository = new DataDragonChampionRepository(this.dataDragonClient);
		this.gameSessionRepository = new InMemoryGameSessionRepository();
		this.userConfigRepository = new LRUUserConfigRepository();
		this.championBuildRepository = new CommunityDragonBuildRepository(
			this.communityDragonClient,
			this.dataDragonClient,
			this.championRepository
		);

		// Crear casos de uso
		this.startGameUseCase = new StartGameUseCase(
			this.championRepository,
			this.gameSessionRepository,
			this.userConfigRepository
		);

		this.makeGuessUseCase = new MakeGuessUseCase(
			this.gameSessionRepository
		);

		this.getHintUseCase = new GetHintUseCase(
			this.gameSessionRepository
		);

		this.giveUpUseCase = new GiveUpUseCase(
			this.gameSessionRepository
		);

		this.updateUserConfigUseCase = new UpdateUserConfigUseCase(
			this.userConfigRepository
		);

		this.getChampionBuildUseCase = new GetChampionBuildUseCase(
			this.championBuildRepository
		);

		console.log('✅ Dependency container initialized');
	}

	public static getInstance(): DependencyContainer {
		if (!DependencyContainer.instance) {
			DependencyContainer.instance = new DependencyContainer();
		}
		return DependencyContainer.instance;
	}

	// Getters for dependencies
	public getChampionRepository(): IChampionRepository {
		return this.championRepository;
	}

	public getGetChampionBuildUseCase(): GetChampionBuildUseCase {
		return this.getChampionBuildUseCase;
	}
}

export { DependencyContainer };
export const container = DependencyContainer.getInstance();
