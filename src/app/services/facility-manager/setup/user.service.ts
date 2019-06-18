import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { RestService, SocketService } from '../../../feathers/feathers.service';

const request = require('superagent');
@Injectable()
export class UserService {
	public _socket;
	public _changePasswordRest;
	private _rest;
	private _restLogin;
	isLoggedIn = false;
	private missionAnnouncedSource = new Subject<string>();
	missionAnnounced$ = this.missionAnnouncedSource.asObservable();
	constructor(private _socketService: SocketService, private _restService: RestService) {
		this._rest = _restService.getService('users');
		this._changePasswordRest = _restService.getService('changepassword');
		this._socket = _socketService.getService('users');
		this._socket.timeout = 30000;
		this._restLogin = _restService.getService('auth/local');
	}
	announceMission(mission: string) {
		this.missionAnnouncedSource.next(mission);
	}

	logOut() {
		this._socketService.logOut();
	}

	login(query: any) {
		// return this._socketService.loginIntoApp(query);
		return this._restService.loginIntoApp(query);
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

	create(user: any) {
		return this._socket.create(user);
	}

	update(user: any) {
		return this._socket.update(user._id, user);
	}

	patch(_id: any, data: any, param: any) {
		return this._socket.patch(_id, data, param);
	}
	remove(id: string, query: any) {
		return this._socket.remove(id, query);
	}
	changePassword(body: any) {
		return this._socketService.getService('change-password').update(body._id, {
			oldpassword: body.oldpassword,
			password: body.password
		});
	}
	verifyUser(body: any) {
		let socket = this._socketService.getService('password-reset');
		socket.timeout = 60000;
		return socket.update(body.apmisId, body);
	}
	resetPassword(body: any) {
		return this._socketService.getService('password-reset').create(body);
	}
	generateUser(data) {
		return this._socketService.getService('generate-user').create(data);
	}

	generatePatientAuthorizationToken(query, type) {
		return this._socketService.getService('documentation-authorization').create({
			patientId: query.patientId,
			employeeId: query.employeeId,
			facilityId: query.facilityId,
			type: type
		});
	}

	validatePatientAuthorizationToken(patientId, type, token, employeeId, facilityId, password) {
		return this._socketService.getService('documentation-authorization').find({
			query: {
				patientId: patientId,
				type: type,
				token: token,
				employeeId: employeeId,
				facilityId: facilityId,
				password: password.toString()
			}
		});
	}
}
