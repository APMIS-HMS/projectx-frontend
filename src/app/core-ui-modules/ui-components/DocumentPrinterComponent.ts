import {Component, Input, OnInit, ElementRef} from '@angular/core';

@Component({
    selector: 'app-document-printer',
    template: `
        <apmis-pager-button [is-oval]="true" (onClick)="printReport()">
            <span class="fa fa-print fa-2x"></span>
        </apmis-pager-button>
    `
})

export class DocumentPrinterComponent implements OnInit {
    @Input() content: string;
   

    constructor() {
    }

    ngOnInit() {
        //console.log(this.content);
    }

    printReport() {
        if (this.content) {

            const wnd:Window = window.open('', 'Lab Report', 'width=860px ; height=680px');
            // also clone head tag of the document
            const headTag  = document.getElementsByTagName("head")[0];
            console.log("Head Tag", headTag);
            
            
              // clone the node marked as report content
                const  node  =  document.getElementById(this.content).cloneNode(true);
                
                wnd.document.head.innerHTML  = headTag.innerHTML;
                wnd.document.body.appendChild(node) ;// = this.content.nativeElement;
                
                console.log("Template Reference from Angular",node);
        }
        else {
            // print currentPage
            window.print();
        }
    }
}