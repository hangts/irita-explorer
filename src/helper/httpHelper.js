import axios from 'axios';

const isMockUrl = (url) => {
  if (!url) {
    return url;
  }
  
  // 当前在代理时候 /api 、 /lcd，
  // mock时候都是url被拼接处理之后http请求，例如：/api/http://xxx
  // 所以在mock时候我们需要把拼接后的 /api/， /lcd/，去掉。直接用http请求就好了。
  const pathRewrites = ['/api/', '/lcd/'];
  const pathRewrite = pathRewrites.find((v) => {
    const reg = new RegExp(`^${v}http`);
    return reg.test(url);
  });
  
  if (pathRewrite) {
    return url.replace(pathRewrite, '');
  }
  
  return url;
};

export class HttpHelper {

    static async get(url){
        const data = await axios.get(isMockUrl(url));
        if(data && data.status === 200){
            return data.data;
        } else {
            console.error('request from server failed:', data);
            return null
        }
    }

    static async post(url, payload){
      const data = await axios.post(isMockUrl(url), payload);
      if(data && data.status === 200){
          return data.data;
      } else {
          console.error('request from server failed:', data);
          return null
      }
  }
}
