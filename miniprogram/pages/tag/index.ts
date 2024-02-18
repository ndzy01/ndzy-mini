import { wxCloudRequest } from '../../http';

Page<{ tags: any[]; name: string }, { [k: string]: any }>({
  data: { tags: [], name: '' },
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
    wxCloudRequest({ url: '/tags', method: 'GET' }).then((res: any) => {
      this.setData({ tags: res.data });
    });
  },
  bindNameChange(e: any) {
    this.setData({ name: e.detail });
  },
  bindAdd() {
    wxCloudRequest({ url: '/tags', method: 'POST', data: { name: this.data.name } }).then(() => {
      this.setData({ name: '' });
      this.init();
    });
  },
  bindDel(e: any) {
    const { id } = e.target.dataset;
    wxCloudRequest({ url: `/tags/${id}`, method: 'DELETE' }).then(() => {
      this.init();
    });
  },
});
