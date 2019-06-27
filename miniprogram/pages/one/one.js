// miniprogram/pages/one/one.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,//右侧菜单的开关
    click:true,//所有按钮是否可点击
    menuon:false,//菜单开关状态
    opt:0,//当前按下的按钮
    time:null,//每个按钮的日期
    timelist:[//预约时间按钮属性
      { uniquekey: '0', remain: null, time: "13:00"},
      { uniquekey: '1', remain: null, time: "15:00" },
      { uniquekey: '2', remain: null, time: "16:30"},
    ],
    buttonAttr: [//日期按钮属性
      { uniquekey: "day0", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click: false  },
      { uniquekey: "day1", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click: false },
      { uniquekey: "day2", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click: false},
      { uniquekey: "day3", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click:false },
      { uniquekey: "day4", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click:false },
      { uniquekey: "day5", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click:false },
      { uniquekey: "day6", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click:false },
      { uniquekey: "daY7", color: "white", textcolord: "gainsboro", textcoloru: "gainsboro", click:false  },],
    subtime:{//预约的时间
      y:null,
      m:null,
      d:null,
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onpagetap()
    var week= ["日", "一", "二", "三", "四", "五", "六"];
    var today = new Date();
    var time = new Array();
    for (var i = 0; i < 8; i++) {
      var a = new Date();
      a.setDate(a.getDate() + i);
      time[i] = { day: a.getDate(), weekday: week[a.getDay()] };
      if(a.getDay()==3 || a.getDay()==5 || a.getDay()==0){
        var key1 = 'buttonAttr[' + i +'].textcolord'
        var key2 = 'buttonAttr[' + i + '].textcoloru'
        var key3 = 'buttonAttr[' + i + '].click'
        this.setData({
          [key1]:"black",
          [key2]: "black",
          [key3]:true
        });
      }
    }
    this.setData({
      time:time,
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onpagetap: function () {
    if (this.data.menuon) {
      var key1 = 'buttonAttr[' + this.data.opt + '].color';
      var key2 = 'buttonAttr[' + this.data.opt + '].textcolord';
      var key3 = 'buttonAttr[' + this.data.opt + '].textcoloru';
      if (this.data.opt != null) {
        this.setData({
          open: false,
          click: true,
          menuon: false,
          [key1]: "white",
          [key2]: "black",
          [key3]: "black"
        });
      }
    } else {
      return
    }
  },
  onShow: function () {
    this.onpagetap()
    var a=["13:00","15:00","16:30"]
    var now=new Date()
    wx.cloud.callFunction({
      name: "checkBook",
      data: {
        now:new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()
      },
      success: res => {
        if (res.result.length > 0) {
          var day = new Date(Number(res.result[0].timestamp))
          console.log(day)
          res.result[0].day = day.getFullYear() + "年" + (day.getMonth()+1) + "月" + day.getDate() + "日"
          res.result[0].time=a[res.result[0].time]
          this.setData({
            order: true,
            orderDetail: res.result[0]
          })
        } else {
          this.setData({
            order: false
          })
        }
      },
      fail: error => {
        wx.showToast({
          title: '查询预约失败，请检查网络',
          icon: "none",
          duration: 2500
        })
      }
    })
  },
  onCancel:function(){
    wx.showModal({
      title: '',
      content: '确认取消',
      success:(res)=>{
        if(res.confirm){
          wx.showLoading({
            title: '取消中',
          })
          var now=new Date()
          wx.cloud.callFunction({
            name:"deleteOrder",
            data:{
              now: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
            },
            success:res=>{
              if(res.result.status==0){
                var now = new Date()
                wx.cloud.callFunction({
                  name: "checkBook",
                  data: {
                    now: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                  },
                  success: res => {
                    if (res.result.length > 0) {
                      var day = new Date(Number(res.result[0].timestamp))
                      console.log(day)
                      res.result[0].day = day.getFullYear() + "年" + (day.getMonth() + 1) + "月" + day.getDate() + "日"
                      res.result[0].time = a[res.result[0].time]
                      this.setData({
                        order: true,
                        orderDetail: res.result[0]
                      })
                    } else {
                      this.setData({
                        order: false
                      })
                    }
                  },
                  fail: error => {
                    wx.showToast({
                      title: '查询预约失败，请检查网络',
                      icon: "none",
                      duration: 2500
                    })
                  }
                })
                wx.hideLoading()
                wx.showToast({
                  title: '取消成功',
                  duration:2500,
                })
              }else{
                wx.hideLoading()
                wx.showToast({
                  title: '取消失败',
                  icon: "none",
                  duration: 2500,
                })
              }
            },
            fail:err=>{
              wx.hideLoading()
              wx.showToast({
                title: '取消失败',
                icon:"none",
                duration:2500,
              })
            }
          })
          setTimeout(function(){
            wx.hideLoading()
          },2000)
        }else{
          return
        }
      }
    })
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

  


  handletap:function(e){
    if(!this.data.click){
      return
    }
    if(!this.data.buttonAttr[e].click){
      return
    }
    var key1 = 'buttonAttr[' + e + '].color';
    var key2 = 'buttonAttr[' + e + '].textcolord';
    var key3 = 'buttonAttr[' + e + '].textcoloru';
    this.setData({
      [key1]: "rgb(255, 153, 0)",
      [key2]: "white",
      [key3]: "rgb(255, 153, 0)",
      click: false
    })
    wx.showLoading({
      title: '查询中',
    })
    var today = new Date()
    today.setDate(today.getDate() + e)
    wx.cloud.callFunction({
      name: 'checkRemain',
      data: {
         timestamp:new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime()
      },
      success: res => {
        
        this.setData({
          opt: e,
          open: true,
          'timelist[0].remain': res.result[0],
          'timelist[1].remain': res.result[1],
          'timelist[2].remain': res.result[2],
          subtime:{
            y:today.getFullYear(),
            m:today.getMonth()+1,
            d:today.getDate(),
          }
        });
        wx.hideLoading()
      },
      fail: err => {
        console.log('error')
      }
    })
    var context=this;

    setTimeout(function () {
      context.setData({
        menuon: true,
      });
    }, 500);
  },

  ontimetap0: function () {
    this.handletimetap(0);
  },
  ontimetap1: function () {
    this.handletimetap(1)
  },
  ontimetap2: function () {
    this.handletimetap(2)
  },

  handletimetap:function(e){
    if(this.data.timelist[e].remain<1){
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.navigateTo({
      url: '../two/two?y='+this.data.subtime.y+'&m='+this.data.subtime.m+'&d='+this.data.subtime.d+'&t='+e,
    })
  },

  ondaytap0: function(){
    this.handletap(0)
  },
  ondaytap1: function () {
    this.handletap(1)
  },
  ondaytap2: function () {
    this.handletap(2)
  },
  ondaytap3: function () {
    this.handletap(3)
  },
  ondaytap4: function () {
    this.handletap(4)
  },
  ondaytap5: function () {
    this.handletap(5)
  },
  ondaytap6: function () {
    this.handletap(6)
  },
  ondaytap7: function () {
    this.handletap(7)
  },

  
})