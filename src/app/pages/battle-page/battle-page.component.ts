import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BattleState } from 'src/app/core/enums/battle-state.enum';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { FighterState } from 'src/app/core/enums/fighter-state.enum';
import { PeerState } from 'src/app/core/enums/peer-state.enum';
import { PeerType } from 'src/app/core/enums/peer-type.enum.ts';
import { BattlePeer } from 'src/app/core/models/battle-peer.model';
import { Battle } from 'src/app/core/models/battle.model';
import { FighterReference } from 'src/app/core/models/fighter-reference.model';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Modifier } from 'src/app/core/models/modifier.model';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';
import { BattlegroundsService } from 'src/app/core/services/battlegrounds.service';
import { CoreService } from 'src/app/core/services/core.service';
import { MultiplayerService } from 'src/app/core/services/multiplayer.service';
import { WarbandService } from 'src/app/core/services/warband.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ConnectDialogComponent } from 'src/app/shared/components/connect-dialog/connect-dialog.component';
import { ModifierDialogComponent } from 'src/app/shared/components/modifier-dialog/modifier-dialog.component';

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
  public PeerType = PeerType;
  public PeerState = PeerState;
  public beastRunemark: string;
  private _subscriptions = new Subscription();
  public showGridLayout: boolean;
  public visibleWarbandIndex: number;
  private wakeLock: any;

  constructor(
    public readonly core: CoreService,
    public readonly battleService: BattleService,
    public readonly warbandService: WarbandService,
    public readonly battlegroundService: BattlegroundsService,
    public readonly multiplayerService: MultiplayerService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly popup: MatSnackBar
  ) {
    if (this.battleService.battle.battleState === BattleState.Peace) {
      this.router.navigateByUrl('/');
    }
    this.beastRunemark = 'beast';
    this.showGridLayout = false;
    this.multiplayerService.initializePeer();
    this.visibleWarbandIndex = -1;
    this.core.setColor(this.battleService.battle.warband.color);
  }

  ngOnInit(): void {
    this._subscriptions.add(
      this.translateService.get('fighter-role.beast').subscribe((beast) => {
        this.beastRunemark = beast;
        this.cdr.detectChanges();
      })
    );
    this._subscriptions.add(
      this.multiplayerService.refreshUi.subscribe(() => {
        this.cdr.detectChanges();
      })
    );
    this._subscriptions.add(
      this.multiplayerService.disconnectedPeerIndex.subscribe((index) => {
        if (index === -1 || this.visibleWarbandIndex === index) {
          this.checkWarband(-1);
        }
      })
    );
    this.stayAwake();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this.multiplayerService.disconnect();
    this.letSleep();
  }

  public get battle(): Battle | BattlePeer {
    return this.visibleWarbandIndex < 0
      ? this.battleService.battle
      : this.multiplayerService.peers[this.visibleWarbandIndex]
      ? this.multiplayerService.peers[this.visibleWarbandIndex]
      : this.battleService.battle;
  }

  public get warband(): Warband {
    return this.visibleWarbandIndex < 0
      ? this.battleService.battle.warband
      : this.multiplayerService.peers[this.visibleWarbandIndex]
      ? this.multiplayerService.peers[this.visibleWarbandIndex].warband
      : this.battleService.battle.warband;
  }

  public get notEditable(): boolean {
    return this.visibleWarbandIndex > -1;
  }

  public alterWounds(
    fighter: FighterReference,
    alterBy: number,
    group: string,
    index: number
  ): void {
    fighter.wounds += alterBy;
    if (fighter.wounds === 0) {
      fighter.carryingTreasure = false;
      fighter.state = FighterState.Dead;
    } else if (fighter.state === FighterState.Dead) {
      fighter.state = FighterState.Ready;
    }
    this.battleService.saveBattle();
    this.battleService.battleSubject.next({
      changed: 'fighter',
      fighter,
      group,
      index
    });
  }

  public alterFighter(
    fighter: FighterReference,
    group: string,
    index: number
  ): void {
    this.battleService.saveBattle();
    this.battleService.battleSubject.next({
      changed: 'fighter',
      fighter,
      group,
      index
    });
  }

  public alterVictoryPoints(alterBy: number): void {
    this.battle.victoryPoints += alterBy;
    this.battleService.saveBattle();
    this.battleService.battleSubject.next({
      changed: 'victory-points',
      value: this.battle.victoryPoints
    });
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
      !this.notEditable &&
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

  public connectToSession(): void {
    this._subscriptions.add(
      this.dialog
        .open(ConnectDialogComponent, {
          data: {},
          disableClose: true,
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((connect: boolean) => {
          if (connect) {
            this.battleService.battle.multiplayer = true;
            this.battleService.saveBattle();
          }
        })
    );
  }

  public copySessionToken(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        this.multiplayerService.peerType === PeerType.Host
          ? this.multiplayerService.peerId
          : this.multiplayerService.peers[0].peerId
      );
      this.popup.open(
        `${this.translateService.instant('multiplayer.action.token')}`,
        undefined,
        {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 1000,
          panelClass: 'bottom-snackbar'
        }
      );
    } else {
      const textarea: HTMLTextAreaElement = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.value =
        this.multiplayerService.peerType === PeerType.Host
          ? this.multiplayerService.peerId
          : this.multiplayerService.peers[0].peerId;
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  public checkWarband(index: number): void {
    this.visibleWarbandIndex = index;
    if (index < 0) {
      this.core.setColor(this.battleService.battle.warband.color);
    } else {
      this.core.setColor(this.multiplayerService.peers[index].warband.color);
    }
    this.cdr.detectChanges();
  }

  public useRenown(
    fighter: FighterReference,
    renownIndex: number,
    group: string,
    index: number
  ): void {
    if (!this.notEditable) {
      this.battleService.useRenown(fighter, renownIndex, group, index);
    }
  }

  public stayAwake(): void {
    if ('WakeLock' in window && 'request' in (window as any).WakeLock) {
      // alert('if WakeLock');
      this.wakeLock = this.requestWakeLockController();
      document.addEventListener(
        'visibilitychange',
        this.handleVisibilityChange
      );
      document.addEventListener(
        'fullscreenchange',
        this.handleVisibilityChange
      );
    } else if (
      'wakeLock' in navigator &&
      'request' in (navigator as any).wakeLock
    ) {
      // alert('else if wakeLock');
      this.requestWakeLock();
      document.addEventListener(
        'visibilitychange',
        this.handleVisibilityChangeTypeTwo
      );
      document.addEventListener(
        'fullscreenchange',
        this.handleVisibilityChangeTypeTwo
      );
    } else {
      // alert('Wake Lock API not supported.');
    }
  }

  private letSleep(): void {
    if (this.wakeLock?.abort) {
      this.wakeLock.abort();
    }
    if (this.wakeLock?.release) {
      this.wakeLock.release();
    }
    this.wakeLock = null;
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
    document.removeEventListener(
      'fullscreenchange',
      this.handleVisibilityChange
    );
  }

  private requestWakeLockController(): AbortController {
    const controller = new AbortController();
    const signal = controller.signal;
    (window as any).WakeLock.request('screen', { signal }).catch((e: any) => {
      if (e.name === 'AbortError') {
        // alert('Wake Lock was aborted');
      } else {
        // alert(`${e.name}, ${e.message}`);
      }
    });
    // alert('Wake Lock is active');
    return controller;
  }

  private handleVisibilityChange(): void {
    if (this.wakeLock !== null && document.visibilityState === 'visible') {
      this.wakeLock = this.requestWakeLockController();
    }
  }

  private async requestWakeLock(): Promise<void> {
    try {
      this.wakeLock = await (navigator as any).wakeLock.request('screen');
      this.wakeLock.addEventListener('release', (e: any) => {
        // alert('Wake Lock was released');
      });
      // alert('Wake Lock is active');
    } catch (e: any) {
      console.error(`${e.name}, ${e.message}`);
    }
  }

  private async handleVisibilityChangeTypeTwo(): Promise<void> {
    if (this.wakeLock !== null && document.visibilityState === 'visible') {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', (e: any) => {
          // alert('Wake Lock was released');
        });
        // alert('Wake Lock is active');
      } catch (e: any) {
        console.error(`${e.name}, ${e.message}`);
      }
    }
  }

  public refreshUI = (): void => {
    this.cdr.detectChanges();
  };

  public removeFighter(fighterIndex: number, index: number): void {
    this.warbandService.removeFighter(fighterIndex, () => {
      this.battleService.battle.fallen!.splice(index, 1);
      this.battleService.saveBattle();
      this.refreshUI();
    });
  }

  public addFighterModifier(fighter: FighterReference, index: number): void {
    this._subscriptions.add(
      this.dialog
        .open(ModifierDialogComponent, {
          data: {},
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((modifier: Modifier) => {
          if (modifier) {
            fighter.stats.modifiers.push(modifier);
            this.warbandService.updateFighter(fighter.stats, fighter.fighterIndex);
            this.battleService.saveBattle();
            this.refreshUI();
          }
        })
    );
  }

  public editFighterModifier(
    fighter: FighterReference,
    index: number,
    modifierIndex: number
  ): void {
    this._subscriptions.add(
      this.dialog
        .open(ModifierDialogComponent, {
          data: {
            modifier: fighter.stats.modifiers[modifierIndex],
            edit: true
          },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((modifier: Modifier) => {
          if (modifier) {
            fighter.stats.modifiers[modifierIndex] = modifier;
            this.warbandService.updateFighter(fighter.stats, fighter.fighterIndex);
            this.battleService.saveBattle();
            this.refreshUI();
          }
        })
    );
  }

  public removeFighterModifier(
    fighter: FighterReference,
    index: number,
    modifierIndex: number
  ): void {
    this._subscriptions.add(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            yesColor: 'warn',
            question: this.translateService.instant(
              'warband-page.tab.fighters.form.modifiers.remove-question',
              {
                modifier: fighter.stats.modifiers[modifierIndex].name,
                fighter: fighter.stats.name || fighter.stats.type
              }
            )
          },
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            fighter.stats.modifiers.splice(modifierIndex, 1);
            this.warbandService.updateFighter(fighter.stats, fighter.fighterIndex);
            this.battleService.saveBattle();
            this.refreshUI();
          }
        })
    );
  }
}
