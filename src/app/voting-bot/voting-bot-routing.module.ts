import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotingBotComponent } from './voting-bot.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: VotingBotComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotingBotRoutingModule {}
