Component<{ editorCtx: any; formats: any }, any, any>({
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
  data: {
    formats: {},
    editorCtx: undefined,
  },
  methods: {
    onEditorReady() {
      this.triggerEvent('onEditorReady');
      this.createSelectorQuery()
        .in(this)
        .select('#editor')
        .context((res: any) => {
          this.setData({ editorCtx: res.context });
          res.context.setContents({
            html: this.properties.value,
          });
        })
        .exec();
    },
    format(e: any) {
      const { name, value } = e.target.dataset;
      this.data.editorCtx.format(name, value);
    },
    onStatusChange(e: any) {
      this.setData({
        formats: e.detail,
      });
    },
    getEditorContent() {
      this.data.editorCtx.getContents({
        success: (res: any) => {
          this.triggerEvent('onChange', { html: res.html });
        },
      });
    },
  },
});
