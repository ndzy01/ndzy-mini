import request from '../../http';

Page<{ records: any[]; name: string; txt: string; txtInfo: string }, { [k: string]: any }>({
  data: { records: [], name: '11', txt: '', txtInfo: '' },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    wx.stopPullDownRefresh();
    this.init();
  },
  onClickLeft() {
    wx.navigateBack();
  },
  init() {
    request({ url: '/records', method: 'GET' }).then((res: any) => {
      this.setData({ records: res.data });
    });
  },
  bindNameChange(e: any) {
    this.setData({ name: e.detail });
  },
  bindTxtChange(e: any) {
    this.setData({ txt: e.detail });
  },
  bindTxtInfoChange(e: any) {
    this.setData({ txtInfo: e.detail });
  },
  bindAdd() {
    if (!this.data.name) {
      wx.showToast({
        title: 'name 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!this.data.txt) {
      wx.showToast({
        title: 'txt 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    request({
      url: '/record',
      method: 'POST',
      data: { name: this.data.name, txt: this.data.txt, txtInfo: this.data.txt },
    }).then((res: any) => {
      if (res && res.data && res.data.token) {
        this.setData({ name: '', txt: '', txtInfo: '' });
      }
    });
  },
});
