import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
	selector: 'app-nhmis-summary',
	templateUrl: './nhmis-summary.component.html',
	styleUrls: [ './nhmis-summary.component.scss' ]
})
export class NhmisSummaryComponent implements OnInit {
	filterMonth: FormControl = new FormControl();
	filterYear: FormControl = new FormControl();
	// dd = { content: document.getElementById('contentToConvert') };
	@ViewChild('contentToConvert') input: ElementRef;
	constructor() {
		// pdfMake.vfs = pdfFonts.pdfMake.vfs;
	}

	ngOnInit() {}

	generatePdf() {
		// console.log(this.input.nativeElement.innerHTML);
		// try {
		// 	var docDefinition = { content: this.input.nativeElement.innerHTML };
		// 	pdfMake.createPdf(docDefinition).open();
		// 	console.log('after');
		// } catch (error) {
		// 	console.log(error);
		// }
		// pdfMake.createPdf({content: document.getElementById('contentToConvert')}).open();
	}
}
