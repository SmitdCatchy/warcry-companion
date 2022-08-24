import { ModifierType } from '../enums/modifier-type.enum';

export interface Modifier {
  name: string;
  type: ModifierType;
  description: string;
  usable?: boolean;
  used?: boolean;
  attribute?: string;
  modify: {
    weapon: {
      ranged: boolean;
      attacks: number;
      strength: number;
      damage: number;
      crit: number;
    };
    movement: number;
    toughness: number;
    wounds: number;
  };
}
