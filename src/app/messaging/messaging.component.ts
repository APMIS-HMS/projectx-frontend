import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-messaging',
	templateUrl: './messaging.component.html',
	styleUrls: [ './messaging.component.scss' ]
})
export class MessagingComponent implements OnInit {
	chatActive = false;
	searchAccount = new FormControl();
	chatBox = new FormControl();
	channels: any;

	clinicalTab = true;
	nonClinicalTab = false;
	@Input('channel') userChannels;

	constructor() {}

	ngOnInit() {}

	chatActiveToggle() {
		this.chatActive = !this.chatActive;
	}
	chatClose() {
		this.chatActive = false;
	}
	clinical_click() {
		this.clinicalTab = true;
		this.nonClinicalTab = false;
	}
	nonClinical_click() {
		this.clinicalTab = false;
		this.nonClinicalTab = true;
	}
}
