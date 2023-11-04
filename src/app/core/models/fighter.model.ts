import { FighterRole } from '../enums/fighter-role.enum';
import { Ability } from './ability.model';
import { Modifier } from './modifier.model';
import { MonsterStat } from './monster-stat.model';
import { Weapon } from './weapon.model';

export interface Fighter {
  role: FighterRole;
  type: string;
  movement: number;
  toughness: number;
  wounds: number;
  runemarks: string[];
  weapons: Weapon[];
  points: number;
  modifiers: Modifier[];
  abilities: Ability[];
  name?: string;
  notes?: string;
  renown?: number;
  icon?: string;
  monsterStatTable?: MonsterStat[];
  faction?: string;
  alliance?: string;
  color?: string;
  bladeborn?: string;
}
