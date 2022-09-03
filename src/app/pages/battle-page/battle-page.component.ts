import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BattleState } from 'src/app/core/enums/battle-state.enum';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { FighterState } from 'src/app/core/enums/fighter-state.enum';
import { Battle } from 'src/app/core/models/battle.model';
import { FighterReference } from 'src/app/core/models/fighter-reference.model';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';
import { BattlegroundsService } from 'src/app/core/services/battlegrounds.service';
import { CoreService } from 'src/app/core/services/core.service';
import { WarbandService } from 'src/app/core/services/warband.service';

@Component({
  selector: 'smitd-battle-page',
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattlePageComponent implements OnInit, OnDestroy {
  public FighterCardMode = FighterCardMode;
  public BattleState = BattleState;
  public FighterState = FighterState;
  public FighterRole = FighterRole;
  public beastRunemark: string;
  private _subscriptions = new Subscription();
  public showGridLayout: boolean;

  constructor(
    public readonly core: CoreService,
    public readonly battleService: BattleService,
    public readonly warbandService: WarbandService,
    public readonly battlegroundService: BattlegroundsService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translateService: TranslateService
  ) {
    if (this.battle.battleState === BattleState.Peace) {
      this.router.navigateByUrl('/');
    }
    this.beastRunemark = 'beast';
    this.showGridLayout = false;
  }

  ngOnInit(): void {
    this._subscriptions.add(
      this.translateService.get('fighter-role.beast').subscribe((beast) => {
        this.beastRunemark = beast;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

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

  public addFighter(): void {
    this.battleService.addFighter(() => {
      this.cdr.detectChanges();
    });
  }

  public addWildFighter(): void {
    this.battleService.addWildFighter(() => {
      this.cdr.detectChanges();
    });
  }

  public endTurn(): void {
    this.battleService.endTurn(() => {
      this.cdr.detectChanges();
    });
  }

  public removeWildFighter(index: number): void {
    this.battleService.removeWildFighter(index, () => {
      this.cdr.detectChanges();
    });
  }

  public canCarry(fighter: Fighter): boolean {
    return (
      fighter.role !== FighterRole.Monster &&
      fighter.role !== FighterRole.Beast &&
      fighter.runemarks.findIndex(
        (runemark) =>
          runemark.toLocaleLowerCase() ===
          this.beastRunemark.toLocaleLowerCase()
      ) === -1
    );
  }

  public dragStarted(): void {
    this.showGridLayout = true;
  }

  public dragEnded(): void {
    this.showGridLayout = false;
  }
}
