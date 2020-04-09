// 云函数入口文件
const cloud = require('wx-server-sdk')
//请求request以访问http协议
const request = require('request')

cloud.init({
		traceUser:true,
		env:"buaalx-w5aor",
})
// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  try{
		let act =  request({
			url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb01e5104d508edee&secret=02f05690d9cb96b23f3ec30d4a2c2e06',
			method: 'GET'
		})
		
	}catch(e){
		console.log(e);
		return e;
	}
}