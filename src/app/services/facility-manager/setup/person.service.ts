import {
  WalletTransaction,
  TransactionType,
  EntityType,
  TransactionDirection,
  TransactionMedium
} from './../../../models/facility-manager/setup/wallet-transaction';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Person } from '../../../models/index';
import { Http, Headers, RequestOptions } from '@angular/http';
const request = require('superagent');

@Injectable()
export class PersonService {
  public _socket;
  public _personSocket;
  public _customSocket;
  public _sendFacilityTokenSocket;
  public _fundWalletSocket;
  public _fundWalletRest;
  public createListener;
  public updateListener;
  public patchListener;
  private _rest;
  // public http;

  private personAnnouncedSource = new Subject<Person>();
  personAnnounced$ = this.personAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private http: Http
  ) {
    this._rest = _restService.getService('people');
    this._socket = _socketService.getService('people');
    this._personSocket = _socketService.getService('save-person');
    this._fundWalletSocket = _socketService.getService('fund-wallet');
    this._fundWalletRest = _restService.getService('fund-wallet');
    this._socket.timeout = 30000;
    this._fundWalletSocket.timeout = 50000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.updateListener = Observable.fromEvent(this._socket, 'updated');
    this.patchListener = Observable.fromEvent(this._socket, 'patched');
  }

  announcePerson(person: Person) {
    this.personAnnouncedSource.next(person);
  }
  receivePerson(): Observable<Person> {
    return this.personAnnouncedSource.asObservable();
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

  create(person: any) {
    return this._socket.create(person);
  }
  createPerson(body: any) {
    return this._personSocket.create(body);
  }
  update(person: any, param?) {
    return this._socket.update(person._id, person, {
      query: { facilityId: param }
    });
  }
  patch(id, param, query) {
    return this._socket.patch(id, param, query);
  }

  remove(id: string, query?: any) {
    return this._socket.remove(id, query);
  }

  abridgePerson(person) {
    return {
      _id: person._id,
      apmisId: person.apmisId,
      email: person.email,
      firstName: person.firstName,
      lastName: person.lastName
    };
  }

  walletTransaction(walletTransaction) {
    const host = this._restService.getHost();
    const path = host + '/wallet-transaction';
    return request.get(path).query({
      destinationId: walletTransaction.destinationId,
      sourceId: walletTransaction.sourceId,
      transactionType: TransactionType[walletTransaction.transactionType],
      transactionMedium: TransactionMedium[walletTransaction.transactionMedium],
      amount: walletTransaction.amount,
      description: walletTransaction.description,
      sourceType: EntityType[walletTransaction.sourceType],
      destinationType: EntityType[walletTransaction.destinationType],
      transactionDirection:
        TransactionDirection[walletTransaction.transactionDirection]
    }); // query string
  }

  fundWallet(payload: any, facilityId?: any) {
    return this._fundWalletSocket.create(payload, {
      query: { facilityId: facilityId, isCardReused: false, saveCard: true }
    });
    // return this._fundWalletRest.create(payload);
  }

  httpFundWallet(payload) {
    const host = this._restService.getHost();
    const path = host + '/fund-wallet';
    const token = 'Bearer' + localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    const options = new RequestOptions({ headers: headers });
    return this.http.post(path, payload);
  }

  // fundWallet(walletTransaction: WalletTransaction) {
  //   const host = this._restService.getHost();
  //   const path = host + '/fund-wallet';
  //   return new Promise((resolve, reject) => {
  //     // resolve(
  //     //   request.get(path).query({
  //     //     ref: walletTransaction.ref,
  //     //     ePaymentMethod: walletTransaction.ePaymentMethod,
  //     //     paymentMethod: walletTransaction.paymentMethod,
  //     //     destinationId: walletTransaction.destinationId,
  //     //     sourceId: walletTransaction.sourceId,
  //     //     transactionType: TransactionType[walletTransaction.transactionType],
  //     //     transactionMedium: TransactionMedium[walletTransaction.transactionMedium],
  //     //     amount: walletTransaction.amount,
  //     //     description: walletTransaction.description,
  //     //     sourceType: EntityType[walletTransaction.sourceType],
  //     //     destinationType: EntityType[walletTransaction.destinationType],
  //     //     transactionDirection: TransactionDirection[walletTransaction.transactionDirection],
  //     //     paidBy: walletTransaction.paidBy
  //     //   })
  //     // );
  //   });
  //   // return request
  //   //   .get(path)
  //   //   .query({
  //   //     paymentMethod: 'Cash',
  //   //     destinationId: walletTransaction.destinationId, sourceId: walletTransaction.sourceId,
  //   //     transactionType: TransactionType[walletTransaction.transactionType],
  //   //     transactionMedium: TransactionMedium[walletTransaction.transactionMedium],
  //   //     amount: walletTransaction.amount, description: walletTransaction.description,
  //   //     source: EntityType[walletTransaction.source],
  //   //     destination: EntityType[walletTransaction.destination],
  //   //     transactionDirection: TransactionDirection[walletTransaction.transactionDirection]
  //   //   }); // query string
  // }
  searchPerson(body: any) {
    return this._socketService.getService('search-people').find(body);
  }

  altFundWallet(payload) {
    const host = this._restService.getHost();
    const path = host + '/fund-wallet';
    const token = 'Bearer' + localStorage.getItem('token');
    // const bearer = '';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    const options = new RequestOptions({ headers: headers });
    this.http.post(path, payload, options).subscribe(subPayload => {
    });
  }
}
