import request from '../../http';

Page({
  data: {
    todos: [],
  },
  onLoad() {
    this.getAll();
  },
  getAll() {
    request({
      url: '/todos',
      method: 'GET',
    }).then((res: any) => {
      this.setData({
        todos: res.data,
      });
    });
  },
  finishTodo(e: any) {
    const { id } = e.target.dataset;
    request({ url: `/todos/${id}`, method: 'PATCH', data: { isDel: true } }).then(() => {
      this.getAll();
    });
  },
  delTodo() {},
  recoverTodo(e: any) {
    const { id } = e.target.dataset;
    request({ url: `/todos/${id}`, method: 'PATCH', data: { isDel: false } }).then(() => {
      this.getAll();
    });
  },
});
