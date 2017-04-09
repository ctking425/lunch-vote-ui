import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomComponent } from './room/room.component';
import { HomeComponent } from './home/home.component';
import { RoomCreateService } from "./room-create.service";

@NgModule({
  declarations: [
    AppComponent,
    RoomCreateComponent,
    RoomComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [RoomCreateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
