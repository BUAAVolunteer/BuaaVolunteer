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
		return promise = new Promise(function (resolve,reject) {
			resolve();
		})
		.then(() => {
			return signUpCheck(0,event);
		})
		.then(res => {
			console.log(res)
			return new Promise((resolve,reject) =>{
				let dtu = dataUpload(res.stopPlace - 1, event, res.success);
				if (!res.success & dtu) {
					reject("error");
				}else{
					resolve();
				}
			})
		})
		.then(() => {
			//console.log(uploadList)
			//记录已经报名成功的人的openid
			var l = uploadList[0].length - 3
			var openid = uploadList[0][l]
			console.log(openid)
			return db.collection('project').where({
				title: event.title
			}).update({
				data:{
					signupList: _.push(openid)
				}
			})
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
			//向个人数据中添加报名成功记录
			let inf = {};
			inf.duration = "待定";
			inf.title = event.title;
			inf.note = "待定";
			inf.score = "待定";
			inf.signUpTime = event.signUpTime;
			console.log(inf)
			let phone = uploadList[0][1];
			db.collection('person').where({
				phone: phone
			}).update({
				data:{
					history: _.push(inf)
				}
			})
		})
		.then(() => {
			//上传报名数据
			db.collection('signUp').where({
				title: event.title
			}).update({
				// data 传入需要局部更新的数据
				data: {
					list : _.push(uploadList)
				}
			})
		})
		.then(() => {
			return 'SignUpSuccess'
		})
		.catch(err => {
			console.log(err)
			return "error"
		})
	}catch (e) {
		console.error(e)
	}
}

function signUpCheck(position,event) {
	//名额增减的递归函数
	let i = position;
	let upPosition = "formInfo." + event.limit[0][i] + ".option." + event.limit[1][i] + ".bookingNum";
	return db.collection('form').where({
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
			let checkResult = {}
			checkResult.success = false;
			checkResult.stopPlace = i;
			return checkResult;
		}
	}).then(() => {
		if (i < event.limit[0].length) {
			console.log("continue")
			signUpCheck(i,event);
		} else {
			console.log("success")
			let checkResult = {}
			checkResult.success = true;
			checkResult.stopPlace = i;
			return checkResult;
		}
	})
}

function dataUpload(position,event,success) {
	let i = position;
	let upPosition = "formInfo." + event.limit[0][i] + ".option." + event.limit[1][i] + ".bookingNum";
	let limPosition = "formInfo." + event.limit[0][i] + ".option." + event.limit[1][i] + ".limit"
	if (!success){
		return db.collection('form').where({
			title: event.title
		}).update({
			data:{
				[upPosition]: _.inc(-1)
			}
		}).then(() => {
			i--;
			if (i >= 0) {
				dataUpload(i,event,success);
			} else {
				return true;
			}
		})
	}else{
		return db.collection('form').where({
			title: event.title
		}).update({
			data:{
				[limPosition]: _.inc(-1),
				[upPosition]: _.inc(-1)
			}
		}).then(() => {
			i--;
			if (i >= 0) {
				dataUpload(i,event,success);
			} else {
				return true;
			}
		})
	}
}