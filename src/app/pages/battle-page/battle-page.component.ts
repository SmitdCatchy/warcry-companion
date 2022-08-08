import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';

@Component({
  selector: 'smitd-battle-page',
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.scss']
})
export class BattlePageComponent implements OnInit {
  constructor(
    private readonly battleService: BattleService,
    private location: Location
  ) {}

  ngOnInit(): void {}

  public get warband(): Warband {
    return this.battleService.warband;
  }

  public back(): void {
    this.location.back();
  }
}
