// miniprogram/pages/two/two.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clinicDate:null,
    time:{
      y:null,
      m:null,
      d:null,
      t:null,
    },
    clinicPlace:"某某科室",
    patient:"",
    phoneNumber:"",
    wxId:null,
    error:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var clock=["13:00","15:00","16:30"]
    var patient=wx.getStorageSync("patient")
    var phone=wx.getStorageSync("phone")
    this.setData({
      patient:patient,
      phoneNumber:phone,
      time:{
        y:options.y,
        m:options.m,
        d:options.d,
        t:options.t,
      },
      clinicTime: clock[options.t],
      clinicPlace: "某某科室",
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  onSure:function(){
    var patient=this.data.patient;
    var phone=this.data.phoneNumber;
    if(patient.length==0){
      this.setData({
        error: "请输入姓名"
      });
      return
    }
    else if(patient.length==1 || patient.length>7){
      this.setData({
        error:"姓名输入错误"
      });
      return
    }
    if (phone.length==0){
      this.setData({
        error:"请输入手机号"
      })
      return
    }
    if ((phone.length != 11) || !(/^[0-9]+$/.test(phone))){
      this.setData({
        error:"手机号输入错误，请输入11位手机号"
      })
      return
    }
    this.setData({
      error:""
    });
    wx.setStorage({
      key: 'patient',
      data: this.data.patient,
    })
    wx.setStorage({
      key: 'phone',
      data: this.data.phoneNumber,
    })
    wx.showLoading({
      title: '预约中',
    })
    var now=new Date()
    console.log(this.data.time)
    wx.cloud.callFunction({
      name: 'addBook',
      data: {
        timestamp: new Date(Number(this.data.time.y),Number(this.data.time.m)-1,Number(this.data.time.d)).getTime(),
        name: this.data.patient,
        phone: this.data.phoneNumber,
        time: this.data.time.t,
        now: new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()
      },
      success: res => {
        try{
          var status=res.result.status
        }catch(err){
          wx.hideLoading()
          wx.showToast({
            icon: "none",
            title: "未知错误，请稍后尝试",
            duration: 2500
          })
          return
        }
        if(Number(res.result.status)==0){
          wx.hideLoading()
          wx.showToast({
            title: '预约成功！',
            duration:2500,
          })
          setTimeout(
            function(){
              wx.navigateBack({
                delta: 1,
              })
            },500)
          }else{
            wx.hideLoading()
            wx.showToast({
              icon:"none",
              title: res.result.msg,
              duration:3000
            })
          }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '预约失败，请检查网络',
          icon:'none'
        })
      }
    })
  },
  onpatientInput:function(e){
    this.setData({
      patient:e.detail.value,
    })
  },
  onphoneInput:function(e){
    this.setData({
      phoneNumber:e.detail.value
    })
  },
})