import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SortService {

  constructor() {
  }

  sortKeys(contentType: any, orderKeys: any[]): any {
    const keys: any[] = [];
    orderKeys.forEach(key => {
      keys.push({
        key,
        attributes: contentType[key]
      });
    });
    return keys;
  }


}
