import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Rx";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { Room } from "../models/room";
import { Votable } from "../models/votable";
import { Message } from "../models/message";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  private roomSubject: WebSocketSubject<any>;
  private timerSubject: WebSocketSubject<MessageEvent>;
  private roomId: string;

  room: Room;
  currentVotes: number;
  currentVetos: number;
  currentNominations: number;
  timer: string = 'Not Started';
  showModal: boolean = false;
  votingPeriod: boolean = false;

  nomName: string;
  nomDesc: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  processMessage = function(msg: MessageEvent) {
    console.log(msg.data);
    switch (msg.type) {
      case "ROOM_INIT":
        this.room = new Room(
          msg.data.id, 
          msg.data.name, 
          msg.data.maxVotes, 
          msg.data.maxVetos, 
          msg.data.maxNominations, 
          msg.data.roomState, 
          msg.data.users, 
          msg.data.votables
        );
        console.log(this.room);
        this.currentVotes = this.room.maxVotes;
        this.currentVetos = this.room.maxVetos;
        this.currentNominations = this.room.maxNominations;
        break;
      case "NOMINATION":
        console.log(this.room);
        this.room.addVotable(msg.data as Votable);
        console.log(this.room);
        break;
      case "VOTE":
        this.room.vote(msg.data);
        break;
      case "ROOM_STATE":
        this.room.roomState = msg.data;
      default:
        break;
    }
  }

  vote(id: string) {
    console.log("voted for: "+id);
    let message = new Message("VOTE", id);
    this.roomSubject.next(JSON.stringify(message));
  }

  onSubmit() {
    console.log(this.nomName+" "+this.nomDesc);
    this.closeModal();
    let message = new Message("NOMINATION", new Votable("", this.nomName , this.nomDesc, 0, 0));
    this.roomSubject.next(JSON.stringify(message));
  }

  closeModal() {
    this.showModal = false;
  }

  ngOnInit() {
    //On load we need to get the room id from the url path parameter
    this.route.params.subscribe(params => {
      this.roomId = params['id'];

      //Setup the websocket for the room communication
      //TODO - Need to make this url relative for PROD
      this.roomSubject = Observable.webSocket(`ws://localhost:8080/lunch-vote/socket/room/${this.roomId}`);
      this.roomSubject.subscribe(
        (msg) => this.processMessage(msg),
        (err) => console.log(err),
        () => console.log('complete')
      );

      //Setup the websocket for the countdown syncing
      //TODO - Need to make this url relative for PROD
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
