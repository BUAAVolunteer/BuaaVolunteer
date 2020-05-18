// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
	try {
			return await db.collection('signUp').where({
					title: event.title
			}).update({
					data:{
						list: event.list
					}
			}).then(res => {
				console.log(res)
			})
  } catch(e) {
    console.error(e)
  }
}