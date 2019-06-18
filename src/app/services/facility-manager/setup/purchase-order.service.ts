import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PurchaseOrderService {
	public _socket;
	public _socket2;
	private _socket3;
	private _rest;
	public listenerCreate;
	public listenerUpdate;
	public listenerDelete;
	constructor(private _socketService: SocketService, private _restService: RestService) {
		this._rest = _restService.getService('purchase-orders');
		this._socket = _socketService.getService('purchase-orders');
		this._socket2 = _socketService.getService('list-of-purchase-orders');
		this._socket3 = _socketService.getService('purchase-list');
		this._socket.timeout = 30000;
		this._socket2.timeout = 30000;
		this._socket3.timeout = 30000;
		this.listenerCreate = Observable.fromEvent(this._socket, 'created');
		this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
		this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');
	}

	find(query: any) {
		return this._socket.find(query);
	}

	findOrder(query: any) {
		return this._socket2.find(query);
	}

	findAll() {
		return this._socket.find();
	}
	get(id: string, query: any) {
		return this._socket.get(id, query);
	}

	getOrder(id: string, query: any) {
		return this._socket2.get(id, query);
	}

	create(serviceprice: any) {
		return this._socket.create(serviceprice);
	}

	createPurchaseList(purchaseList: any) {
		return this._socket3.create(purchaseList);
	}

	findPurchaseList(query: any) {
		return this._socket3.find(query);
	}

	removePurchaseList(id: string, query: any) {
		return this._socket3.remove(id, query);
	}

	update(serviceprice: any) {
		return this._socket.update(serviceprice._id, serviceprice);
	}

	patch(id, data) {
		return this._socket.patch(id, data);
	}

	remove(id: string, query: any) {
		return this._socket.remove(id, query);
	}
}
