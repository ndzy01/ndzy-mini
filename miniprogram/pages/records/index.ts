import { wxCloudRequest } from '../../http';

Page<{ records: any[]; name: string; txt: string; txtInfo: string }, { [k: string]: any }>({
  data: { records: [], name: '', txt: '', txtInfo: '' },
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
    wxCloudRequest({ url: '/records', method: 'GET' }).then((res: any) => {
      this.setData({
        records: res.data,
      });
    });
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
    wxCloudRequest({
      url: '/records',
      method: 'POST',
      data: {
        name: this.data.name,
        txt: this.data.txt,
        txtInfo: this.data.txtInfo,
      },
    }).then((res: any) => {
      if (res && res.data) {
        this.setData({ name: '', txt: '', txtInfo: '' });
        this.init();
      }
    });
  },
  bindDel(e: any) {
    const { id } = e.target.dataset;
    wxCloudRequest({ url: `/records/${id}`, method: 'DELETE' }).then(() => {
      this.init();
    });
  },
});
