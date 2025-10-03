/**
 * Rune slot in a rune page
 */
export interface Rune {
  id: number;
  name: string;
  icon: string;
}

/**
 * Complete rune page for a champion role
 */
export interface RunePage {
  primaryTree: {
    id: number;
    name: string;
    icon: string;
  };
  secondaryTree: {
    id: number;
    name: string;
    icon: string;
  };
  runes: Rune[];
  shards: {
    offense: number;
    flex: number;
    defense: number;
  };
}

/**
 * Item information
 */
export interface Item {
  id: number;
  name: string;
  icon: string;
  price: number;
}

/**
 * Champion role build information
 */
export interface RoleBuild {
  role: string;
  pickRate: number;
  winRate: number;
  runePage: RunePage;
  startingItems: Item[];
  coreItems: Item[];
  situationalItems: Item[];
  skillOrder: string[];
  summonerSpells: {
    spell1: string;
    spell2: string;
  };
}
