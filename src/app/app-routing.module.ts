import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogGuard } from './core/guards/dialog.guard';
import { BattlePageComponent } from './pages/battle-page/battle-page.component';
import { BattlegroundsPageComponent } from './pages/battlegrounds-page/battlegrounds-page.component';
import { FighterStorePageComponent } from './pages/fighter-store-page/fighter-store-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PrintPageComponent } from './pages/print-page/print-page.component';
import { UtilityPageComponent } from './pages/utility-page/utility-page.component';
import { WarbandPageComponent } from './pages/warband-page/warband-page.component';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [DialogGuard],
    component: MainPageComponent,
    data: { animation: 'menu' }
  },
  {
    path: 'warband',
    canDeactivate: [DialogGuard],
    component: WarbandPageComponent,
    data: { animation: 'warband', tab: 'fighters' }
  },
  {
    path: 'warband/fighters',
    canDeactivate: [DialogGuard],
    component: WarbandPageComponent,
    data: { animation: 'warband', tab: 'fighters' }
  },
  {
    path: 'warband/record',
    canDeactivate: [DialogGuard],
    component: WarbandPageComponent,
    data: { animation: 'warband', tab: 'record' }
  },
  {
    path: 'warband/campaign',
    canDeactivate: [DialogGuard],
    component: WarbandPageComponent,
    data: { animation: 'warband', tab: 'campaign' }
  },
  {
    path: 'battlegrounds',
    canDeactivate: [DialogGuard],
    component: BattlegroundsPageComponent,
    data: { animation: 'battlegrounds' }
  },
  {
    path: 'battle',
    canDeactivate: [DialogGuard],
    component: BattlePageComponent,
    data: { animation: 'battle' }
  },
  {
    path: 'fighter-store',
    canDeactivate: [DialogGuard],
    component: FighterStorePageComponent,
    data: { animation: 'fighter-store' }
  },
  {
    path: 'runemarks',
    canDeactivate: [DialogGuard],
    component: UtilityPageComponent,
    data: { animation: 'runemarks' }
  },
  {
    path: 'print',
    canDeactivate: [DialogGuard],
    component: PrintPageComponent,
    data: { animation: 'print' }
  },
  {
    path: 'print-groups',
    canDeactivate: [DialogGuard],
    component: PrintPageComponent,
    data: { animation: 'print', groups: true }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
