import type { IChampionBuildRepository } from '../../repositories/champion-build.repository';
import type { ChampionBuild } from '../../entities/champion-build.entity';

/**
 * Use case for getting champion build information
 */
export class GetChampionBuildUseCase {
  constructor(
    private readonly championBuildRepository: IChampionBuildRepository
  ) {}

  /**
   * Execute the use case to get a champion's build
   * @param championId - The champion ID or name
   * @param role - Optional specific role to filter by
   */
  async execute(championId: string, role?: string): Promise<ChampionBuild> {
    if (!championId?.trim()) {
      throw new Error('Champion ID is required');
    }

    if (role) {
      return this.championBuildRepository.getBuildByRole(championId, role);
    }

    return this.championBuildRepository.getBuild(championId);
  }
}
