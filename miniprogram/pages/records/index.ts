import request from '../../http';
import { encrypt, decrypt } from '../../utils';

Page<{ role: string; records: any[]; name: string; txt: string; txtInfo: string }, { [k: string]: any }>({
  data: { role: '1', records: [], name: '', txt: '', txtInfo: '' },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    const role = wx.getStorageSync('role') || '1';
    this.setData({
      role: role,
    });
    wx.stopPullDownRefresh();
    this.init();
  },
  onClickLeft() {
    wx.navigateBack();
  },
  init() {
    request({ url: '/records', method: 'GET' })
      .then((res: any) => {
        this.setData({
          records: res.data.map((item: any) => ({
            ...item,
            txt: decrypt(item.txt, item.keyBase, item.ivBase),
          })),
        });
        wx.setStorageSync(
          'records',
          JSON.stringify(
            res.data.map((item: any) => ({
              ...item,
              txt: decrypt(item.txt, item.keyBase, item.ivBase),
            })),
          ),
        );
      })
      .catch(() => {
        const records = wx.getStorageSync('records') || '[]';
        this.setData({
          records: JSON.parse(records),
        });
      });
  },
  bindAdd() {
    if (!this.data.name) {
      wx.showToast({
        title: 'name 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!this.data.txt) {
      wx.showToast({
        title: 'txt 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    const { text, keyBase, ivBase } = encrypt(this.data.txt);
    request({
      url: '/records',
      method: 'POST',
      data: { name: this.data.name, txt: text, txtInfo: this.data.txtInfo, keyBase, ivBase },
    }).then((res: any) => {
      if (res && res.data) {
        this.setData({ name: '', txt: '', txtInfo: '' });
        this.init();
      }
    });
  },
  bindDel(e: any) {
    const { id } = e.target.dataset;
    request({ url: `/records/${id}`, method: 'DELETE' }).then(() => {
      this.init();
    });
  },
});
