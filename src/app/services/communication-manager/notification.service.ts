import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../feathers/feathers.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationService {
	public _socket;
	private _rest;
	public listner;
	constructor(private _socketService: SocketService, private _restService: RestService) {
		this._rest = _restService.getService('notification');
		this._socket = _socketService.getService('notification');
		this._socket.timeout = 30000;
		// this.listner = Observable.fromEvent(this._socket, 'remove');
		this._socket.on('created', function(notification) {});
	}
	find(query: any) {
		return this._socket.find(query);
	}

	findAll(query: any) {
		return this._socket.find(query);
	}
	get(id: string, query: any) {
		return this._socket.get(id, query);
	}

	create(notification: any) {
		return this._socket.create(notification);
	}

	delete(id: string, query: any) {
		return this._socket.remove(id, query);
	}
}

export interface Notification {
	_id?: string;
	facilityId: string;
	isRead: boolean;
	title: string;
	description: string;
	receiverId: string;
	senderId: string;
}
