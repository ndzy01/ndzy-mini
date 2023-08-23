Component({
  properties: {
    placeholder: {
      type: String,
      value: '开始编辑吧...',
    },
    value: {
      type: String,
      value: '',
    },
  },
  editorCtx: undefined,
  data: {
    formats: {},
    // 用户手机键盘得高度，大于0表示打开了键盘
  },
  methods: {
    onEditorReady() {
      this.triggerEvent('onEditorReady');
      this.createSelectorQuery()
        .in(this)
        .select('#editor')
        .context((res) => {
          this.editorCtx = res.context;
          this.setContents(this.properties.value);
        })
        .exec();
    },
    format(e: any) {
      const { name, value } = e.target.dataset;
      this.editorCtx.format(name, value);
    },
    onStatusChange(e: any) {
      this.setData({
        formats: e.detail,
      });
    },
    setContents(html: string) {
      this.editorCtx.setContents({
        html,
      });
    },
    getEditorContent() {
      this.editorCtx.getContents({
        success: (res: any) => {
          this.triggerEvent('onChange', { html: res.html });
        },
      });
    },
  },
});
