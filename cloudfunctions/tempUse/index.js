// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'volunteer-platform-1v92i',
    // env: 'buaalx-w5aor',
    traceUser: true,
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('blacklist').where({
    name: "积分规则"
  })
  .get()
  .then(res => {
    delete res.data[0]._id
    return db.collection('official').add({
      data: {
        name: "积分规则",
        role: res.data[0].role
      }
    })
  })
  .then(() => {
    return db.collection('head').get()
  })
  .then(res => {
    let upList = []
    for(let i = 0; i < res.data.length; i++) {
      let up = {}
      up.qualification = res.data[i].qualification
      up.src = res.data[i].src
      upList.push(up)
    }
    return upList
  })
  .then(res => {
    return db.collection('official').add({
      data: {
        name: "头像",
        head: res
      }
    })
  })
  .then(() => {
    return db.collection('main').get()
  })
  .then(res => {
    let upList = []
    for(let i = 0; i < res.data.length; i++) {
      let up = {}
      up.url = res.data[i].url
      up.src = res.data[i].src
      upList.push(up)
    }
    return upList
  })
  .then(res => {
    return db.collection('official').add({
      data: {
        name: "首页展示",
        main: res
      }
    })
  })
  .then(() => {
    return db.collection('show').get()
  })
  .then(res => {
    let upList = []
    for(let i = 0; i < res.data.length; i++) {
      let up = {}
      up.url = res.data[i].url
      up.title = res.data[i].title
      up.image = res.data[i].image
      upList.push(up)
    }
    return upList
  })
  .then(res => {
    return db.collection('official').add({
      data: {
        name: "近期活动",
        show: res
      }
    })
  })
}