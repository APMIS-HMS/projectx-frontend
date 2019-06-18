import {
    Component,
    OnInit,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList,
    ElementRef
} from '@angular/core';
import * as  _ from "lodash";
import {ProductGridModel} from "../ProductGridModel";
import {FormControl} from "@angular/forms";
import {ProductGridItemComponent} from "./product-grid-item-component";

@Component({
    selector: 'product-grid',
    templateUrl: 'product-grid.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProductGridComponent implements OnInit {
    checkAll: FormControl = new FormControl(false);
    @Input() products: ProductGridModel[] = [];
    @Input() selectedStore: string = "";
    @Input() showStatus: boolean = false;
    @Output() onItemSelected: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() onItemRemoved: EventEmitter<any> = new EventEmitter<any>();
    @ViewChildren("item") items: QueryList<ProductGridItemComponent> = new QueryList<ProductGridItemComponent>();

    constructor() {
    }

    ngOnInit() {
        // console.log(this.checkAll.value);
        this.checkAll.valueChanges.subscribe(
            x => {
                this.items.forEach(i => {
                    i.isSelected = x;
                })
            }
        )
    }

    // Manage double-click on each grid item
    manageEditting(cmpRef: ProductGridItemComponent) {

        // remove selection on others except this one
        this._resetEditable(cmpRef);
        console.log(cmpRef, cmpRef.isEditMode)
        if (cmpRef.isEditMode) {
            cmpRef.resetEditMode();
        }

        else {
            cmpRef.makeEditable();
        }


    }

    private _resetEditable(except: ProductGridItemComponent = null) {
        this.items.forEach(x => {
            if (_.isNil(except)) {
                x.resetEditMode();
            }
            else {
                if (except != x) {
                    x.resetEditMode();
                }
            }

        });
    }

    addNewItem() {
        this._resetEditable();
        // This creates an Empty ProductGridModel 
        const pm: ProductGridModel = {
            productName: "[New Item]",
            qtyToSend: 1,
            availableQuantity: 0,
            unitOfMeasure: "",
            qtyOnHold: 0,
            price: 0,
            totalQuantity: 0,
            size: 0,
            reorderLevel: 0,
            productId: "",
            _id: _.uniqueId("OUTBUND-"),
            isNew: true,
            isAccepted: false,
            productConfiguration  : null,
        };
        this.products.push(pm);
        // make the component editable at the index of data
        const cmp: ProductGridItemComponent = this.items[this.products.length - 1];
       
       
    }

    removeItem(data: ProductGridModel, cmRef: ProductGridComponent) {
        // dispose  the component
        const index = _.findIndex(this.products, x => {
            return x._id == data._id;
        });
       
        if (index > -1) {
            this.products.splice(index, 1);
        }
    }

    getSelectedItems()  : ProductGridModel[]
    {
        let res  : ProductGridModel[]   =this.items.filter(x => {
           return x.isSelected == true
        }).map(x => x.data);
        return res;
    }
}
