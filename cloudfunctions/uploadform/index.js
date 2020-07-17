// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
	try {
		return promise = new Promise((resolve,reject) =>{
			resolve();
		})
		.then(() =>{
			return db.collection('project').where({
				title: event.title
			}).update({
				data:{
					check: 1
				}
			})
		})
		.then(() =>{
			return db.collection('form').where({
				title: event.title
			}).update({
				data:{
					formInfo: event.formInfo,
					fieldName: event.fieldName,
					over: 1
				}
			})
		})
	} catch(e) {
		console.error(e)
		return e;
	}
}