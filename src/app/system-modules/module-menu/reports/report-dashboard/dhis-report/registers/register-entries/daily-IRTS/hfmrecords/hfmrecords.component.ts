import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-hfmrecords',
	templateUrl: './hfmrecords.component.html',
	styleUrls: [ './hfmrecords.component.scss' ]
})
export class HfmrecordsComponent implements OnInit {
	@Output() switch: EventEmitter<number> = new EventEmitter<number>();
	showNewEntry = false;
	dateRange: any;
	loadIndicatorVisible = false;
	constructor(private _router: Router) {}

	ngOnInit() {}
	back_registers() {
		this._router.navigate([ '/dashboard/reports/register' ]);
	}
	newEntry() {
		this.showNewEntry = true;
	}

	close_onClick(e) {
		this.showNewEntry = false;
	}

	setReturnValue(event) {}
}
