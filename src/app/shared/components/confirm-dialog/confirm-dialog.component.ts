import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'smitd-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      question: string;
      yesLabel?: string;
      noLabel?: string;
      yesColor?: string;
      noColor?: string;
      confirmation?: boolean;
      list?: string[]
    }
  ) {}

  public acceptDialog(): void {
    this.dialogRef.close(true);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
