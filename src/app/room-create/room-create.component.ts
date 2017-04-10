import { Component, OnInit } from '@angular/core';
import { RoomCreateService } from "../room-create.service";
import { Room } from "../models/room";

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.css']
})
export class RoomCreateComponent implements OnInit {

  constructor(private createService: RoomCreateService) { }

  roomName: string;
  votes: number;
  vetos: number;
  nominations: number;

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
  }

}
