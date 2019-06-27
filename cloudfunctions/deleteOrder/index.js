// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
const _=db.command

// 云函数入口函数
exports.main = async (event, context) => {
  res=await db.collection('patients').where({
    user: event.userInfo.openId,
    timestamp:_.gte(event.now)
  }).remove()
  if (res.errMsg =="collection.remove:ok"){
    return {
      "status":0,
      "msg":""
    }
  }else{
    return {
      "status":1,
      "msg":"取消失败"
    }
  }
}