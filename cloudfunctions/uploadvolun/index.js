// 云函数入口文件
const cloud = require('wx-server-sdk')

//云函数初始化
cloud.init({
	traceUser:true,
	env:"buaalx-w5aor"//环境ID
})

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
	try {
		console.log(event.etitle)
		if (event.etitle==="发布一个新志愿"){//如果需要发布一个新志愿
			return await db.collection('project').add({//新增记录
				data:{
						title: event.title,//志愿名称
						date: event.date,//志愿日期
						time: event.time,//志愿时间
						textarea: event.textarea,//志愿的具体内容
						detail: event.detailList,//注意事项
						people: event.people,//志愿人数
						assure: event.assureList,//志愿保障
						response: event.responseList,//负责人及联系方式
						require: event.requireList,//要求
						place: event.place,//志愿地点
						qqnum: event.qqnum,//qq群号
						check: 0//检测表单编辑是否完成（与edit页面有关，超纲内容）
					}
			}).then(res =>{
				console.log(res)
			})//调试用
		}else{
			return await db.collection('project').where({//如果是更新已有志愿
					title: event.etitle//用名称检索志愿
			}).update({
					data:{
							date: event.date,
							time: event.time,
							textarea: event.textarea,
							detail: event.detailList,
							people: event.people,
							assure: event.assureList,
							response: event.responseList,
							require: event.requireList,
							place: event.place,
							qqnum: event.qqnum,
							check: 0
					}
			}).then(res => {
				console.log(res)
			})
		}
  } catch(e) {
    console.error(e)
  }//执行失败进入catch
}