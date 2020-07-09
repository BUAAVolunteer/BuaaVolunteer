// pages/Main/childCpn/main-swiper/main-swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageList: {
      type: Array,
      value: [
        {
          src: "", // 轮播图图片地址
        },
      ],
    },
  },

  /**
   * 组件的初始数据
   */
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
