import { request } from "../../request/request"

Page({
  data: {
    addList: []
  },

  // 跳转新增地址
  add() {
    wx.navigateTo({
      url: '/pages/newaddress/newaddress',
    })
  },

  // 获取地址信息
  getDetail() {
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findAddress',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token
      }
    }).then(res => {
      this.setData({
        addList: res.data.result
      })
      console.log(this.data.addList)
    })
  },

  // 跳转编辑地址
  edit(e) {
    // console.log(e.currentTarget.dataset.id);
    // let aid = e.currentTarget.dataset.id
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/editaddress/editaddress?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  onShow() {
    this.getDetail()
  },
  
})