const cloud = require('wx-server-sdk')
//环境变量 ID
cloud.init({
  env:'buaalx-w5aor',
  traceUser:true
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async (event, context) => {
  var p;
  if (event.scoreChange==='提交感想') {
    p = 0.5
  }
  else if(event.scoreChange==='优秀感想'||event.scoreChange==='受到表扬') {
    p = 1
  }
  else if(event.scoreChange==='志愿迟到'){
    p = -4
  }
  else if(event.scoreChange==='受到批评'){
    p = -2
  }
  else if(event.scoreChange==='其他减分行为'){
    p = -1
  }
  else if(event.scoreChange==='缺勤但提前说明'){
    p = -8
  }
  else if(event.scoreChange==='缺勤但未提前说明'){
    p = -10
  }
  else if(event.scoreChange==='缺勤且未说明'){
    p = -15
  }
  
  
  try {
    return await db.collection('person').doc(event.openid).update({
      
      data: {
        score: event.basic + p + '0'
      }
    })
  } catch (e) {
    console.error(e)
  }
  
}
