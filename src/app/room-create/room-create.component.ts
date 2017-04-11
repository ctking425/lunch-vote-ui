import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RoomCreateService } from "../room-create.service";
import { Room } from "../models/room";

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.css']
})
export class RoomCreateComponent implements OnInit {

  constructor(private router: Router, private createService: RoomCreateService) { }

  roomName: string;
  votes: number;
  vetos: number;
  nominations: number;
  showModal: boolean = false;
  roomId: string;
  roomUrl: string;

  ngOnInit() {
  }

  onSubmit() {
    console.log("Submitted");
    let room = new Room(this.roomName, this.votes, this.vetos, this.nominations);
    console.log(room);
    let roomId: string;
    this.createService.createRoom(room).then(id => this.onRoomCreate(id));
  }

  onRoomCreate(roomId: string) {
    console.log("Room ID: "+roomId);
    const location = window.location.href.substring(0, window.location.href.lastIndexOf('/'))
    this.roomId = roomId;
    this.roomUrl = `${location}/room/${roomId}`;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  goToRoom() {
    this.router.navigate(['/room', this.roomId]);
  }

}
