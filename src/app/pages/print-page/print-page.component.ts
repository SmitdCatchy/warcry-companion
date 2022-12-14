import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterState } from '@angular/router';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { Ability } from 'src/app/core/models/ability.model';
import { FighterReference } from 'src/app/core/models/fighter-reference.model';
import { Fighter } from 'src/app/core/models/fighter.model';
import { BattleService } from 'src/app/core/services/battle.service';
import { CoreService } from 'src/app/core/services/core.service';
import { WarbandService } from 'src/app/core/services/warband.service';

@Component({
  selector: 'smitd-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {
  FighterCardMode = FighterCardMode;
  FighterRole = FighterRole;

  constructor(
    readonly core: CoreService,
    private readonly _warbandService: WarbandService,
    private readonly _battleService: BattleService,
    private readonly _route: ActivatedRoute
  ) {}

  get printGroups(): boolean {
    return (this._route.data as any).value.groups;
  }

  get fighters(): Fighter[] {
    return this._warbandService.selectedWarband?.fighters ?? [];
  }

  get hammer(): FighterReference[] {
    return this._battleService.battle?.hammer ?? [];
  }

  get shield(): FighterReference[] {
    return this._battleService.battle?.shield ?? [];
  }

  get dagger(): FighterReference[] {
    return this._battleService.battle?.dagger ?? [];
  }

  get warbandName(): string | undefined {
    return this._warbandService.selectedWarband?.name.toUpperCase();
  }

  get warbandFaction(): string | undefined {
    return this._warbandService.selectedWarband?.faction.toUpperCase();
  }

  get abilities(): Ability[] {
    return this._warbandService.selectedWarband?.abilities ?? [];
  }

  ngOnInit(): void {}

  print(): void {
    window.print();
  }

  toggleVisibility(event: any): void {
    const element: HTMLElement = event.path.find(
      (element: any) =>
        element.localName === 'smitd-ability-card' ||
        element.localName === 'smitd-fighter-print-card' ||
        (element.classList ? element.classList[0] : undefined) === 'divider' ||
        (element.classList ? element.classList[0] : undefined) ===
          'page-break' ||
        element.localName === 'h1' ||
        element.localName === 'h2'
    );

    if (element) {
      element.classList.toggle('hide');
    }
  }
}
