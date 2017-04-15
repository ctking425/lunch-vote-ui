import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from "../environments/environment";
import { Room } from "./models/room";

@Injectable()
export class RoomCreateService {

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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}