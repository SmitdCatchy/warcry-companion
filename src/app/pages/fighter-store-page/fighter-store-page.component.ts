import { Component, OnDestroy } from '@angular/core';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterStoreService } from 'src/app/core/services/fighter-store.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FighterDialogComponent } from 'src/app/shared/components/fighter-dialog/fighter-dialog.component';
import { Fighter } from 'src/app/core/models/fighter.model';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AbilityDialogComponent } from 'src/app/shared/components/ability-dialog/ability-dialog.component';
import { WarbandService } from 'src/app/core/services/warband.service';
import { TranslateService } from '@ngx-translate/core';
import { CoreService } from 'src/app/core/services/core.service';

export const fighterStoreFileType = 'fighterStore';

@Component({
  selector: 'smitd-fighter-store-page',
  templateUrl: './fighter-store-page.component.html',
  styleUrls: ['./fighter-store-page.component.scss']
})
export class FighterStorePageComponent implements OnDestroy {
  public FighterCardMode = FighterCardMode;
  private _subscriptions = new Subscription();
  public FighterRole = FighterRole;

  constructor(
    public readonly core: CoreService,
    public readonly fighterStore: FighterStoreService,
    public readonly warbandService: WarbandService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public addFighter(): void {
    this._subscriptions.add(
      this.dialog
        .open(FighterDialogComponent, {
          data: { storeDialog: true },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((fighter) => {
          if (fighter) {
            this.fighterStore.storeFighter(fighter);
          }
        })
    );
  }

  public duplicateFighter(fighter: Fighter): void {
    this._subscriptions.add(
      this.dialog
        .open(FighterDialogComponent, {
          data: { storeDialog: true, fighter },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((fighter) => {
          if (fighter) {
            this.fighterStore.storeFighter(fighter);
          }
        })
    );
  }

  public editFighter(fighter: Fighter): void {
    this._subscriptions.add(
      this.dialog
        .open(FighterDialogComponent, {
          data: { fighter, storeDialog: true, edit: true },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((updated) => {
          if (updated) {
            this.fighterStore.updateFighter(updated);
          }
        })
    );
  }

  public importFighterStore(): void {
    this.core.handleFileUpload(
      (result) => {
        const fighters = result.fighterStore as Fighter[];
        fighters.forEach((fighter) => {
          if (!this.fighterStore.checkFighter(fighter, false)) {
            this.fighterStore.storeFighter(fighter, false);
          } else {
            this.fighterStore.updateFighter(fighter);
          }
        });
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            confirmation: true,
            noLabel: this.translateService.instant('common.ok'),
            question: this.translateService.instant('import.success')
          },
          closeOnNavigation: false
        });
        this.core.stopLoader();
      },
      'json',
      fighterStoreFileType
    );
  }

  public exportFighterStore(): void {
    const filename = `fighter-store.json`;
    const jsonStr = JSON.stringify({
      type: 'fighterStore',
      fighterStore: this.fighterStore.store
    });
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  public addFighterAbility(fighter: Fighter, index: number): void {
    this._subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: {},
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((abilityFormValue) => {
          if (abilityFormValue) {
            fighter.abilities ||= [];
            fighter.abilities.push(abilityFormValue);
            fighter.abilities = WarbandService.sortAbilities(fighter.abilities);
            this.fighterStore.updateFighter(fighter);
          }
        })
    );
  }

  public editFighterAbility(
    fighter: Fighter,
    index: number,
    abilityIndex: number
  ): void {
    this._subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: { edit: true, ability: fighter.abilities[abilityIndex] },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((abilityFormValue) => {
          if (abilityFormValue) {
            fighter.abilities[abilityIndex] = abilityFormValue;
            fighter.abilities = WarbandService.sortAbilities(fighter.abilities);
            this.fighterStore.updateFighter(fighter);
          }
        })
    );
  }

  public removeFighterAbility(
    fighter: Fighter,
    index: number,
    abilityIndex: number
  ): void {
    this._subscriptions.add(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            yesColor: 'warn',
            question: this.translateService.instant(
              'warband-page.tab.fighters.form.abilities.remove-question',
              {
                ability: fighter.abilities[abilityIndex].title,
                fighter: fighter.name || fighter.type
              }
            )
          },
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            fighter.abilities.splice(abilityIndex, 1);
            this.fighterStore.updateFighter(fighter);
          }
        })
    );
  }

  public updateAllFighters(): void {
    this.core.startLoader();
    this.fighterStore.factions.forEach((faction) => {
      this.warbandService.warbands.forEach((warband) => {
        if (warband.faction === faction.name) {
          faction.fighterTypes.forEach((fighterType) => {
            warband.fighters.forEach((fighter) => {
              if (fighterType.type === fighter.type) {
                fighter.movement = fighterType.movement;
                fighter.toughness = fighterType.toughness;
                fighter.wounds = fighterType.wounds;
                fighter.runemarks = fighterType.runemarks;
                fighter.weapons = fighterType.weapons;
                fighter.points = fighterType.points;
                fighter.abilities = fighterType.abilities;
              }
            });
          });
        }
      });
    });
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmation: true,
        noLabel: this.translateService.instant('common.ok'),
        question: this.translateService.instant('fighter-store-page.updated')
      },
      closeOnNavigation: false
    });
    this.core.stopLoader();
  }
}
