import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-child-immunization',
	templateUrl: './child-immunization.component.html',
	styleUrls: [ './child-immunization.component.scss', '../../../../nhmis-summary/nhmis-summary.component.scss' ]
})
export class ChildImmunizationComponent implements OnInit {
	@Output() switch: EventEmitter<number> = new EventEmitter<number>();
	showNewEntry = false;
	dateRange: any;
	loadIndicatorVisible = false;

	constructor(private _router: Router) {}

	ngOnInit() {}

	newEntry() {
		this.showNewEntry = true;
	}
	close_onClick(e) {
		this.showNewEntry = false;
	}

	back_registers() {
		this._router.navigate([ '/dashboard/reports/register' ]);
	}

	setReturnValue(event) {}
}
