import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }, 
  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) }, 
  { path: 'video', loadChildren: () => import('./video/video.module').then(m => m.VideoModule) }, 
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
  { path: 'leaderspeak', loadChildren: () => import('./leaderspeak/leaderspeak.module').then(m => m.LeaderspeakModule) },
  { path: '**',   redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
