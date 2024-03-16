import { areaList } from '../../miniprogram_npm/@vant/area-data/index'
import { request } from '../../request/request'

Page({
  data: {
    areaList,
    show: false,
    checked: false,
    isDefault: 0,
    areaCode: '',
    province: '',
    city: '',
    county: ''
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

  // 新增地址
  saveAdd() {
    var token = wx.getStorageSync('token')
    let that = this.data
    if (that.name != '' && that.phone != '' && that.area != '' && that.areaList != '' && that.areaCode != '' && that.postalCode != '') {
      request({
        url: 'http://www.kangliuyong.com:10002/addAddress',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          tokenString: token,
          name: this.data.name,
          tel: this.data.phone,
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
        if (res.data.code == 9000) {
          wx.showToast({
            title: res.data.msg,
          })
          wx.navigateBack({
            url: '/pages/address/address',
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入全部信息',
        icon: 'error'
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
})