import { PeerState } from '../enums/peer-state.enum';
import { PeerType } from '../enums/peer-type.enum.ts';
import { FighterReference } from './fighter-reference.model';
import { Warband } from './warband.model';

export interface BattlePeer {
  peerId: string;
  warband: Warband;
  hammer: FighterReference[];
  shield: FighterReference[];
  dagger: FighterReference[];
  victoryPoints: number;
  hostIndex?: number;
  type?: PeerType;
  state: PeerState;
}
