import { request } from '../../request/request'
Page({
  data: {
    userImg: '',
    nickName: '',
    userId: '',
    desc: '',
    show1: false,
    show2: false,
    base64: ''
  },

  onClose() {
    this.setData({ show: false });
  },

  // 获取用户资料
  getPerson() {
    var token = wx.getStorageSync('token')
    if (token) {
      request({
        url: 'http://www.kangliuyong.com:10002/findAccountInfo',
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token
        }
      }).then(res => {
        console.log(res)
        this.setData({
          userImg: res.data.result[0].userImg,
          nickName: res.data.result[0].nickName,
          userId: res.data.result[0].userId,
          desc: res.data.result[0].desc
        })
      })
    }
  },

  // 上传头像
  uploadImg() {
    wx.chooseImage({
      count: 1, // 限制上传数量
      sizeType: ['compressed'], // 必须放在 数组里面才有效； original 原图；compressed 压缩图
      sourceType: ['album', 'camera'], // album 从相册选图; camera 使用相机
      success: res => {
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

  // upload
  upload() {
    var token = wx.getStorageSync('token')
    if (this.data.base64 != '') {
      request({
        url: 'http://www.kangliuyong.com:10002/updateAvatar',
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
        if (res.data.code == 'H001') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          this.setData({
            userImg: res.data.userImg
          })
        } else {
          wx.showToast({
            title: '上传头像失败',
            icon: 'error'
          })
        }
      })
    }
  },

  // 修改昵称
  reName() {
    this.setData({
      show1: true
    })
  },

  // 修改昵称
  onRename() {
    var token = wx.getStorageSync('token')
    if (token) {
      request({
        url: 'http://www.kangliuyong.com:10002/updateNickName',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token,
          nickName: this.data.nickName
        }
      }).then(res => {
        // console.log(res)
        wx.showToast({
          title: res.data.msg,
        })
      })
    }
  },

  // 修改简介
  reDesc() {
    this.setData({
      show2: true
    })
  },

  onDesc() {
    var token = wx.getStorageSync('token')
    if (token) {
      request({
        url: 'http://www.kangliuyong.com:10002/updateDesc',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token,
          desc: this.data.desc
        }
      }).then(res => {
        // console.log(res);
        wx.showToast({
          title: res.data.msg,
        })
      })
    }
  },

  onLoad(options) {
    this.getPerson()
  },

})