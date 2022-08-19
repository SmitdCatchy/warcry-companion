import { EncampmentState } from '../enums/encampment-state.enum';

export interface Campaign {
  name: string;
  limit: number;
  reputation: number;
  glory: number;
  progress: number;
  encampment: string;
  encampmentState: EncampmentState;
  notes: string;
}
