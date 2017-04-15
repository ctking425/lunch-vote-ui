import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RoomService } from "../room.service";
import { Room } from "../models/room";

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.css']
})
export class RoomCreateComponent implements OnInit {

  constructor(private router: Router, private roomService: RoomService) { }

  roomName: string;
  votes: number;
  vetos: number;
  nominations: number;
  readyTime: number;
  nominationTime: number;
  votingTime: number;
  showModal: boolean = false;
  roomId: string;
  roomUrl: string;

  ngOnInit() {
  }

  onSubmit() {
    let room = new Room("", this.roomName, this.votes, this.vetos, this.nominations, this.readyTime, this.nominationTime, this.votingTime);
    let roomId: string;
    this.roomService.createRoom(room).then(id => this.onRoomCreate(id));
  }

  onRoomCreate(roomId: string) {
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
