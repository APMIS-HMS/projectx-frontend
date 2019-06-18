import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoolLocalStorage } from 'angular2-cool-storage/src/cool-local-storage';

@Component({
	selector: 'app-doc-upload-detail',
	templateUrl: './doc-upload-detail.component.html',
	styleUrls: [ './doc-upload-detail.component.scss' ]
})
export class DocUploadDetailComponent implements OnInit {
	@Input() selectedDocument: any = {};
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	page = 1;
	auth: any;
	currentPDF = {};
	currentImg;
	loading = true;
	loadingError: boolean;

	docPdf: any;
	docImg: any;

	constructor(private locker: CoolLocalStorage) {}

	ngOnInit() {
		this.auth = this.locker.getObject('auth');
		if (this.selectedDocument.fileType === 'application/pdf') {
			this.docPdf = true;
			this.docImg = false;
			this.currentPDF = {
				url: this.selectedDocument.docUrl
			};
		} else {
			this.docPdf = false;
			this.docImg = true;
			this.currentImg = this.selectedDocument.docUrl;
		}
	}

	close_onClick(e) {
		this.closeModal.emit(true);
	}
	onComplete(event) {
		this.loading = false;
	}
	onError(event) {
		this.loading = false;
		this.loadingError = true;
	}
	onProgress(progressData: any) {}
}
