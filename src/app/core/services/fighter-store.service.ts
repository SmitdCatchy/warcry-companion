import { Injectable } from '@angular/core';
import { Fighter } from '../models/fighter.model';
import { CoreService } from './core.service';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageKey, StoreKey } from '../enums/local-keys.enum';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Faction } from '../models/faction.model';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash.clonedeep';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FighterStoreService {
  store: Fighter[];
  private _factions!: Map<string, Faction>;
  loaded: boolean = false;

  constructor(
    private readonly core: CoreService,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog
  ) {
    this.store = JSON.parse(
      CoreService.getLocalStorage(LocalStorageKey.FighterStore, '[]')
    ) as Fighter[];
    this.core.getStore(StoreKey.FighterStore).subscribe((store: Fighter[]) => {
      this.store = store;
      this.loaded = true;
      this.createFactions(this.store);
    });
  }

  storeFighter(fighter: Fighter, dialog: boolean = true): void {
    if (!this.checkFighter(fighter, dialog)) {
      this.store.push(fighter);
      this.sortStore();
      this.addFighterToFaction(fighter);
      this.saveFighterStore();
    }
  }

  discardFighter(
    fighter: Fighter,
    removeCallBack: () => any = () => {}
  ): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant(
            'fighter-store-service.remove',
            { fighter: fighter.type }
          )
        },
        closeOnNavigation: false
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          const fighterIndex = this.getFighterStoreIndex(fighter);
          const deleted = this.store.splice(fighterIndex, 1);
          this.removeFighterFromFaction(deleted[0]);
          this.saveFighterStore();
          removeCallBack();
        }
      });
  }

  moveFighter(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.store, event.previousIndex, event.currentIndex);
    this.saveFighterStore();
  }

  private saveFighterStore(): void {
    this.core.setStore({
      name: StoreKey.FighterStore,
      data: this.store
    });
  }

  updateFighter(fighter: Fighter): void {
    const fighterIndex = this.getFighterStoreIndex(fighter);
    if (fighterIndex > -1) {
      this.store[fighterIndex] = fighter;
      this.updateFighterFromFaction(fighter);
      this.saveFighterStore();
    } else {
      this.store.push(fighter);
      this.addFighterToFaction(fighter);
      this.sortStore();
      this.saveFighterStore();
    }
  }

  checkFighter(fighter: Fighter, dialog: boolean = true): boolean {
    const check = -1 < this.getFighterStoreIndex(fighter);

    if (check && dialog) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          confirmation: true,
          noLabel: 'common.ok',
          question: this.translateService.instant(
            'fighter-store-service.exists',
            { fighter: fighter.type }
          )
        },
        closeOnNavigation: false
      });
    }
    return check;
  }

  sortStore(): void {
    this.store.sort((a, b) => (a.type < b.type ? -1 : 1));
  }

  sortFactions(): void {
    this._factions = new Map(
      [...this._factions.entries()].sort((a, b) =>
        a[0].toLocaleLowerCase() < b[0].toLocaleLowerCase() ? -1 : 1
      )
    );
  }

  getFighterStoreIndex(fighter: Fighter): number {
    return this.store.findIndex(
      (check) =>
        fighter.type.toLocaleLowerCase() === check.type.toLocaleLowerCase()
    );
  }

  createFactions(store: Fighter[]): void {
    this._factions = new Map();
    store.forEach((fighter) => {
      this.addFighterToFaction(fighter, false);
    });
    this.sortFactions();
  }

  addFighterToFaction(fighter: Fighter, sort: boolean = true): void {
    const factionName =
      fighter.faction || this.translateService.instant('common.unaligned');
    if (this._factions.has(factionName)) {
      const faction = this._factions.get(factionName)!;
      faction.fighterTypes.push(fighter);
      faction.fighterTypes.sort((a, b) => (a.type < b.type ? -1 : 1));
      this.store.sort((a, b) => (a.type < b.type ? -1 : 1));
    } else {
      this._factions.set(factionName, {
        name: factionName,
        fighterTypes: [fighter],
        alliance: factionName
      });
    }
    if (sort) {
      this.sortFactions();
    }
  }

  removeFighterFromFaction(fighter: Fighter): void {
    const factionName =
      fighter.faction || this.translateService.instant('common.unaligned');
    const faction = this._factions.get(factionName)!;

    const fighterIndex = faction.fighterTypes.findIndex(
      (check) => check.type === fighter.type
    );
    faction.fighterTypes.splice(fighterIndex, 1);
    if (!faction.fighterTypes.length) {
      this._factions.delete(factionName);
    }
  }

  updateFighterFromFaction(fighter: Fighter): void {
    const factionName =
      fighter.faction || this.translateService.instant('common.unaligned');
    const faction = this._factions.get(factionName)!;
    const fighterIndex = faction.fighterTypes.findIndex(
      (check) => check.type === fighter.type
    );
    faction.fighterTypes[fighterIndex] = fighter;
  }

  get factions(): Faction[] {
    return Array.from(this._factions.values());
  }
}
