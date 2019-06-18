import { ProductObserverService } from '../../../../../services/tools/product-observer.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../../../services/facility-manager/setup/product.service';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { ProductConfig } from '../../store-utils/global';


@Component({
  selector: 'app-product-conguration',
  templateUrl: './product-conguration.component.html',
  styleUrls: ['./product-conguration.component.scss']
})
export class ProductCongurationComponent implements OnInit, OnDestroy {
  currentFacility: Facility = <Facility>{};
  productConfigs = [];
  baseUnit = '';
  productConfigType;
  selectedProductConfig;
  productConfigLoading = true;
  configToDelete: any = <any>{};
  subscription: Subscription;
  editObject: ProductConfig = <ProductConfig>{};
  
  constructor(private productService: ProductService,
    private systemModuleService: SystemModuleService,
    private pdObserverService: ProductObserverService,
    private locker: CoolLocalStorage) { }
  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getProductConfigsByFacility();

    this.subscription = this.productService.productConfigRecieved().subscribe(payload => {
        this.productConfigs.push(payload);
        const index = this.productConfigs.length - 1;
        this.productConfigs[index].baseUnit = payload.packSizes.filter(y => y.isBase);
    });
    this.productService.productConfigUpdateRecieved().subscribe(payload => {
      if (payload) {
        this.getProductConfigsByFacility();
      }
    }, err => {
    });
  }

  onEdit(data: ProductConfig) {

    this.productConfigType = data.productType ? data.productType : 0;
    data.productType = data.productType ? data.productType : 0;
    this.pdObserverService.setToggleIndex(this.productConfigType);
    this.pdObserverService.setConfigDataToEdit(data);
    //console.log('editing data');
    //console.log(data);
  }

  getProductConfigsByFacility() {
    let prop =[];
    let noprob=[];
    this.productService.findProductConfigs({
      query: {
        $limit: false,
        facilityId: this.currentFacility._id
      }
    }).then(payload => {
      this.productConfigLoading = false;
      if (payload.data.length > 0) {
        this.productConfigs = payload.data;
        //console.log(this.productConfigs);
        this.productConfigs.forEach(x => {
            x.baseUnit = x.packSizes.filter(y => y.isBase);
        });
        
         this.productConfigs.forEach(x => {
           if  (x.hasOwnProperty('productObject')){
            prop.push(x);
           }else{
            noprob.push(x);
           }     
      });

        prop.sort((a, b) =>(a.productObject.name > b.productObject.name) ? 1 : -1);
       // console.log (prop);
        //console.log (noprob); 
        this.productConfigs=prop;
        // calling reverse on array to display most recent record in array
        // this.reverseArray(this.productConfigs);
      }
    
      });
      }
  confirmDelete(data) {
    this.configToDelete = data;
    this.configToDelete.acceptFunction = true;
    this.systemModuleService.announceSweetProxy(`You are about to delete configuration for
                  : '${data.productObject.name}'`, 'question', this);
  }
  sweetAlertCallback(result) {
		if (result.value) {
		  if (this.configToDelete.acceptFunction === true) {
				// proceed with the delete action after user has confirmed
				this.deleteProductConfiguration(true);
		  } else {
				this.deleteProductConfiguration(false);
		  }
			}
    }
  deleteProductConfiguration(isProceed: boolean) {
      if (isProceed) {
        this.productService.removeProductConfig(this.configToDelete._id, {}).then(payload => {
             this.getProductConfigsByFacility();
        });
      }
  }
  ngOnDestroy() {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }
}
