import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from "../environments/environment";
import { Room } from "./models/room";
import { User } from "./models/user";

@Injectable()
export class RoomService {

  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  private baseUrl = environment.baseUrl;

  constructor(private http: Http) { }

  createRoom(room: Room): Promise<string> {
    const url = `${this.baseUrl}/room`;
    return this.http.post(url, JSON.stringify(room), {headers: this.headers})
      .toPromise().then(resp => resp.json().roomId)
      .catch(this.handleError);
  }

  joinRoom(roomId: string) {
    const url = `${this.baseUrl}/room/${roomId}/join`;
    return this.http.get(url, {headers: this.headers})
      .toPromise().then(resp => resp.json() as User)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}