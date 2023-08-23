import request from '../../http';

Page<
  {
    id: string;
    detailHtml: string;
    link: string;
    name: string;
    deadline: string;
    tags: any[];
    tagIndex: number;
    tag: { id: string; name: string };
    editType: string;
    show: boolean;
  },
  { [k: string]: any }
>({
  data: {
    id: '',
    detailHtml: '',
    link: '',
    name: '',
    deadline: '',
    tags: [],
    tagIndex: 0,
    editType: '',
    show: false,
    tag: { id: '', name: '' },
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad(query) {
    wx.stopPullDownRefresh();
    this.init(query);
  },
  init(query: any) {
    if (query.id) {
      request({ url: `/todos/${query.id}`, method: 'GET' }).then((res: any) => {
        if (res.data && res.data.length > 0) {
          const todo = res.data[0];
          this.setData({
            id: query.id,
            detailHtml: todo.detailHtml,
            link: todo.link,
            name: todo.name,
            deadline: todo.deadline,
            editType: 'edit',
          });
          request({ url: '/tags', method: 'GET' }).then((tagRes: any) => {
            this.setData({
              tags: tagRes.data,
              tagIndex: tagRes.data.findIndex((item: any) => item.id === todo.tagId),
              tag: tagRes.data.find((item: any) => item.id === todo.tagId),
            });
          });
        }
      });
    } else {
      request({ url: '/tags', method: 'GET' }).then((tagRes: any) => {
        this.setData({
          tags: tagRes.data,
          editType: 'add',
        });
      });
    }
  },
  bindNameChange(e: any) {
    this.setData({ name: e.detail });
  },
  bindLinkChange(e: any) {
    this.setData({ link: e.detail });
  },
  bindDeadlineChange(e: any) {
    const { value } = e.detail;
    this.setData({ deadline: value });
  },
  bindTagChange(e: any) {
    const { index, value } = e.detail;
    this.setData({ tagIndex: index, tag: value });
  },
  bindDetailHtmlChange(e: any) {
    const { html } = e.detail;
    this.setData({ detailHtml: html });
  },
  bindSave() {
    if (!this.data.name) {
      wx.showToast({
        title: '名称 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!this.data.deadline) {
      wx.showToast({
        title: '截止时间 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!this.data.detailHtml) {
      wx.showToast({
        title: '详情 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!this.data.tag.id) {
      wx.showToast({
        title: '标签 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    const baseParams: any = {
      detailHtml: this.data.detailHtml,
      link: this.data.link,
      tagId: this.data.tag.id,
      name: this.data.name,
      deadline: this.data.deadline,
      detail: this.data.detailHtml,
    };
    if (this.data.id) {
      request({ url: `/todos/${this.data.id}`, method: 'PATCH', data: { ...baseParams } }).then(() => {
        wx.navigateTo({
          url: '/pages/index/index',
        });
      });
    } else {
      request({ url: '/todos', method: 'POST', data: { ...baseParams } }).then(() => {
        wx.navigateTo({
          url: '/pages/index/index',
        });
      });
    }
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
});
