App<IAppOption>({
  globalData: {},
  onLaunch() {
    wx.cloud.init();
    wx.setStorageSync('token', '');
    wx.setStorageSync(
      'local',
      JSON.stringify([
        {
          createdAt: '2023-08-22T22:04:24.470Z',
          detail: '<ol>\n<li>每天至少运动一个小时</li>\n<li>尽量在十点钟之前完成</li>\n</ol>\n',
          id: 'ecfe7e3e-ebee-42ab-a08d-7245463e5353',
          isDel: 0,
          link: '',
          name: '运动',
          deadline: '2023-08-31',
          updatedAt: '2023-08-23T08:11:09.000Z',
          version: 3,
          tagName: '生活',
          tagId: '37c64bf2-a215-4fa6-8f9a-792a8586fcb5',
          userName: '游客',
          isDemo: true,
        },
        {
          createdAt: '2023-08-22T19:17:52.858Z',
          detail: '<h2>十点前上床睡觉</h2>',
          id: '6df6b214-53ef-4635-9aa4-a788ae52feaa',
          isDel: 1,
          link: '',
          name: '早睡',
          deadline: '2023-08-23',
          updatedAt: '2023-08-22T22:02:35.000Z',
          version: 12,
          tagName: '生活',
          tagId: '37c64bf2-a215-4fa6-8f9a-792a8586fcb5',
          userName: '游客',
          isDemo: true,
        },
      ]),
    );
    // 登录
    wx.login({
      success: (_res) => {},
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
