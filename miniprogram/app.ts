App<IAppOption>({
  globalData: {},
  onLaunch() {
    wx.setStorageSync('token', '');

    // 登录
    wx.login({
      success: (_res) => {},
    });
  },
});
