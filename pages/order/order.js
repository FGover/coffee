import { request } from "../../request/request";

Page({
  data: {
    show: false,
    // 默认地址
    addList: {},
    // 选择地址列表
    AddList: [],
    sids: [],
    // 商品订单列表
    List: [],
    // 时间
    time: '',
    sum: 0,
    count: 0,
    // 收获地址
    address: '',
    // 立即购买的数据
    goodnum: '',
    pid: '',
    rule: '',
    buyList: []
  },

  // 复选框来回切换
  onChange(e) {
    let that = this
    // console.log(e.currentTarget.dataset.aid)
    let aid = e.currentTarget.dataset.aid
    let arr = that.data.AddList
    for (var i = 0; i < arr.length; i++) {
      arr[i].isChecked = false
      if (arr[i].aid == aid) {
        arr[i].isChecked = !arr[i].isChecked
      }
    }
    that.setData({
      AddList: arr,
      show: false,
    })
    for (var i = 0; i < this.data.AddList.length; i++) {
      if (this.data.AddList[i].isChecked == true) {
        this.setData({
          addList: this.data.AddList[i]
        })
      }
    }
    console.log(this.data.addList);
  },

  // 关闭弹出层
  onClose() {
    this.setData({ show: false });
  },

  // 跳转新增地址页面
  add() {
    wx.navigateTo({
      url: '/pages/newaddress/newaddress',
    })
  },

  // 获取默认地址
  getDetail() {
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findAddress',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token
      }
    }).then(res => {
      console.log(res)
      this.setData({
        AddList: res.data.result,
      })
      let arr = []
      let j;
      for (var i = 0; i < res.data.result.length; i++) {
        if (res.data.result[i].isDefault == 1) {
          j = i
          this.setData({
            addList: res.data.result[i]
          })
          arr.push(res.data.result[i])
          // 复选框默认
          this.data.AddList[i].isChecked = true
        }
      }
      // 弹出层地址渲染
      for (var i = 0; i < res.data.result.length; i++) {
        if (j != i) {
          arr.push(res.data.result[i])
        }
      }
      this.setData({
        AddList: arr
      })
    })
  },

  // 选择地址
  select() {
    this.setData({
      show: true
    })
  },

  // 获取订单商品信息
  getOrder() {
    let sids = this.data.sids
    console.log(sids);
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/commitShopcart',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        sids: JSON.stringify(sids)
      }
    }).then(res => {
      console.log(res)
      this.setData({
        List: res.data.result
      })
      let sum = 0
      let count = 0
      for (var i = 0; i < res.data.result.length; i++) {
        let price = res.data.result[i].price * res.data.result[i].count
        sum = sum + price
        count = count + res.data.result[i].count
      }
      this.setData({
        sum: sum,
        count: count
      })
    })
  },

  // 获取立即购买的订单信息
  getBuy() {
    request({
      url: 'http://www.kangliuyong.com:10002/productDetail',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid: this.data.pid
      }
    }).then(res => {
      console.log(res)
      this.setData({
        buyList: res.data.result[0]
      })
    })
  },

  // 立即结算(sids)
  settle() {
    this.setData({
      address: this.data.addList.province + this.data.addList.city + this.data.addList.county + this.data.addList.addressDetail
    })
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/pay',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        sids: JSON.stringify(this.data.sids),
        phone: this.data.addList.tel,
        address: this.data.address,
        receiver: this.data.addList.name
      }
    }).then(res => {
      console.log(res)
      if (!this.data.pid) {
        // 页面A跳转到页面B可以通过这个方法在页面B修改页面A的数据
        var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
        // var currentPage = pages[pages.length - 1]  // 获取当前页面
        var prevPage = pages[pages.length - 2]    //获取上一个页面
        // console.log(prevPage.data.result) 
        prevPage.data.result = []
      }
      let status = this.data.List[0].status
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?status=' + status,
      })
    })
  },

  // 获取当前系统时间
  getTime() {
    var d = new Date();
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var day = d.getDate()
    var hour = d.getHours()
    var minutes = d.getMinutes()
    var second = d.getSeconds()
    if(hour < 10) {
      this.setData({
        time: year + '-' + month + '-' + day + ' ' + '0' + hour + ':' + minutes + ':' + second
      })
    } else if(minutes < 10) {
      this.setData({
        time: year + '-' + month + '-' + day + ' ' + hour + ':' + '0' + minutes + ':' + second
      })
    } else if(second < 10) {
      this.setData({
        time: year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + '0' + second
      })
    } else {
      this.setData({
        time: year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      sids: options.sids,
      pid: options.pid,
      goodnum: options.goodnum,
      rule: options.rule
    })
    if (this.data.pid == undefined) {
      this.setData({
        pid: false
      })
    }
    if (this.data.sids != undefined) {
      let arr = []
      arr.push(this.data.sids.split(','))
      this.setData({
        sids: arr[0]
      })
      this.getOrder()
    } else {
      this.getBuy()
    }
    this.getTime()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getDetail()
  },

})