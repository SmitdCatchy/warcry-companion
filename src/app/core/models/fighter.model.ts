import { FighterRole } from '../enums/fighter-role.enum';
import { Modifier } from './modifier.model';
import { Weapon } from './weapon.model';

export interface Fighter {
  role: FighterRole;
  type: string;
  movement: number;
  toughness: number;
  wounds: number;
  runemarks: string;
  weapons: Weapon[];
  points: number;
  name?: string;
  modifiers?: Modifier[];
  note?: string;
}
