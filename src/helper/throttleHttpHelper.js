import { getIbcToken } from '@/service/api';

export class throttleHttpHelper {
  constructor() {
    this.cacheMap = new Map();
    this.pendingArr = [];
    this.arr = [];
    this.stackLength = 30;
  }

  /*
   * FIXME: 边界情况
   */
  validate = () => {
    if (this.arr.length < this.stackLength) {
      return true;
    }
    this.cacheMap.clear();
    return true;
  };

  queryCache = (key) => {
    if (this.cacheMap.has(key)) {
      return this.cacheMap.get(key);
    }
    return null;
  };

  setPending = (key, resolve, reject) => {
    const list = this.pendingArr[key] || (this.pendingArr[key] = []);
    resolve && list.push({ resolve, reject: 'reject!' });
  };

  request = (payload) => {
    const { key } = payload;
    if (this.validate()) {
      if (this.queryCache(key)) {
        return this.queryCache(key);
      }
      if (this.pendingArr[key]) {
        return new Promise((resolve, reject) => {
          this.pendingArr[key].push({ resolve, reject });
        });
      }
      this.setPending(key);
      return new Promise((resolve, reject) => {
        this.pendingArr[key].push({ resolve, reject });
        getIbcToken(payload).then((data) => {
          if (data) {
            const list = this.pendingArr[key];
            list.forEach((item) => {
              item.resolve(data.data);
            });
            delete this.pendingArr[key];
            this.cacheMap.set(key, data.data);
          } else {
            console.error('request from server failed:', data);
            return null;
          }
        });
      });
    }
  };
}

const _requestThrottler = new throttleHttpHelper();

export async function requestThrottler(payload) {
  return await _requestThrottler.request(payload);
}
