// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
		traceUser:true,
		env:"buaalx-w5aor",
})
// 云函数入口函数
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('person').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const allpeople = [{}]
  for (let i = 0; i < batchTimes; i++) {
    const people = db.collection('person').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get() 
    allpeople.push(people)
  }

  // 等待所有
  return await Promise.all(allpeople)
}