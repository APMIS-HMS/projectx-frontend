import { Gender } from './../../models/facility-manager/setup/gender';
import { Title } from './../../models/facility-manager/setup/title';
import { Injectable } from '@angular/core';
import { TitleService, GenderService } from 'app/services/facility-manager/setup';

@Injectable()
export class TitleGenderFacadeService {

  private titles: Title[] = [];
  private genders: Gender[] = [];
  constructor(private titleService: TitleService, private genderService:GenderService) { }

  getTitles() {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.titles.length > 0) {
        resolve(that.titles);
      } else {
        that.titleService.find({}).then((payload) => {
          that.titles = payload.data;
          resolve(that.titles);
        }, error => {
          reject(error);
        });
      }
    });
  }

  getGenders() {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.genders.length > 0) {
        resolve(that.genders);
      } else {
        that.genderService.find({}).then((payload) => {
          that.genders = payload.data;
          resolve(that.genders);
        }, error => {
          reject(error);
        });
      }
    });
  }

}
