import type { ChampionBuild } from '../entities/champion-build.entity';

/**
 * Repository interface for champion builds
 */
export interface IChampionBuildRepository {
  /**
   * Get build information for a specific champion
   * @param championId - The champion ID or name
   * @returns ChampionBuild entity with all role builds
   */
  getBuild(championId: string): Promise<ChampionBuild>;

  /**
   * Get build for a specific champion and role
   * @param championId - The champion ID or name
   * @param role - The role to get build for
   * @returns ChampionBuild entity filtered for that role
   */
  getBuildByRole(championId: string, role: string): Promise<ChampionBuild>;
}
