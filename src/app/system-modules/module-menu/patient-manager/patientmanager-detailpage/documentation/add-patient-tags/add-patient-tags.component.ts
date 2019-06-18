import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import {
  PatientService, PersonService, FacilitiesService, FacilitiesServiceCategoryService,
  HmoService, GenderService, RelationshipService, CountriesService, TitleService, TagService
} from 'app/services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { Facility, Patient, Gender, Relationship, Employee, Person, User } from 'app/models/index';

@Component({
  selector: 'app-add-patient-tags',
  templateUrl: './add-patient-tags.component.html',
  styleUrls: ['./add-patient-tags.component.scss']
})
export class AddPatientTagsComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient;

  facility: Facility = <Facility>{};

  tagName = new FormControl('', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]);
  identity = new FormControl('');

  tag;
  tags;
  changetagButton: boolean = false;
  dictionaries;

  tagLoader: boolean = false;
  showSearchResult: boolean = false;

  btnLabel = "Add Tag";

  mainErr: boolean = true;
  errMsg: string;

  constructor(private systemService: SystemModuleService, private tagService: TagService, private locker: CoolLocalStorage) {
    this.facility = <Facility>this.locker.getObject('selectedFacility');
  }

  ngOnInit() {
    this.tagName.valueChanges
      .debounceTime(200)
      .distinctUntilChanged().subscribe(payload => {
        if (payload.length >= 1) {
          this.showSearchResult = true;
          this.tagService.suggestPatientTags({
            query: {
              facilityId: this.facility._id,
              word: payload
            }
          }).then(suggestPayload => {
            if(suggestPayload.length === 0){
              this.showSearchResult = false;
            }
            this.dictionaries = suggestPayload;
          });
        } else {
          this.showSearchResult = false;
        }
      });
  }
  

  close_onClick() {
    this.closeModal.emit(true);
  }

  changeButton() { }

  newTag(valid: boolean) {
    this.systemService.on();
    this.tagLoader = true;
    const tag: any = <any>{};
    if (this.identity.value === true) {
      tag.tagType = 'identification';
    }
    tag.identity = this.identity.value;
    tag.name = this.tagName.value;
    tag.facilityId = this.facility._id;
    tag.patientId = this.patient._id;
    this.tagService.createSuggestedPatientTags(tag).then(payl => {
      this.systemService.off();
      this.tagLoader = false;
      if (payl.status === "error") {
        this.mainErr = false;
        this.errMsg = payl.message;
      } else {
        this.patient.tags = payl.data.tags;
        this.tagName.setValue('');
        this.identity.reset();
      }
    });
  }

  displayFn(tag: any): string {
    return tag ? tag.name : tag;
  }

  fillingWithSearchInfo(tag) {
    this.tagName.setValue(tag.name);
  }

  hideSuggestions() {
    this.showSearchResult = false;
  }

}
