import { request } from "../../request/request"

Page({
  data: {
    checked: true,
    checked2: false,
    checked3: false,
    allList: [],
    ingList: [],
    doneList: [],
    show: false,
    // 合起来的数组
    List: [],
  },

  // 全部
  all() {
    this.getAll()
    let arr = this.data.allList
    let b = []
    let c = []
    if (arr.length == 1) {
      let e = []
      let count = arr[0].count
      let price = arr[0].price * arr[0].count
      let obj = { sum: count, okprice: price }
      arr.push(obj)
      e.push(arr)
      this.setData({
        List: e,
        checked: true,
        checked2: false,
        checked3: false
      })
    } else {
      for (var i = 1; i < arr.length; i++) {
        if (arr[i].oid == arr[i - 1].oid) {
          b.push(arr[i - 1])
          if (i == arr.length - 1) {
            b.push(arr[i])
            c.push(b)
          }
        } else {
          // console.log(i - 1)
          b.push(arr[i - 1])
          c.push(b)
          b = []
          if (i == arr.length - 1) {
            b.push(arr[i])
            c.push(b)
          }
        }
      }
      this.setData({
        List: c,
        checked: true,
        checked2: false,
        checked3: false
      })
      let d = this.data.List
      let count = 0
      let price = 0
      for (var i = 0; i < d.length; i++) {
        d[i].forEach((item) => {
          count = item.count + count
          price = item.price * item.count + price
        })
        let obj = { sum: count, okprice: price }
        d[i].push(obj)
        count = 0
        price = 0
      }
      this.setData({
        List: d,
      })
      console.log(this.data.List);
    }
  },

  // 进行中
  ing() {
    this.getIng()
    let arr = this.data.ingList
    let b = []
    let c = []
    if (arr.length == 1) {
      let e = []
      let count = arr[0].count
      let price = arr[0].price * arr[0].count
      let obj = { sum: count, okprice: price }
      arr.push(obj)
      e.push(arr)
      this.setData({
        List: e,
        checked: false,
        checked2: true,
        checked3: false
      })
    } else {
      for (var i = 1; i < arr.length; i++) {
        if (arr[i].oid == arr[i - 1].oid) {
          b.push(arr[i - 1])
          if (i == arr.length - 1) {
            b.push(arr[i])
            c.push(b)
          }
        } else {
          // console.log(i - 1)
          b.push(arr[i - 1])
          c.push(b)
          b = []
          if (i == arr.length - 1) {
            b.push(arr[i])
            c.push(b)
          }
        }
      }
      this.setData({
        List: c,
        checked: false,
        checked2: true,
        checked3: false
      })
      let d = this.data.List
      let count = 0
      let price = 0
      for (var i = 0; i < d.length; i++) {
        d[i].forEach((item) => {
          count = item.count + count
          price = item.price * item.count + price
        })
        let obj = { sum: count, okprice: price }
        d[i].push(obj)
        count = 0
        price = 0
      }
      this.setData({
        List: d,
      })
      console.log(this.data.List);
    }
  },

  // 已完成
  done() {
    this.getDone()
    let arr = this.data.doneList
    let b = []
    let c = []
    if (arr.length == 1) {
      let e = []
      let count = arr[0].count
      let price = arr[0].price * arr[0].count
      let obj = { sum: count, okprice: price }
      arr.push(obj)
      e.push(arr)
      this.setData({
        List: e,
        checked: false,
        checked2: false,
        checked3: true
      })
    } else {
      for (var i = 1; i < arr.length; i++) {
        if (arr[i].oid == arr[i - 1].oid) {
          b.push(arr[i - 1])
          if (i == arr.length - 1) {
            b.push(arr[i])
            c.push(b)
          }
        } else {
          b.push(arr[i - 1])
          c.push(b)
          b = []
          if (i == arr.length - 1) {
            b.push(arr[i])
            c.push(b)
          }
        }
      }
      this.setData({
        List: c,
        checked: false,
        checked2: false,
        checked3: true
      })
      let d = this.data.List
      let count = 0
      let price = 0
      for (var i = 0; i < d.length; i++) {
        d[i].forEach((item) => {
          count = item.count + count
          price = item.price * item.count + price
        })
        let obj = { sum: count, okprice: price }
        d[i].push(obj)
        count = 0
        price = 0
      }
      this.setData({
        List: d,
      })
    }
  },

  // 确认收货
  confirm(e) {
    let that = this
    // console.log(e.currentTarget.dataset.oid)
    let oid = e.currentTarget.dataset.oid
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/receive',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        oid: oid
      }
    }).then(res => {
      if (res.data.code == 80000) {
        wx.showToast({
          title: res.data.msg,
        })
        let arr = this.data.List
        for (var i = 0; i < arr.length; i++) {
          if (oid == arr[i][0].oid) {
            arr.splice(i, 1)
          }
        }
        that.setData({
          List: arr
        })
        this.getIng()
      } else {
        wx.showToast({
          title: '确定收货失败',
          icon: 'error'
        })
      }
    })
  },

  // 删除订单
  delete(e) {
    let that = this
    let oid = e.currentTarget.dataset.oid
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/removeOrder',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        oid: oid
      }
    }).then(res => {
      if (res.data.code == 90000) {
        wx.showToast({
          title: res.data.msg,
        })
        let arr = this.data.List
        for (var i = 0; i < arr.length; i++) {
          if (oid == arr[i][0].oid) {
            arr.splice(i, 1)
          }
        }
        that.setData({
          List: arr
        })
        this.getDone()
      } else {
        wx.showToast({
          title: '删除订单失败',
          icon: 'error'
        })
      }
    })
  },

  // 获取全部订单
  getAll() {
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findOrder',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        status: 0
      }
    }).then(res => {
      console.log(res)
      for (var i = 0; i < res.data.result.length; i++) {
        let time1 = res.data.result[i].updatedAt.split('.000Z')
        let time2 = time1[0].split('T') 
        let time = time2.join(' ')
        var d = new Date(time)
        d.setHours(d.getHours() + 8);
        let Y = d.getFullYear() + '-';
        let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
        let D = d.getDate() < 10 ? '0' + d.getDate() + ' ' : d.getDate() + ' ';
        let h = d.getHours() < 10 ? '0' + d.getHours() + ':' : d.getHours() + ':';
        let m = d.getMinutes() < 10 ? '0' + d.getMinutes() + ':' : d.getMinutes() + ':';
        let s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
        time = Y + M + D + h + m + s
        res.data.result[i].updatedAt = time
      }
      this.setData({
        allList: res.data.result,
      })
      let arr = this.data.allList
      console.log(arr);
      let b = []
      let c = []
      if (arr.length == 1) {
        let e = []
        let count = arr[0].count
        let price = arr[0].price * arr[0].count
        let obj = { sum: count, okprice: price }
        arr.push(obj)
        e.push(arr)
        this.setData({
          List: e,
        })
      } else {
        for (var i = 1; i < arr.length; i++) {
          if (arr[i].oid == arr[i - 1].oid) {
            b.push(arr[i - 1])
            if (i == arr.length - 1) {
              b.push(arr[i])
              c.push(b)
            }
          } else {
            b.push(arr[i - 1])
            c.push(b)
            b = []
            if (i == arr.length - 1) {
              b.push(arr[i])
              c.push(b)
            }
          }
        }
        this.setData({
          List: c,
        })
        console.log(this.data.List);
        let d = this.data.List
        let count = 0
        let price = 0
        for (var i = 0; i < d.length; i++) {
          d[i].forEach((item) => {
            count = item.count + count
            price = item.price * item.count + price
          })
          let obj = { sum: count, okprice: price }
          d[i].push(obj)
          count = 0
          price = 0
        }
        this.setData({
          List: d,
        })
        console.log(this.data.List);
      }
    })
  },

  // 获取进行中订单信息
  getIng() {
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findOrder',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        status: 1
      }
    }).then(res => {
      console.log(res)
      for (var i = 0; i < res.data.result.length; i++) {
        let time1 = res.data.result[i].updatedAt.split('.000Z')
        let time2 = time1[0].split('T') // 14 - 6
        let time = time2.join(' ')
        var d = new Date(time)
        d.setHours(d.getHours() + 8);
        let Y = d.getFullYear() + '-';
        let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
        let D = d.getDate() < 10 ? '0' + d.getDate() + ' ' : d.getDate() + ' ';
        let h = d.getHours() < 10 ? '0' + d.getHours() + ':' : d.getHours() + ':';
        let m = d.getMinutes() < 10 ? '0' + d.getMinutes() + ':' : d.getMinutes() + ':';
        let s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
        time = Y + M + D + h + m + s
        res.data.result[i].updatedAt = time
      }
      this.setData({
        ingList: res.data.result,
      })
      console.log(this.data.ingList);
    })
  },

  // 获取已完成订单信息
  getDone() {
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findOrder',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        status: 2
      }
    }).then(res => {
      console.log(res)
      for (var i = 0; i < res.data.result.length; i++) {
        let time1 = res.data.result[i].updatedAt.split('.000Z')
        let time2 = time1[0].split('T')
        let time = time2.join(' ')
        var d = new Date(time)
        d.setHours(d.getHours() + 8);
        let Y = d.getFullYear() + '-';
        let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
        let D = d.getDate() < 10 ? '0' + d.getDate() + ' ' : d.getDate() + ' ';
        let h = d.getHours() < 10 ? '0' + d.getHours() + ':' : d.getHours() + ':';
        let m = d.getMinutes() < 10 ? '0' + d.getMinutes() + ':' : d.getMinutes() + ':';
        let s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
        time = Y + M + D + h + m + s
        res.data.result[i].updatedAt = time
      }
      this.setData({
        doneList: res.data.result,
      })
    })
  },

  onLoad(options) {
    this.getAll()
    this.getIng()
    this.getDone()
  },

  // 微信小程序返回键跳转到指定页面,reLaunch 可以打开任意页面。onUnload函数为监听页面卸载的函数，把页面重定向到指定的页面
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/user/user'
    })
  }
})