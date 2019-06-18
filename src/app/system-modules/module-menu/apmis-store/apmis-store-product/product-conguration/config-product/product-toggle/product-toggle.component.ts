import { ProductObserverService } from './../../../../../../../services/tools/product-observer.service';
import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ProductType } from 'app/system-modules/module-menu/apmis-store/store-utils/global';

@Component({
  selector: 'app-product-toggle',
  templateUrl: './product-toggle.component.html',
  styleUrls: ['./product-toggle.component.scss']
})
export class ProductToggleComponent implements OnInit, OnDestroy {
  @Input() data;
  @Output() onToggleSelected =  new EventEmitter();
  toggleSubscription: Subscription;
  selectedToggleIndex = 0;
  drugSearchEntry = false;
  consumableEntry = false;
  constructor(private pdObserverService: ProductObserverService) {
  }
  ngOnInit() {
    // this.onToggle(this.selectedToggleIndex);
    this.toggleSubscription = this.pdObserverService.toggleIndexChanged.subscribe((payload: number) => {
      this.selectedToggleIndex = payload;
      if (this.selectedToggleIndex === ProductType.Drugs) {
          this.drugSearchEntry = true;
          this.consumableEntry = false;
        } else if (this.selectedToggleIndex === ProductType.Consumables) {
          this.consumableEntry = true;
          this.drugSearchEntry = false;
        }
    });
  }
  onToggle(index) {
    this.pdObserverService.setToggleIndex(index);
    this.selectedToggleIndex = index;
    this.pdObserverService.setBaseUnitState(false);
    switch (this.selectedToggleIndex) {
        case ProductType.Drugs:
            this.drugSearchEntry = true;
            this.consumableEntry = false;
          break;
        case ProductType.Consumables:
            this.consumableEntry = true;
            this.drugSearchEntry = false;
        break;
        default:
          break;
    }
  }
  ngOnDestroy() {
    if (this.toggleSubscription !== null) {
      this.toggleSubscription.unsubscribe();
    }
  }
}
