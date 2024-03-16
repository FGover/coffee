// pages/personaldata /personaldata.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mineobj: null,
    // 展示用户上传的头像
    fileList: [],
    token: null,

    // 用户昵称
    nickName: "还没有昵称",
    base64: null
  },

  // 用户上传头像的回调函数
  afterRead(e) {
    // console.log(e.detail.file.url);
    // let obj = {};
    // obj.url = e.detail.file.url;
    // let arr = this.data.fileList;
    // console.log(arr);
    // arr.push(obj)
    // this.setData({
    //     fileList:arr
    // }),
    // 获取图片本地地址
    //     wx.chooseImage({
    //       success:res=>{
    //         // console.log(res);
    //         this.urlTobase64(res.tempFilePaths[0])
    //       }
    // })
    // 把图片转base64成功
    wx.chooseImage({
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log('data:image/png;base64,' + res.data);
            this.setData({
              base64: res.data
            })
          }
        })

        //以下两行注释的是同步方法，不过我不太喜欢用。
        //let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64') 
        //console.log(base64)
      }
    })
  },
  // 把图片地址转base
  //   urlTobase64(url){
  //     wx.request({
  //       url:url,
  //       responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
  //       success:res=>{
  //         //把arraybuffer转成base64
  //             let base64 = wx.arrayBufferToBase64(res.data); 
  //             //不加上这串字符，在页面无法显示的哦
  //             base64　= 'data:image/jpeg;base64,' + base64;
  //             //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
  //             console.log(base64)　
  //             this.setData({
  //               base64:base64
  //             })
  //           }
  //     })
  //  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'mytoken',
      success(res) {
        // console.log(res.data);
        // 获取我的页面
        that.setData({
          token: res.data
        })
        wx.request({
          url: 'http://www.kangliuyong.com:10002/findMy',
          method: "GET",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: that.data.token
          },
          success: res => {
            console.log(res.data.result[0]);
            that.setData({
              mineobj: res.data.result[0]
            });
            if (res.data.result[0].nickName != 'undefined') {
              that.setData({
                nickName: res.data.result[0].nickName
              });
            }
          }
        })
      },
    })
  },

  // 点击输入框就清空输入框的值
  empty() {
    this.setData({
      nickName: null
    })
  },

  // 保存修改的资料
  save() {
    // 保存用户昵称
    if (this.data.nickName != null) {
      wx.request({
        url: 'http://www.kangliuyong.com:10002/updateNickName',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.data.token,
          nickName: this.data.nickName
        },
        success: res => {
          console.log(res);
        }
      })
    } else {
      console.log(111);
      wx.showToast({
        title: '请输入昵称',
        icon: "error"
      })
    };
    if (this.data.base64 != null) {
      wx.request({
        url: 'http://www.kangliuyong.com:10002/updateAvatar',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.data.token,
          imgType: 'png',
          serverBase64Img: this.data.base64
        },
        success: res => {
          console.log(res);
        }
      })
    }

  },
  nosave() {
    wx.redirectTo({
      url: '../personaldata/personaldata',
    })
  },

})