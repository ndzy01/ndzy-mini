App<IAppOption>({
  globalData: {},
  onLaunch() {
    wx.setStorageSync('token', '');
    wx.setStorageSync(
      'local',
      JSON.stringify([
        {
          createdAt: '2023-08-22T22:04:24.470Z',
          detail: '1. 每天至少运动一个小时\n2. 尽量在十点钟之前完成\n',
          detailHtml: '<ol>\n<li>每天至少运动一个小时</li>\n<li>尽量在十点钟之前完成</li>\n</ol>\n',
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
          detail: '## 十点前上床睡觉',
          detailHtml: '<h2>十点前上床睡觉</h2>',
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
  },
});
