import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class HmoService {
	public _socket;
	private _rest;
	public _insuranceSocket;
	public _hmoSocket;
	public _hmoBillHistorySocket;
	public _hmoBillHistoryRest;

	private hmoAnnouncedSource = new Subject<Object>();
	hmoAnnounced$ = this.hmoAnnouncedSource.asObservable();

	constructor(private _socketService: SocketService, private _restService: RestService) {
		this._rest = _restService.getService('hmos');
		this._socket = _socketService.getService('hmos');
		this._hmoSocket = _socketService.getService('add-hmo-facilities');
		this._hmoBillHistoryRest = _restService.getService('health-covered-bill-histories');
		this._hmoBillHistorySocket = _socketService.getService('health-covered-bill-histories');
		this._socket.timeout = 50000;
		this._hmoBillHistorySocket.timeout = 50000;
		this._socket.on('created', function(gender) {});
		this._insuranceSocket = _socketService.getService('insurance-enrollees');
		this._insuranceSocket.timeout = 50000;
	}
	announceHmo(hmo: Object) {
		this.hmoAnnouncedSource.next(hmo);
	}
	receiveHmo(): Observable<Object> {
		return this.hmoAnnouncedSource.asObservable();
	}

	find(query: any) {
		return this._socket.find(query);
	}

	findBillHistory(query: any) {
		return this._hmoBillHistorySocket.find(query);
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

	addHmo(obj: any) {
		return this._hmoSocket.create(obj);
	}

	remove(id: string, query: any) {
		return this._socket.remove(id, query);
	}

	update(hmo: any) {
		return this._socket.update(hmo._id, hmo);
	}

	update2(_id, hmo) {
		return this._socket.update(_id, hmo);
	}

	patch(id: string, data: any, params: any) {
		return this._socket.patch(id, data, params);
	}

	patchBeneficiary(id: string, data: any, params: any) {
		return this._insuranceSocket.patch(id, data, params);
	}
	async deleteBeneficiary(data: any[]) {
		for (let i = 0; i < data.length; i++) {
			const done = await this._insuranceSocket.delete(data[i]._id);
		}
		//we could use delete multiple items at once*
		/*   console.log("Before DELETING Items");
       return  /!*await*!/  this._insuranceSocket.delete(null, {params : { id : {$in :  data.map(x => x._id)}} } );*/
	}

	hmos(facilityId, hmoId?, search?) {
		const host = this._restService.getHost();
		const path = host + '/distinct-hmo-plans';
		return request.get(path).query({ facilityId: facilityId, hmoId: hmoId, search: search });
	}
	updateBeneficiaryList(formData) {
		const host = this._restService.getHost();
		const path = host + '/hmo-beneficiaries';
		return request.post(path).send(formData);
	}
	getEnrollee(filNo) {
		const host = this._restService.getHost();
		const path = host + '/insurance-enrollees';
		return request.get(path).query({ filNo: filNo }); // query string
	}

	getHmos(query) {
		return this._insuranceSocket.find(query);
	}
}
