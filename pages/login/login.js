import { request } from "../../request/request";

Page({
  data: {
    show: false,
    phone: '18824400184',
    password: 'fgh020407',
    regArr: [
      {
        text: '用户名',
        value: '',
        check: (value)=> /^[\w\u4e00-\u9fa5]{1,10}$/.test(value),
        erroMsg: '',
      },
      {
        text: '手机号',
        value: '',
        check: (value)=> /^1[3-9]\d{9}$/.test(value),
        erroMsg: '',
      },
      {
        text: '密码',
        value: '',
        check: (value)=> /^[A-Za-z]\w{5,15}$/.test(value),
        erroMsg: '',
      },
    ]
  },

  showPopup() {
    this.setData({ show: true });
  },

  onChange(e){
    var arr = this.data.regArr
    var obj = ['你的昵称不符合格式','你的手机号码不符合格式','你的密码不符合格式']
    // console.log(e.detail)  //输入框内容
    console.log(e)
    // 获取输入框内容
    var value = e.detail
    var id = e.currentTarget.dataset.id
    console.log(arr[id].check(value))
    if(arr[id].check(value)) {
      // 验证成功
      arr[id].erroMsg = ''
      arr[id].value = value
      this.setData({
        regArr: arr
      })
    } else {
      // 验证失败
      // console.log(arr[id].erroMsg)
      arr[id].erroMsg = obj[id]
      arr[id].value = value
      this.setData({
        regArr: arr
      })
    }
  },

  // 注册
  register(){
    if(this.data.regArr[0].value == '' || this.data.regArr[1].value == '' || this.data.regArr[2].value == '') {
      wx.showToast({
        title: '请输入全部信息',
        icon: 'error'
      })
    } else {
      request({
        url: 'http://www.kangliuyong.com:10002/register',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          nickName: this.data.regArr[0].value,
          password: this.data.regArr[2].value,
          phone: this.data.regArr[1].value
        }
      }).then(res=> {
        console.log(res)
        // 判断是否注册成功
        if(res.data.code == 100) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
          this.setData({
            show: false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error'
          })
        }
      })
    }
  },

  // 登录
  login(){
    if(this.data.phone == '' || this.data.password == ''){
      wx.showToast({
        title: '请输入全部信息',
        icon: 'error'
      })
    } else {
      request({
        url: 'http://www.kangliuyong.com:10002/login',
        method: 'POST',
        header: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          password: this.data.password,
          phone: this.data.phone
        }
      }).then(res=>{
        console.log(res)
        if(res.data.code == 200){
           // 保存token
           wx.setStorageSync('token', res.data.token)
           wx.switchTab({
             url: '/pages/user/user',
           })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        
      })
    }
  },

  // 找回密码
  findPass() {
    wx.navigateTo({
      url: '/pages/find/find',
    })
  },

  onClose() {
    this.setData({ show: false });
  },
});
