import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-apmis-pagination',
	templateUrl: './apmis-pagination.component.html',
	styleUrls: [ './apmis-pagination.component.scss' ]
})
export class ApmisPaginationComponent implements OnInit {
	@Input() total = 0;
	@Input() numberOfPages = 0;
	@Input() currentPage = 0;
	@Input() limit = 0;
	@Output() emitCurrentPage: EventEmitter<number> = new EventEmitter<number>();
	defaultPages = [];
	firstNumberPart = 0;
	secondNumberPart = 0;
	skip = 0;

	constructor() {}

	ngOnInit() {
		this.limit = APMIS_STORE_PAGINATION_LIMIT;
		this.numberOfPages = this.total / this.limit;
		this.numberOfPages = Math.ceil(this.numberOfPages);
		this.defaultPages = [];
		for (let i = 0; i < this.limit; i++) {
			this.defaultPages.push({ id: i });
		}
		this.getFirstPart();
		this.getSecondPart();
	}

	moveNext() {
		this.numberOfPages = this.total / this.limit;
		this.numberOfPages = Math.ceil(this.numberOfPages);
		this.defaultPages.forEach((page) => {
			if (page.id < this.total) {
				page.id = page.id + this.limit;
			}
		});
		if (this.currentPage <= this.numberOfPages) {
			this.currentPage = this.currentPage + 1;
			this.selectCurrentPage(this.currentPage);
		}
	}
	movePrevious() {
		this.defaultPages.forEach((page, i) => {
			let j = 0;
			do {
				page.id = page.id - this.limit;
				j = j + 1;
			} while (this.defaultPages[i].id - i !== this.defaultPages[i].id && j >= 2);
		});
		if (this.currentPage > 0) {
			this.currentPage = this.currentPage - 1;
			this.selectCurrentPage(this.currentPage);
		}
	}

	selectCurrentPage(page, direct?) {
		if (direct) {
			this.getCurrentPageDefaultPages(page);
			this.currentPage = page;
		}
		this.getFirstPart();
		this.getSecondPart();
		this.emitCurrentPage.emit(page);
	}
	getCurrentPageDefaultPages(page) {
		this.defaultPages = [];
		for (let i = page * this.limit; i < this.limit + page * this.limit; i++) {
			this.defaultPages.push({ id: i });
		}
	}
	getFirstPart() {
		this.firstNumberPart = this.defaultPages.length > 0 ? this.defaultPages[0].id + 1 : 1;
	}
	getSecondPart() {
		if (this.defaultPages.length > 0) {
			if (this.skip === 0) {
				this.secondNumberPart = this.defaultPages[this.limit - 1].id + 1;
			} else {
				this.secondNumberPart = this.defaultPages[this.limit - 1].id;
			}
		}
	}

	getPages() {
		if (this.limit > this.total) {
			this.limit = this.total;
			this.getSecondPart();
		}
		this.numberOfPages = this.total / this.limit;
		this.numberOfPages = Math.ceil(this.numberOfPages);
		const pages = [];
		for (let i = 0; i < this.numberOfPages; i++) {
			pages.push({ id: i });
		}
		return pages;
	}
}
