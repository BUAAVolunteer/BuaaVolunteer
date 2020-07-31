// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'volunteer-platform-1v92i',
    // env: 'buaalx-w5aor',
    traceUser: true,
})

// 云函数入口函数
exports.main = async(event, context) => {
    try {
        var openid = event.openid;
        var title = event.title;
        var detail = event.detail;
        console.log(title, openid, detail)
        const result = await cloud.openapi.subscribeMessage.send({
            touser: openid,
            page: '',
            lang: 'zh_CN',
            data: {
                thing2: {
                    value: title
                },
                date3: {
                    value: "2020年12月31日"
                },
                thing4: {
                    value: detail
                },
                phrase5: {
                    value: '成功'
                }
            },
            templateId: 'Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w',
            miniprogramState: 'developer'
        })
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        return err
    }
}