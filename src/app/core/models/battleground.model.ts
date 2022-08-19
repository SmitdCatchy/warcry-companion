import { Ability } from './ability.model';

export interface Battleground {
  name: string;
  abilities: Ability[];
  universal?: boolean;
}
