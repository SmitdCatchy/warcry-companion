import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattlePageComponent } from './pages/battle-page/battle-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { WarbandPageComponent } from './pages/warband-page/warband-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    data: { animation: 'menu' }
  },
  {
    path: 'warband',
    component: WarbandPageComponent,
    data: { animation: 'warband' }
  },
  {
    path: 'battle',
    component: BattlePageComponent,
    data: { animation: 'battle' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
