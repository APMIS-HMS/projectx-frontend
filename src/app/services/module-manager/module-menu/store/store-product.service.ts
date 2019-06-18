import { Injectable } from '@angular/core';
import { SocketService, RestService } from 'app/feathers/feathers.service';

@Injectable()
export class ProductService {
    _socket;
    constructor(private socketService: SocketService, private restService: RestService) {
        this._socket = this.socketService.getService('');
    }

    find(params) {

    }
    get(params) {

    }

    create() {

    }

    update() {

    }

    delete() {

    }
}
