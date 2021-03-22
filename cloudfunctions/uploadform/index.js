// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'volunteer-platform-1v92i',
  	// env: 'buaalx-w5aor',
	traceUser: true,
})

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
	try {
		return promise = new Promise((resolve,reject) =>{
			resolve();
		})
		.then(() =>{
			return new Promise((resolve, reject) => {
				db.collection('project').where({
					title: event.title
				}).update({
					data:{
						check: 1
					}
				})
				.then(() => {
					resolve()
				})
			})
		})
		.then(() =>{
			return db.collection('form').where({
				title: event.title
			}).update({
				data:{
					formInfo: event.formInfo,
					fieldName: event.fieldName,
					isOver: false
				}
			})
		})
		.then(() =>{
			return db.collection('signUp').where({
				title: event.title
			}).update({
				data:{
					list: event.list
				}
			})
		})
		.catch(err =>{
			reject(err)
		})
	} catch(e) {
		console.error(e)
		return e;
	}
}