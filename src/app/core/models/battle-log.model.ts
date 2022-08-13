import { Fighter } from './fighter.model';

export interface BattleLog {
  victory: boolean;
  casualities: Fighter[];
  date: string;
  enemy?: string;
  campaign?: boolean;
}
