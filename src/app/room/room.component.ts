import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { trigger, state, style, animate, transition, group, keyframes } from "@angular/animations";
import { Observable } from "rxjs/Rx";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { environment } from "../../environments/environment";
import { RoomService } from "../room.service";
import { Room } from "../models/room";
import { User } from "../models/user";
import { Votable } from "../models/votable";
import { Message } from "../models/message";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  animations: [
    trigger('flipIn', [
      transition(':enter', [
        animate(800, keyframes([
          style({opacity: 0, transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', offset: 0}),
          style({transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', offset: 0.4}),
          style({opacity: 1, transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)',  offset: 0.6}),
          style({opacity: 1, transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)',  offset: 0.8}),
          style({opacity: 1, transform: 'perspective(400px) rotate3d(1, 0, 0, 0)',  offset: 1.0})
        ]))
      ]),
      transition(':leave', [
        animate(600, keyframes([
          style({opacity: 1, offset: 0}),
          style({opacity: 0, transform: 'scale3d(.3, .3, .3)', offset: 0.5}),
          style({opacity: 0,  offset: 1.0})
        ]))
      ])
    ]),
    trigger('pulse', [
      transition('* => *', [
        animate(200, keyframes([
          style({transform: 'scale3d(1, 1, 1)', offset: 0}),
          style({transform: 'scale3d(1.3, 1.3, 1.3)', offset: 0.5}),
          style({transform: 'scale3d(1, 1, 1)',  offset: 1.0})
        ]))
      ])
    ]),
    trigger('lightSpeed', [
      transition(':enter', [
        group([
          animate(300, keyframes([
            style({opacity: 0, transform: 'translate3d(100%, 0, 0) skewX(-30deg)', offset: 0}),
            style({opacity: 1, transform: 'skewX(20deg)', offset: 0.6}),
            style({opacity: 1, transform: 'skewX(-5deg)', offset: 0.8}),
            style({opacity: 1, transform: 'none', offset: 1.0})
          ]))
        ])
      ])
    ])
  ]
})
export class RoomComponent implements OnInit {

  private baseSocket: string = environment.baseWebsocketUrl;

  private roomSubject: WebSocketSubject<any>;
  private timerSubject: WebSocketSubject<MessageEvent>;
  private roomId: string;

  room: Room;
  currentVotes: number;
  currentVetos: number;
  currentNominations: number;
  timer: string = 'LOADING';
  showModal: boolean = false;
  votingPeriod: boolean = false;
  resultsReady: boolean = false;
  nomName: string;
  nomDesc: string;
  errorOccured: boolean = false;
  errorMsg: string;
  errorCode: number;
  sorted: Array<Votable> = [];
  sortedReady: Array<Votable> = [];

  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService) { }

  @HostListener('window:keyup', ['$event'])
  keyboardShortcut(event: any) {
    if(!this.showModal) {
      event.preventDefault();
      event.stopPropagation();
      switch(event.keyCode) {
        case 78:
          this.showModalFn();
          break;
        default:
          break;
      }
    }
  }

  processMessage = function(msg: MessageEvent) {
    switch (msg.type) {
      case "ROOM_INIT":
        this.room = new Room(
          msg.data.id,
          msg.data.name,
          msg.data.maxVotes,
          msg.data.maxVetos,
          msg.data.maxNominations,
          msg.data.readyTime,
          msg.data.nominationTime,
          msg.data.votingTime,
          msg.data.roomState,
          msg.data.votables
        );
        if(msg.data.roomState == 'Complete') {
          this.showResults();
        }
        break;
      case "NOMINATION":
        this.room.addVotable(msg.data as Votable);
        break;
      case "VOTE":
        this.room.vote(msg.data);
        break;
      case "VETO":
        this.room.veto(msg.data);
        break;
      case "ROOM_STATE":
        this.room.roomState = msg.data;
        if(msg.data == 'Complete') {
          this.showResults();
        }
        break;
      default:
        break;
    }
  }

  vote(id: string) {
    if(this.currentVotes > 0) {
      this.currentVotes--;
      let message = new Message("VOTE", id);
      this.roomSubject.next(JSON.stringify(message));
    }
  }

  veto(id: string) {
    if(this.currentVetos > 0) {
      this.currentVetos--;
      let message = new Message("VETO", id);
      this.roomSubject.next(JSON.stringify(message));
    }
  }

  onSubmit() {
    if(this.currentNominations > 0) {
      this.currentNominations--;
      this.closeModal();
      let message = new Message("NOMINATION", new Votable("", this.nomName , this.nomDesc, 0, 0));
      this.roomSubject.next(JSON.stringify(message));
    }
  }

  showModalFn() {
    if(!this.showModal && this.room.roomState == 'Nominations' && this.currentNominations > 0) {
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
  }

  showResults() {

    //Need to do a proper clone here. It's passing the ref.
    this.sorted = this.room.votables.slice();
    this.sorted.sort((v1,v2) => (v2.votes-(2*v2.vetos)) - (v1.votes-(2*v1.vetos)));

    setTimeout(() => {
      this.room.votables = [];
      setTimeout(() => {
        this.resultsReady = true;
        this.loopAdd(0);
      }, 1000);
    }, 800);   
  }

  loopAdd(index: number) {
    setTimeout(() => {
      this.sortedReady.push(this.sorted[index]);
      if(index < this.sorted.length-1) {
        this.loopAdd(++index);
      }
    }, 800);
  }

  setupRoom(user: User) {
    this.currentNominations = user.nominations;
    this.currentVotes = user.votes;
    this.currentVetos = user.vetos;

    if(environment.production) {
      this.baseSocket = `ws://${window.location.hostname}:${window.location.port}${this.baseSocket}`;
    }

    //Setup the websocket for the room communication
    this.roomSubject = Observable.webSocket(`${this.baseSocket}/room/${this.roomId}?key=${user.id}`);
    this.roomSubject.subscribe(
      (msg) => this.processMessage(msg)
    );

    //Setup the websocket for the countdown syncing
    this.timerSubject = Observable.webSocket(`${this.baseSocket}/timer/${this.roomId}`);
    this.timerSubject.subscribe(
      (msg) => this.timer = msg.data
    );
  }

  private handleError(reason: any) {
    switch(reason.status) {
      case 404:
        this.errorCode = 404;
        this.errorMsg = "ROOM NOT FOUND";
        this.errorOccured = true;
        break;
      default:
        this.errorCode = reason.status;
        this.errorMsg = reason.json().message;
        this.errorOccured = true;
        break;
    }
  }

  ngOnInit() {
    //On load we need to get the room id from the url path parameter
    this.route.params.subscribe(params => {
      this.roomId = params['id'];

      if(this.roomId == null || this.roomId == '') {
        let error = new Object({'status':404});
        this.handleError(error);
      } else {
        this.roomService.joinRoom(this.roomId).then(user => this.setupRoom(user))
          .catch(reason => this.handleError(reason));
      }
    });
  }

  ngOnDestroy() {
    if(this.roomSubject) this.roomSubject.unsubscribe();
    if(this.timerSubject) this.timerSubject.unsubscribe();
  }

}
