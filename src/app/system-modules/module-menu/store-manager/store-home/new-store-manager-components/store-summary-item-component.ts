import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IStoreSummaryItem} from './store-summary-model';

@Component({
    selector: 'store-summary-item',
    template: `
        <div class="item-color-bar" [ngStyle]="{'background-color':item?.tagColor || '#dbdbdb'}"></div>
        <div  class="store-item">
            <span class="item-key">{{item?.key || '' }}</span>
            
                <p class="item-value" *ngIf="item?.key && item?.value > 0 ; else templRef"  (click)="itemDetailsClick($event)"
                   [style.color]="item?.tagColor || 'grey'">{{item?.value }}</p>
            <span class="details" (click)="itemDetailsClick($event)" *ngIf="item?.key && item?.value >0">See Details...</span>
        </div> 
        <ng-template #templRef>
            <p class="item-value"
               [style.color]="item?.tagColor || 'grey'">{{item?.value }}</p>
        </ng-template>
    `,
    styles : [
        `
            span.details {
                color: #008eb4;
                font-size: 10px;
                cursor: pointer;
            }

            p.item-value {
                font-size: 26px;
                margin: 2px;
                cursor: pointer;
            }

            span.item-key {
                font-size: 12px;
            }

            div.item-color-bar {
                height: 5px;
                min-width: 120px;
            }

            div.store-ipatem:focus, div.store-item:hover {
                background-color: rgba(226, 243, 255, 0.63);

            }

            .store-item {
                transition: all linear 500ms;
                padding: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-height: 70px;
                min-width: 120px;
                align-items: center;
                background-color: white;
                box-shadow: 1px 2px 9px rgba(79, 79, 79, 0.27);

            }
        `
    ]
})


export class StoreSummaryItemComponent implements OnInit {
    @Input() item: IStoreSummaryItem;
    @Input() color: String = '';
    @Output() onDetailClick: EventEmitter<IStoreSummaryItem>  =  new EventEmitter<IStoreSummaryItem>();

    constructor() {
    }

    ngOnInit() {
    }

    itemDetailsClick(item) {
        this.onDetailClick.emit(item);
    }
}