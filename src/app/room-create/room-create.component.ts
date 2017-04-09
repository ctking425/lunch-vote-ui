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

  ngOnInit() {
  }

}
