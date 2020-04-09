const cloud = require('wx-server-sdk')
    //环境变量 ID
cloud.init({
    //env: 'volunteer-platform-1v92i',
    
})

const db = cloud.database()
const _ = db.command
    // 云函数入口函数
    //传递的参数可通过event.xxx得到

exports.main = async(event, context) => {
    try {
        return await db.collection('person').doc(event.id).update({

            // data 传入需要局部更新的数据
            data: {
                name: event.name,
                phone: event.phone,
                personnum: event.personnum,
                text: event.text
            }
        })
    } catch (e) {
        console.error(e)
    }
}