import { fetch } from 'undici';
import { InfrastructureError } from '../../shared/errors';

/**
 * Community Dragon API Client
 * Provides access to champion builds, runes, and items data
 */
export class CommunityDragonClient {
  private readonly baseUrl = 'https://cdn.communitydragon.org';
  private readonly timeout = 10000; // 10 seconds
  private latestPatch: string | null = null;

  /**
   * Get the latest patch version
   */
  async getLatestPatch(): Promise<string> {
    if (this.latestPatch) {
      return this.latestPatch;
    }

    try {
      // Try to get from Community Dragon
      const response = await fetch(`${this.baseUrl}/latest/champion/-1/data`, {
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        console.warn('Community Dragon patch fetch failed, using fallback');
        this.latestPatch = 'latest';
        return this.latestPatch;
      }

      // Extract patch from response URL or use latest
      this.latestPatch = 'latest';
      return this.latestPatch;
    } catch (error) {
      console.warn('Community Dragon not available, using fallback patch version');
      this.latestPatch = 'latest';
      return this.latestPatch;
    }
  }

  /**
   * Get champion data including abilities and recommended builds
   */
  async getChampionData(championId: number): Promise<any> {
    try {
      const patch = await this.getLatestPatch();
      const url = `${this.baseUrl}/${patch}/champion/${championId}/data`;
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        console.warn(`Community Dragon champion data not available: ${response.statusText}`);
        return { recommendedItemDefaults: [] };
      }

      return await response.json();
    } catch (error) {
      console.warn('Community Dragon champion data fetch failed, using fallback');
      return { recommendedItemDefaults: [] };
    }
  }

  /**
   * Get all items data
   */
  async getItems(): Promise<any> {
    try {
      const patch = await this.getLatestPatch();
      const url = `${this.baseUrl}/${patch}/plugins/rcp-be-lol-game-data/global/default/v1/items.json`;
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        console.warn('Community Dragon items not available, using empty array');
        return [];
      }

      return await response.json();
    } catch (error) {
      console.warn('Community Dragon items fetch failed');
      return [];
    }
  }

  /**
   * Get all runes data
   */
  async getRunes(): Promise<any> {
    try {
      const patch = await this.getLatestPatch();
      const url = `${this.baseUrl}/${patch}/plugins/rcp-be-lol-game-data/global/default/v1/perks.json`;
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        console.warn('Community Dragon runes not available, using empty array');
        return [];
      }

      return await response.json();
    } catch (error) {
      console.warn('Community Dragon runes fetch failed');
      return [];
    }
  }
}
