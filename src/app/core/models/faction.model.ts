import { Ability } from './ability.model';
import { Fighter } from './fighter.model';

export interface Faction {
  name: string;
  alliance?: string;
  icon?: string;
  description?: string;
  fighterTypes: Fighter[];
  abilities?: Ability[];
}
