export interface Weapon {
  range: number | string;
  attacks: number;
  strength: number;
  damage: number;
  crit: number;
  type?: string;
  runemark?: string;
}
