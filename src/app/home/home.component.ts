import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showModal: boolean = false;
  roomCode: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  openRoomModal() {
    this.showModal = true;
  }

  closeRoomModal() {
    this.showModal = false;
  }

  goToRoom() {
    this.router.navigate(['/room', this.roomCode]);
  }

}
