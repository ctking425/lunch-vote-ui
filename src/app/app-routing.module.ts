import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { RoomCreateComponent } from './room-create/room-create.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'room', redirectTo: '/create', pathMatch: 'full' },
  { path: 'room/:id', component: RoomComponent },
  { path: 'create', component: RoomCreateComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
