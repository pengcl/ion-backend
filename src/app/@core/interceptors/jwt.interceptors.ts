import {Inject, Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../../pages/auth/auth.service';

@Injectable()
export class JwtInterceptors implements HttpInterceptor {
  urls = [
    this.PREFIX_URL + '/auth/local',
    this.PREFIX_URL + '/installed'
  ];

  constructor(@Inject('PREFIX_URL') private PREFIX_URL, private authSvc: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userToken;
    if (req.body.head && req.body.head.userToken) {
      userToken = req.body.head.userToken;
    } else {
      userToken = this.authSvc.token() ? this.authSvc.token().token : null;
    }
    const version = '1.0.0';
    const head: any = {
      clientIP: '192.168.103.56',
      questUID: 'C943B16E39A00001715A87502E1A1D65',
      userToken,
      version
    };
    req.body.head = head;
    return next.handle(req);
  }

}
