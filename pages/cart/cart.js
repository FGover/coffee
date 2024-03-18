import { request } from "../../request/request"

Page({
  data: {
    cartList: [],
    checked: false,
    result: [],
    // 未加.00价格
    // 处理好加.00价格
    okprice: 0,
    show: true,
    show2: false
  },

  // 编辑
  edit() {
    this.setData({
      show: false
    })
  },

  // 完成
  done() {
    if (this.data.result.length == 0) {
      this.setData({
        checked: false,
        okprice: 0
      })
    } else if (this.data.result.length < this.data.cartList.length) {
      this.setData({
        checked: false
      })
    }
    this.setData({
      show: true
    })
  },

  // 提交订单
  onSubmit(e) {
    // console.log(e.currentTarget.dataset.id)
    if (this.data.result.length > 0) {
      wx.navigateTo({
        url: '/pages/order/order?sids=' + this.data.result,
      })
    } else {
      wx.showToast({
        title: '请先选择商品',
        icon: 'error'
      })
    }
  },

  // 删除商品
  onDelete() {
    // console.log(JSON.stringify(this.data.result));
    let that = this
    let sids = this.data.result
    // console.log(sids);
    var token = wx.getStorageSync('token')
    if (sids.length > 0) {
      request({
        url: 'http://www.kangliuyong.com:10002/deleteShopcart',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token,
          sids: JSON.stringify(sids)
        }
      }).then(res => {
        if (res.data.code == 7000) {
          wx.showToast({
            title: res.data.msg,
          })
          this.setData({
            result: []
          })
          that.getCartList()
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'error'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先选择商品',
        icon: 'error'
      })
    }
  },

  // 加
  plus(e) {
    let count = e.currentTarget.dataset.data.count
    let sid = e.currentTarget.dataset.data.sid
    count++
    let that = this
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/modifyShopcartCount',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        sid: sid,
        count: count
      }
    }).then(res => {
      if (res.data.code == 6000) {
        // that.getCartList()
        // 如果全选就计算价格
        if (that.data.checked == true) {
          request({
            url: 'http://www.kangliuyong.com:10002/findAllShopcart',
            data: {
              appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
              tokenString: token
            }
          }).then(res => {
            that.setData({
              cartList: res.data.result
            })
            let num = 0
            for (var i = 0; i < this.data.cartList.length; i++) {
              num = num + this.data.cartList[i].count * this.data.cartList[i].price
            }
            console.log(num);
            num = parseInt(num + '00')
            this.setData({
              okprice: num
            })
          })
        }
        // 如果部分选中
        if (this.data.result.length != 0 && that.data.checked == false) {
          request({
            url: 'http://www.kangliuyong.com:10002/findAllShopcart',
            data: {
              appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
              tokenString: token
            }
          }).then(res => {
            that.setData({
              cartList: res.data.result
            })
            let num2 = 0
            for (var i = 0; i < that.data.cartList.length; i++) {
              for (var j = 0; j < this.data.result.length; j++) {
                if (this.data.result[j] == that.data.cartList[i].sid) {
                  num2 = num2 + that.data.cartList[i].count * that.data.cartList[i].price
                }
              }
            }
            console.log(num2);
            num2 = parseInt(num2 + '00')
            that.setData({
              okprice: num2
            })
          })
        }
      }
    })
  },

  // 减
  minus(e) {
    let count = e.currentTarget.dataset.data.count
    let sid = e.currentTarget.dataset.data.sid
    count--
    let that = this
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/modifyShopcartCount',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        sid: sid,
        count: count
      }
    }).then(res => {
      if (res.data.code == 6000) {
        // that.getCartList()
        // 全选计算价格
        if (that.data.checked == true) {
          request({
            url: 'http://www.kangliuyong.com:10002/findAllShopcart',
            data: {
              appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
              tokenString: token
            }
          }).then(res => {
            that.setData({
              cartList: res.data.result
            })
            let num = 0
            for (var i = 0; i < this.data.cartList.length; i++) {
              num = num + this.data.cartList[i].count * this.data.cartList[i].price
            }
            console.log(num);
            num = parseInt(num + '00')
            this.setData({
              okprice: num
            })
          })
        }
        // 部分选中
        if (this.data.result.length != 0 && that.data.checked == false) {
          request({
            url: 'http://www.kangliuyong.com:10002/findAllShopcart',
            data: {
              appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
              tokenString: token
            }
          }).then(res => {
            that.setData({
              cartList: res.data.result
            })
            let num2 = 0
            for (var i = 0; i < that.data.cartList.length; i++) {
              for (var j = 0; j < this.data.result.length; j++) {
                if (this.data.result[j] == that.data.cartList[i].sid) {
                  console.log(num2);
                  num2 = num2 + that.data.cartList[i].count * that.data.cartList[i].price
                }
              }
            }
            console.log(num2);
            num2 = parseInt(num2 + '00')
            that.setData({
              okprice: num2
            })
          })
        }
      }
    })
  },

  // 全选按钮
  onChange(e) {
    this.setData({
      checked: e.detail,
    });
    if (e.detail == true) {
      this.data.cartList.forEach(item => {
        // console.log(item)
        let arr = this.data.result
        // 使用indexOf来去除arr中的重复元素
        if (arr.indexOf(item.sid) == -1) {
          arr.push(item.sid)
        }
        this.setData({
          result: arr
        })
        let num = 0
        for (var i = 0; i < this.data.cartList.length; i++) {
          num = num + this.data.cartList[i].count * this.data.cartList[i].price
        }
        num = parseInt(num + '00')
        this.setData({
          okprice: num,
        })
      });
    } else {
      this.setData({
        result: [],
        okprice: 0
      })
    }
  },

  // 单独选择按钮
  onChangeson(e) {
    console.log(e);
    // 商品的sid布尔值
    console.log(e.detail);
    let that = this
    this.setData({
      result: e.detail
    })
    let num = 0
    if (e.detail.length !== 0) {
      // 判断sid值
      for (var i = 0; i < that.data.cartList.length; i++) {
        for (var j = 0; j < e.detail.length; j++) {
          if (e.detail[j] == that.data.cartList[i].sid) {
            num = num + that.data.cartList[i].count * that.data.cartList[i].price
          }
        }
      }
    }
    // console.log(num);
    num = parseInt(num + '00')
    that.setData({
      okprice: num
    })
    // 如果全勾上，全选按钮也会勾上
    if (that.data.result.length == that.data.cartList.length) {
      that.setData({
        checked: true
      })
    } else {
      that.setData({
        checked: false
      })
    }

  },

  // 获取购物车商品
  getCartList() {
    var token = wx.getStorageSync('token')
    if (token) {
      // 用户已登录
      request({
        url: 'http://www.kangliuyong.com:10002/findAllShopcart',
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token
        }
      }).then(res => {
        // 判断是否加入购物车，加入则将全选取消
        if (res.data.result.length > this.data.cartList.length) {
          this.setData({
            checked: false,
            result: []
          })
        }
        this.setData({
          cartList: res.data.result,
          result: this.data.result
        })
        console.log(this.data.result)
        if (this.data.result.length == 0) {
          this.setData({
            checked: false,
            okprice: 0
          })
        }
        if (this.data.cartList.length == 0) {
          this.setData({
            show2: true
          })
        } else {
          this.setData({
            show2: false,
          })
        }
      })
    } else {
      // 用户未登录
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },

  onLoad(options) {
  },

  // 当页面显示出来的时候
  onShow() {
    this.getCartList()
  }
})