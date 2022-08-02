import { Component, OnInit } from '@angular/core';
import { Warband } from 'src/app/core/models/warband.model';
import { WarbandService } from 'src/app/core/services/warband.service';

@Component({
  selector: 'smitd-warband-page',
  templateUrl: './warband-page.component.html',
  styleUrls: ['./warband-page.component.scss']
})
export class WarbandPageComponent implements OnInit {

  constructor(private readonly warbandService: WarbandService) { }

  ngOnInit(): void {
  }

  public get warband(): Warband {
    return this.warbandService.selectedWarband
  }
}
