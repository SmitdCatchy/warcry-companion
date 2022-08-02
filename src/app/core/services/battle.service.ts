import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog
  ) {}

  public quickBattle(): void {
    this.router.navigate(['battle']);
  }
}
