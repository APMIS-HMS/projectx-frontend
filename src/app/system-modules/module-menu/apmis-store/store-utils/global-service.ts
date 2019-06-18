import { Injectable } from '@angular/core';

@Injectable()
export class StoreGlobalUtilService {
    constructor() {
    }
    getObjectKeys(obj) {
        return Object.keys(obj).map(val => obj[val]);
    }
}