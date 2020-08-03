// pages/Main/childCpn/main-icon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //传入的页面数据对象
    iconInf: {
      type: Object,
      value: {
        imgSrc: "",                 
        desc: "",                     
        id: "",                    
        width: "100%",              // 按钮的宽度
        height: "230rpx"
        
      },
    },
  },

  data: {
    current: 0,
  },
  lifetimes: {},
  methods: {
    // 传入的e是页面参数，e.detail代表当前展示的index
    // 用于改变current来间接更改指示点
    currentHandle(e) {
      let { current } = e.detail;
      this.setData({
        current,
      });
    },
  },
});
