import {Component, Input} from '@angular/core';

@Component({
    selector: 'naira-currency',
    template: `<span [class]="cssClass">&#8358;</span>`
})

export class NairaCurrencySymbolComponent  {
    @Input() cssClass  : string  = "";
  
}