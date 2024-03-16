import { request } from "../../request/request"

Page({

  data: {
    show: true,
    phone: '',
    password: '',
    erroMsg: '',
    errMsg: ''
  },

  onClose() {
    this.setData({ show: false })
  },

  // 邮箱格式
  onChange(e) {
    if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e.detail) == false) {
      this.setData({
        erroMsg: '你的邮箱格式不正确'
      })
    } else {
      this.setData({
        erroMsg: ''
      })
    }
  },

  // 密码格式
  change(e) {
    if (/^[A-Za-z]\w{5,15}$/.test(e.detail) == false) {
      this.setData({
        errMsg: '你的密码不符合格式'
      })
    } else {
      this.setData({
        errMsg: ''
      })
    }
  },

  // 提交
  submit() {
    if (this.data.phone == '' || this.data.password == '') {
      wx.showToast({
        title: '请输入全部信息',
        icon: 'error'
      })
    } else {
      request({
        url: 'http://www.kangliuyong.com:10002/retrievePassword',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          phone: this.data.phone,
          password: this.data.password
        }
      }).then(res => {
        console.log(res)
        if (res.data.code == 'L001') {
          wx.showToast({
            title: res.data.msg,
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          wx.showToast({
            title: '找回密码失败',
          })
        }
      })
    }
  },

  // 下一步
  next() {
    if (this.data.email == '' || this.data.code == '') {
      wx.showToast({
        title: '请输入全部信息',
        icon: 'error'
      })
    } else {
      request({
        url: 'http://www.kangliuyong.com:10002/checkValidCode',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          validCode: this.data.code
        }
      }).then(res => {
        console.log(res)
        if (res.data.code == 'K001') {
          this.setData({ show: false })
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error'
          })
        }
      })
    }
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 发送验证码
  send() {
    request({
      url: 'http://www.kangliuyong.com:10002/emailValidCode',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        email: this.data.email
      }
    }).then(res => {
      console.log(res)
      if (res.data.code == 'J001') {
        wx.showToast({
          title: '验证码发送成功',
        })
      }
    })
  },

  onLoad(options) {
  }
})