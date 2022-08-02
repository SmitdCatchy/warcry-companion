import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Warband } from 'src/app/core/models/warband.model';
import { WarbandService } from 'src/app/core/services/warband.service';

@Component({
  selector: 'smitd-battle-page',
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.scss']
})
export class BattlePageComponent implements OnInit {
  constructor(
    private readonly warbandService: WarbandService,
    private location: Location
  ) {}

  ngOnInit(): void {}

  public get warband(): Warband {
    return this.warbandService.selectedWarband;
  }

  public back(): void {
    this.location.back();
  }
}
