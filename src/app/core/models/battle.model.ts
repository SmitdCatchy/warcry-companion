import { Battleground } from '../enums/battle-ground.enum';
import { BattleState } from '../enums/battle-state.enum';
import { FighterReference } from './fighter-reference.model';
import { Warband } from './warband.model';

export interface Battle {
  warband: Warband;
  roster: FighterReference[];
  hammer: FighterReference[];
  shield: FighterReference[];
  dagger: FighterReference[];
  wild: FighterReference[];
  battleState: BattleState;
  turn: number;
  victoryPoints: number;
  groupless?: boolean;
  campaign?: boolean;
  features?: Battleground[];
}
