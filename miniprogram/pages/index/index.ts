import request from '../../http';

Page<
  { todos: { id: string; isDel: number }[]; isLocal: boolean; show: boolean },
  {
    goEditPage: (e: any) => void;
    goTagsPage: () => void;
    goSearchPage: () => void;
    goLoginPage: () => void;
    signOut: () => void;
    getAll: () => void;
    finishTodo: (e: any) => void;
    delTodo: (e: any) => void;
    recoverTodo: (e: any) => void;
  }
>({
  data: {
    show: false,
    todos: [],
    isLocal: false,
  },
  onShow() {
    this.onLoad();
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    wx.stopPullDownRefresh();
    this.getAll();
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
    this.onLoad();
  },
  getAll() {
    request({
      url: '/todos',
      method: 'GET',
      data: { operationSource: 'wx' },
    })
      .then((res: any) => {
        this.setData({
          todos: res.data,
          isLocal: false,
          show: true,
        });
      })
      .catch(() => {
        this.setData({
          isLocal: true,
          todos: JSON.parse(wx.getStorageSync('local')),
          show: false,
        });
      });
  },
  finishTodo(e) {
    const { id } = e.target.dataset;
    if (this.data.isLocal) {
      const todos = this.data.todos.map((item) => {
        if (item.id === id) {
          item.isDel = 1;
        }
        return item;
      });
      this.setData({
        todos,
      });
      wx.setStorageSync('local', JSON.stringify(todos));
    } else {
      request({ url: `/todos/${id}`, method: 'PATCH', data: { isDel: true } }).then(() => {
        this.getAll();
      });
    }
  },
  delTodo(e) {
    const { id } = e.target.dataset;
    if (this.data.isLocal) {
      const todos = this.data.todos.filter((item) => item.id !== id);
      this.setData({
        todos,
      });
      wx.setStorageSync('local', JSON.stringify(todos));
    } else {
      request({ url: `/todos/${id}`, method: 'DELETE' }).then(() => {
        this.getAll();
      });
    }
  },
  recoverTodo(e) {
    const { id } = e.target.dataset;
    if (this.data.isLocal) {
      const todos = this.data.todos.map((item) => {
        if (item.id === id) {
          item.isDel = 0;
        }
        return item;
      });
      this.setData({
        todos,
      });
      wx.setStorageSync('local', JSON.stringify(todos));
    } else {
      request({ url: `/todos/${id}`, method: 'PATCH', data: { isDel: false } }).then(() => {
        this.getAll();
      });
    }
  },
});
