// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'volunteer-platform-1v92i',
  // env: 'buaalx-w5aor',
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const _ = db.command;
	try {
    //将报名数据转入confirm待确认
    let his = {};
    his.time = event.time;
    his.data = event.list;
    his.isCheck = false;
    return db.collection('confirm').where({
      title: event.title
    }).update({
      data:{
        historyList: _.push(his)
      }
    })
    .then(res => {
      if (res.stats.updated == 0) {
        return db.collection('confirm').add({
          data:{
            title: event.title,
            historyList: [his]
          }
        })
      }
    })
    .then(() => {
      /*
      return db.collection('signUp').where({
        title: event.title
      }).update({
        data:{
          list: [event.list[0]]
        }
      })
      */
    })
    .then(() => {
      // 清空已报名以及内部名额数据，因此在添加内部名额前要确认已经导出报名表
      return db.collection('project').where({
        title: event.title
      }).update({
        data:{
          check: -1,
          signupList: [],
          innerList: []
        }
      })
    })
    .then(() => {
      return "success"
    })
    .catch(err => {
      console.log(err)
      return err
    })
  } catch (e) {
    console.error(e)
    return e
  }
}