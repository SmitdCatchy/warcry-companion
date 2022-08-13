import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Ability } from 'src/app/core/models/ability.model';

@Component({
  selector: 'smitd-abilities-bottom-sheet',
  templateUrl: './abilities-bottom-sheet.component.html',
  styleUrls: ['./abilities-bottom-sheet.component.scss']
})
export class AbilitiesBottomSheetComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      abilityGroups: {label: string, abilities: Ability[]}[];
      showRunemarks: boolean;
    }
  ) {}
}
