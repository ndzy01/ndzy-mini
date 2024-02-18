App<IAppOption>({
  globalData: {},
  onLaunch() {
    wx.cloud.init();
    wx.setStorageSync('token', '');
    wx.navigateTo({
      url: `/pages/login/index`,
    });
    wx.login({
      success: (res) => {
        wx.setStorageSync('code', res.code);
      },
    });
    const updateManager = wx.getUpdateManager();
    if (updateManager) {
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '更新提示',
              content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
            });
          });
        }
      });
    }
  },
});
