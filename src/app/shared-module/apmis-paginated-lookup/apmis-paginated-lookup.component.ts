import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  forwardRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator
} from '@angular/forms';
import {
  FacilitiesService,
  FacilitiesServiceCategoryService
} from './../../services/facility-manager/setup/index';
import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatPaginator, PageEvent } from '@angular/material';

@Component({
  selector: 'app-apmis-paginated-lookup',
  templateUrl: './apmis-paginated-lookup.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApmisPaginatedLookupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ApmisPaginatedLookupComponent),
      multi: true
    }
  ],
  styleUrls: ['./apmis-paginated-lookup.component.scss']
})
export class ApmisPaginatedLookupComponent implements OnInit, ControlValueAccessor, Validator {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  operateResults = [];
  filteredResults = [];
  @Input() displayKey = '';
  @Input() url = '';
  @Input() placeholder = '';
  @Input() query: any = {};
  @Input() imgObj = '';
  @Input() min = 0;
  @Input() otherKeys = [];
  @Input() isSocket = false;
  @Input() multipleKeys = false;
  @Input() displayImage = false;
  @Output() selectedItem = new EventEmitter();
  public _socket;
  public _rest;
  public valueString = '';
  public valueParseError: boolean;
  public data: any;
  searchText = '';
  isLoadingMore = false;
  showCuDropdown = false;
  cuDropdownLoading = false;
  form: FormGroup;
  selectedValue: any = {};
  baseUrl: any;
  imgError = false;
  results = [];
  constructor(
    private fb: FormBuilder,
    private _socketService: SocketService,
    private _restService: RestService,
    private facilitiesService: FacilitiesService,
    private facilityServiceCategory: FacilitiesServiceCategoryService
  ) { }

  ngOnInit() {
    this._rest = this._restService.getService(this.url);
    this._socket = this._socketService.getService(this.url);
    this.baseUrl = this._restService.HOST;
    this.form = this.fb.group({ searchtext: [''] });
    this.form.controls['searchtext'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(value => this.filter({
        query: this.query
      }, this.isSocket))
      .subscribe((payload: any) => {
        this.cuDropdownLoading = false;
        if (payload !== undefined && payload.data !== undefined) {
          this.results = payload.data;
          const startIndex = 0 * 10;
          this.operateResults = JSON.parse(JSON.stringify(this.results));
          this.filteredResults = JSON.parse(JSON.stringify(this.operateResults.splice(startIndex, 10)));
        } else {
          this.results = payload;
          const startIndex = 0 * 10;
          this.operateResults = JSON.parse(JSON.stringify(this.results));
          this.filteredResults = JSON.parse(JSON.stringify(this.operateResults.splice(startIndex, 10)));
        }
      });
  }

  onPaginateChange(event) {
    this.cuDropdownLoading = true;
    let _pageIndex = 1;
    _pageIndex += event.pageIndex;
    let _pageLength = _pageIndex * event.pageSize;
    if (_pageLength < this.results.length) {
      const startIndex = event.pageIndex * event.pageSize;
      this.operateResults = JSON.parse(JSON.stringify(this.results));
      this.filteredResults = JSON.parse(JSON.stringify(this.operateResults.splice(startIndex, event.length)));
    } else {
      let mQuery = JSON.parse(JSON.stringify(this.query));
      mQuery.$skip = event.length;
      this.isLoadingMore = true;
      this.filter({
        query: mQuery
      }, this.isSocket)
        .subscribe((payload: any) => {
          if (payload !== undefined && payload.data !== undefined) {
            this.isLoadingMore = false;
            this.results = JSON.parse(JSON.stringify(this.results.concat(payload.data)));
            const startIndex = event.pageIndex * event.pageSize;
            this.operateResults = JSON.parse(JSON.stringify(this.results));
            this.filteredResults = JSON.parse(JSON.stringify(this.operateResults.splice(startIndex, event.length)));
          } else {
            this.isLoadingMore = false;
            this.results = JSON.parse(JSON.stringify(this.results.concat(payload)));
            const startIndex = event.pageIndex * event.pageSize;
            this.operateResults = JSON.parse(JSON.stringify(this.results));
            this.filteredResults = JSON.parse(JSON.stringify(this.operateResults.splice(startIndex, this.paginator.pageSize)));
            // this.showCuDropdown = true;
          }
        }, err => {
          this.isLoadingMore = false;
        });
    }
  }

  getImgUrl(item) {
    const splitArray = this.imgObj.split('.');
    let counter = 0;
    splitArray.forEach((obj, i) => {
      if (item[obj] !== undefined) {
        item = item[obj];
      } else {
        item = 'undefined';
      }
      counter++;
    });
    if (counter === splitArray.length) {
      if (item === 'undefined') {
        const imgUri = undefined;
        return imgUri;
      } else {
        const imgUri = this.baseUrl + '/' + item;
        // this.imgError = false;
        return imgUri;
      }
    }
  }

  filter(query: any, isSocket: boolean) {
    this.cuDropdownLoading = true;
    if (isSocket) {
      return this._socket.find(query);
    } else {
      return this._rest.find(query);
    }
  }

  getName(item, displayKey: String) {
    const splitArray = displayKey.split('.');
    let counter = 0;
    splitArray.forEach((obj, i) => {
      item = item[obj];
      counter++;
    });
    if (counter === splitArray.length) {
      return item;
    }
  }
  getOtherKeyValues(item) {
    const otherValues = [];
    let mainCounter = 0;
    let objItem = item;
    this.otherKeys.forEach((key, i) => {
      const splitArray = key.split('.');
      let counter = 0;
      mainCounter++;
      splitArray.forEach((obj, _i) => {
        if (objItem[obj] !== undefined) {
          objItem = objItem[obj];
        } else {
          objItem = '';
        }
        counter++;
      });
      if (counter === splitArray.length) {
        const checkDate = new Date(objItem);
        const notANumber = '' + checkDate.getDate().toString() + '';
        if (notANumber === 'NaN') {
          otherValues.push(objItem);
        } else {
          const d = new Date(objItem);
          otherValues.push(d.toDateString());
        }
        objItem = item;
      }
    });
    if (mainCounter === this.otherKeys.length) {
      return otherValues;
    }
  }
  onSelectedItem(value) {
    this.selectedItem.emit(value);
  }

  focusSearch() {
    this.showCuDropdown = !this.showCuDropdown;
  }

  focusOutSearch() {
    setTimeout(() => {
      this.showCuDropdown = !this.showCuDropdown;
    }, 1000);
  }

  // this is the initial value set to the component
  public writeValue(obj: any) {
    if (obj) {
      this.data = obj;
      this.valueString = this.data;
    } else {
      this.valueString = '';
    }
  }

  // registers 'fn' that will be fired wheb changes are made
  // this is how we emit the changes back to the form
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // validates the form, returns null when valid else the validation object
  // in this case we're checking if the json parsing has passed or failed from the onChange method
  public validate(c: FormControl) {
    return !this.valueParseError
      ? null
      : {
        valueParseError: {
          valid: false
        }
      };
  }

  // not used, used for touch input
  public registerOnTouched() { }

  // change events from the textarea
  public onChange(event) {
    // get value from text area
    const newValue = event.target.value;

    try {
      this.data = newValue;
      this.valueParseError = false;
    } catch (ex) {
      // set parse error if it fails
      this.valueParseError = true;
    }

    // update the form
    this.propagateChange(this.data);
  }

  // the method set in registerOnChange to emit changes back to the form
  public propagateChange = (_: any) => { };
}
