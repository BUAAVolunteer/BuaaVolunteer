## 一、项目的结构

### 1.0 命名规范

数据库表名和字段名采用驼峰命名法。

所有变量/方法采用驼峰命名法。

所有的页面名采用大写英文字母开头。

### 1.1 目录的划分

```javascript
|-assests    // 引入的资源，包括wxss，icon，img

|-components // 公共组件（多个页面共享的）

|-pages      // 页面

|-service    // 可能的网络请求（暂无）

|-utils      // 全局工具类
```



### 1.2 页面的划分（Page）

> 第一层一般以tabbar划分，再将各页面对应的展示组件划入其中

划分为目标的多个文件并注册，以咱们项目为例就是划分为3个文件夹（由下面的建议，最好划分成4个文件夹）

P.s.感觉咱们可以将一些功能性很强的也抽出来单独设成1级文件夹

> 第二层：

```javascript
|-childCpn  //存储该页面或该页面子页面需要用到的组件

|-otherPage1

|-otherPage2 //命名正常取就可以，表示该页面对应需展示的其他页面

xxx.js

xxx.wxml

xxx.wxss

xxx.json //这一部分为一级目录对应的页面信息
```

页面的结构图可以就像这样，因此建议把管理员相关单拎出来
$$
全部页面
\begin{cases}
    起始页(Main) \begin{cases}
    	子组件(childCpn) \\
    	公告栏（Bulletin) \\
        近期活动(Activity)(暂未使用) \\
    \end{cases} \\
    志愿招募(Recruit) \begin{cases}
        报名表单(Form)
    \end{cases} \\
    个人主页(PersonMain) \begin{cases}
        志愿历史(History) \\
        问题反馈(Feedback) \\
        更新日志(UpdateLog) \\
        志愿地图(Map) \\
        编辑资料(PersonEdit) \\
    \end{cases} \\
    管理员页面(Admin) \begin{cases}
        反馈审核(FeedbackComment) \\
        积分操作(Score) \\
        缺勤处理(Absence) \\
    \end{cases} \\
     志愿项目管理(Manage) \begin{cases}
            详细信息(Detail) \\
            编辑表单(FormEdit) \\
            导出数据(DataExport) \\
        \end{cases} \\
    项目介绍(Introduction)\begin{cases}
            项目主页(VolunteerMain)
        \end{cases} \\
    志愿招募历史(ConfirmHistory)\begin{cases}
	    时长确认(Confirm) \\
    \end{cases}
\end{cases}
$$
复用结构建议：
1. 全局变量：个人信息（姓名学号手机号等等），个人身份验证（是否为管理员）
2. 全局工具：链表相关（链表的生成、插入、删除、链表转数组等等），数据导出，数据检验
3. 全局组件：表单相关组件（包括报名表单、各种需要填写或用到单独按钮的地方，可以尽量统一格式），卡片组件（志愿介绍列表卡片，志愿项目卡片，志愿历史卡片，可以往相近的样式修改）

### 1.3 具体页面划分

#### 1.3.0 总体纲要

**所有页面采用组件Component来构造，其基本结构如下：**

```javascript
// js文件，原page构造，现改为Component构造
Component({
  externalClasses: [],	  // 引用的外部类属性
  behaviors: [],          // 引用的外部方法，不写即不引用

  properties: {
    myProperty: {         // 传入的属性名，type为属性类型，value为默认值
      type: String,
      value: ''
    }
  },
  
  data: {},               // 组件私有数据，可用于模板渲染

  lifetimes: {
    attached: function () { }, // 组件的生命周期函数，包括created/attached/ready/moved
    moved: function () { },	   // detached/error
    detached: function () { }, // 这里仅是举例，详见微信开放文档
  },

  methods: {						 // 所有自己定义的方法写在methods内
    onMyButtonTap: function(){
      this.setData({				 // 更新属性和数据的方法与更新页面数据的方法类似
        
      })
    },
    _myPrivateMethod: function(){    // 若有内部方法（仅由本页面其他方法调用的）建议以下划线开头
      this.setData({				 // 这里将 data.A[0].B 设为 'myPrivateData'
        'A[0].B': 'myPrivateData'
      })
    },
    _propertyChange: function(newVal, oldVal) { // 方法可以有传入参数

    }
  }

})

```



#### 1.3.1 起始页（展示组件化的例子）

> 其包含3个局部子组件，都放在page/Main/childCpn内

$$
起始页(Main/childCpn) 
\begin{cases}
首页轮播图 (main-swiper) \\
首页按钮 (main-icon) \\
首页logo (main-logo) \\
\end{cases} \\
$$

##### 1.3.1.1 上方展示栏（main-swiper）：轮播图复用组件

> 传入参数

```javascript
// pages/Main/childCpn/main-swiper/main-swiper.js
// 传入参数名称与结构
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
```

> 组件私有数据：

```javascript
data: {
	current: 0,  // 当前展示的轮播图序号
},
```

> 组件方法：写在methods内，做好传入参数的标注

```javascript
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
```

> 生命周期：未使用

------------------------------------------------------------------------------------------------------------------------------------------------------

##### 1.3.1.2 首页logo（main-logo）

> 外部类属性

```javascript
// pages/Main/childCpn/main-logo/main-logo.js
externalClasses: ['logo-position'],          // 引用外部名为logo-position的样式
```

##### 1.3.1.3 首页icon（main-icon）

逐渐缩短的独特按钮（本页内复用），抽离组件，包括阴影和右方圆角，用于插入具体的图片/文字/宽度。

> 传入参数

```javascript
// pages/Main/childCpn/main-icon.js
// 传入参数名称与结构
properties: {
    //传入的页面数据对象
    iconInf: {
      type: Object,
      value: {
        navigateUrl: "",                 // 要跳转到的页面路径
        iconSrc: "",                     // 按钮图标的路径
        iconText: "",                    // 按钮的文本
        width: "520.64rpx",              // 按钮的宽度
        backgroundColor: "#f68c60",      // 按钮的背景颜色
        zIndex: 2,                       // 按钮的层级
      },
    },
  },
```

##### 1.3.1.4首页(main)

>main.json

**（在json内要引用需要使用的组件）**

```json
{
  // 子组件的引用
  // 格式为"组件名"："组件路径"
  "usingComponents": {
    "main-swiper": "./childCpn/main-swiper/main-swiper",
    "main-logo": "./childCpn/main-logo/main-logo",
    "main-icon": "./childCpn/main-icon/main-icon"
  },
  "navigationBarTitleText": "北航蓝天志愿者协会"
}
```



> main.wxml

**（包含三个组件的使用，直接使用json中引用的名称，在标签中传入子组件需要的参数/外部样式）**

```html
<!-- 轮播图组件 -->
<!-- imageList为传入组件的数据名称 -->
<main-swiper imageList="{{imageList}}"></main-swiper>

<!-- logo -->
<!-- logo-position为组件引用的外部样式 -->
<main-logo logo-position="logo"></main-logo>

<!-- 遍历展示组件，子组件仅包含按钮功能，数据由item传入 -->
<!-- iconInf为传入组建的数据名称 -->
<view class="middle-icon">
  <block wx:for="{{mainIcon}}" wx:key="index">
    <main-icon iconInf="{{item}}"></main-icon>
  </block>
</view>

<!-- 蓝小咕咕咕咕 -->
<!-- 质朴的图片定位，非组件 -->
<navigator url="/pages/Main/UpdateLog/UpdateLog" open-type="navigate" hover-class="none">
  <image class="gugugu" mode="aspectFit" src="/assests/image/gu.png" />
</navigator>
```



> main.js

**（所有代码加入详细注释，包括数据定义data，生命周期lifetimes...）**

```javascript
// pages/main/main.js
let app = getApp(); 				// 获取全局app实例
const db = wx.cloud.database();		// 获取数据库实例
Component({
  /**
   * 页面的初始数据
   *
   */

  data: {
    // 页面按钮跳转相关信息存储
    mainIcon: [
      {
        navigateUrl: "/pages/Main/Activity/Activity",  // 要跳转到的页面路径
        iconSrc: "/assests/icons/1.png",               // 按钮图标的路径
        iconText: "近期活动",                           // 按钮的文本
        width: '724.64rpx',                            // 按钮的宽度
        backgroundColor: '#22a2c3',                    // 按钮的背景颜色
        zIndex:5                                       // 按钮的层级
      },
      // 其余按钮数据省略，见具体文件
    ],
  },
  // 组件生命周期
  lifetimes: {
    // 生命周期函数，在组件实例刚刚被创建时执行
    created: function () {
      // 这里获取了首页轮播图数据和用户openid，详细代码见文件
    },
  },
  // 组件自己的方法
  methods: {
    
  },
});

```



> main.wxss

**（样式代码要注释，组件样式单独写在组件内，这里只写组件定位的代码）**

```css
page {
  background-color: white;
}

/* logo图片定位 */
.logo {
  margin-top: -50rpx;
}

/* 中部按钮相对定位 */
.middle-icon {
  margin-top: 35rpx;
}

/* 蓝小咕定位 */

.gugugu {
  height: 240rpx;
  width: 210rpx;
  max-width: 100%;
  position: relative;
  margin-top: -98rpx;
  left: 510rpx;
}
```



##### 1.3.1.1 近期活动
上方展示栏（复用起始页），推送列表（本页内复用（或者能不能加到全局卡片组件的样式里？））
##### 1.3.1.2 项目介绍
上方展示栏（复用起始页），校区选择（无法复用），志愿卡片（复用全局卡片）
###### 1.3.1.2.1 项目具体信息
图片展示组件（是不是也可以复用展示栏？），文本展示组件（尽量改美观些吧）
##### 1.3.1.3 问题反馈
上方图片（不知道干啥的），反馈表单（全局表单组件）
##### 1.3.1.4 更新日志
日志栏（无法复用）
#### 1.3.2 志愿招募
志愿项目卡片（复用全局卡片组件）
##### 1.3.2.1 报名表单
复用表单组件
#### 1.3.3 个人主页
上方个人信息（无复用），中间时长和积分展示栏（页内复用），左下蓝小咕（无复用），右下3个按钮（页内复用）
##### 1.3.3.1 志愿历史
志愿历史卡片（复用全局卡片组件）
##### 1.3.3.2 志愿地图
背景（无复用），锁（页内复用）
##### 1.3.3.3 编辑资料
资料表单（复用全局表单组件）
#### 1.3.4 管理员页面
在考虑要不要取消这个页面，变为复用的侧边栏
##### 1.3.4.1 志愿项目管理
标题（是不是可以去了？），志愿列表（可以复用到志愿导出和时长确认页面），新志愿按钮（复用全局表单组件）
###### 1.3.4.1.1 详细信息
详细信息表单（复用全局表单组件）
###### 1.3.4.1.2 编辑表单
表单编辑（复用全局表单组件）
###### 1.3.4.1.3 导出数据
报名列表（可以复用志愿列表），确认按钮（复用表单组件）
###### 1.3.4.1.4 时长确认
时长列表（可以复用志愿列表），确认按钮（复用表单组件）
##### 1.3.4.2 反馈审核
反馈卡片（复用全局卡片组件）
##### 1.3.4.3 积分操作
操作表单（按钮有点多）（复用全局表单组件）（另外这个页面的逻辑有问题，要改一下）
##### 1.3.4.4 缺勤处理
缺勤表单（复用全局表单组件）