// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser:true,
	env:"buaalx-w5aor"
})

const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
	try {
		let delist = [], suc = 0;
		for(let i = 0; i < event.limit[0].length; i++){
			let uplist = "formInfo." + event.limit[0][i] + ".data." + event.limit[1][i] + ".limit";
			let upd = db.collection('form').where({
				title: event.title,
				[uplist]: _.gt(0)
			}).update({
				data:{
					[uplist] : _.inc(-1)
				}
			})
			if((await upd).stats.updated == 0){
				delist.push([event.limit[0][i],event.limit[1][i]]);
			}else{
				suc++;
			}
		}
		console.log(suc);
		let uplist = event.list;
		if(suc == event.limit[0].length){
		}else if (suc == 0){
			return "error";
		}else{
			for(let i = 0; i < delist.length; i++){
				let count = 0;
				for(let j = 0; j < event.limit.length; j++){
					if ((event.limit[0][j] == delist[i][0]) && (event.limit[1][j] == delist[i][1])){
						break;
					}
					if(event.limit[0][j] == delist[i][0]){
						count++;
					}
				}
				let lim = uplist[delist[i][0]+5].split(";");
				let upstr = "";
				for(let j = 0; j < lim.length; j++){
					if(j == count){
						continue;
					}else{
						upstr = upstr + lim[j] + ";";
					}
				}
				uplist[delist[i][0]+5] = upstr;
			}
		}
		var l = uplist[0].length - 3
		var openid = uplist[0][l]
		console.log(openid)
		db.collection('project').where({
			title: event.title
		}).update({
			data:{
				signuplist: _.push(openid)
			}
		})

		return await db.collection('signUp').where({
			title: event.title
		}).update({
			// data 传入需要局部更新的数据
			data: {
				list : _.push(uplist)
			}
		})
	}catch (e) {
		console.error(e)
	}
}