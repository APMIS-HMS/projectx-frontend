import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'dialog-host',
    template: `
        <div *ngIf="visible" class="modal-overlay" >
            <ng-content>
                
            </ng-content>
            
        </div>
    `
})

export class DialogHostComponent implements OnInit {
    @Input() visible : boolean   =  false;

    constructor() {
    }

    ngOnInit() {
    }
}
