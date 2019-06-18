import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');
@Injectable()
export class InventoryInitialiserService {
	public _socket;

	constructor(private _socketService: SocketService) {
		this._socket = _socketService.getService('inventory-initialisers');
		this._socket.timeout = 50000;
	}

	create(inpatient: any, isArray?: boolean) {
		return this._socket.create(inpatient, { query: { isArray: isArray } });
	}
}
