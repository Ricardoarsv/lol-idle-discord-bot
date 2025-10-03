/**
 * Enums relacionados con campeones
 */

export enum ChampionTag {
	ASSASSIN = 'Assassin',
	FIGHTER = 'Fighter',
	MAGE = 'Mage',
	MARKSMAN = 'Marksman',
	SUPPORT = 'Support',
	TANK = 'Tank'
}

export enum ResourceType {
	MANA = 'Mana',
	ENERGY = 'Energy',
	FURY = 'Fury',
	RAGE = 'Rage',
	FLOW = 'Flow',
	HEAT = 'Heat',
	FEROCITY = 'Ferocity',
	BLOOD_WELL = 'BloodWell',
	NONE = 'None'
}

export enum AttackType {
	MELEE = 'melee',
	RANGED = 'ranged'
}

export const ATTACK_RANGE_THRESHOLD = 200;

export function getAttackType(attackRange: number): AttackType {
	return attackRange > ATTACK_RANGE_THRESHOLD ? AttackType.RANGED : AttackType.MELEE;
}
