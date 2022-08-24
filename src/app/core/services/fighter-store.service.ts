import { Injectable } from '@angular/core';
import { Fighter } from '../models/fighter.model';
import { CoreService } from './core.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class FighterStoreService {
  public store: Fighter[];

  constructor(
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog
  ) {
    this.store = JSON.parse(
      CoreService.getLocalStorage(LocalStorageKey.FighterStore, '[]')
    ) as Fighter[];
  }

  public storeFighter(fighter: Fighter, dialog: boolean = true): void {
    if (!this.checkFighter(fighter, dialog)) {
      this.store.push(fighter);
      this.sortStore();
      this.saveFighterStore();
    }
  }

  public discardFighter(
    index: number,
    removeCallBack: () => any = () => {}
  ): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant(
            'fighter-store-service.remove',
            { fighter: this.store[index].type }
          )
        }
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          this.store.splice(index, 1);
          this.saveFighterStore();
          removeCallBack();
        }
      });
  }

  public moveFighter(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.store, event.previousIndex, event.currentIndex);
    this.saveFighterStore();
  }

  private saveFighterStore(): void {
    CoreService.setLocalStorage(
      LocalStorageKey.FighterStore,
      JSON.stringify(this.store)
    );
  }

  public updateFighter(fighter: Fighter, index?: number): void {
    const fighterIndex = index ?? this.getFighterStoreIndex(fighter);
    if (fighterIndex > -1) {
      this.store[fighterIndex] = fighter;
      this.sortStore();
      this.saveFighterStore();
    } else {
      this.store.push(fighter);
      this.sortStore();
      this.saveFighterStore();
    }
  }

  public checkFighter(fighter: Fighter, dialog: boolean = true): boolean {
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
        }
      });
    }
    return check;
  }

  public sortStore(): void {
    this.store.sort((a, b) => (a.type < b.type ? -1 : 1));
  }

  public getFighterStoreIndex(fighter: Fighter): number {
    return this.store.findIndex((check) => fighter.type.toLocaleLowerCase() === check.type.toLocaleLowerCase());
  }
}
