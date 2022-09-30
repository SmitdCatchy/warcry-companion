import { BattleState } from '../enums/battle-state.enum';
import { Battleground } from './battleground.model';
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
  multiplayer?: boolean;
  campaign: boolean;
  battlegrounds?: Battleground[];
}
