import { HttpHelper } from '../helper/httpHelper';

function get(url) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (res, rej) => {
    url = `/api/${url.replace(/^\//, '')}`;
    try {
      const data = await HttpHelper.get(url);
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
}

export default {
  get,
};
