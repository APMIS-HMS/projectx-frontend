import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-drgsrch',
  templateUrl: './drgsrch.component.html',
  styleUrls: ['./drgsrch.component.scss']
})
export class DrgsrchComponent implements OnInit {

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
