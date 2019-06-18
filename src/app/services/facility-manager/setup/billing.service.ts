import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BillingService {
	public _socket;
	public _socketBillFacilityServices;
	private _rest;
	private _socketBillCreators;
	public updatelistner;

	private billingAnnouncedSource = new Subject<Object>();
	billingAnnounced$ = this.billingAnnouncedSource.asObservable();

	constructor(private _socketService: SocketService, private _restService: RestService) {
		this._rest = _restService.getService('billings');
		this._socket = _socketService.getService('billings');
		this._socketBillFacilityServices = _socketService.getService('bill-facility-services');
		this._socketBillCreators = _socketService.getService('bill-creators');
		this._socketBillCreators.timeout = 50000;
		this.updatelistner = Observable.fromEvent(this._socket, 'updated');
		this._socket.timeout = 90000;
		this._socketBillFacilityServices.timeout = 30000;
		this._socket.on('created', function(gender) {});
	}
	announceBilling(billing: Object) {
		this.billingAnnouncedSource.next(billing);
	}
	receiveBilling(): Observable<Object> {
		return this.billingAnnouncedSource.asObservable();
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

	create(gender: any) {
		return this._socket.create(gender);
	}

	createBill(billItems: any, params: any) {
		return this._socketBillCreators.create(billItems, params);
	}

	remove(id: string, query: any) {
		return this._socket.remove(id, query);
	}

	update(billing: any) {
		return this._socket.update(billing._id, billing);
	}

	patch(_id: any, data: any, param: any) {
		return this._socket.patch(_id, data, param);
	}

	findBillService(query: any) {
		return this._socketBillFacilityServices.find(query);
	}

	generateInvoice(data: any) {
		return this._socketBillFacilityServices.create(data);
	}
}
