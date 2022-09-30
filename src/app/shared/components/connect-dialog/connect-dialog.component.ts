import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MultiplayerService } from 'src/app/core/services/multiplayer.service';

@Component({
  selector: 'smitd-connect-dialog',
  templateUrl: './connect-dialog.component.html',
  styleUrls: ['./connect-dialog.component.scss']
})
export class ConnectDialogComponent {
  public peerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {},
    public readonly multiplayerService: MultiplayerService
  ) {
    this.peerForm = new FormGroup({
      sessionToken: new FormControl('', [Validators.required])
    });
  }

  public get sessionToken(): string {
    return this.peerForm.get('sessionToken')?.value;
  }

  public acceptDialog(): void {
    this.multiplayerService.connectPeer(this.sessionToken, () => {
      this.dialogRef.close(true);
    })
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
