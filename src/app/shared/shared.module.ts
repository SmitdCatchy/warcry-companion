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
import { FighterCardComponent } from './components/fighter-card/fighter-card.component';
import { FighterDialogComponent } from './components/fighter-dialog/fighter-dialog.component';
import { AbilityFormComponent } from './components/ability-form/ability-form.component';
import { AbilityDialogComponent } from './components/ability-dialog/ability-dialog.component';
import { AbilityCardComponent } from './components/ability-card/ability-card.component';
import { IconUploaderComponent } from './components/icon-uploader/icon-uploader.component';
import { AbilitiesBottomSheetComponent } from './components/abilities-bottom-sheet/abilities-bottom-sheet.component';
import { BattleDialogComponent } from './components/battle-dialog/battle-dialog.component';
import { BattleEndDialogComponent } from './components/battle-end-dialog/battle-end-dialog.component';
import { LogsBottomSheetComponent } from './components/logs-bottom-sheet/logs-bottom-sheet.component';
import { ModifierCardComponent } from './components/modifier-card/modifier-card.component';
import { ModifierDialogComponent } from './components/modifier-dialog/modifier-dialog.component';
import { DividerExpansionComponent } from './components/divider-expansion/divider-expansion.component';
import { FighterStoreDialogComponent } from './components/fighter-store-dialog/fighter-store-dialog.component';
import { ConnectDialogComponent } from './components/connect-dialog/connect-dialog.component';
import { FighterPrintCardComponent } from './components/fighter-print-card/fighter-print-card.component';

const declarationsAndExports = [
  HeaderComponent,
  FooterComponent,
  ConfirmDialogComponent,
  WarbandDialogComponent,
  WarbandColorDirective,
  FighterCardComponent,
  FighterDialogComponent,
  AbilityFormComponent,
  AbilityDialogComponent,
  AbilityCardComponent,
  IconUploaderComponent,
  AbilitiesBottomSheetComponent,
  BattleDialogComponent,
  BattleEndDialogComponent,
  LogsBottomSheetComponent,
  ModifierCardComponent,
  ModifierDialogComponent,
  DividerExpansionComponent,
  FighterStoreDialogComponent,
  ConnectDialogComponent,
  FighterPrintCardComponent
];
const importsAndExports = [MaterialModule];

@NgModule({
  declarations: [...declarationsAndExports],
  imports: [
    ...importsAndExports,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [...declarationsAndExports, ...importsAndExports]
})
export class SharedModule {}
