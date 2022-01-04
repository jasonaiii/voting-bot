import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';
import { VotingBotRoutingModule } from './voting-bot-routing.module';
import { VotingBotComponent } from './voting-bot.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [VotingBotComponent],
  imports: [
    CommonModule,
    VotingBotRoutingModule,
    NgChartsModule,
    MatToolbarModule,
    MatSliderModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
  ],
  exports: [VotingBotComponent],
})
export class VotingBotModule {}
