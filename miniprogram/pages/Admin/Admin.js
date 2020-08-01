// pages/Admin/Admin.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    


// 滚动切换标签样式
    switchTab:function(e){
      this.setData({
        currentTab:e.detail.current
      });
      this.checkCor();
    },
// 点击标题切换当前页时改变样式
    swichNav:function(e){
      var cur=e.target.dataset.current;
      if(this.data.currentTaB==cur){
        return false;
      }
      else{
        this.setData({
          currentTab:cur
        })
      }
    },
//判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor:function(){
    if (this.data.currentTab>4){
      this.setData({
      scrollLeft:300
      })
    }else{
      this.setData({
      scrollLeft:0
      })
    }
    },
  }
})
