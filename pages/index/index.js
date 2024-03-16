// index.js
// 通过const app = getApp()实现在page页面获取app.js从而获取app.js中定义的全局数据globalData
const app = getApp()
// 引入request.js文件
import { request } from '../../request/request'
Page({
  data: {
    bannerList: [],
    hotList: [],
    user: {},
    time: '',
    show: false,
    // 搜索列表
    searchList: []
  },

  // 搜索框内容发生变化时
  change(e) {
    if (e.detail) {
      request({
        url: 'http://www.kangliuyong.com:10002/search',
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          name: e.detail
        }
      }).then(res => {
        if (res.data.result.length > 0) {
          this.setData({
            searchList: res.data.result,
            show: true
          })
        }
      })
    } else {
      this.setData({
        show: false
      });
    }
  },

  // 搜索
  search(e) {
    if (e.detail) {
      request({
        url: 'http://www.kangliuyong.com:10002/search',
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          name: e.detail
        }
      }).then(res => {
        if (res.data.result.length > 0) {
          for(var i = 0;i < res.data.result.length;i++) {
            if(e.detail == res.data.result[i].name){
              let pid = res.data.result[i].pid
              wx.navigateTo({
                url: '/pages/detail/detail?pid=' + pid,
              })
            }
          }
        } else {
          wx.showToast({
            title: '该店没有该商品',
            icon: 'error'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'error'
      })
    }
  },

  // 请求轮播图
  getBanner() {
    wx.request({
      url: 'http://www.kangliuyong.com:10002/banner',
      // method: 'GET',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='
      },
      success: (res => {
        // console.log(res)
        this.setData({
          bannerList: res.data.result
        })
      })
    })
  },

  // 请求热卖商品
  getHotList() {
    request({
      url: 'http://www.kangliuyong.com:10002/typeProducts',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        key: 'isHot',
        value: 1
      }
    }).then(res => {
      //  console.log(res,'hot')
      this.setData({
        hotList: res.data.result
      })
    })
  },

  // 点击跳转详情页
  toDetail(e) {
    var pid = e.currentTarget.dataset.pid
    // console.log(pid)
    wx.navigateTo({
      url: '/pages/detail/detail?pid=' + pid,
    })
  },

  // 获取用户昵称
  getNickName() {
    var tokenString = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findMy',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: tokenString
      }
    }).then(res => {
      // console.log(res)
      this.setData({
        user: res.data.result[0]
      })
    })
  },

  // 获取系统当前时间
  getTime() {
    var timer = new Date()
    // console.log(timer)
    var hour = timer.getHours()
    var minute = timer.getMinutes()
    var second = timer.getSeconds()
    if (hour >= 6 && hour <= 11) {
      this.setData({
        time: '上午好'
      })
    } else if (hour >= 12 && hour < 14) {
      this.setData({
        time: '中午好'
      })
    } else if (hour >= 14 && hour <= 17) {
      this.setData({
        time: '下午好'
      })
    } else {
      this.setData({
        time: '晚上好'
      })
    }
  },

  // 退出登录
  loginOut() {
    var token = wx.getStorageSync('token')
    if (token) {
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
      }).then(res => {
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

  // 页面加载生命周期
  onLoad() {
    this.getBanner()
    this.getHotList()
    this.getNickName()
    this.getTime()
  }
})
