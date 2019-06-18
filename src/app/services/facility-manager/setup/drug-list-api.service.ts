import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DrugListApiService {
	public _socket;
	public _socketCommon;
	public _socketInteraction;
	private _rest;
	constructor(private _socketService: SocketService, private _restService: RestService) {
		this._rest = _restService.getService('drug-generic-list');
		this._socket = _socketService.getService('drug-generic-list');
		this._socketCommon = _socketService.getService('commonly-prescribed-drugs');
		this._socketInteraction = _socketService.getService('drug-interactions');
		this._socket.timeout = 50000;
		this._socket.on('created', function(drug) {});
	}

	find(query: any) {
		return this._socket.find(query);
	}

	findAll() {
		return this._socket.find();
	}
	get(id: string, query: any) {
		return this._socket.get(id, query);
	}

	create(drug: any) {
		return this._socket.create(drug);
	}

	create_commonly_prescribed(drug: any) {
		return this._socketCommon.create(drug);
	}

	find_commonly_prescribed(query: any) {
		return this._socketCommon.find(query);
	}

	remove_commonly_prescribed(id: string, query: any) {
		return this._socketCommon.remove(id, query);
	}

	remove(id: string, query: any) {
		return this._socket.remove(id, query);
	}

	find_drug_interactions(query: any) {
		return this._socketInteraction.find(query);
	}
}
