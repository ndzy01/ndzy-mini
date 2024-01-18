import { wxCloudRequest } from '../../http';

Page<{ role: string; records: any[]; name: string; txt: string; txtInfo: string }, { [k: string]: any }>({
  data: { role: '1', records: [], name: '', txt: '', txtInfo: '' },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    const role = wx.getStorageSync('role') || '1';
    this.setData({
      role: role,
    });
    wx.stopPullDownRefresh();
    this.init();
  },
  onClickLeft() {
    wx.navigateBack();
  },
  init() {
    wxCloudRequest({ url: '/records/search', method: 'POST' })
      .then((res: any) => {
        this.setData({
          records: res.data,
        });
        wx.setStorageSync('records', JSON.stringify(res.data));
      })
      .catch(() => {
        const records = wx.getStorageSync('records') || '[]';
        this.setData({
          records: JSON.parse(records),
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
      data: { name: this.data.name, txt: this.data.txt, txtInfo: this.data.txtInfo },
    }).then((res: any) => {
      if (res && res.data) {
        this.setData({ name: '', txt: '', txtInfo: '' });
        this.init();
      }
    });
  },
  bindDel(e: any) {
    const { id } = e.target.dataset;
    wxCloudRequest({ url: `/records/delete`, method: 'POST', data: { id } }).then(() => {
      this.init();
    });
  },
});
