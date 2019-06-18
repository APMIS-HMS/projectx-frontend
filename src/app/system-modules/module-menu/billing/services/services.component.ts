import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FacilitiesServiceCategoryService, TagService, FacilityPriceService } from '../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, Tag, FacilityServicePrice } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  searchShowc = false;
  searchShow = false;
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  facility: Facility = <Facility>{};
  prices: FacilityServicePrice[] = [];
  categories: any[] = [];
  facilityServiceId: any;
  tags: Tag[] = [];
  globalCategories: CustomCategory[] = [];
  globalCategoriesToBePaginated: CustomCategory[] = [];
  selectedServices = [];
  searchCategory = new FormControl();
  searchService = new FormControl();
  searchTag = new FormControl();
  newServicePopup = false;
  newCategoryPopup = false;
  newTagPopup = false;
  newModefierPopup = false;
  serviceDetail = false;
  newPricePopup = false;
  selectedFacilityServicePrice = FacilityPriceService;
  showNewModifer = false;


  selectedService: any = <any>{};
  selectedCategory: any = <any>{};
  selectedPriceItem: any = <any>{};
  index = 1;
  pageSize = 10;

  showLoadMore = true;

  constructor(
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private _locker: CoolLocalStorage,
    private _tagService: TagService,
    private systemModuleService: SystemModuleService) {

  }

  ngOnInit() {
    this.pageInView.emit('Services/Billing Manager');
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.getCategories();
    this.getTags();

    const subscribeForCategory = this.searchCategory.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value !== null && value !== '' && value.length > 0) {
          this.categories = this.categories.filter(x => x.name.toLowerCase().includes(value.toLowerCase()))
        } else {
          this.getCategories();
        }
      });

    this.searchService.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value !== null && value !== '' && value.length > 0) {
          this.selectedServices = this.selectedServices.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
        } else {
          if (this.selectedCategory._id !== undefined) {
            this.selectCategory(this.selectedCategory);
          }
        }
      });

    const subscribeForTag = this.searchTag.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: Tag[]) => this._tagService.find({
        query:
          { search: this.searchTag.value, facilityId: this.facility._id }
      }).then(payload => {
        this.tags = payload.data;
      }));

    subscribeForTag.subscribe((payload: any) => {
    });
  }

  selectCategory(category) {
    
    this.systemModuleService.on();
    this.selectedServices = [];
    this.selectedCategory = category;
    if (this.selectedCategory._id !== undefined) {
      this._facilitiesServiceCategoryService.allServices({
        query:{
          facilityId: this.facility._id,
          categoryId: this.selectedCategory._id
        }
      }
      ).then(payload => {
        this.systemModuleService.off();
        this.selectedServices = payload.services;
      });
    } else {
      this.systemModuleService.off();
    }
  }

  onDoubleClick(value: any) {
    this.selectedService = value;
    this.newServicePopup = true;
  }
  onDoubleClickCategory(value: any) {
    this.selectedCategory = value;
    this.newCategoryPopup = true;
  }
  filterOutCategory(payload) {
    this.categories = [];
    payload.data.forEach((itemi, i) => {
      itemi.categories.forEach((itemj, j) => {
        if (itemi.facilityId !== undefined) {
          this.categories.push(itemj);
        }
      });
    });
  }

  filterOutService(payload) {
    this.globalCategories = [];
    payload.data.forEach((itemi, i) => {
      itemi.categories.forEach((itemj, j) => {
        if (itemi.facilityId !== undefined) {
          // this.categories.push(itemj);
        }
        itemj.services.forEach((itemk, k) => {
          const customCategory: CustomCategory = <CustomCategory>{};
          customCategory.service = itemk.name;
          customCategory.serviceId = itemk._id;
          customCategory.category = itemj.name;
          customCategory.serviceCode = itemk.code;
          if (itemi.facilityId === undefined) {
            customCategory.isGlobal = true;
          } else {
            customCategory.isGlobal = false;
          }
          this.globalCategories.push(customCategory);
        });
      });
    });
  }
  getCategories() {
    this.systemModuleService.on();
    this._facilitiesServiceCategoryService.find({
      query: {
        facilityId: this.facility._id,
        $select: ['_id', 'categories._id', 'categories.name']
      }
    }).then(payload => {
      this.systemModuleService.off();
      this.categories = payload.data[0].categories;
      this.facilityServiceId = payload.data[0]._id;
      this.selectCategory(this.categories[0]);
    }, error => {
      this.systemModuleService.off();
    });
  }

  getTags() {
    this._tagService.find({ query: { facilityId: this.facility._id } }).then(payload => {
      this.tags = payload.data;
    });
  }
  

  newServicePopup_show(val) {
    this.selectedService = val;
    this.selectedService.categoryId = this.selectedCategory._id;
    this.selectedService.facilityServiceId = this.facilityServiceId;
    this.newServicePopup = true;
  }

  addModifierPopup_show() {
    this.newModefierPopup = false;
    this.serviceDetail = false;
  }
  newModefierPopup_show(price: FacilityServicePrice) {
    this.newModefierPopup = true;
    this.newPricePopup = false;
    this.serviceDetail = false;
  }

  onRefreshService(categoryId) {
    this.systemModuleService.on();
    if (categoryId !== undefined && categoryId !== null) {
      this._facilitiesServiceCategoryService.allServices({
        query: {
          facilityId: this.facility._id,
          categoryId: categoryId
        }
      }).then(payload => {
        this.systemModuleService.off();
        this.selectedServices = payload.services;
      });
    } else {
      this.systemModuleService.off();
    }
  }

  newCategoryPopup_show(value?: any) {
    if (!!value) {
      this.selectedCategory = value;
    }
    this.newCategoryPopup = true;
  }

  newTagPopup_show() {
    this.newTagPopup = true;
  }
  close_onClick(e) {
    this.newServicePopup = false;
    this.newCategoryPopup = false;
    this.newTagPopup = false;
    this.newModefierPopup = false;
    this.showNewModifer = false;
  }
  onClickshowNewModifer(value) {
    this.selectedPriceItem = value.price.filter(x => x.isBase === true)[0];
    this.showNewModifer = !this.showNewModifer;
  }

  onRefreshCategory(event) {
    this.getCategories();
  }

  serviceDetail_show(price) {
    this.serviceDetail = true;
    this.newPricePopup = false;
    this.newModefierPopup = false;
    this.selectedFacilityServicePrice = price;
  }
  paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  }

  loadMoreGlobalCategories() {
    if (this.globalCategoriesToBePaginated.length <= this.globalCategories.length) {
      this.showLoadMore = false;
    } else {
      const goo = this.paginate(this.globalCategoriesToBePaginated, this.pageSize, this.index);
      this.globalCategories.push(...goo);
      this.index++;
    }
  }

  showSearch() {
    this.searchShow = true;
  }

  closeSearch() {
    this.searchShow = false;
  }

  showSearchc() {
    this.searchShowc = true;
  }

  closeSearchc() {
    this.searchShowc = false;
  }
}
