import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { FacilitiesServiceCategoryService, ServicePriceService } from '../../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, FacilityServicePrice } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-new-price',
  templateUrl: './new-price.component.html',
  styleUrls: ['./new-price.component.scss']
})
export class NewPriceComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = 'you have unresolved errors';
  categories: FacilityService[] = [];
  selectedCategory: FacilityService = <FacilityService>{};
  services: CustomCategory[] = [];
  facility: Facility = <Facility>{};
  frmNewprice: FormGroup;
  frmNewprice2: FormGroup;
  msg = '';
  loadingIndicator = false;
  constructor(private formBuilder: FormBuilder, private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private _locker: CoolLocalStorage, private servicePriceService: ServicePriceService) {
  }

  ngOnInit() {
    this.addNew();
    this.addNew2();
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.getCategories();

    this.frmNewprice.controls['serviceCat'].valueChanges.subscribe(value => {
      this.filterServices(value);
      this.selectedCategory = value;
      this.loadingIndicator = false;
      this.msg = '';
    });

  }
  addNew() {
    this.frmNewprice = this.formBuilder.group({
      serviceCat: ['', [<any>Validators.required]],
      service: ['', [<any>Validators.required]],
      //service: this.formBuilder.array(['service'],<any>Validators.required),
      //price: this.formBuilder.array([],<any>Validators.required)
      price: [0.00, [<any>Validators.required]]
    });
  }

  
  addNew2() {
    this.frmNewprice2 = this.formBuilder.group({
      'priceArray': this.formBuilder.array([
        this.formBuilder.group({
          item: ['', [<any>Validators.required]],
          amount: [0.00, [<any>Validators.required]],
          priceObject: [, [<any>Validators.required]]
        })
      ])
    });
    this.frmNewprice2.controls['priceArray'] = this.formBuilder.array([]);
  }
  filterServices(itemj) {
    this.services = [];
    this.frmNewprice2.controls['priceArray'] = this.formBuilder.array([]);
    this.servicePriceService.find({ query: { facilityId: this.facility._id, categoryId: itemj._id } }).then(payload => {
      const prices: any[] = payload.data;
      itemj.services.forEach((itemk, k) => {
        const customCategory: CustomCategory = <CustomCategory>{};
        customCategory.service = itemk.name;
        customCategory.serviceId = itemk._id;
        customCategory.facilityServiceId = itemj.facilityServiceId;
        customCategory.category = itemj.name;
        customCategory.serviceCode = itemk.code;
        this.services.push(customCategory);

        let productPrice: any = { price: 0 };
        let findPrice = false;
        const filterPrice = prices.filter(x => x.serviceId === customCategory.serviceId);
        if (filterPrice.length > 0) {
          productPrice = filterPrice[0];
          findPrice = true;
        }

        if (findPrice) {
          (<FormArray>this.frmNewprice2.controls['priceArray']).push(
            this.formBuilder.group({
              item: [itemk, [<any>Validators.required]],
              amount: [productPrice.price, [<any>Validators.required]],
              priceObject: [productPrice, [<any>Validators.required]]
            })
          );
        } else {
          (<FormArray>this.frmNewprice2.controls['priceArray']).push(
            this.formBuilder.group({
              item: [itemk, [<any>Validators.required]],
              amount: [productPrice.price, [<any>Validators.required]],
              priceObject: [, [<any>Validators.required]]
            })
          );
        }

      });
    })
  }
  getCategories() {
    this._facilitiesServiceCategoryService.find({
      query: {
        $or: [
          { facilityId: this.facility._id },
          { facilityId: undefined }
        ]
      }
    })
      .then(payload => {
        this.categories = [];
        this.services = [];
        payload.data.forEach((itemi, i) => {
          itemi.categories.forEach((itemj, j) => {
            if (itemi.facilityId !== undefined) {
              itemj.facilityServiceId = itemi._id;
              this.categories.push(itemj);
            }
          });
        });
      });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  newPrice(value: any, valid: boolean) {
    (<FormArray>this.frmNewprice2.controls['priceArray'])
      .controls.forEach((itemi: any, i) => {
        this.msg = 'Please wait performing this operation';
        this.loadingIndicator = true;
        if (itemi.value.priceObject === null && itemi.value.amount > 0) {
          const price: FacilityServicePrice = <FacilityServicePrice>{};
          price.categoryId = value.serviceCat._id;
          price.facilityId = this.facility._id;
          price.serviceId = itemi.value.item._id;
          price.facilityServiceId = this.selectedCategory.facilityServiceId;
          price.price = itemi.value.amount;
          Observable.fromPromise(this.servicePriceService.create(price)).subscribe(payload => {
            this.msg = 'Operation completed successfully';
            this.loadingIndicator = false;
          });
        } else if (itemi.value.priceObject !== null) {
          let priceObject = itemi.value.priceObject;
          priceObject.price = itemi.value.amount;
          Observable.fromPromise(this.servicePriceService.update(priceObject)).subscribe(payload => {
            this.msg = 'Operation completed successfully';
            this.loadingIndicator = false;
          })
        } else {
        }
      });



    // const price: FacilityServicePrice = <FacilityServicePrice>{};
    // price.categoryId = value.serviceCat._id;
    // price.facilityId = this.facility._id;
    // price.serviceId = value.service.serviceId;
    // price.facilityServiceId = value.service.facilityServiceId;
    // price.price = value.price;
    // this.servicePriceService.create(price).then(payload => {
    //   this.addNew();
    //   this.frmNewprice.controls['serviceCat'].valueChanges.subscribe(newValue => {
    //     this.filterServices(newValue);
    //     this.selectedCategory = newValue;
    //   });
    // });
  }
  getPrice(service) {
    Observable.fromPromise(this.servicePriceService
      .find({ query: { facilityServiceId: service.facilityServiceId, serviceId: service.serviceId } }))
      .subscribe((payload: any) => {
      })
  }
}
