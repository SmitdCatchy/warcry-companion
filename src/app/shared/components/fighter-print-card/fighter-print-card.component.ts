import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { Fighter } from 'src/app/core/models/fighter.model';
import { MonsterStat } from 'src/app/core/models/monster-stat.model';
import { Runemark } from 'src/app/core/models/runemark.model';
import { RunemarksService } from 'src/app/core/services/runemarks.service';

@Component({
  selector: 'smitd-fighter-print-card',
  templateUrl: './fighter-print-card.component.html',
  styleUrls: ['./fighter-print-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FighterPrintCardComponent {
  @Input() fighter: Fighter;
  @Input() showRunemarks: boolean;
  @Input() darkBorders: boolean;
  @Input() edit: boolean;

  constructor(readonly runemarksService: RunemarksService) {
    this.fighter = {
      role: FighterRole.Thrall,
      type: 'Error Thrall',
      movement: 1,
      toughness: 1,
      wounds: 2,
      runemarks: ['Minion'],
      weapons: [
        {
          range: 1,
          attacks: 1,
          strength: 2,
          damage: 1,
          crit: 2,
          runemark: 'Claws'
        }
      ],
      points: 100,
      name: '',
      modifiers: [],
      abilities: [],
      notes: ''
    };
    this.showRunemarks = false;
    this.darkBorders = true;
    this.edit = false;
  }

  get runemarks(): Runemark[] {
    return this.fighter.runemarks.map(
      (key) =>
        this.runemarksService.runemarks.find(
          (runemark) => runemark.key === key
        ) || { key }
    );
  }



  getModifier(
    stat: string,
    secondary: string = '',
    weaponIndex: number = 0
  ): number {
    return 0;
  }

  getModified(
    stat: string,
    secondary: string = '',
    weaponIndex: number = 0
  ): number {
      switch (stat) {
        case 'weapon':
          return this.getFighterStat(stat, secondary, weaponIndex);
        default:
          return this.getFighterStat(stat);
      }
  }

  getFighterStat(
    stat: string,
    secondary: string = '',
    weaponIndex: number = 0
  ): number {
    switch (stat) {
      case 'weapon':
        return this.fighter.role == FighterRole.Monster
          ? this.getMonsterStat(stat, secondary)
          : (this.fighter.weapons[weaponIndex] as any)[secondary];
      default:
        return this.fighter.role == FighterRole.Monster
          ? this.getMonsterStat(stat, secondary)
          : (this.fighter as any)[stat];
    }
  }

  getMonsterStat(stat: string, secondary: string = ''): number {
    const monsterTable: MonsterStat[] = this.fighter.monsterStatTable!;
    const monsterStatIndex = monsterTable?.findIndex(
      (stats) => stats.minHealth <= 0
    );
    if (monsterStatIndex < 0) {
      switch (stat) {
        case 'weapon':
          return (this.fighter.weapons[0] as any)[secondary];
        default:
          return (this.fighter as any)[stat];
      }
    }

    switch (stat) {
      case 'weapon':
        switch (secondary) {
          case 'damage':
            return monsterTable[monsterStatIndex][secondary];
          case 'crit':
            return monsterTable[monsterStatIndex][secondary];
          default:
            return (this.fighter.weapons[0] as any)[secondary];
        }
      default:
        switch (stat) {
          case 'movement':
            return (monsterTable as any)[monsterStatIndex][stat];
          default:
            return (this.fighter as any)[stat];
        }
    }
  }
}
