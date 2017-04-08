import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  private subject: WebSocketSubject<MessageEvent>;

  constructor() { }

  ngOnInit() {
    this.subject = Observable.webSocket('ws://localhost:8080/lunch-vote/socket/room');
    this.subject.subscribe(
      (msg) => console.log('message received: ' + msg.data),
      (err) => console.log(err),
      () => console.log('complete')
    );
  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }

}
