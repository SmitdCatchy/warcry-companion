import { Component, OnDestroy } from '@angular/core';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterStoreService } from 'src/app/core/services/fighter-store.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FighterDialogComponent } from 'src/app/shared/components/fighter-dialog/fighter-dialog.component';
import { Fighter } from 'src/app/core/models/fighter.model';

@Component({
  selector: 'smitd-fighter-store-page',
  templateUrl: './fighter-store-page.component.html',
  styleUrls: ['./fighter-store-page.component.scss']
})
export class FighterStorePageComponent implements OnDestroy {
  public FighterCardMode = FighterCardMode;
  private _subscriptions = new Subscription();

  constructor(
    public readonly fighterStore: FighterStoreService,
    private readonly dialog: MatDialog
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
    const upload: HTMLInputElement = document.createElement('input');
    upload.type = 'file';
    upload.style.display = 'none';
    document.body.appendChild(upload);
    upload.addEventListener('change', () => {
      if ((upload as any).files.length > 0) {
        const reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
          const fighters = JSON.parse((reader as any).result) as Fighter[];
          fighters.forEach((fighter) => {
            this.fighterStore.storeFighter(fighter, false);
          });
        });
        reader.readAsText((upload as any).files[0]);
      }
    });
    upload.click();
    document.body.removeChild(upload);
  }

  public exportFighterStore(): void {
    const filename = `fighter-store.json`;
    const jsonStr = JSON.stringify(this.fighterStore.store);
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
}
