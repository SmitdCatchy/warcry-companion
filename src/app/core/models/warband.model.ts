import { Color } from '../enums/color.enum';
import { Ability } from './ability.model';
import { Campaign } from './campaign.model';
import { Fighter } from './fighter.model';

export interface Warband {
  name: string;
  faction: string;
  alliance?: string;
  color: Color;
  fighters: Fighter[];
  abilities: Ability[];
  campaign: Campaign;
}
