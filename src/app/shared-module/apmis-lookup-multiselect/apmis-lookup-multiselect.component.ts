import { Component, OnInit, EventEmitter, Output, Input, ElementRef, forwardRef } from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    Validators, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator
} from '@angular/forms';
import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'apmis-lookup-multiselect',
    templateUrl: './apmis-lookup-multiselect.component.html',
    styleUrls: ['./apmis-lookup-multiselect.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ApmisLookupMultiselectComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ApmisLookupMultiselectComponent),
            multi: true,
        }],
})
export class ApmisLookupMultiselectComponent implements OnInit, ControlValueAccessor, Validator {
    @Input() displayKey = "";
    @Input() url = "";
    @Input() placeholder = "";
    @Input() query = {};
    @Input() isSocket = false;
    @Output() selectedItem = new EventEmitter();
    public _socket;
    public _rest;
    public valueString = "";
    public valueParseError: boolean;
    public data: any;
    searchText = '';
    showCuDropdown: boolean = false;
    cuDropdownLoading: boolean = false;
    form: FormGroup;
    selectedValue: any = {};

    results = [];
    constructor(private fb: FormBuilder,
        private _socketService: SocketService,
        private _restService: RestService) { }

    ngOnInit() {
        this._rest = this._restService.getService(this.url);
        this._socket = this._socketService.getService(this.url);
        this.form = this.fb.group({ searchtext: [''] });
        this.form.controls['searchtext'].valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(value => this.filter({ query: this.query }, this.isSocket))
            .subscribe((payload: any) => {
                this.cuDropdownLoading = false;
                if (payload !== undefined && payload.data !== undefined) {
                    this.results = payload.data;
                } else {
                    this.results = payload;
                }
            });
    }

    filter(query: any, isSocket: boolean) {
        this.cuDropdownLoading = true;
        if (isSocket) {
            return this._socket.find(query);
        } else {
            return this._rest.find(query);
        }
    }

    onSelectedItem(value, $event) {
        this.selectedItem.emit({ object: value, checked: $event.checked, clear: false });
    }

    focusSearch() {
        this.showCuDropdown = !this.showCuDropdown;
    }

    focusOutSearch() {
        setTimeout(() => {
            this.showCuDropdown = !this.showCuDropdown;
        }, 300);
    }
    cancel() {
        this.results = [];
        this.showCuDropdown = !this.showCuDropdown;
        this.selectedItem.emit({ object: undefined, checked: false, clear: true, action: 'cancel' });
        this.form.controls['searchtext'].reset();
    }
    ok() {
        this.results = [];
        this.showCuDropdown = !this.showCuDropdown;
        this.selectedItem.emit({ object: undefined, checked: false, clear: true, action: 'ok' });
        this.form.controls['searchtext'].reset();
    }

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.data = obj;
            this.valueString = this.data;
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
        return (!this.valueParseError) ? null : {
            valueParseError: {
                valid: false,
            },
        };
    }

    // not used, used for touch input
    public registerOnTouched() { }

    // change events from the textarea
    public onChange(event) {

        // get value from text area
        let newValue = event.target.value;

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
