import { AbilityType } from '../enums/ability-type.enum';
import { Battleground } from '../enums/battle-ground.enum';

export interface Ability {
  type: AbilityType;
  runemarks: string[];
  title: string;
  description: string;
  dependencies: Battleground[];
}
