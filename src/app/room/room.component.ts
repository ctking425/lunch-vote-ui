import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Rx";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { Room } from "../models/room";
import { Votable } from "../models/votable";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  private roomSubject: WebSocketSubject<MessageEvent>;
  private timerSubject: WebSocketSubject<MessageEvent>;
  private roomId: string;

  room: Room;
  currentVotes: number;
  currentVetos: number;
  currentNominations: number;
  timer: string = 'Not Started';

  constructor(private route: ActivatedRoute, private router: Router) { }

  processMessage = function(msg: MessageEvent) {
    switch (msg.type) {
      case "ROOM_INIT":
        this.room = msg.data as Room;
        this.currentVotes = this.room.maxVotes;
        this.currentVetos = this.room.maxVetos;
        this.currentNominations = this.room.maxNominations;
        break;
    
      default:
        break;
    }
  }

  nominate = function(nomination: Votable) {
    console.log(nomination);
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.roomId = params['id'];

      console.log(this.roomId);
      this.roomSubject = Observable.webSocket(`ws://localhost:8080/lunch-vote/socket/room/${this.roomId}`);
      this.roomSubject.subscribe(
        (msg) => this.processMessage(msg),
        (err) => console.log(err),
        () => console.log('complete')
      );

      this.timerSubject = Observable.webSocket(`ws://localhost:8080/lunch-vote/socket/timer/${this.roomId}`);
      this.timerSubject.subscribe(
        (msg) => this.timer = msg.data,
        (err) => console.log(err),
        () => console.log('complete')
      );
    });
  }

  ngOnDestroy() {
    this.roomSubject.unsubscribe();
    this.timerSubject.unsubscribe();
  }

}
