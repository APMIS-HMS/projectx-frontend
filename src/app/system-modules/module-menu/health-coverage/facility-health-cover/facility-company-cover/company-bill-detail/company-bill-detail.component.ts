import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-company-bill-detail",
  templateUrl: "./company-bill-detail.component.html",
  styleUrls: ["./company-bill-detail.component.scss"]
})
export class CompanyBillDetailComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  hmoTypeControl: FormControl = new FormControl();
  authCodeControl: FormControl = new FormControl();
  workspace: any;
  constructor() {}

  ngOnInit() {}

  close_onClick() {
    this.closeModal.emit(true);
  }

  newWorkspace_onClick(employee) {}
  deletion_popup(workspace) {}
}
