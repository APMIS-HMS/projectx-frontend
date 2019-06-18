import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { DocumentUploadService, FacilitiesService } from 'app/services/facility-manager/setup';

@Component({
	selector: 'app-print-documentation',
	templateUrl: './print-documentation.component.html',
	styleUrls: [ './print-documentation.component.scss' ]
})
export class PrintDocumentationComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() patientDocumentation: any = <any>{};
	@Input() patient: any = <any>{};
	loading: boolean;

	constructor(private docUploadService: DocumentUploadService, private facilityService: FacilitiesService) {}

	ngOnInit() {
		this.getDocuments();
	}

	getDocuments() {
		this.docUploadService
			.docUploadFind({
				query: {
					patientId: this.patient._id,
					facilityId: this.facilityService.getSelectedFacilityId()._id,
					$sort: {
						createdAt: -1
					}
				}
			})
			.then((payload) => {
				// this.documents = payload.data;
				payload.data.forEach((document) => {
					this.patientDocumentation.documentations.push(document);
				});
				// this.patientDocumentation.documentations.push(...payload.data);
			});
	}
	sortDocumentation() {
		return this.patientDocumentation.documentations.sort(function(a, b) {
			return a.createdAt < b.createdAt;
		});
	}

	getCurrentDocument(group) {
		return {
			url: group.docUrl
		};
	}

	onComplete(event) {
		this.loading = false;
	}
	onError(event) {
		this.loading = false;
		// this.loadingError = true;
	}
	onProgress(progressData: any) {}

	onClickPrintDocument() {
		const printContents = document.getElementById('printDoc-Section').innerHTML;
		const popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
		popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
            table{
              width: 100%;
              position: relative;
              border-collapse: collapse;
              font-size: 1.2rem;
            }
            table, td { 
                border: 0.5px solid #ddd;
            } 
            th {
                height: 50px;
                background: transparent;
                border: 0.5px solid #ddd;
            }
            td {
                vertical-align: center;
                text-align: left;
                padding: 5px;
            }
            tr:nth-child(even) {background-color: #f8f8f8}
            
           
.doc-preview-margin{
  padding: 2px;
  overflow: auto;
  width: auto !important;
}
.txt-wrap{
  display:inline-block;
}
.filter-doc{
  height: 100px;
  background:white; 
  border-radius: 5px;
}
.docPreview{
  display: grid;
  grid-template-rows: auto;
  grid-gap: 1em;
  background: white;
  border-radius: 5px;
  width: 800px;
  height: 510px;
  padding: 10px;
  overflow: auto;
}

.top-bio{
  text-align: center;
  align-items: center;
  box-shadow: 0 3px 0px rgba(0, 0, 0, 0.5);
  padding: 5px;
  width: auto;
  height: auto;
  margin: 10px;
  display: grid;
  justify-content: center;
  flex-wrap: wrap;
  
}

.doc-content{
  border-radius: 5px;
  width: 800px
}

.doc-con{
  padding-top: 10px;
}

.secWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  // margin: 5px;
}

.secWrap-header{
  text-align: center;
  padding: 5px;
}

th{
  font-size: 1rem;
  text-align: center;
  font-weight: normal;
  color: #ff2500;
  border-bottom: 1px solid #ff2500;
  padding: 10px;
  min-width: 60px;
}
td{
  font-size: 1rem;
  text-align: center;
  font-weight: normal;
  padding: 10px;
  min-width: 60px;
}

.filter-section {
  display: flex;
  align-content: center;
  align-items: center;
  height: 50px;
  background: lightgrey;
}

.filter-margin {
  margin: 5px;
}


.float{
position:fixed;
width:60px;
height:60px;
bottom:40px;
  right:40px;
  cursor: pointer;
background-color:rgb(0, 68, 255);
color:#FFF;
border-radius:50px;
text-align:center;
box-shadow: 2px 2px 3px #999;
}


.control-group{
  display: inline-block;
  vertical-align: top;
  text-align: left;
  box-shadow: 0 3px 2px rgba(0, 0, 0, 0.5);
  padding: 20px;
  width: 92%;
  height: auto;
  margin: 0px 10px 10px 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}


.doc-span{
  font-weight: bold;
  text-decoration: underline;
}


.doc-p{
  padding: 0px 10px 10px 10px;
  text-align: justify;
}

.control-group-header{
  max-height: 30px;
  background: rgba(211, 211, 211, 0.719);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px;
}

footer{
  background-color: 0 3px 0px rgba(112, 111, 111, 0.253);
  text-align: center;
  -webkit-text-fill-color: white;
  font-weight: 500;
  background: grey;
  height: 20px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  justify-content: center;
  position: inherit;
}

.pdf-wrap{
    box-sizing: border-box;
    width: 100% !important;
    display: block;
}


          </style>
        </head>
        <body onload="window.print();window.close()">
        ${printContents}
        </body>
      </html>`);
		popupWin.document.close();
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

	checkType(value) {
		if (typeof value === 'string') {
			return true;
		} else if (typeof value === 'number') {
			return true;
		} else if (value.length !== undefined) {
			return true;
		}
	}
}
