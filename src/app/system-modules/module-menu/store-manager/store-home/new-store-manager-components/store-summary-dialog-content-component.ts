import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'store-summary-dialog',
	templateUrl: 'store-summary-dialog-content.component.html',
	styles: [
		`
        .modal-baseWrap {
            width: 100% !important;
        }
        div.width-medium
        {
            width : 750px !important;
        }
        divi.dialog-container {
            min-height: 350px;
            box-shadow: 2px 4px 10px rgba(58, 58, 58, 0.99) !important;
        }
    `
	]
})
export class StoreSummaryDialogComponent implements OnInit {
	@Input('title') dialogTitle: string;
	@Output() onActionSuccess: EventEmitter<any> = new EventEmitter<any>();
	@Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
	constructor() {}

	ngOnInit() {}
	watchForEscKeyPress(evt: KeyboardEvent) {
		if (evt.key === 'esc') {
			alert(evt.keyCode);
		} else {
			alert(evt.key);
		}
	}
	closeDialogClick() {
		this.onClose.emit(true);
	}
}
