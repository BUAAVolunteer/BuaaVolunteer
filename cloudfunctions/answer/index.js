const cloud = require('wx-server-sdk')
    //环境变量 ID

cloud.init({
    env: 'volunteer-platform-1v92i',
    // env: 'buaalx-w5aor',
    traceUser: true,
})

const db = cloud.database({})
const _ = db.command;
    // 云函数入口函数
    //传递的参数可通过event.xxx得到

exports.main = async(event, context) => {
    try {
        if (event.type === "detail") {
            return db.collection('person').where(_.or([{
                _openid: event.id
            },
            {
                phone: event.phone
            }
            ])).update({
                data:{
                    _openid: event.id,
                    name: event.name,
                    phone: event.phone,
                    personNum: event.personNum,
                    text: event.text,
                    qqNum: event.qqNum,
                    campus: event.campus
                }
            })
            .then(res => {
                if (res.stats.updated == 0) {
                    console.log(res)
                    return db.collection('person').add({
                        data:{
                            _openid: event.id,
                            name: event.name,
                            phone: event.phone,
                            personNum: event.personNum,
                            text: event.text,
                            qqNum: event.qqNum,
                            campus: event.campus
                        }
                    })
                } else {
                    console.log(res)
                    return res
                }
            })
        } else if (event.type === "avatar") {
            return db.collection('person').where({
                _openid: event.openid
            }).update({
                data: {
                    avatar: event.avatar
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
}