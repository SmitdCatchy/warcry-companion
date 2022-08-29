import { AbilityType } from '../enums/ability-type.enum';

export interface Ability {
  type: AbilityType;
  runemarks: string[];
  prohibitiveRunemarks?: string[];
  title: string;
  description: string;
}
