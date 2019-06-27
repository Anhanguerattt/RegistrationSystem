// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _=db.command

// 云函数入口函数
exports.main = async (event, context) => {

  var getBook=function(){
    return new Promise((resolve, reject) => {
      res = db.collection('patients').where({
        user: event.userInfo.openId,
        timestamp:_.gte(event.now)
      }).get()
      resolve(res)
    })
  }
  var res=await getBook()
  console.log(event.now)
  return res.data
}