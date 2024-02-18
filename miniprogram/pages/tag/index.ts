import { wxCloudRequest } from '../../http';

Page<{ tags: any[] }, { [k: string]: any }>({
  data: { tags: [] },
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
});
