const request = (options: {
  url: string;
  method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'PATCH' | undefined;
  data?: any;
}) => {
  wx.showLoading({ title: '加载中' });
  const token = wx.getStorageSync('token') || '';
  // const baseUrl = 'http://localhost:3000';
  const baseUrl = 'https://ndzy-server.vercel.app';
  return new Promise((resolve, reject) => {
    const { data, method } = options;
    if (data && method !== 'GET') {
      options.data = JSON.stringify(data);
    }
    wx.request({
      header: { Authorization: 'Basic' + ' ' + token },
      ...(options as any),
      url: baseUrl + options.url,
      success: (res: any) => {
        if (res.data && (res.data.status === 11 || res.data.status === 0)) {
          if (res.data.status === 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000,
            });
          }
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
      },
      fail: function (res) {
        wx.showToast({
          title: '网络出错了',
          icon: 'error',
          duration: 2000,
        });
        reject(res);
        wx.hideLoading();
      },
    });
  });
};
export const wxCloudRequest = (options: {
  url: string;
  method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'PATCH' | undefined;
  data?: any;
  okMsg?: string;
}) => {
  wx.showLoading({ title: '加载中' });
  const token = wx.getStorageSync('token') || '';
  return new Promise((resolve, reject) => {
    const { data = {}, okMsg = '操作成功' } = options;
    // if (data && method !== 'GET') {
    //   options.data = JSON.stringify(data);
    // }
    wx.cloud
      .callContainer({
        ...options,
        config: {
          env: 'prod-3gjeiq7x1fbed11e',
        },
        path: options.url,
        header: {
          'X-WX-SERVICE': 'ndzy-s',
        },
        method: options.method,
        data: {
          ...(token ? { token } : ''),
          ...data,
        },
      })
      .then((res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: okMsg,
            icon: 'success',
            duration: 2000,
          });
          resolve(res.data);
        } else {
          wx.showToast({
            title: res.data.errorMsg,
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

export default request;
