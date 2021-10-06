import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderspeakRoutingModule } from './leaderspeak-routing.module';
import { LeaderspeakComponent } from './leaderspeak.component';


@NgModule({
  declarations: [
    LeaderspeakComponent
  ],
  imports: [
    CommonModule,
    LeaderspeakRoutingModule
  ]
})
export class LeaderspeakModule { }
