import { request } from "../../request/request"

Page({
  data: {
    collectList:[]
  },

  getCollectList() {
    var token = wx.getStorageSync('token')
    if(token) {
      request({
        url: 'http://www.kangliuyong.com:10002/findAllLike',
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token
        }
      }).then(res=>{
        console.log(res)
        this.setData({
          collectList: res.data.result
        })
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 取消收藏
  cancel(e) {
    // console.log(e.currentTarget.dataset.pid)
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/notlike',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid: e.currentTarget.dataset.pid,
        tokenString: token
      }
    }).then(res=>{
      console.log(res)
      if(res.data.code == 900) {
        wx.showToast({
          title: res.data.msg,
        })
        this.getCollectList()
      } else {
        wx.showToast({
          title: '取消收藏失败',
          icon: 'error'
        })
      }
    })
  },

  onLoad(options) {
    this.getCollectList()
  },

})