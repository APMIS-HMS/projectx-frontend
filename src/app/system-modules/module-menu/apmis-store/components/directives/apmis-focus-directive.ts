import { ElementRef, Renderer, Input, Directive, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { TypeFormatFlags } from 'typescript';
import { type } from 'os';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[myFocus]' })
export class FocusDirective implements OnInit {
	isFocused = false;

	@Input()
	set myFocus(condition: boolean) {
		this.isFocused = condition;
		if (condition) {
			this.setFocus();
		} else {
			this.unSetFocus();
		}
	}

	constructor(private hostElement: ElementRef, private renderer: Renderer, private viewContainer: ViewContainerRef) {}

	ngOnInit() {}
	setFocus() {
		// console.log(this.hostElement.nativeElement
		this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');
		this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'select');
	}
	unSetFocus() {
		this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'blur');
	}
}
