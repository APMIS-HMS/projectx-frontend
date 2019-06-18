import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'apmis-search-button',
    template: ` <apmis-pager-button [background-color]="color" (onClick)="search()"
                                   [is-disable]="processing" [is-oval]="true"

    ><span [ngClass]="{'fa-circle-o-notch fa-spin' : processing}" class="fa fa-search fa-2x"></span></apmis-pager-button>`
})
export class SearchButtonComponent implements OnInit {
    @Input() color : string  = 'blue';
    @Input() processing : boolean  = false;
    @Output() onSearch : EventEmitter<void>  =  new EventEmitter<void>();
    constructor() {
    }

    ngOnInit() {
    }
    search()
    {
        this.onSearch.emit();
    }
}