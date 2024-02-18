import { wxCloudRequest } from '../../http';

Page<
  {
    mobile: string;
    password: string;
  },
  { [k: string]: any }
>({
  data: {
    mobile: '',
    password: '',
  },
  onClickLeft() {
    wx.navigateBack();
  },
  bindMobileChange(e: any) {
    this.setData({ mobile: e.detail });
  },
  bindPasswordChange(e: any) {
    this.setData({ password: e.detail });
  },
  bindLogin() {
    if (!this.data.mobile) {
      wx.showToast({
        title: '手机号 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码 不能为空！',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    wxCloudRequest({
      url: '/users/login',
      method: 'POST',
      data: { mobile: this.data.mobile, password: this.data.password },
    }).then((res: any) => {
      if (res && res.data) {
        wx.setStorageSync('token', res.data.token);
        wx.navigateBack();
      }
    });
  },
});
