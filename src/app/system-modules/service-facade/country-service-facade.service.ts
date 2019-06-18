import { Country } from './../../models/facility-manager/setup/country';
import { CountriesService } from './../../services/facility-manager/setup/countries.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CountryServiceFacadeService {
  private countries: Country[] = [];
  private states: any[] = [];
  private lgsAndCities: any;
  constructor(private countriesService: CountriesService) { }

  getOnlyCountries() {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.countries.length > 0) {
        resolve(that.countries);
      } else {
        that.countriesService.find({
          query: {
            $select: { 'states': 0 }
          }
        }).then((payload) => {
          that.countries = payload.data;
          resolve(that.countries);
        }, error => {
          reject(error);
        });
      }
    });
  }

  getOnlyStates(country: string, refresh?: boolean) {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.states.length > 0 && !refresh) {
        resolve(that.states);
      } else {
        that.countriesService.find({
          query: {
            'name': country,
            $select: { 'states.cities': 0, 'states.lgs': 0 }
          }
        }).then((payload) => {
          if (payload.data.length > 0) {
            that.states = payload.data[0].states;
          }
          resolve(that.states);
        }, error => {
          reject(error);
        });
      }
    });
  }

  getOnlyLGAndCities(country: string, state: string, refresh?: boolean) {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.lgsAndCities !== undefined && !refresh) {
        resolve(that.lgsAndCities);
      } else {
        that.countriesService.find({
          query: {
            name: country,
            'states.name': state,
            $select: { 'states.$': 1}
          
          }
        }).then((payload) => {
          if (payload.data.length > 0) {
            that.lgsAndCities = { lgs: payload.data[0].states[0].lgs, cities: payload.data[0].states[0].cities };
          }
          resolve(that.lgsAndCities);
        }, error => {
          reject(error);
        });
      }
    });
  }
}
