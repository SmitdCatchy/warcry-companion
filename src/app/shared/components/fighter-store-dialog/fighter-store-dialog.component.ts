import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FighterStoreService } from 'src/app/core/services/fighter-store.service';
import cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'smitd-fighter-store-dialog',
  templateUrl: './fighter-store-dialog.component.html',
  styleUrls: ['./fighter-store-dialog.component.scss']
})
export class FighterStoreDialogComponent {
  public storeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FighterStoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {},
    public readonly fighterStore: FighterStoreService
  ) {
    this.storeForm = new FormGroup({
      fighter: new FormControl('', [Validators.required])
    });
  }

  public acceptDialog(): void {
    this.dialogRef.close(cloneDeep(this.storeForm.value.fighter));
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
