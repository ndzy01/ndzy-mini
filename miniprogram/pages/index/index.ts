import request from '../../http';

Page<
  { todos: { id: string; isDel: number }[]; isLocal: boolean; showCreate: boolean },
  {
    goEditPage: (e: any) => void;
    getAll: () => void;
    finishTodo: (e: any) => void;
    delTodo: (e: any) => void;
    recoverTodo: (e: any) => void;
  }
>({
  data: {
    showCreate: false,
    todos: [],
    isLocal: false,
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
  getAll() {
    request({
      url: '/todos',
      method: 'GET',
      // TODO-n
      data: { operationSource: 'wx' },
    })
      .then((res: any) => {
        this.setData({
          todos: res.data,
          isLocal: false,
          showCreate: true,
        });
      })
      .catch(() => {
        this.setData({
          isLocal: true,
          todos: JSON.parse(wx.getStorageSync('local')),
          showCreate: false,
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
