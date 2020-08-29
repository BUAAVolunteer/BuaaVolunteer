// pages/Main/Bulletin/Bulletin.js
let app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    bulletinList: [],
  },

  lifetimes: {
    attached() {
      var that = this
      db.collection('notice')
      .count()
      .then(res => {
        console.log(res)
        if (res.total <= 20) {
          return 0
        } else {
          return res.total - 20
        }
      })
      .then(res => {
        console.log(res)
        return db.collection('notice').skip(res).get()
      })
      .then(res => {
        console.log(res)
        let bulletinList = []
        for (let i = res.data.length - 1; i >= 0; i--) {
          let item = {}
          let time = res.data[i].date.split('-')
          item.year = time[0]
          item.month = time[1]
          item.day = time[2]
          let date = new Date(item.year, item.month - 1, item.day);
          let weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          item.week = weekDay[date.getDay()];
          item.content = res.data[i].text
          bulletinList.push(item)
        }
        console.log(bulletinList)
        that.setData({
          bulletinList,
        })
      })
    }
  }
});
