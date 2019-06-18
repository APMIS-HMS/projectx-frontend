import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

export enum ConnectionStatusEnum {
	Online,
	Offline
}

export class NetworkConnection {
	public static status: ConnectionStatusEnum = ConnectionStatusEnum.Online;
	private static online$: Observable<string>;
	private static offline$: Observable<string>;

	public static init() {
		NetworkConnection.online$ = Observable.fromEvent(window, 'online');
		NetworkConnection.offline$ = Observable.fromEvent(window, 'offline');

		NetworkConnection.online$.subscribe((e) => {
			NetworkConnection.status = ConnectionStatusEnum.Online;
		});

		NetworkConnection.offline$.subscribe((e) => {
			NetworkConnection.status = ConnectionStatusEnum.Offline;
		});
	}

	constructor() {
		NetworkConnection.init();
	}
}

// tslint:disable-next-line:no-unused-expression
new NetworkConnection();
