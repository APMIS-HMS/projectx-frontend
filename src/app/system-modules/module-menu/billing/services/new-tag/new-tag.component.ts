import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Tag, Facility } from '../../../../../models/index';
import { TagService, TagDictionaryService } from '../../../../../services/facility-manager/setup/index';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-new-tag',
  templateUrl: './new-tag.component.html',
  styleUrls: ['./new-tag.component.scss']
})
export class NewTagComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() tagValueChanged = new EventEmitter();
  @Input() tag = <any>{};
  mainErr = true;
  errMsg = 'You have unresolved errors';
  btnLabel = 'CREATE TAG';
  facility: Facility = <Facility>{};
  dictionaries: any[] = [];
  public frmNewtag: FormGroup;

  constructor(private formBuilder: FormBuilder, private _tagService: TagService,
    private _locker: CoolLocalStorage, private tagDictionaryService: TagDictionaryService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.addNew();
    if(this.tag.name !== undefined){
      this.btnLabel = 'UPDATE TAG';
      this.frmNewtag.controls['tagName'].setValue(this.tag.name);
    }
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    const subscribeForTagDictionary = this.frmNewtag.controls['tagName'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.tagDictionaryService.find({
        query:
          { word: { $regex: this.frmNewtag.controls['tagName'].value, '$options': 'i' } }
      }).
        then(payload => {
          if (this.frmNewtag.controls['tagName'].value.length === 0) {
            this.dictionaries = [];
          } else {
            this.dictionaries = payload.data;
          }
        },
        error => {
        })
      );

    subscribeForTagDictionary.subscribe((payload: any) => {
    });
  }

  addNew() {
    this.frmNewtag = this.formBuilder.group({
      tagName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  onSelectDictionary(dic: any) {
    this.frmNewtag.controls['tagName'].setValue(dic.word);
  }
  newTag(model: any, valid: boolean) {
    this.systemModuleService.on();
    if (valid) {
      if (this.tag.name == undefined){
        const tag: Tag = <Tag>{};
        tag.name = this.frmNewtag.controls['tagName'].value;
        tag.facilityId = this.facility._id;
        const authObj: any = this._locker.getObject('auth')
        const auth: any = authObj.data;
        tag.createdBy = auth._id;
        this._tagService.create(tag).then(callback => {
          this.systemModuleService.off();
          this.tagValueChanged.emit(true);
          this.frmNewtag.controls['tagName'].setValue('');
        }, error => {
          this.systemModuleService.off();
        });
        if (this.dictionaries.length === 0) {
          this.tagDictionaryService.create({ word: this.frmNewtag.controls['tagName'].value }).then(inPayload => {
          });
        }
      } else {
        let tag = this.tag;
        tag.name = this.frmNewtag.controls['tagName'].value;
        this._tagService.update(tag).then(callback => {
          this.systemModuleService.off();
          this.tagValueChanged.emit(true);
          this.frmNewtag.controls['tagName'].setValue('');
          this.btnLabel = 'CREATE TAG';
        }, error => {});

        if (this.dictionaries.length === 0) {
          this.tagDictionaryService.create({ word: this.frmNewtag.controls['tagName'].value }).then(inPayload => {
          });
        }
      }
    }
  }
}
