import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash.clonedeep';
import { Runemark } from 'src/app/core/models/runemark.model';
import { CoreService } from 'src/app/core/services/core.service';
import { RunemarksService } from 'src/app/core/services/runemarks.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

export const runemarksFileType = 'runemarks';

@Component({
  selector: 'smitd-utility-page',
  templateUrl: './utility-page.component.html',
  styleUrls: ['./utility-page.component.scss']
})
export class UtilityPageComponent implements OnInit {
  newRunemark: Runemark;

  constructor(
    public readonly core: CoreService,
    private readonly _runemarksService: RunemarksService,
    private readonly _dialog: MatDialog,
    private readonly _translateService: TranslateService
  ) {
    this.newRunemark = {
      key: '',
      icon: ''
    };
  }

  ngOnInit(): void {}

  get runemarks(): Runemark[] {
    return this._runemarksService.runemarks;
  }

  iconValueChange(icon: string, index: number): void {
    const updatedRunemark = cloneDeep(this.runemarks[index]);
    updatedRunemark.icon = icon;
    this.updateRunemark(updatedRunemark, index);
  }

  updateRunemark(updated: Runemark, index: number): void {
    this._runemarksService.updateRunemark(updated, index);
  }

  newIconValueChange(icon: string): void {
    this.newRunemark.icon = icon;
  }

  addRunemark(): void {
    this._runemarksService.addRunemark(this.newRunemark);
    this.newRunemark = {
      key: '',
      icon: ''
    };
  }

  removeRunemark(index: number): void {
    this._runemarksService.removeRunemark(index);
  }

  importRunemarks(): void {
    this.core.handleFileUpload(
      (result) => {
        const runemarks = result.runemarks as Runemark[];
        this._runemarksService.addRunemarks(runemarks);
        this._dialog.open(ConfirmDialogComponent, {
          data: {
            confirmation: true,
            noLabel: this._translateService.instant('common.ok'),
            question: this._translateService.instant('import.success')
          },
          closeOnNavigation: false
        });
      },
      'json',
      runemarksFileType
    );
  }

  exportRunemarks(): void {
    const filename = `runemarks.json`;
    const jsonStr = JSON.stringify({
      type: runemarksFileType,
      runemarks: this.runemarks
    });
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
