import { AbilityType } from '../enums/ability-type.enum';

export interface Ability {
  type: AbilityType;
  runemarks: string[];
  title: string;
  description: string;
}
