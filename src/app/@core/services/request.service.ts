import {Injectable, Inject, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, of as observableOf} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';

import {StorageService} from './storage.service';
import {SnackbarService} from './snackbar.service';

@Injectable({providedIn: 'root'})
export class RequestService {

  constructor(@Inject('PREFIX_URL') private PREFIX_URL: string, private http: HttpClient,
              private zone: NgZone,
              private router: Router,
              private storage: StorageService,
              private snackbarSvc: SnackbarService) {
  }

  // 接口调用
  send(url: string, data: any, headers?: any): Observable<any> {
    const requestUrl = this.PREFIX_URL + url;
    const aidaShell = (window as any).aidaShell;
    if (aidaShell) {
      return new Observable((observe) => {
        this.sendByAidaShell(requestUrl, data).then(res => {
          this.handleResponse(res, data);
          observe.next(res);
          observe.complete();
        }, (errorRs: any) => {
          observe.next(errorRs);
          observe.complete();
        });
      });
    } else {
      return this.http.post(requestUrl, {data}, {}).pipe(observableMargeMap((res: any) => {
        /*if (url.indexOf('posLogin') !== -1) {
          res.data.terminalCode = body.accountLoginName;
        }*/
        return observableOf(res);
      }));
    }
  }

  // 通过外壳访问
  sendByAidaShell = async (requestUrl: string, data: any) => {
    const user: any = this.storage.get('token');
    const token: any = user ? JSON.parse(user).token : '';
    const requestData = JSON.stringify({
      head: {
        questUID: 'C943B16E39A00001715A87502E1A1D65',
        clientIP: '192.168.103.57',
        version: '1.0.0',
        userToken: token
      },
      data
    });
    const restRs = await this.aidaShell_callRestService(requestUrl, requestData);
    return restRs;
  }

  aidaShell_readDataFromCache(): Promise<any> {
    const aidaShell = (window as any).aidaShell;
    return new Promise((resolve, error) => {
      aidaShell.readDataFromCache((status: any, msg: any, data: any) => {
        if (status === 0) {
          return resolve(data);
        } else {
          console.error('readDataFromCache出错了,status:' + status + 'msg:' + msg);
          const errorRs: any = {};
          errorRs.head = {};
          errorRs.data = {};
          errorRs.status = {
            status: -11001,
            msg2Client: msg
          };
          error(errorRs);
        }
      }, 'token');
    });
  }


  aidaShell_callRestService(requestUrl: string, requestData: any) {
    const aidaShell = (window as any).aidaShell;
    return new Promise((success, error) => {
      aidaShell.callRestService((status: any, msg: any, url: any, data: any) => {
        if (status) {// 表示http协议OK
          if (data) {
            success(JSON.parse(data));
          } else {
            const errorRs: any = {};
            errorRs.head = {};
            errorRs.data = {};
            errorRs.status = {
              status: -12001,
              msg2Client: '没有数据返回'
            };
            error(errorRs);
          }
        } else {
          console.error('sendRequest外壳出错了,status:' + status + 'msg:' + msg);
          const errorRs: any = {};
          errorRs.head = {};
          errorRs.data = {};
          errorRs.status = {
            status: -12002,
            msg2Client: msg
          };
          error(errorRs);
        }
      }, requestUrl, requestData);
    });
  }

  private handleResponse(res: any, req: any): void {
    if (res.status && res.status.status !== 0) {
      if (res.status.status === 401 || res.status.status === 403 || res.status.status === 411) {
        if (this.router.url.indexOf('auth') === -1) {
          this.zone.run(() => {
            this.router.navigate(['/auth/login']).then();
          });
        }
      } else {
        if (res.status && !req.notErrorInterceptor) {
          this.snackbarSvc.show(res.status.msg2Client);

        }
      }
    }
  }

}
