import { Component, Injectable, OnInit } from '@angular/core';
@Injectable()
export class LogoSrcService {
	src: string = 'default src';
	setSrc(src: string) {
		this.src = src;
	}
}

@Component({
	selector: 'logo-viewer',
	template: `<span></span>`
})
export class CustomLogoComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		// this.src  = this.logoService.src;
	}
}
