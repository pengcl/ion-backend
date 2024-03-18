import {hex_md5} from './md5';

declare interface Key {
  name: string;
  code: string;
}


export const listToTable = (items: any, keys: Key[], parent?: any) => {
  const is: any[] = [];
  items.forEach((item: any) => {
    is.push({
      id: item.id,
      parentId: parent ? (item[parent] ? item[parent].id : 0) : 0,
      value: (() => {
        const value: any = {};
        keys.forEach(keyItem => {
          value[keyItem.name] = item[keyItem.code];
        });
        return value;
      })(),
      children: [],
      isExpanded: false,
      isVisible: true,
    });
  });

  return is;
};

export const hump = (key: any) => {
  return key.replace(/\-(\w)/g, (all: any, letter: any) => {
    return letter.toUpperCase();
  });
};


export function formData(body: any): FormData {
  const _formData: any = new FormData();
  for (const kn in body) {
    if (body) {
      _formData.append(kn, body[kn] === undefined ? '' : body[kn]);
    }
  }
  return _formData;
}

export const getPages = (page: any, count: any) => {
  const currentPage = (page._start / page._limit) + 1;
  const firstPage = currentPage === 1 ? '' : 1;
  let lastPage: any = Math.floor((count / page._limit) - 0.1) + 1;
  lastPage = lastPage === currentPage ? '' : lastPage;
  const prevPage = currentPage <= 2 ? '' : (currentPage - 1 === firstPage ? '' : currentPage - 1);
  const nextPage = currentPage >= lastPage - 1 ? '' : (currentPage + 1 === lastPage ? '' : currentPage + 1);
  let pages = [firstPage, prevPage, currentPage, nextPage, lastPage];
  pages = pages.filter(item => item);
  return pages;
};


const map = {
  isSaleNet: {
    yes: 1,
    no: 0
  },
  typePriceCinema: {
    traditional: 0,
    dynamics: 1
  },
  validType: {
    long: 1,
    short: 0
  },
  status: {
    activated: 0,
    deactivated: -1
  },
  configType: {
    mini: 1,
    service: 2
  },
  enableStatus: {
    activated: 1,
    deactivated: 0
  },
  managePattern: {
    unify: '1',
    independence: '2'
  },
  staffSex: {
    male: '0',
    female: '1'
  },
};

export const fileToBase64 = (file: any, cb: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = e => {
    cb(e.target ? e.target?.result : null);
  };
};

export const getPassword = (origin: any) => {
  let str = hex_md5(origin);
  const salt = 'AIDATACOM';
  for (let i = 0; i < str.length; i++) {
    const start = 3 * (i + 1) + i;
    str = str.slice(0, start) + salt.charAt(i) + str.slice(start);
  }
  return hex_md5(str);
};
