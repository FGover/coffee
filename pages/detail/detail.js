import { request } from '../../request/request'

Page({
  data: {
    detailData: {},
    sugar:[],
    tem:[],
    cream:[],
    milk:[],
    temid: 0,
    sugarid: 0,
    creamid: 0,
    milkid: 0,
    goodnum: 1,
    isCollected: false,
  },

  // 获取商品详情数据
  getDetail(pid){
    request({
      url: 'http://www.kangliuyong.com:10002/productDetail',
      data:{
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid: pid
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        detailData: res.data.result[0],
        sugar: res.data.result[0].sugar.split('/'),
        tem: res.data.result[0].tem.split('/'),
        cream: res.data.result[0].cream.split('/'),
        milk: res.data.result[0].milk.split('/'),
      })
      this.findLike()
    })
  },

  // 温度切换
  toggleTem(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    this.setData({
      temid: id
    })
  },

  // 糖分切换
  toggleSugar(e){
    var id = e.currentTarget.dataset.id
    this.setData({
      sugarid: id
    })
  },

  // 奶油切换
  toggleCream(e){
    var id = e.currentTarget.dataset.id
    this.setData({
      creamid: id
    })
  },
  
  // 牛奶切换
  toggleMilk(e){
    var id = e.currentTarget.dataset.id
    this.setData({
      milkid: id
    })
  },

  // 商品增加
  plus(){
    var num = this.data.goodnum
    num++
    this.setData({
      goodnum: num
    })
  },

  // 商品减少
  minus(){
    var num =  this.data.goodnum
    num--
    this.setData({
      goodnum: num
    })
  },

  // 加入购物袋
  addCart(){
    var token = wx.getStorageSync('token')
    // 判断用户是否登录
    if(token) {
      var tokenString = wx.getStorageSync('token')
      // 用户已登录
      request({
        url: 'http://www.kangliuyong.com:10002/addShopcart',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          pid: this.data.detailData.pid,
          count: this.data.goodnum,
          rule: `${this.data.tem[this.data.temid]}/${this.data.sugar[this.data.sugarid]}/${this.data.cream[this.data.creamid]}/${this.data.milk[this.data.milkid]}`,
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: tokenString
        }
      }).then(res=>{
        console.log(res)
        if(res.data.code == 3000) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showToast({
            title: '加入购物袋失败',
            icon: 'error'
          })
        }
      })
    }else {
      // 用户未登录
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 点击购物袋跳转购物袋
  toCart() {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  // 点击收藏
  collect() {
    var token = wx.getStorageSync('token')
    if(token) {
      request({
        url: 'http://www.kangliuyong.com:10002/like',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          pid: this.data.detailData.pid,
          tokenString: token
        }
      }).then(res=>{
        console.log(res)
        if(res.data.code == 800) {
          this.setData({
            isCollected: true
          })
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showToast({
            title: '收藏失败',
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
    }
  },

  // 取消收藏
  cancelCollect() {
    var tokenString = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/notlike',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid: this.data.detailData.pid,
        tokenString: tokenString
      }
    }).then(res=>{
      console.log(res)
      if(res.data.code == 900) {
        this.setData({
          isCollected: false
        })
        wx.showToast({
          title: res.data.msg,
        })
      } else {
        wx.showToast({
          title: '无法取消收藏',
          icon: 'error'
        })
      }
    })
  },

  // 查看是否收藏
  findLike() {
    var tokenString = wx.getStorageSync('token')
    if(tokenString) {
      request({
        url: 'http://www.kangliuyong.com:10002/findlike',
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          pid: this.data.detailData.pid,
          tokenString: tokenString
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.result.length > 0) {
          this.setData({
            isCollected: true
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 立即购买
  buy() {
    let pid = this.data.detailData.pid
    let goodnum = this.data.goodnum
    let rule = `${this.data.tem[this.data.temid]}/${this.data.sugar[this.data.sugarid]}/${this.data.cream[this.data.creamid]}/${this.data.milk[this.data.milkid]}`
    wx.navigateTo({
      url: '/pages/order/order?pid=' + pid + '&goodnum=' + goodnum + '&rule=' + rule,
    })
  },

  onLoad(options) {
    // 路由传的参数通过options获取
    // console.log(options.pid)
    this.getDetail(options.pid)
  },
})