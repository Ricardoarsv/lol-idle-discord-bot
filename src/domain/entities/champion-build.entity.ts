import { DomainError } from '../../shared/errors';
import type { RoleBuild } from '../../shared/types/build.types';

/**
 * ChampionBuild Entity
 * Represents comprehensive build information for a champion
 */
export class ChampionBuild {
  private constructor(
    private readonly _championId: string,
    private readonly _championName: string,
    private readonly _championIcon: string,
    private readonly _roles: RoleBuild[],
    private readonly _patch: string
  ) {}

  /**
   * Factory method to create a ChampionBuild
   */
  static create(
    championId: string,
    championName: string,
    championIcon: string,
    roles: RoleBuild[],
    patch: string
  ): ChampionBuild {
    // Validate required fields
    if (!championId?.trim()) {
      throw new DomainError('Champion ID is required');
    }

    if (!championName?.trim()) {
      throw new DomainError('Champion name is required');
    }

    if (!championIcon?.trim()) {
      throw new DomainError('Champion icon is required');
    }

    if (!roles || roles.length === 0) {
      throw new DomainError('At least one role build is required');
    }

    if (!patch?.trim()) {
      throw new DomainError('Patch version is required');
    }

    return new ChampionBuild(championId, championName, championIcon, roles, patch);
  }

  // Getters
  get championId(): string {
    return this._championId;
  }

  get championName(): string {
    return this._championName;
  }

  get championIcon(): string {
    return this._championIcon;
  }

  get roles(): ReadonlyArray<RoleBuild> {
    return this._roles;
  }

  get patch(): string {
    return this._patch;
  }

  /**
   * Get the most popular role build
   */
  getMostPopularRole(): RoleBuild {
    return this._roles.reduce((prev, current) => 
      (current.pickRate > prev.pickRate) ? current : prev
    );
  }

  /**
   * Get build for a specific role
   */
  getRoleBuild(role: string): RoleBuild | undefined {
    return this._roles.find(r => r.role.toLowerCase() === role.toLowerCase());
  }

  /**
   * Get all available roles
   */
  getAvailableRoles(): string[] {
    return this._roles.map(r => r.role);
  }
}
