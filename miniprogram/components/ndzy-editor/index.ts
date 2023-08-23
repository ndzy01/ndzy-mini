Component({
  /**
   * 组件的属性列表
   */
  properties: {
    project_id: {
      type: String,
      value: '',
    },
    //编辑器默认提示语
    placeholder: {
      type: String,
      value: '开始编辑吧...',
    },
    // 修改时显示内容
    richTextContents: {
      type: String,
      value: '',
    },
    // 编辑的富文本的索引
    index: {
      type: Number,
      value: 0,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 用户手机键盘得高度，大于0表示打开了键盘
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @name: 编辑器初始化完成时触发
     * @author: camellia
     * @date: 20211220
     */
    onEditorReady() {
      let self = this;
      this.triggerEvent('onEditorReady');
      // 获取编辑器实例
      self
        .createSelectorQuery()
        .in(this)
        .select('#editor')
        .context((res) => {
          self.editorCtx = res.context;
          self.setContents(self.properties.richTextContents); //设置富文本内容
        })
        .exec();
    },
    /**
     * @name: 点击工具栏格式化编辑文本
     * @author: camellia
     * @date: 20211220
     */
    format(e) {
      let self = this;
      let { name, value } = e.target.dataset;
      // 富文本编辑器格式化内容方法
      self.editorCtx.format(name, value);
    },
    /**
     * @name: 工具栏选项选中，图标出现选中样式
     * @author: camellia
     * @date: 20211220
     */
    onStatusChange(e) {
      let self = this;
      self.setData({
        formats: e.detail,
      });
    },
    /**
     * @name: 设置富文本内容
     * @author: camellia
     * @date: 2021-12-23
     * @param:	rechtext	string	富文本内容
     */
    setContents(rechtext) {
      this.editorCtx.setContents({
        html: rechtext,
        success: (res) => {
          // 富文本内容设置成功
          // console.log("[setContents success]", res);
        },
      });
    },
    /**
     * @name: 富文本编辑器输入时，获取值
     * @author: camellia
     * @date: 20211220
     */
    getEditorContent() {
      let self = this;
      // 富文本编辑器获取内容方法
      self.editorCtx.getContents({
        success: (res) => {
          let array = [];
          array['html'] = res.html;
          array['index'] = self.properties.index;
          // 通过自定义事件把内容传到父组件
          self.triggerEvent('getEditorValue', array);
        },
      });
    },
  },
});
