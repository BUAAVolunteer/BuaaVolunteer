// components/lx-hover/lx-hover.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
      value: {
        name: "", //弹窗的名称，用来分辨不同的弹窗
        type: "msg", //弹窗的类型，分为msg（弹窗消息）和show（浮窗展示）
        isMaskCancel: true, //能否通过点击遮盖层退出
        isTitle: false, //是否显示标题
        title: "标题", //标题
        isContent: false, //是否使用组件自带的文字消息格式
        content: "阿巴阿巴阿巴阿巴\n阿巴阿巴阿巴阿巴", //弹窗的文字内容
        button: [
          {
            ID: 0, //按钮的编号
            name: "cancel", //返回的名称
            text: "取消", //选项上的文字
            isAblePress: true, //能否点击
          },
          {
            ID: 1,
            name: "assure",
            text: "确认",
            isAblePress: true,
          },
        ], //按钮安排
      },
    }, // 悬浮窗细节
  },

  /**
   * 组件的初始数据
   */
  data: {
    onShow: false,
    isResult: false,
    res: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*
    状态改变（用于展示型悬浮窗）
    */
    stateChange() {
      if (!(this.data.onShow && !this.properties.detail.isMaskCancel)) {
        this.setData({
          onShow: !this.data.onShow,
        });
      }
    },

    /*
    悬浮窗外部引用弹出（用于弹窗型悬浮窗）
    */
    showHover({
      name = "",
      isMaskCancel = true,
      isTitle = true,
      title = "标题",
      isContent = true,
      content = "内容",
      button = [
        {
          ID: 0,
          name: "cancel",
          text: "取消",
          isAblePress: true,
        },
        {
          ID: 1,
          name: "assure",
          text: "确认",
          isAblePress: true,
        },
      ],
      success = function (res) {},
      fail = function (err) {},
    } = {}) {
      var detail = {};
      var that = this;
      detail.name = name;
      detail.type = "msg";
      detail.isMaskCancel = isMaskCancel;
      detail.isTitle = isTitle;
      detail.title = title;
      detail.isContent = isContent;
      detail.content = content;
      detail.button = button;
      this.setData({
        detail: detail,
        onShow: true,
        res: {},
        isResult: false,
      });
      return new Promise((resolve, reject) => {
        resolve();
      })
        .then(() => {
          var t;
          t = setInterval(function () {
            if (that.data.isResult) {
              clearInterval(t);
              success(that.data.res);
            }
          }, 200);
        })
        .catch((err) => {
          fail(err);
        });
    },

    /*
    按钮按下
    */
    buttonPress(e) {
      var ID = e.currentTarget.id;
      var button = this.properties.detail.button;
      var choose = button[ID].name;
      var that = this;
      if (that.properties.detail.type === "show") {
        if (button[ID].isAblePress) {
          that.setData({
            onShow: !that.data.onShow,
          });
          that.triggerEvent("hoverConfirm", choose, {});
        }
      } else {
        that.setData({
          onShow: !that.data.onShow,
          res: choose,
          isResult: true,
        });
      }
    },
  },
});
