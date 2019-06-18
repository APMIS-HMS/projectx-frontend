import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderSetSharedService {
  public itemSubject = new Subject<any>();

  constructor() {}

  saveItem(value: any) {
    this.itemSubject.next(value);
  }
}
