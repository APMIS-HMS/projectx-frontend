import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class ApmisFilterBadgeService {
	item$: Observable<any>;
	private itemSubject = new Subject<any>();

	storage$: Observable<any>;
	private storageSubject = new Subject<any>();

	constructor(private _locker: CoolLocalStorage) {
		this.item$ = this.itemSubject.asObservable();
		this.storage$ = this.storageSubject.asObservable();
	}

	reset(status: boolean) {
		this.itemSubject.next(status);
	}

	clearItemsStorage(status: boolean) {
		this.storageSubject.next(status);
	}

	edit(status: boolean, data) {
		if (status) {
			this._locker.setObject('APMIS_SELECTED_ITEMS', data);
		}
	}
}
