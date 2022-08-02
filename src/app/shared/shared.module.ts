import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from '../material/material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { WarbandDialogComponent } from './components/warband-dialog/warband-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WarbandColorDirective } from './directives/warband-color.directive';

const declarationsAndExports = [HeaderComponent, FooterComponent, ConfirmDialogComponent, WarbandDialogComponent, WarbandColorDirective];
const importsAndExports = [MaterialModule];

@NgModule({
  declarations: [...declarationsAndExports],
  imports: [...importsAndExports, CommonModule, TranslateModule, ReactiveFormsModule],
  exports: [...declarationsAndExports, ...importsAndExports]
})
export class SharedModule {}
