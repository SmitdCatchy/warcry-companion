import { FighterRole } from '../enums/fighter-role.enum';
import { FighterState } from '../enums/fighter-state.enum';
import { Modifier } from './modifier.model';
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
  name?: string;
  note?: string;
  icon?: string;
}
