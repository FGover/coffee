import { request } from '../../request/request'

Page({
  data: {
    hotList: [],
    checked1: true,
    checked2: false,
    checked3: false,
    checked4: false,
    show: true,
  },

  getGoods() {
    let that = this.data
    if(that.checked1 == true) {
      this.getFruit_tea()
    } else if(that.checked2 == true) {
      this.getLatte()
    } else if(that.checked3 == true) {
      this.getCoffee()
    } else if(that.checked4 == true) {
      this.getRena_ice()
    }
  },

  // 搜索商品
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
            hotList: res.data.result,
            show: false
          })
        }
      })
    } else {
      this.setData({
        show: true
      })
      this.getGoods()
    }
  },

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
          for (var i = 0; i < res.data.result.length; i++) {
            if (e.detail == res.data.result[i].name) {
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
        this.setData({
          hotList: res.data.result,
          show: false,
        })
      })
    } else {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'error'
      })
    }
  },

  // 传pid跳转商品详情页
  toDetail(e) {
    // console.log(e.currentTarget.dataset.pid)
    let pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: '/pages/detail/detail?pid=' + pid,
    })
  },

  // 推荐热卖
  getFruit_tea() {
    request({
      url: 'http://www.kangliuyong.com:10002/typeProducts',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        key: 'type',
        value: 'fruit_tea'
      }
    }).then(res => {
      console.log(res, 'fruit_tea')
      this.setData({
        hotList: res.data.result
      })
    })
  },

  change1() {
    this.getFruit_tea()
    this.setData({
      checked1: true,
      checked2: false,
      checked3: false,
      checked4: false,
    })
  },

  // 拿铁
  getLatte() {
    request({
      url: 'http://www.kangliuyong.com:10002/typeProducts',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        key: 'type',
        value: 'latte'
      }
    }).then(res => {
      console.log(res, 'latte')
      this.setData({
        hotList: res.data.result
      })
    })
  },

  change2() {
    this.getLatte()
    this.setData({
      checked1: false,
      checked2: true,
      checked3: false,
      checked4: false,
    })
  },

  // 咖啡
  getCoffee() {
    request({
      url: 'http://www.kangliuyong.com:10002/typeProducts',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        key: 'type',
        value: 'coffee'
      }
    }).then(res => {
      console.log(res, 'coffee')
      this.setData({
        hotList: res.data.result
      })
    })
  },

  change3() {
    this.getCoffee()
    this.setData({
      checked1: false,
      checked2: false,
      checked3: true,
      checked4: false,
    })
  },

  // 瑞纳冰
  getRena_ice() {
    request({
      url: 'http://www.kangliuyong.com:10002/typeProducts',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        key: 'type',
        value: 'rena_ice'
      }
    }).then(res => {
      console.log(res, 'rena_ice')
      this.setData({
        hotList: res.data.result
      })
    })
  },

  change4() {
    this.getRena_ice()
    this.setData({
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: true,
    })
  },

  onLoad(options) {
    this.getFruit_tea()
  }
})