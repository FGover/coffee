import { areaList } from '../../miniprogram_npm/@vant/area-data/index'
import { request } from '../../request/request';

Page({
  data: {
    areaList,
    show: false,
    checked: false,
    id: '',
    aid: '',
  },

  // 取消选地区
  cancel() {
    this.setData({
      show: false
    })
  },

  // 确认选地区
  confirm(e) {
    console.log(e.detail.values);
    this.data.province = e.detail.values[0].name
    this.data.city = e.detail.values[1].name
    this.data.county = e.detail.values[2].name
    this.setData({
      show: false,
      area: this.data.province + this.data.city + this.data.county,
      areaCode: e.detail.values[2].code
    })
  },

  // 默认地址
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail,
    })
    if (detail == true) {
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 0
      })
    }
  },

  onPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  // 通过aid获取地址(接口出问题)
  getDetailByaid() {
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/findAddress',
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
      }
    }).then(res => {
      this.setData({
        area: res.data.result[this.data.id].province + res.data.result[this.data.id].city + res.data.result[this.data.id].county,
        name: res.data.result[this.data.id].name,
        tel: res.data.result[this.data.id].tel,
        addressDetail: res.data.result[this.data.id].addressDetail,
        postalCode: res.data.result[this.data.id].postalCode,
        aid: res.data.result[this.data.id].aid,
        areaCode: res.data.result[this.data.id].areaCode,
        province: res.data.result[this.data.id].province,
        city: res.data.result[this.data.id].city,
        county: res.data.result[this.data.id].county,
        isDefault: res.data.result[this.data.id].isDefault
      })
      if (res.data.result[this.data.id].isDefault == 1) {
        this.setData({
          checked: true
        })
      }
    })
  },

  // 删除地址
  delete() {
    var token = wx.getStorageSync('token')
    request({
      url: 'http://www.kangliuyong.com:10002/deleteAddress',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        aid: this.data.aid
      }
    }).then(res=>{
      console.log(res)
      if(res.data.code == 10000) {
        wx.showToast({
          title: res.data.msg,
        })
        wx.reLaunch({
          url: '/pages/address/address',
        })
      } else {
        wx.showToast({
          title: '删除地址失败',
          icon: 'error'
        })
      }
    })
  },


  // 编辑保存地址
  save() {
    var token = wx.getStorageSync('token')
    console.log(this.data.isDefault);
    request({
      url: 'http://www.kangliuyong.com:10002/editAddress',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: token,
        aid: this.data.aid,
        name: this.data.name,
        tel: this.data.tel,
        province: this.data.province,
        city: this.data.city,
        county: this.data.county,
        addressDetail: this.data.addressDetail,
        areaCode: this.data.areaCode,
        postalCode: this.data.postalCode,
        isDefault: this.data.isDefault
      }
    }).then(res => {
      console.log(res)
      if(res.data.code == 30000) {
        wx.showToast({
          title: res.data.msg,
        })
        wx.reLaunch({
          url: '/pages/address/address',
        })
      } else {
        wx.showToast({
          title: '编辑地址失败',
          icon: 'error'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDetailByaid()
    this.setData({
      id: options.id
    })
  },
})