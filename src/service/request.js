import { HttpHelper } from '../helper/httpHelper';

export const get = (url) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (res, rej) => {
    url = `/${url.replace(/^\//, '')}`;
    try {
      const nodeServerUrl = process?.env?.VUE_APP_NODE_SERVER_URI || '';
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
      const goServerUrl = process?.env?.VUE_APP_GO_SERVER_URI || '';
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
      const lcdServerUrl = process?.env?.VUE_APP_LCD_URI || '';
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
