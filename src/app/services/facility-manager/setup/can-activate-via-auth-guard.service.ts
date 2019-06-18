import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class CanActivateViaAuthGuardService implements CanActivate {

  constructor(private locker: CoolLocalStorage) { }

  canActivate() {
    const auth = this.locker.getObject('auth');
    if (auth !== undefined && auth != null) {
      return true;
    }
    return false;
  }
}
