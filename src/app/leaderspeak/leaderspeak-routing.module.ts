import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderspeakComponent } from './leaderspeak.component';

const routes: Routes = [{ path: '', component: LeaderspeakComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderspeakRoutingModule { }
