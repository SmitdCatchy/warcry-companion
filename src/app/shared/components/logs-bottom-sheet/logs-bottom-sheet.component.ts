import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { BattleLog } from 'src/app/core/models/battle-log.model';

@Component({
  selector: 'smitd-logs-bottom-sheet',
  templateUrl: './logs-bottom-sheet.component.html',
  styleUrls: ['./logs-bottom-sheet.component.scss']
})
export class LogsBottomSheetComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      logs: BattleLog[];
    }
  ) {}
}
