import request from '../../http';

const demoData = [
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
];

Page<
  { todos: { id: string; isDel: number }[]; isDemo: boolean },
  {
    goEditPage: (e: any) => void;
    getAll: () => void;
    finishTodo: (e: any) => void;
    delTodo: (e: any) => void;
    recoverTodo: (e: any) => void;
  }
>({
  data: {
    todos: [],
    isDemo: false,
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
    })
      .then((res: any) => {
        this.setData({
          todos: res.data,
          isDemo: false,
        });
      })
      .catch(() => {
        this.setData({
          isDemo: true,
          todos: JSON.parse(JSON.stringify(demoData)),
        });
      });
  },
  finishTodo(e) {
    const { id } = e.target.dataset;
    if (this.data.isDemo) {
      this.setData({
        isDemo: true,
        todos: this.data.todos.map((item) => {
          if (item.id === id) {
            item.isDel = 1;
          }
          return item;
        }),
      });
    } else {
      request({ url: `/todos/${id}`, method: 'PATCH', data: { isDel: true } }).then(() => {
        this.getAll();
      });
    }
  },
  delTodo(e) {
    const { id } = e.target.dataset;
    if (this.data.isDemo) {
      this.setData({
        isDemo: true,
        todos: this.data.todos.filter((item) => item.id !== id),
      });
    } else {
      request({ url: `/todos/${id}`, method: 'DELETE' }).then(() => {
        this.getAll();
      });
    }
  },
  recoverTodo(e) {
    const { id } = e.target.dataset;
    if (this.data.isDemo) {
      this.setData({
        isDemo: true,
        todos: this.data.todos.map((item) => {
          if (item.id === id) {
            item.isDel = 0;
          }
          return item;
        }),
      });
    } else {
      request({ url: `/todos/${id}`, method: 'PATCH', data: { isDel: false } }).then(() => {
        this.getAll();
      });
    }
  },
});
