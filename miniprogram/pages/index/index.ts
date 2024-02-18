import { wxCloudRequest } from '../../http';
import { decrypt } from '../../utils';

Page<
  { todos: any[] },
  {
    goRecordsPage: () => void;
    goEditPage: (e: any) => void;
    goTagsPage: () => void;
    goSearchPage: () => void;
    goLoginPage: () => void;
    signOut: () => void;
    getList: () => void;
    finishTodo: (e: any) => void;
    delTodo: (e: any) => void;
    recoverTodo: (e: any) => void;
  }
>({
  data: {
    todos: [],
  },
  onShow() {
    this.onLoad();
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    wx.stopPullDownRefresh();
    this.getList();
  },
  goRecordsPage() {
    wx.navigateTo({
      url: `/pages/records/index`,
    });
  },
  goEditPage(e) {
    const { id } = e.target.dataset;
    if (id) {
      wx.navigateTo({
        url: `/pages/edit/index?id=${id}`,
      });
    } else {
      wx.navigateTo({
        url: '/pages/edit/index',
      });
    }
  },
  goTagsPage() {
    wx.navigateTo({
      url: '/pages/tag/index',
    });
  },
  goSearchPage() {
    wx.navigateTo({
      url: '/pages/search/index',
    });
  },
  goLoginPage() {
    wx.navigateTo({
      url: '/pages/login/index',
    });
  },
  signOut() {
    wx.setStorageSync('token', '');
    wx.navigateTo({
      url: '/pages/login/index',
    });
  },
  getList() {
    wxCloudRequest({
      url: '/todos',
      method: 'GET',
      data: { operationSource: 'wx' },
    }).then((res: any) => {
      console.log(
        res.data.map((item: any) => ({
          ...item,
          detail: decrypt(item.detail, item.keyBase, item.ivBase),
        })),
      );
      this.setData({
        todos: res.data.map((item: any) => ({
          ...item,
          detail: decrypt(item.detail, item.keyBase, item.ivBase),
        })),
      });
    });
  },
  finishTodo(e) {
    const { id } = e.target.dataset;
    wxCloudRequest({ url: `/todos/${id}`, method: 'PATCH', data: { isFinish: true } }).then(() => {
      this.getList();
    });
  },
  delTodo(e) {
    const { id } = e.target.dataset;
    wxCloudRequest({ url: `/todos/${id}`, method: 'DELETE' }).then(() => {
      this.getList();
    });
  },
  recoverTodo(e) {
    const { id } = e.target.dataset;
    wxCloudRequest({ url: `/todos/${id}`, method: 'PATCH', data: { isFinish: false } }).then(() => {
      this.getList();
    });
  },
});
