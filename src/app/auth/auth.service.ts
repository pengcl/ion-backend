import {Inject, Injectable, NgZone} from '@angular/core';
import {RequestService} from '../@core/services/request.service';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {StorageService} from '../@core/services/storage.service';
import {getPassword} from '../@core/utils/extend';

@Injectable({providedIn: 'root'})
export class AuthService {
  public loginRedirectUrl: string = '';
  private loginStatus = new Subject<boolean>();

  constructor(@Inject('PREFIX_URL') private PREFIX_URL: any,
              private zone: NgZone,
              private requestSvc: RequestService,
              private router: Router,
              private storage: StorageService) {
  }

  requestAuth(): any {
    if (this.router.url.indexOf('auth') !== -1) {
      return false;
    }
    if (this.loginRedirectUrl) {
      return false;
    }

    this.loginRedirectUrl = this.router.url;
    this.zone.run(() => {
      this.router.navigate(['/auth']).then();
    });
  }

  login(body: any): Observable<any> {
    const data: any = {};
    data.userAccount = body.identifier;
    data.userPassword = getPassword(body.password);
    return this.requestSvc.send('/cloudCoreService-api/account/simpleLogin', data);
  }

  token(token?: any): any {
    if (token) {
      this.storage.set('token', JSON.stringify(token));
    } else if (token === null) {
      this.storage.remove('token');
    } else {
      const TOKEN = this.storage.get('token');
      if (TOKEN) {
        return JSON.parse(TOKEN);
      } else {
        return '';
      }
    }
  }

  get currentUser(): any {
    const token = this.storage.get('token');
    return JSON.parse(token).user;
  }

  get isLogged(): boolean {
    return !!this.currentUser;
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  updateLoginStatus(token: any): void {
    console.log('1');
    this.storage.set('token', JSON.stringify(token));
    this.loginStatus.next(this.isLogged);
  }

  logout(): void {
    this.storage.remove('token');
    this.zone.run(() => {
      this.router.navigate(['/auth']).then();
    });
  }
}
