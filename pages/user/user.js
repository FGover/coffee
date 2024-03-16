import { request } from "../../request/request"

Page({
  data: {
    user:{},
    obj: ['个人资料', '我的订单', '我的收藏', '地址管理','安全中心'],
    base64: ''
  },

  findMy() {
    var tokenString = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findMy',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: tokenString
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        user: res.data.result[0],
      })
    })
  },

  // 查看个人资料
  find(e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    if(id == 0) {
      wx.navigateTo({
        url: '/pages/person/person',
      })
    } else if(id == 1) {
      wx.navigateTo({
        url: '/pages/myOrder/myOrder',
      })
    } else if(id == 2) {
      wx.navigateTo({
        url: '/pages/myCollect/myCollect',
      })
    } else if(id == 3) {
      wx.navigateTo({
        url: '/pages/address/address',
      })
    } else if(id == 4) {
      wx.navigateTo({
        url: '/pages/center/center',
      })
    }
  },

  // 上传背景图
  uploadBg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], 
      success: res=>{
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',
          success: res => {
            this.setData({
              base64: res.data
            })
            this.upload()
          }
        })
      }
    })
  },

  upload() {
    var token = wx.getStorageSync('token')
    if(this.data.base64 != '') {
      request({
        url: 'http://www.kangliuyong.com:10002/updateUserBg',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: token,
          imgType: 'png' || 'jpg' || 'jpeg',
          serverBase64Img: this.data.base64
        },
      }).then(res => {
        console.log(res)
        if (res.data.code == 'I001') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          let user = this.data.user
          user.userBg = res.data.userBg
          this.setData({
            user: user
          })
        } else {
          wx.showToast({
            title: '上传背景图失败',
            icon: 'error'
          })
        }
      })
    }
  },

  onLoad(options) {
    this.findMy()
  },
})