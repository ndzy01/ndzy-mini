import { objectToQueryString } from './utils';

export const wxCloudRequest = (options: {
  url: string;
  method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'PATCH' | undefined;
  data?: any;
  params?: any;
}) => {
  wx.showLoading({ title: '加载中' });
  const token = wx.getStorageSync('token') || '';
  const { url = '', data = {}, params = {} } = options;
  let path = url;
  const header: any = {
    'X-WX-SERVICE': 'ndzy-service',
  };
  if (token) {
    header.Authorization = 'Basic' + ' ' + token;
  }
  if (options.method === 'GET' && JSON.stringify(params) !== '{}') {
    path += '?' + objectToQueryString(params);
  }
  return new Promise((resolve, reject) => {
    wx.cloud
      .callContainer({
        ...options,
        config: {
          env: 'prod-3gjeiq7x1fbed11e',
        },
        path,
        header,
        method: options.method,
        data,
      })
      .then((res) => {
        // 鉴权失败
        if (res.data.statusCode === 401) {
          wx.navigateTo({
            url: `/pages/login/index`,
          });
        }
        if (res.data.status === 11) {
          wx.hideLoading();
          resolve(res.data);
          return;
        }
        if (res.data.status === 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000,
          });
          resolve(res.data);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000,
          });
          reject(res.data);
        }
        wx.hideLoading();
      })
      .catch((e) => {
        wx.showToast({
          title: '网络出错了',
          icon: 'error',
          duration: 2000,
        });
        reject(e);
        wx.hideLoading();
      });
  });
};
