// 云函数入口文件
const cloud = require('wx-server-sdk')

init({
	env:'buaalx-w5aor',
	traceUser:true
})

const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
	try {
		let uploadList = event.list;
		let promise = new Promise(function (resolve,reject) {
			resolve();
		})
		.then(signUpCheck(0,event))
		.then(res => {
			let dtu = dataUpload(res.stopPlace - 1, event, res.success);
			if (!res.success & dtu) {
				return "error";
			}
		})
		.then(() => {
			//console.log(uploadList)
			//记录已经报名成功的人的openid
			var l = uploadList[0].length - 3
			var openid = uploadList[0][l]
			console.log(openid)
			db.collection('project').where({
				title: event.title
			}).update({
				data:{
					signuplist: _.push(openid)
				}
			})
		})
		.then(
			//获得表单数据
			db.collection('form').where({
				title: event.title
			})
			.get()
		)
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
				db.collection('project').where({
					title: event.title
				}).update({
					data:{
						check: -1
					}
				})
			}
		})
		.then(() => {
			//向个人数据中添加报名成功记录
			let inf = {};
			inf.t = "待定";
			inf.v = event.title;
			inf.a = "待定";
			inf.s = "待定";
			inf.st = event.stime;
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
			resolve('SignUpSuccess');
		})
		.catch(err => {
			console.log(err)
			reject(err)
		})
		return promise
	}catch (e) {
		console.error(e)
	}
}

function signUpCheck(position,event) {
	//名额增减的递归函数
	let i = position;
	let upPosition = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".bookingNum";
	db.collection('form').where({
		title: event.title,
	}).update({
		data:{
			[upPosition] : _.inc(1)
		}
	}).then(() => {
		db.collection('form').where({
			title: event.title
		}).field({
			formInfo: true
		}).get()
	}).then(res => {
			let temp = res.data[0].formInfo[event.limit[0][i]].data[event.limit[1][i]].bookingNum;
			let limit = res.data[0].formInfo[event.limit[0][i]].data[event.limit[1][i]].limit;
			i++;
			if (temp > limit){
				//无民歌，返回报名失败
				let checkResult = {}
				checkResult.success = false;
				checkResult.stopPlace = i;
				return checkResult;
			}
	}).then(() => {
		if (i < event.limit[0].length) {
			signUpCheck(i,event);
		} else {
			let checkResult = {}
			checkResult.success = true;
			checkResult.stopPlace = i;
			return checkResult;
		}
	})
}

function dataUpload(position,event,success) {
	let i = position;
	let upPosition = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".bookingNum";
	let limPosition = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".limit"
	if (!success){
		db.collection('form').where({
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
		db.collection('form').where({
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