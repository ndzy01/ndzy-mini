import request from '../../http';

Page<
  {
    id: string;
    detailHtml: string;
    link: string;
    name: string;
    deadline: string;
    tags: any[];
    selectTag: any;
    editType: string;
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
    selectTag: {},
    editType: '',
  },
  onLoad(query) {
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
              selectTag: tagRes.data.find((item: any) => item.id === todo.tagId),
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
    const { value } = e.detail;
    this.setData({ selectTag: this.data.tags[value] });
  },
  bindDetailHtmlChange(e: any) {
    const { html } = e.detail;
    this.setData({ detailHtml: html });
  },
  bindSave() {
    const baseParams: any = {
      detailHtml: this.data.detailHtml,
      link: this.data.link,
      tagId: this.data.selectTag.id,
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
});
