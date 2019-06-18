import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PendingBillService {
	private _socket;
	private _socketSummary;
	private _socketChartSummary;
	constructor(private _socketService: SocketService) {
		this._socket = _socketService.getService('pending-bills');
		this._socket.timeout = 30000;
		this._socketSummary = _socketService.getService('bill-summary-data');
		this._socketSummary.timeout = 30000;
		this._socketChartSummary = _socketService.getService('payment-chart-data');
		this._socketSummary.timeout = 30000;
	}

	get(id: string, query: any) {
		return this._socket.get(id, query);
	}

	getDataSummary(id: string, query: any) {
		return this._socketSummary.get(id, query);
	}

	getChartSummary(id: string, query: any) {
		return this._socketChartSummary.get(id, query);
	}
}
