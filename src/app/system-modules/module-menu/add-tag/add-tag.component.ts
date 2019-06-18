import { Component, OnInit } from '@angular/core';
import { FacilitiesServiceCategoryService, TagService } from '../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, Tag } from '../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { error } from 'util';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  facility: Facility = <Facility>{};
  tags: Tag[] = [];
  searchTag = new FormControl();
  newServicePopup = false;
  newCategoryPopup = false;
  newTagPopup = false;
  editedTag = <any>{};
  constructor(private _locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService,
    private _tagService: TagService) {
    this._tagService.createListener.subscribe(payload => {
      this.getTags();
    });
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.getTags();

    const subscribeForTag = this.searchTag.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(value => this._tagService.serach({
        query:
          { search: this.searchTag.value, facilityId: this.facility._id }
      }).
        then(payload => {
          this.tags = payload.data;
        }));

    subscribeForTag.subscribe((payload: any) => {
    });

  }
  getTags() {
    this.systemModuleService.on();
    this._tagService.find({ query: { facilityId: this.facility._id } }).then(payload => {
      this.systemModuleService.off();
      if (payload.length > 0) {
        this.tags = payload.data;
      }
    });
  }
  newTagPopup_show() {
    this.newTagPopup = true;
  }

  onTagValueChange() {
    this.getTags();
    this.editedTag = {};
  }

  onTagEdit(tag) {
    const text = 'You are about to edit ' + tag.name.toUpperCase() + ' tag';
    this.systemModuleService.announceSweetProxy(text, 'info', this);
    this.editedTag = tag;
    this.newTagPopup = true;
  }

  onTagRemove(tag) {
    this.systemModuleService.announceSweetProxy('You are about to delete this tag', 'question', this);
    this.editedTag = tag;
  }

  sweetAlertCallback(result) {
    this.systemModuleService.on();
    if (result.value) {
      this._tagService.remove(this.editedTag._id, {}).then(callback_remove => {
        const msg = `${this.editedTag.name} is deleted`;
        this.systemModuleService.announceSweetProxy(msg, 'success');
        this.systemModuleService.off();
        this.getTags();
        this.editedTag = {};
      }, error => {
        this.systemModuleService.off();
      });
    }
  }


  close_onClick(e) {
    this.newServicePopup = false;
    this.newCategoryPopup = false;
    this.newTagPopup = false;
    this.editedTag = {};
  }
}
