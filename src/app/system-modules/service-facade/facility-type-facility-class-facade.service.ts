import { Injectable } from '@angular/core';
import { FacilityTypesService } from 'app/services/facility-manager/setup';

@Injectable()
export class FacilityTypeFacilityClassFacadeService {

  private facilityClasses: any[] = [];
  private facilityTypes: any[] = [];
  constructor(private facilityTypeService: FacilityTypesService) { }

  getFacilityTypes() {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.facilityTypes.length > 0) {
        resolve(that.facilityTypes);
      } else {
        that.facilityTypeService.find({
          query: {
            $select: { 'facilityClasses': 0 }
          }
        }).then((payload) => {
          that.facilityTypes = payload.data;
          resolve(that.facilityTypes);
        }, error => {
          reject(error);
        });
      }
    });
  }

  getFacilityClasses(facilityType:string, refresh: boolean) {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.facilityTypes.length > 0 && !refresh) {
        resolve(that.facilityTypes);
      } else {
        that.facilityTypeService.find({
          query: {
            name: facilityType,
          }
        }).then((payload) => {
          if(payload.data.length > 0){
            that.facilityClasses = payload.data[0].facilityClasses;
          }
          
          resolve(that.facilityClasses);
        }, error => {
          reject(error);
        });
      }
    });
  }

}
