import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class StorageService {
  type = environment.cacheType; // 存储类型，由环境变量决定；
  memory: any = {};
  public localStorage: any;

  constructor() {
    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  public set(key: string, value: any): void {
    this.localStorage[key] = value;
  }

  public get(key: string, isLocal?: boolean): string {
    return this.localStorage[key] || false;
  }

  public setObject(key: string, value: any): void {
    this.localStorage[key] = JSON.stringify(value);
  }

  public getObject(key: string): any {
    return JSON.parse(this.localStorage[key] || '{}');
  }

  public remove(key: string): any {
    this.localStorage.removeItem(key);
  }

  public clear(): any {
    if (this.type === 'memory') {
      this[this.type] = {};
    } else {
      this.localStorage.clear();
    }
  }
}
