import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattlePageComponent } from './pages/battle-page/battle-page.component';
import { BattlegroundsPageComponent } from './pages/battlegrounds-page/battlegrounds-page.component';
import { FighterStorePageComponent } from './pages/fighter-store-page/fighter-store-page.component';
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
    path: 'battlegrounds',
    component: BattlegroundsPageComponent,
    data: { animation: 'battlegrounds' }
  },
  {
    path: 'battle',
    component: BattlePageComponent,
    data: { animation: 'battle' }
  },
  {
    path: 'fighter-store',
    component: FighterStorePageComponent,
    data: { animation: 'fighter-store' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
