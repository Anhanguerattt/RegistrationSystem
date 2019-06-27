// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
const _=db.command
//day,time,day,phone
// 云函数入口函数
exports.main = async (event, context) => {
  var isExists=function(){
    return new Promise((resolve,reject)=>{
      var res=db.collection('patients').where({
        user: event.userInfo.openId,
        timestamp:_.gt(event.now)
      }).count()
      resolve(res)
      reject("error")
    })
  }

  var addPatient=function(){
    return new Promise((resolve,reject)=>{
      var res = db.collection('patients').add({
        data: {
          timestamp: event.timestamp,
          name: event.name,
          phone: event.phone,
          time: Number(event.time),
          checkIn: false,
          user: event.userInfo.openId
        }
      })
      resolve(res)
      reject("fail")
    })
  }

  var count=await isExists()
  console.log(count)
  console.log(typeof event.timestamp)
  if(count.total!=0){
    return {
      "status": 1,
      "msg": "已有一个预约，请取消后再尝试"
    }
  }else{
    var res=await addPatient()
    console.log(res)
    if (res.errMsg =="collection.add:ok"){
      return {
        "status":0,
        "msg":""
      }
    }else{
      return {
        "status":1,
        "msg":"预约失败,请稍后尝试"
      }
    }
  }


}