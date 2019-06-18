import {Component, OnInit, Input, EventEmitter, Output,ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ProductGridModel} from "../ProductGridModel";
import {Form, FormControl} from "@angular/forms";
import {InventoryService} from "../../../../../../services/facility-manager/setup";
import {ReportGeneratorService} from "../../../../../../core-ui-modules/ui-components/report-generator-service";
import * as _ from "lodash";
@Component({
    selector: 'product-grid-item',
    templateUrl: 'product-grid-item-component.html',
    styles: [`
        .marked {
            transition: all 120ms linear;
            background-color: #fff6da;
        }

        .focused {
            transition: all 120ms linear;
            background-color: #dff8ff;
        }

        div.product-suggestion-popup {
            z-index: 2100;
            position: absolute;
            min-width: 350px;
            max-width: 550px;
            background-color: white;
            box-shadow: 1px 2px 12px rgba(95, 95, 95, 0.5);
            padding: 0px;
            top: 40px;
            max-height: 300px;
            overflow-y: auto;
            min-height: 50px;

        }

        div.product-suggestion-popup .item {
            cursor: pointer;
            transition: all 300ms linear;
            padding: 5px 15px;
            font-size: 12px;
        }

        div.product-suggestion-popup .item:hover, div.product-suggestion-popup .item:focus {
            background-color: #c7dff9;
            font-weight: 400;

        }

        input[type=text].form-control, input[type].form-control {
            transition: all 100ms linear;
            padding: 7px 10px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            border: solid 1px #b9b9b9;
            box-shadow: 1px 1px 13px rgba(167, 167, 167, 0.4) inset;
        }

        input[type].form-control:hover, input[type].form-control:focus {
            border: solid 1px #99acb9;
            box-shadow: 1px 1px 13px rgba(150, 150, 150, 0.4) inset;
        }

        .tbl-status {
            padding: 3px 10px;
            font-size: 14px;
        }

        .status-green {
            color: #00D455;
            border: 1px solid #00D455;
        }

        .status-red {
            color: #FF3838;
            border: 1px solid #FF3838;
        }
    `]
})

export class ProductGridItemComponent implements OnInit , AfterViewInit{
    //lineCheck : FormControl =  new FormControl();
    isEditMode: boolean = false;
    isSelected: boolean = false;
    searching : boolean  = false;
  
    productName: FormControl  =  new FormControl();
    qtyToSend : FormControl  =  new FormControl(1);
    @ViewChild("txtProductNameRef") productInputRef  : ElementRef;
    @Input() data: ProductGridModel;
    @Input() showStatus : boolean = false;
    @Input() storeId: string;
    @Output() onRemove : EventEmitter<ProductGridModel> =  new EventEmitter<ProductGridModel>();
    searchedProducts : ProductGridModel[] = [];
    constructor(private inventoryService: InventoryService,private locService: ReportGeneratorService) {
    }

    ngOnInit() {
        if(this.data.isNew)
        {
            this.makeEditable();
        }
        this.productName.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(x => {
            this.data.productName  = x;
            // perform a search Here
             if(this.data.isNew && !_.isEmpty(x))
             {
                 this.data.isNew = false;
             }
                if((!_.isEmpty(x) && x.length>2)  &&  !_.isEmpty(this.storeId))
                {
                    this.findProductInStore(x);
                }
                
        });
        this.qtyToSend.valueChanges.subscribe(x => {
            const  qty  = _.isNumber(_.parseInt(x)) ? _.toNumber(x)  : 1;
            this.data.qtyToSend  = qty ;
            //this.data.isAccepted = true; Tested the Accepted Property on the UI
        });
    }

    makeEditable() {
        this.isEditMode = true;
        this.isSelected  = false;
        
    }
    resetEditMode()
    {
        this.isEditMode = false;
    }

    toggleSelect() {
        this.isSelected = !this.isSelected;
    }
    findProductInStore(searchText: string) {
        // 

        const selectedStore: string = this.storeId;
        
        if (_.isEmpty(selectedStore)) {
            alert("Select a Store");
            return;
        }
        this.searching   = true;
        this.inventoryService.findFacilityProductList(
            {
                query: {
                    facilityId: this.locService.facilityId,
                    storeId: selectedStore,
                    searchText: searchText,
                    limit: 20,
                    skip: 0


                }
            }
        ).then(x => {
            this.searching  = false;
            this.searchedProducts  = x.data;
            console.log(x, "Inventory Service Search Result");
        }, x => {
            this.searching  = false;
            console.log("Error on Server!", x);
        });


    }
    itemClicked(item  : ProductGridModel)
    {
        // emit an event here
        
        // assign the selected product line to the selected product
        this.data  = item;
        
        // close the search suggested items
        this.searchedProducts  =[];
        
    }
    removeItem(item : ProductGridModel)
    {
       this.onRemove.emit(item);
    }
    // focus on ProductName Text input on Edit
    makeProductNameInputUiActive()
    {
       const elem  : HTMLInputElement  = this.productInputRef.nativeElement; 
       elem.focus();
       //elem.setSelectionRange(0, elem.value.length-1);
       elem.select();
    }

    ngAfterViewInit(): void {
       // console.log(this.productInputRef , "Product Name TextBox Reference");
        if(this.isEditMode)
        {
            this.makeProductNameInputUiActive();
        }
    }
   
}
