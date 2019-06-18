import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { ProductPackSize, StoreProduct, ProductBase } from 'app/system-modules/module-menu/apmis-store/store-utils/global';

@Injectable()
export class ProductObserverService {
    private productSubject = new Subject<StoreProduct>();
    productChanged = this.productSubject.asObservable();

    private drugConfigBtnSubject = new BehaviorSubject(false);
    drugConfigBtnChanged = this.drugConfigBtnSubject.asObservable();

    private baseUnitSubject = new BehaviorSubject(false);
    baseUnitChanged = this.baseUnitSubject.asObservable();

    private configContainerSubject = new BehaviorSubject(false);
    configContainerChanged = this.configContainerSubject.asObservable();

    private selectedPackSizeSubject = new Subject<ProductPackSize[]>();
    selectedPackSizeChanged = this.selectedPackSizeSubject.asObservable();

    private isBaseUnitSubject = new Subject<ProductBase>();
    isBaseUnitChanged = this.isBaseUnitSubject.asObservable();

    private preSelectedProductSubject = new Subject<any>();
    preSelectedChanged = this.preSelectedProductSubject.asObservable();

    private productNameSubject = new BehaviorSubject('');
    productNameChanged = this.productNameSubject.asObservable();

    private selectedEditableConfig = new Subject<any>();
    editableConfigChanged = this.selectedEditableConfig.asObservable();

    private toggleIndexSubject = new BehaviorSubject(0);
    toggleIndexChanged = this.toggleIndexSubject.asObservable();

    private toggleFilterViewSubject = new BehaviorSubject('');
    filterViewChanged = this.toggleFilterViewSubject.asObservable();

    setSelectedProduct(data: StoreProduct) {
        this.productSubject.next(data);
    }
    drugConfigBtnState(state: boolean) {
        this.drugConfigBtnSubject.next(state);
    }
    setBaseUnitState(state: boolean) {
        this.baseUnitSubject.next(state);
    }
    setConfigContainerState(state: boolean) {
        this.configContainerSubject.next(state);
    }
    setSelectedPackSize(data: ProductPackSize[]) {
        this.selectedPackSizeSubject.next(data);
    }
    setIsBaseUnit(data: ProductBase) {
        this.isBaseUnitSubject.next(data);
    }
    setPreselectedProduct(data) {
        this.preSelectedProductSubject.next(data);
    }
    setProductName(name: string) {
        this.productNameSubject.next(name);
    }
    setConfigDataToEdit(data) {
        this.selectedEditableConfig.next(data);
    }
    setToggleIndex(index: number) {
        this.toggleIndexSubject.next(index);
    }
    setFilterView(filter: string) {
        this.toggleFilterViewSubject.next(filter);
    }
}
