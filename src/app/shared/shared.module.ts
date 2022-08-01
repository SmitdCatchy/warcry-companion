import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from '../material/material.module';

const declarationsAndExports = [HeaderComponent, FooterComponent];
const importsAndExports = [MaterialModule];

@NgModule({
  declarations: [...declarationsAndExports],
  imports: [...importsAndExports, CommonModule],
  exports: [...declarationsAndExports, ...importsAndExports]
})
export class SharedModule {}
