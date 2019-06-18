import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
    OnChanges,
  
    SimpleChanges
} from "@angular/core";
import {Payment} from "../../../../../../core-ui-modules/ui-components/PaymentReportModel";

@Component({
    encapsulation:ViewEncapsulation.None,
    selector: 'app-invoice-item',
    templateUrl: "./invoice-item.component.html"
   
    
})
export class InvoiceItemComponent implements OnInit, OnChanges {
    loading : boolean  =  false;
    subTotal   =0;
    discount = 0
    grandTotal = 0;
    @Output() onItemsSelected: EventEmitter<Payment> = new EventEmitter<Payment>();
    @Input() invoiceItems: Payment[] = [];
   

    constructor() {
    }

    ngOnInit() {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        
        // just calculate the sub totals etx
        if(changes["invoiceItems"] != null && changes["invoiceItems"].currentValue !== null)
        {
            this.invoiceItems.forEach(x => {
                this.subTotal  += x.totalPrice;
                this.discount  =0;
            });
            this.grandTotal  = this.subTotal - this.discount;
        }
    }

  
}
