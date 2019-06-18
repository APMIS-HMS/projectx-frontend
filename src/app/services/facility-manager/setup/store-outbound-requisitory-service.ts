import {Injectable} from "@angular/core";
import {RestService, SocketService} from "../../../feathers/feathers.service";

@Injectable()
export class StoreOutboundService {
    public _socket;
    private _rest;
    public listenerCreate;
    public listenerUpdate;
    public listenerDelete;
    constructor(
        private _socketService: SocketService,
        private _restService: RestService
    ) {
        this._rest = _restService.getService('store-requisitions');
        this._socket = _socketService.getService('store-requisitions');
        this._socket.timeout = 60000;
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

    create(serviceprice: any) {
        return this._socket.create(serviceprice);
    }
    update(serviceprice: any) {
        return this._socket.update(serviceprice._id, serviceprice);
    }
    remove(id: string, query: any) {
        return this._socket.remove(id, query);
    }
}