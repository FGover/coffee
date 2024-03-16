import {request} from '../../request/request'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({
  data: {
    show: false
  },
  onClose() {
    this.setData({ show: false });
  },

  updatePass() {
    this.setData({ show: true })
  },

  // 提交修改密码
  submit() {
    var token = wx.getStorageSync('token')
    if(this.data.oldpassword == '' || this.data.newpassword == '') {
      wx.showToast({
        title: '请输入全部信息',
        icon: 'error'
      })
    } else {
      request({
        url: 'http://www.kangliuyong.com:10002/updatePassword',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token,
          password: this.data.newpassword,
          oldPassword: this.data.oldpassword
        }
      }).then(res=>{
        console.log(res)
        if(res.data.code == 'E001') {
          wx.showToast({
            title: res.data.msg,
          })
          this.setData({ show: false })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      })
    }
  },

  // 退出登录
  loginout() {
    var token = wx.getStorageSync('token')
    if(token) {
      request({
        url: 'http://www.kangliuyong.com:10002/logout',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token
        }
      }).then(res=>{
        console.log(res)
        wx.removeStorage({
          key: 'token',
        })
        wx.navigateTo({
          url: '/pages/index/index',
        })
        wx.showToast({
          title: res.data.msg,
        })
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 注销
  out() {
    Dialog.confirm({
      title: '注销账号',
      message: '是否确定注销账号，一旦注销无法恢复!',
    }).then(() => {
        // 确定
        var token = wx.getStorageSync('token')
        if(token) {
          request({
            url: 'http://www.kangliuyong.com:10002/destroyAccount',
            method: 'POST',
            header: {
              "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
              appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
              tokenString: token
            }
          }).then(res=>{
            console.log(res)
            if(res.data.code == 'G001') {
              wx.showToast({
                title: res.data.msg,
              })
              // wx.navigateTo({
              //   url: '/pages/index/index',
              // })
              wx.removeStorage({
                key: 'token',
              })
            } else {
              wx.showToast({
                title: '注销账号失败',
                icon: 'error'
              })
            }
          })
        }
      }).catch(() => {
        // 取消
      })
  },

  onLoad(options) {

  }
})