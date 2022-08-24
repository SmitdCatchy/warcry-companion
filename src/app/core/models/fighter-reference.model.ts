import { FighterState } from '../enums/fighter-state.enum';
import { Fighter } from './fighter.model';
import { Modifier } from './modifier.model';

export interface FighterReference {
  fighterIndex: number;
  stats: Fighter;
  wounds: number;
  inititalWounds: number;
  state: FighterState;
  modifiers: {
    weapons: {
      attacks: number;
      strength: number;
      damage: number;
      crit: number;
    }[];
    movement: number;
    toughness: number;
    wounds: number;
  };
  artefacts: Modifier[];
  injuries: Modifier[];
  availableRenown?: boolean[];
  traits: Modifier[];
  carryingTreasure?: boolean;
}
