import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'apmis-spinner',
    template: `<span *ngIf="visible"><i class="fa fa-circle-o-notch fa-spin {{iconSize}} text-blue"
                                        aria-hidden="true"></i></span>`
})
export class ApmisSpinnerComponent implements OnChanges {
    @Input() visible: boolean = true;
    @Input() size: string = "medium";
    iconSize: string = 'fa-2x';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["size"] != undefined) {
            // calculate height
            this.calSize();
        }
    } // small , medium, large, x-large, xx-large
    private calSize() {
        switch (this.size.toLowerCase()) {
            case 'small':
                this.iconSize = 'fa';
                break;
            case 'medium':
                this.iconSize = 'fa-2x';
                break;
            case 'large':
                this.iconSize = 'fa-3x';
                break;
            case 'x-large':
                this.iconSize = 'fa-4x';
                break;
            case 'xx-large':
                this.iconSize = 'fa-5x';
                break;
            default:
                this.iconSize  = 'fa-2x';
        }
    }
}