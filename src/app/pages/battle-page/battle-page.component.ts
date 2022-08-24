import { Location } from '@angular/common';
import { Component, ChangeDetectionStrategy  } from '@angular/core';
import { BattleState } from 'src/app/core/enums/battle-state.enum';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { FighterState } from 'src/app/core/enums/fighter-state.enum';
import { Battle } from 'src/app/core/models/battle.model';
import { FighterReference } from 'src/app/core/models/fighter-reference.model';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';
import { BattlegroundsService } from 'src/app/core/services/battlegrounds.service';
import { WarbandService } from 'src/app/core/services/warband.service';

@Component({
  selector: 'smitd-battle-page',
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattlePageComponent {
  public FighterCardMode = FighterCardMode;
  public BattleState = BattleState;
  public FighterState = FighterState;
  public FighterRole = FighterRole;

  constructor(
    public readonly battleService: BattleService,
    public readonly warbandService: WarbandService,
    public readonly battlegroundService: BattlegroundsService,
    private location: Location
  ) {}

  public get battle(): Battle {
    return this.battleService.battle;
  }

  public get warband(): Warband {
    return this.battleService.battle.warband;
  }

  public alterWounds(fighter: FighterReference, alterBy: number): void {
    fighter.wounds += alterBy;
    if (fighter.wounds === 0) {
      fighter.carryingTreasure = false;
      fighter.state = FighterState.Dead;
    } else if (fighter.state === FighterState.Dead) {
      fighter.state = FighterState.Ready;
    }
    this.battleService.saveBattle();
  }

  public alterVictoryPoints(alterBy: number): void {
    this.battle.victoryPoints += alterBy;
    this.battleService.saveBattle();
  }

  public back(): void {
    this.location.back();
  }
}
