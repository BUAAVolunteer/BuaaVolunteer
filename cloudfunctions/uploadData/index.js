// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
	try {
		let placed = 0, stop = 0;
		for(let i = 0; i < event.limit[0].length; i++){
			let uplist = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".bookingNum";
			let lim = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".limit"
			let upd = db.collection('form').where({
				title: event.title,
				[lim]: _.gt(0)
			}).update({
				data:{
					[uplist] : _.inc(1)
				}
			})
			if((await upd).stats.updated == 0){
				placed = 1;
				stop = i;
			}
			
			if (!placed){
				let check = db.collection('form').where({
					title: event.title
				}).field({
					formInfo: true
				}).get().then(res => {
					let temp = res.data[0].formInfo[event.limit[0][i]].data[event.limit[1][i]].bookingNum;
					let limit = res.data[0].formInfo[event.limit[0][i]].data[event.limit[1][i]].limit;
					if (temp > limit){
						placed = 1;
						stop = i+1;
					}
				})
			}
			if(placed){
				break;
			}
		}
		let uplist = event.list;
		console.log(uplist)

		if (placed){
			console.log("error")
			for (let i = 0; i < stop; i++){
				let uplist = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".bookingNum";
				await db.collection('form').where({
					title: event.title
				}).update({
					data:{
						[uplist]: _.inc(-1)
					}
				})
			}
			return await 'error';
		}else{
			console.log("success")
			for (let i = 0; i < event.limit[0].length; i++){
				let uplist = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".bookingNum";
				let lim = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".limit"
				await db.collection('form').where({
					title: event.title
				}).update({
					data:{
						[lim]: _.inc(-1),
						[uplist]: _.inc(-1)
					}
				})
			}
		}
		
		p1 = new Promise((resolve,reject) => {
			//记录已经报名成功的人的openid
			var l = uplist[0].length - 3
			var openid = uplist[0][l]
			console.log(openid)
			db.collection('project').where({
				title: event.title
			}).update({
				data:{
					signuplist: _.push(openid)
				}
			}).then(res => {
				resolve('openidupload')
			}).catch(err => {
				reject()
			})
		})
		



		p2 = new Promise((resolve,reject) => {
			//判断是否报名完毕
			let over = 1;
			db.collection('form').where({
				title: event.title
			}).get().then(res => {
				for (let i = 0; i < res.data[0].formInfo.length; i++){
					if (res.data[0].formInfo[i].limit){
						for (let j = 0; j < res.data[0].formInfo[i].data.length; j++){
							if (res.data[0].formInfo[i].data[j].limit > 0){
								over = 0;
								break;
							}
						}
					}
					if (over == 0){
						break;
					}
				}
				console.log("over:" + over)
				if (over == 1){
					db.collection('project').where({
						title: event.title
					}).update({
						data:{
							check: -1
						}
					})
				}
			}).then(res => {
				resolve('finish')
			}).catch(err => {
				reject()
			})
		})
		

		p3 = new Promise((resolve,reject) => {
			//向个人数据中添加报名成功记录
			let inf = {};
			inf.t = "待定";
			inf.v = event.title;
			inf.a = "待定";
			inf.s = "待定";
			inf.st = event.stime;
			console.log(inf)
			let phone = uplist[0][1];
			db.collection('person').where({
				phone: phone
			}).update({
				data:{
					history: _.push(inf)
				}
			}).then(res => {
				resolve('add')
			}).catch(err => {
				reject()
			})
		})

		p4 = new Promise((resolve,reject) => {
			db.collection('signUp').where({
				title: event.title
			}).update({
				// data 传入需要局部更新的数据
				data: {
					list : _.push(uplist)
				}
			}).then(res => {
				resolve('update')
			}).catch(err => {
				reject()
			})
		}) 

		promiseArrey = [p1,p2,p3,p4]
		FinalState = await Promise.all(promiseArrey).then(res => {
			return 'SignUpSuccess'
		}).catch(err => {
			console.log(err)
		})
		
	}catch (e) {
		console.error(e)
	}
}