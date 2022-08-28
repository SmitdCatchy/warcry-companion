export interface BattleLog {
  outcome: string;
  casualities: {
    type: string;
    name?: string;
  }[];
  date: string;
  enemy?: string;
  campaign?: boolean;
}
