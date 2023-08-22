Component({
  properties: {
    value: {
      type: String,
      value: '',
    },
  },
  ready: function () {
    this.setData({ innerValue: this.data.value });
  },
  data: { innerValue: '' },
  methods: {
    onEditorReady() {
      wx.createSelectorQuery()
        .in(this)
        .select('#preview')
        .context((res) => {
          const editorCtx = res.context;
          editorCtx.setContents({ html: this.data.innerValue });
        })
        .exec();
    },
  },
});
