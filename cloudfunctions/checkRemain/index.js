// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'registration-ujn',
  traceUser: true,
})
const db = cloud.database()
const patients = db.collection('patients')

// 云函数入口函数
exports.main = async(event, context) => {
  function getSingleDbCount(day,time){
    return new Promise((resolve,reject)=>{
      res = db.collection('patients').where({
        timestamp:day,
        time:time,
      }).count()
      resolve(res)
    })
  }
  var getThreeCount=async function(day){
    var list=new Array();
    var tmp=null;
    for(var i=0;i<3;i++){
      tmp=await getSingleDbCount(day,i)
      list[i]=25-tmp.total;
    }
    return new Promise((resolve,reject)=>{
      resolve(list)
    })
  }

  return getThreeCount(event.timestamp)
}