import { wxCloudRequest } from '../../http';
import { decrypt, encrypt } from '../../utils';

Page<
  {
    id: string;
    detail: string;
    name: string;
    deadline: string;
    tags: any[];
    tagIndex: number;
    tag: { id: string; name: string };
    editType: string;
    showTags: boolean;
    showCalendar: boolean;
  },
  { [k: string]: any }
>({
  data: {
    id: '',
    detail: '',
    name: '',
    deadline: '',
    tags: [],
    tag: { id: '', name: '' },
    tagIndex: 0,
    editType: '',
    showTags: false,
    showCalendar: false,
  },
  onClickLeft() {
    wx.navigateBack();
  },
  onLoad(query) {
    this.init(query);
  },
  init(query: any) {
    if (query.id) {
      wxCloudRequest({ url: `/todos/${query.id}`, method: 'GET' }).then((res: any) => {
        if (res.data) {
          const todo = res.data;
          this.setData({
            id: query.id,
            detail: decrypt(todo.detail, todo.keyBase, todo.ivBase),
            name: todo.name,
            deadline: todo.deadline,
            editType: 'edit',
          });
          wxCloudRequest({ url: '/tags', method: 'GET' }).then((tagRes: any) => {
            this.setData({
              tags: tagRes.data,
              tagIndex: tagRes.data.findIndex((item: any) => item.id === todo.tagId),
              tag: tagRes.data.find((item: any) => item.id === todo.tagId),
            });
          });
        }
      });
    } else {
      wxCloudRequest({ url: '/tags', method: 'GET' }).then((tagRes: any) => {
        if (tagRes.data.length > 0) {
          this.setData({
            tag: tagRes.data[0],
            tags: tagRes.data,
            editType: 'add',
          });
        } else {
          this.setData({
            tags: tagRes.data,
            editType: 'add',
          });
        }
      });
    }
  },
  bindNameChange(e: any) {
    this.setData({ name: e.detail });
  },
  bindDeadlineChange(e: any) {
    const { value } = e.detail;
    this.setData({ deadline: value });
  },
  bindTagChange(e: any) {
    const { index, value } = e.detail;
    this.setData({ tagIndex: index, tag: value });
  },
  bindDetailChange(e: any) {
    const { html } = e.detail;
    this.setData({ detail: html });
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
    if (!this.data.detail) {
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
    const { text, keyBase, ivBase } = encrypt(this.data.detail);
    const baseParams: any = {
      tagId: this.data.tag.id,
      name: this.data.name,
      deadline: this.data.deadline,
      detail: text,
      keyBase,
      ivBase,
    };
    if (this.data.id) {
      wxCloudRequest({ url: `/todos/${this.data.id}`, method: 'PATCH', data: { ...baseParams } }).then(() => {
        wx.navigateBack();
      });
    } else {
      wxCloudRequest({ url: '/todos', method: 'POST', data: { ...baseParams, operationSource: 'wx' } }).then(() => {
        wx.navigateBack();
      });
    }
  },
  showTagsPopup() {
    this.setData({ showTags: true });
  },
  onTagsClose() {
    this.setData({ showTags: false });
  },
  onCalendarDisplay() {
    this.setData({ showCalendar: true });
  },
  onCalendarClose() {
    this.setData({ showCalendar: false });
  },
  formatDate(date: any) {
    date = new Date(date);
    return `${date.getYear() + 1900}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  onCalendarConfirm(e: any) {
    this.setData({
      showCalendar: false,
      deadline: this.formatDate(e.detail),
    });
  },
});
