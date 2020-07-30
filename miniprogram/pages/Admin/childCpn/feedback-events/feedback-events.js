// pages/Admin/childCpn/feedback-events/feedback-events.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eventsInf: {
      type: Object,
      value: {
        comment_list: [{}],
        answer: null,
      },    
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    comment_list:[{
      name:"hzx",
      textarea:"yeahiloveitqwertyuioplkjhgfdsazxcvbnmmmmmmmmmmmmmmffffffffff",
      title:"somanybugs"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
