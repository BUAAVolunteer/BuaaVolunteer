const cloud = require('wx-server-sdk')
    //环境变量 ID

cloud.init()

const db = cloud.database({})
const _ = db.command;
    // 云函数入口函数
    //传递的参数可通过event.xxx得到

exports.main = async(event, context) => {
    try {
        let upload = db.collection('person').where(_.or([{
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
                personnum: event.personnum,
                text: event.text,
                qqnum: event.qqnum,
                campus: event.campus
            }
        })
        if((await upload).stats.updated == 0){
            console.log(upload)
            return await db.collection('person').add({
                data:{
                    _openid: event.id,
                    name: event.name,
                    phone: event.phone,
                    personnum: event.personnum,
                    text: event.text,
                    qqnum: event.qqnum,
                    campus: event.campus,
                    score: 0
                }
            })
        }else{
            console.log(upload)
            return upload;
        }
    } catch (e) {
        console.error(e)
    }
}