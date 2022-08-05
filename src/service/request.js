import { requestThrottler } from '@/helper/throttleHttpHelper';
import productionConfig from '@/productionConfig';
import { HttpHelper } from '../helper/httpHelper';

export const post = (url, payload) => {
  return new Promise(async (res, rej) => {
    url = `/${url.replace(/^\//, '')}`;
    try {
      const nodeServerUrl = productionConfig?.nodeServerUrl || '';
      const data = await HttpHelper.post(`${nodeServerUrl}${url}`, payload);
      if (data && data.code === 0) {
        // 下面这行，这里判断了data.code === 0, 所以肯定是一个对象了，肯定可以剥离出来。
        // 安全起见，重新写一个，不合适的用这个替换老版
        // res(data.data || data);
        res(data.data);
      } else {
        console.error(`error from ${url}:`, JSON.stringify(data));
        rej(data);
      }
    } catch (err) {
      console.error(`error from ${url}:`, err.message);
      rej(err);
    }
  });
};
export const get = (url) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (res, rej) => {
    url = `/${url.replace(/^\//, '')}`;
    try {
      const nodeServerUrl = productionConfig?.nodeServerUrl || '';
      const data = await HttpHelper.get(`${nodeServerUrl}${url}`);
      if (data && data.code === 0) {
        // 下面这行，这里判断了data.code === 0, 所以肯定是一个对象了，肯定可以剥离出来。
        // 安全起见，重新写一个，不合适的用这个替换老版
        // res(data.data || data);
        res(data.data);
      } else {
        console.error(`error from ${url}:`, JSON.stringify(data));
        rej(data);
      }
    } catch (err) {
      console.error(`error from ${url}:`, err.message);
      rej(err);
    }
  });
};
export const getFromGo = (url) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (res, rej) => {
    url = `/${url.replace(/^\//, '')}`;
    try {
      const goServerUrl = productionConfig?.goServerUrl || '';
      const data = await HttpHelper.get(`${goServerUrl}${url}`);
      if (data && data.code === 0) {
        res(data.data);
      } else {
        console.error(`error from ${url}:`, JSON.stringify(data));
        rej(data);
      }
    } catch (err) {
      console.error(`error from ${url}:`, err.message);
      rej(err);
    }
  });
};
export const getFromLcd = (url) => {
  url = `/${url.replace(/^\//, '')}`;
  return new Promise(async (res, rej) => {
    try {
      const lcdServerUrl = productionConfig?.lcdUrl || '';
      const data = await HttpHelper.get(`${lcdServerUrl}${url}`);
      if (data) {
        res(data);
      } else {
        console.error(`error from ${url}:`, JSON.stringify(data));
        rej(data);
      }
    } catch (err) {
      console.error(`error from ${url}:`, err.message);
      rej(err);
    }
  });
};
export const throttlerPost = async (url, payload) => {
  url = `/${url.replace(/^\//, '')}`;
  try {
    const data = await requestThrottler(url, payload);
    if (data && data.code == 0) {
      return data;
    }
    console.error(`error from ${url}:`, JSON.stringify(data));
    return data;
  } catch (err) {
    console.error(`error from ${url}:`, err.message);
    return err;
  }
};
