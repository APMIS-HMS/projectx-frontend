import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-drug-search',
	templateUrl: './drug-search.component.html',
	styleUrls: [ './drug-search.component.scss' ]
})
export class DrugSearchComponent implements OnInit {
	@Input() products: any = [];
	@Input() commonProducts: any = [];
	@Output() closeSearch: EventEmitter<any> = new EventEmitter<any>();
	@Output() markProduct: EventEmitter<any> = new EventEmitter<any>();
	constructor() {}

	ngOnInit() {}

	setMarked(event, product) {
		product.marked = event.target.checked;
		this.markProduct.emit({ product: product, marked: event.target.checked });
	}

	selectProduct(event, product) {
		this.closeSearch.emit(product);
	}
	close() {
		this.closeSearch.emit(undefined);
	}
}
