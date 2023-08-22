import request from '../../http';

Page<any, any>({
  data: {
    formats: {},
    content: '',
    todos: [],
  },

  editorCtx: undefined,

  onLoad() {
    request({
      url: '/todos',
      method: 'GET',
    }).then((res: any) => {
      this.setData({
        todos: res.data,
      });
    });
  },

  onEditorReady() {
    wx.createSelectorQuery()
      .select('#editor')
      .context((res) => {
        this.editorCtx = res.context;
      })
      .exec();
  },

  format(e: any) {
    const { name, value } = e.target.dataset;
    if (!name) return;
    this.editorCtx.format(name, value);
  },

  onStatusChange(e: any) {
    const formats = e.detail;
    this.setData({ formats });
  },

  onEditorChange(e: any) {
    this.setData({
      content: e.detail.html,
    });
  },
});
