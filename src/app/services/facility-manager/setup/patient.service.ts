import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Patient } from '../../../models/index';
const request = require('superagent');

@Injectable()
export class PatientService {
	public _socket;
	private _rest;
	public listner;
	public createListener;
	public patchListener;
	public _patientSearchSocket;
	public _customPatientSocket;
	public _bulkUploadSocket;
	public _excelUploadSocket;
	public unknownPatientSocket;

	private patientAnnouncedSource = new Subject<Patient>();
	patientAnnounced$ = this.patientAnnouncedSource.asObservable();

	constructor(private _socketService: SocketService, private _restService: RestService) {
		this._rest = _restService.getService('patients');
		this._socket = _socketService.getService('patients');
		this._socket.timeout = 50000;
		this._patientSearchSocket = _socketService.getService('patient-search');
		this._patientSearchSocket.timeout = 30000;
		this._bulkUploadSocket = _socketService.getService('bulk-patient-upload');
		this._excelUploadSocket = _socketService.getService('upload-excel-patients');
		this.unknownPatientSocket = _socketService.getService('unknown-patients');
		this._customPatientSocket = _socketService.getService('create-patient');
		this._bulkUploadSocket.timeout = 100000;
		this._excelUploadSocket.timeout = 100000;
		this.createListener = Observable.fromEvent(this._socket, 'created');
		this.listner = Observable.fromEvent(this._socket, 'updated');
		this.patchListener = Observable.fromEvent(this._socket, 'patched');
	}
	announcePatient(patient: Patient) {
		this.patientAnnouncedSource.next(patient);
	}
	receivePatient(): Observable<Patient> {
		return this.patientAnnouncedSource.asObservable();
	}
	InitializeEvent(event) {
		const observable = new Observable((observer) => {
			this._socket.on(event, (data) => {
				observer.next(data);
			});
			return () => {
				this._socket.disconnect();
			};
		});
		return observable;
	}
	RxfromIO(io, eventName) {
		return Observable.create((observer) => {
			io.on(eventName, (data) => {
				observer.onNext(data);
			});
			return {
				dispose: io.close
			};
		});
	}
	reload() {
		// this._restService.reload();
	}
	find(query: any) {
		this.reload();
		return this._socket.find(query);
	}

	findAll() {
		this.reload();
		return this._socket.find();
	}
	findPatient(query: any) {
		return this._patientSearchSocket.find(query);
	}
	get(id: string, query: any) {
		this.reload();
		return this._socket.get(id, query);
	}

	abridgePatient(patient) {
		return {
			_id: patient._id,
			personId: patient.personId,
			personDetails: {
				_id: patient.personDetails._id,
				apmisId: patient.personDetails.apmisId,
				email: patient.personDetails.email,
				firstName: patient.personDetails.firstName,
				lastName: patient.personDetails.lastName
			}
		};
	}

	createUnknowPatient(object) {
		return this.unknownPatientSocket.create(object, {});
	}

	mergeUnknowPatient(id, query) {
		return this.unknownPatientSocket.remove(id, query);
	}

	create(patient: any) {
		return this._socket.create(patient);
	}

	createCustomPatient(patient: any) {
		return this._customPatientSocket.create(patient);
	}

	remove(id: string, query: any) {
		return this._socket.remove(id, query);
	}
	update(patient: any) {
		return this._socket.update(patient._id, patient);
	}
	patch(id, patient: any, query) {
		return this._socket.patch(id, patient, query);
	}
	searchPatient(facilityId: string, searchText: string) {
		const host = this._restService.getHost();
		const path = host + '/patient';
		return request.get(path).query({ facilityid: facilityId, searchtext: searchText }); // query string
	}

	bulkUpload(data) {
		return this._bulkUploadSocket.create(data);
	}

	uploadExcel(data) {
		return this._excelUploadSocket.create(data);
	}
}
