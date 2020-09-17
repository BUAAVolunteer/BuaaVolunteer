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
		let uploadList = event.list;
		let success
		console.log(event)
		return promise = new Promise(function (resolve,reject) {
			resolve();
		})
		.then(()=> {
			return db.collection('person').where({
				phone: event.list[1]
			}).update({
				data:{
					qualification: ["测试1"]
				}
			})
		})
		.then(() => {
			return signUpCheck(event);
		})
		.then(res => {
			console.log(res)
			return dataUpload(event, res)
		})
		.then(res => {
			//console.log(uploadList)
			//记录已经报名成功的人的openid
			success = res
			if (res) {
				var l = uploadList.length - 3
				var openid = uploadList[l]
				console.log(openid)
				return db.collection('project').where({
					title: event.title
				}).update({
					data:{
						signupList: _.push(openid)
					}
				})
			}
		})
		.then(() =>{
			//获得表单数据
			return db.collection('form').where({
				title: event.title
			})
			.get()
		})
		.then(res => {
			//判断是否报名完毕
			let over = 1;
			for (let i = 0; i < res.data[0].formInfo.length; i++){
				if (res.data[0].formInfo[i].isLimit){
					for (let j = 0; j < res.data[0].formInfo[i].option.length; j++){
						if (res.data[0].formInfo[i].option[j].limit > 0){
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
				return db.collection('project').where({
					title: event.title
				}).update({
					data:{
						check: 2
					}
				})
				.then(() =>{
					db.collection('form').where({
						title: event.title
					}).update({
						data: {
							isOver: true
						}
					})
				})
			}
		})
		.then(() => {
			console.log(success)
			if (success) {
				return afterSuccess(event)
			} else {
				return false
			}
		})
		.then(() => {
			if (success) {
				return 'SignUpSuccess'
			} else {
				return 'error'
			}
		})
		.catch(err => {
			console.log(err)
			return "error"
		})
	}catch (e) {
		console.error(e)
	}
}

function signUpCheck(event) {
	//名额增减的递归函数
	var promiseList = []
	var success = true
	for (let i = 0; i < event.limit[0].length; i++) {
		var promise = new Promise((resolve, reject) => {
			let upPosition = "formInfo." + event.limit[0][i] + ".option." + event.limit[1][i] + ".bookingNum";
			resolve(
				db.collection('form').where({
					title: event.title,
				}).update({
					data:{
						[upPosition] : _.inc(1)
					}
				}).then(() => {
					return db.collection('form').where({
						title: event.title
					}).field({
						formInfo: true
					}).get()
				}).then(res => {
					let temp = res.data[0].formInfo[event.limit[0][i]].option[event.limit[1][i]].bookingNum;
					let limit = res.data[0].formInfo[event.limit[0][i]].option[event.limit[1][i]].limit;
					i++;
					if (temp > limit){
						//无名额，返回报名失败
						console.log("fail")
						success = false
					}
				})
			)
		})
		promiseList.push(promise)
	}
	return Promise.all(promiseList).then(() => {
		return success
	})
}

function dataUpload(event,success) {
	var promiseList = []
	for (let i = 0; i < event.limit[0].length; i++) {
		var promise = new Promise((resolve,reject) => {
			let upPosition = "formInfo." + event.limit[0][i] + ".option." + event.limit[1][i] + ".bookingNum";
			let limPosition = "formInfo." + event.limit[0][i] + ".option." + event.limit[1][i] + ".limit"
			if (!success){
				resolve(
					db.collection('form').where({
						title: event.title
					}).update({
						data:{
							[upPosition]: _.inc(-1)
						}
					})
				)
			}else{
				resolve(
					db.collection('form').where({
						title: event.title
					}).update({
						data:{
							[limPosition]: _.inc(-1),
							[upPosition]: _.inc(-1)
						}
					})
				)
			}
		})
		promiseList.push(promise)
	}
	return Promise.all(promiseList).then(() => {
		return success
	})
}

function afterSuccess(event) {
	//向个人数据中添加报名成功记录
	let inf = {};
	inf.duration = "待定";
	inf.title = event.title;
	inf.note = "待定";
	inf.score = "待定";
	inf.signUpTime = event.signUpTime;
	console.log(inf)
	let phone = event.list[1];
	return db.collection('person').where({
		phone: phone
	}).update({
		data:{
			history: _.push(inf)
		}
	})
	.then(() => {
		//上传报名数据
		return db.collection('signUp').where({
			title: event.title
		}).update({
			// data 传入需要局部更新的数据
			data: {
				list : _.push(event.list)
			}
		})
	})
}