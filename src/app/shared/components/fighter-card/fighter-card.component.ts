import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from 'src/app/core/enums/color.enum';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { FighterState } from 'src/app/core/enums/fighter-state.enum';
import { FighterReference } from 'src/app/core/models/fighter-reference.model';
import { Fighter } from 'src/app/core/models/fighter.model';
import { CoreService } from 'src/app/core/services/core.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'smitd-fighter-card',
  templateUrl: './fighter-card.component.html',
  styleUrls: ['./fighter-card.component.scss']
})
export class FighterCardComponent {
  @Input('fighter') fighter: Fighter;
  @Input('fighterReference') fighterReference: FighterReference;
  @Input('mode') mode: string;
  public Color = Color;
  public FighterRole = FighterRole;
  public FighterCardMode = FighterCardMode;
  public FighterState = FighterState;
  @Output() callAbilities: EventEmitter<null>;
  @Output() woundChange: EventEmitter<number>;

  constructor(public readonly core: CoreService) {
    this.fighter = {
      role: FighterRole.Thrall,
      type: 'Error Thrall',
      movement: 1,
      toughness: 1,
      wounds: 2,
      runemarks: ['Minion'],
      weapons: [
        {
          range: 1,
          attacks: 1,
          strength: 2,
          damage: 1,
          crit: 2,
          type: 'Claws'
        }
      ],
      points: 100,
      name: '',
      modifiers: [],
      note: ''
    };
    this.fighterReference = {
      fighterIndex: -1,
      state: FighterState.Activated,
      wounds: 0,
      stats: this.fighter,
      modifiers: {
        weapons: [
          {
            attacks: 0,
            strength: 0,
            damage: 0,
            crit: 0
          },
          {
            attacks: 0,
            strength: 0,
            damage: 0,
            crit: 0
          }
        ],
        movement: 0,
        toughness: 0,
        wounds: 0
      },
      artefacts: [],
      injuries: []
    };
    this.mode = 'roster';
    this.callAbilities = new EventEmitter();
    this.woundChange = new EventEmitter();
  }

  public get headerColor(): Observable<any> {
    return this.core.color.pipe()
  }

  public get deadColor(): string| undefined {
    return this.fighterReference.state === FighterState.Dead ? this.core.getTheme() === 'dark' ? '#222222' : '#cccccc': undefined;
  }
}
