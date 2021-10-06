import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { VideoComponent } from './video.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VideoComponent
  ],
  imports: [
    CommonModule,
    VideoRoutingModule,
    FormsModule,
    PickerModule
  ]
})
export class VideoModule { }
