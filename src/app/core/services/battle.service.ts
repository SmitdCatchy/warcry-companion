import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Color } from '../enums/color.enum';
import { Warband } from '../models/warband.model';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  public warband: Warband;

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog
  ) {
    this.warband = {
      name: '',
      faction: '',
      alliance: '',
      color: Color.grey,
      fighters: [],
      abilities: [],
      campaign: {
        name: '',
        limit: 1000,
        reputation: 2,
        glory: 0,
        notes: '',
        logs: []
      }
    };
  }

  public quickBattle(warband?: Warband): void {
    if (warband) {
      this.warband = { ...warband };
    } else {
      this.warband = {
        name: '',
        faction: '',
        alliance: '',
        color: Color.grey,
        fighters: [],
        abilities: [],
        campaign: {
          name: '',
          limit: 1000,
          reputation: 2,
          glory: 0,
          notes: '',
          logs: []
        }
      };
    }
    this.router.navigate(['battle']);
  }
}
