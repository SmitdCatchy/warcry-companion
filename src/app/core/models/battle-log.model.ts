export interface BattleLog {
  victory: boolean;
  casualities: {
    type: string;
    name?: string;
  }[];
  date: string;
  enemy?: string;
  campaign?: boolean;
}
