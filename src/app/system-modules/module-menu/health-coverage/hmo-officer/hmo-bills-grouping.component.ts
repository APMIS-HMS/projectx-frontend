import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'hmo-billing-grouping',
    template: `
        <div class="p-3 m-3" *ngFor="let nd of newData ">
            <h2 (click)="nd.showDetails = !nd.showDetails" style="cursor: pointer;">
                <span   [ngClass]="{'fa fa-chevron-down ': !nd.showDetails,'fa fa-chevron-up ': nd.showDetails}"></span>
                {{nd.key}} <span
                    *ngIf="!nd.showDetails" style="float:right; font-weight:bold; color:blue;">Total : <naira-currency></naira-currency>{{nd.sum | number}}</span>
            </h2>
            <table class="table table-bordered table-hover  table-light" *ngIf="nd.showDetails">

                <tr>
                    <td colspan="5">
                        <div *ngFor="let sg of nd.subGroup">
                            <h4 style="cursor: pointer;" [ngClass]="{'show-details-heading':sg.showDetails}"
                                (click)="sg.showDetails = !sg.showDetails">
                                <span   [ngClass]="{'fa fa-chevron-down ': !sg.showDetails,'fa fa-chevron-up ': sg.showDetails}"></span>
                                File No : {{sg.key}} <span
                                    style="float:right; font-weight:bold; color:blue;">Sub Total : <naira-currency></naira-currency>{{sg.sum | number}}</span>
                            </h4>
                            <div style="padding:15px;" *ngIf="sg.showDetails">
                                <table class="table table-dark text-black-50 show-details-table">
                                    <tr>
                                        <th>File Id</th>

                                        <th>Patient Detail</th>
                                        <th>Date</th>
                                        <th>Balance</th>
                                    </tr>
                                    <tr *ngFor="let s of sg.value" class="" (click)="handleItemSelectedEvent(s)">
                                        <td>{{s.coverFile.id}}</td>
                                        <td>{{s.billItems[0]?.patientObject?.personDetails?.firstName}}
                                            {{s.billItems[0]?.patientObject?.personDetails?.lastName}}
                                            <span style="color:#2027ab;font-weight: bold;">
                                        ({{s.billItems[0]?.patientObject?.personDetails?.apmisId}}) 
                                               
                                    </span> <span class="fa fa-chevron-right" *ngIf="s.billItems[0]?.serviceObject?.name"></span> {{s.billItems[0]?.serviceObject?.name}}</td>
                                        <td>{{s.updatedAt | date:'dd MMM, yyyy'}}</td>
                                        <td class="font-weight-bold text-right"
                                            style="font-weight: bold;text-align: right"><naira-currency></naira-currency>{{s.grandTotal | number}}
                                        </td>
                                    </tr>
                                    <tr style="font-weight: bold; background-color:#b7c9ec; ">
                                        <td colspan="3" class="text-right font-weight-bold bg-light"> Sub Total</td>
                                        <td class="text-right font-weight-bold"
                                            style="font-weight: bold;text-align: right">
                                            <naira-currency></naira-currency>{{sg.sum | number}}
                                        </td>
                                    </tr>
                                </table>

                            </div>

                        </div>
                    </td>
                </tr>

                <tr class="font-weight-bold" style="font-weight: bold; background-color: #e1d5d2; font-size:16px; ">
                    <td colspan="3" style=" text-align: left;">Total</td>
                    <td class="text-right" style=" text-align: right;"><naira-currency></naira-currency>{{nd.sum | number}}</td>
                </tr>
            </table>

        </div>`, 
    styles :[`
        .show-details-heading {

            padding: 7px 10px;
            background-color: #ced7cf;

        }

        .show-details-table {
            background-color: #cadde4;
            box-shadow: 1px 1px 10px rgba(56, 61, 63, 0.27);
        }

        .show-details-table td {
            padding: 7px 12px;
        }
    `]
})

export class HmoBillingGroupingComponent implements OnInit {
    @Input() newData : any[]  = [];
    @Output() itemSelected  : EventEmitter<any>   = new EventEmitter<any> ();
    
    constructor() {
    }
    handleItemSelectedEvent(item : any)
    {
        this.itemSelected.emit(item);
    }
    ngOnInit() {
    }
}