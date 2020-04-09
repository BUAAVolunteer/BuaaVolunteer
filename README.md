# 蓝天志愿者协会小程序
蓝天志愿者协会作为校内主要的志愿者管理组织，却一直缺乏一个信息化平台。如今每个人都关注了许多的公众号，仅凭公众号的推送不能完全满足宣传需要。而迅速抢完的志愿，众多的志愿qq群，又使得不了解蓝协的人没有合适的途径去获取信息。所以我做了一个蓝天志愿者协会的微信小程序，帮助志愿者了解蓝协，宣传志愿思想，提供反馈渠道，帮助志愿者报名志愿。
# 主要功能
## 1.信息展示
* 志愿者风采：展示近期志愿者活动介绍；
* 近期活动：展示了最近的志愿招募
* 志愿项目介绍：展示所有长期志愿项目的基本信息
## 2.问题反馈
* 志愿者可以选择自己遇到问题的志愿项目，并且详细描述自己的问题。数据会提交到云端数据库，管理员可以进行查看和审核。
## 3.志愿信息的发布与报名 
* 志愿者注册，用户须提交基本信息注册后才可以报名志愿项目
* 志愿信息发布：只有在云端数据库登记openid后才能发布志愿
* 志愿信息报名：提交注册信息后，可以报名发布的志愿信息
* 参与项目记录：成功报名的项目，可以在个人页面查询到


# 部署步骤
1. 下载微信官方的微信开发者工具，申请微信小程序账号
2. 创建新项目，开发模式选择小程序·云开发
3. 将新建项目中的cloudfunctions和miniprogram文件夹替换成本项目的
4. 再次启动查看效果

# 代码目录结构描述
## 全局配置：
### app.json：包括了小程序的所有页面路径、网络超时时间、底部 tab
- tab栏：main主界面，about个人界面
- 界面路径：activity活动界面，introduction介绍界面等
### app.wxss
- 引入外部样式表：main.wxss,row.wxss等
## 页面逻辑：
### 主页面：main
- main.js：获取openid并存储，储存功能块的信息
- main.wxml：展示顶部图片，功能块
- main.wxss：设置图片样式，标题文字样式
### 个人界面：about
- about.js：
    - 判断个人信息是否存储在云端person库：
        - 未找到数据：跳出提示，并跳转至person界面
        - 找到数据：正常进行
    - 从云端集合person库中获取注册信息
    - 从云端集合list中获取数据：（list存储的是志愿项目报名信息）
        - 根据_openid获取参与过的志愿信息
    - 与所有获取信息相对的报错信息
- about.wxml
    - 根据person库中的信息渲染个人信息界面，包括头像和志愿时长
    - 根据list库中的志愿信息渲染参与过的志愿项目，以列表形式
### 展示界面：show/activity
- show/activity.js:
    - 从云端集合test中获取推送信息，包括：
        - 推送封面的云端链接
        - 推送标题的文字
    - 从云端集合test中获取轮播图的云端链接
    - 图片都采用云存储的形式
- show/activity.wxml
    - 将上述信息以swiper和list组件形式渲染
- show/activity.wxss
    - swiper组件的长宽，以及自动播放
    - list列表总体的高度：自适应，列表左右内边距
    - list列表每一个组件：kind-list-item
        - flex布局
        - 包括kind-list-box：左下角的蓝色小logo，左边的标题文字
        - 标题文字包括居中操作，overflow的样式，上外边距margin等
        - 右侧封面图片：kind-list-img
            - 包括图片长宽，以及flex比例
### 志愿项目介绍页：introduction
- introduction.js：
- 在data中定义了三个分类的志愿项目信息，包括：
    - 介绍页图片云端链接
    - 介绍页文字标题
    - 云端集合test中，对应志愿项目的id
- clickTab/swiperTab:
    - 通过改变data中的currentTab值，实现选项卡的滑动和点击改变
- introduction.wxml:
    - navigator组件，跳转detail页面
    - 同时根据dta中的id 
### 志愿项目详情页：detail
- detail.js:
- 通过introduction中传入的id从云端集合test中获取信息，包括：
    - 志愿信息的标题
    - 志愿信息的介绍文字
    - 志愿信息的介绍图片
- detail.wxss
    - 标题文字的居中，大小
    - 展示图片的长宽，外边距
    - 文字的分段，首行缩进，内边距
### 反馈界面：question
- question.js
- 输入信息的合法性检验
- 上传信息到云端
- 交互提示
- question.wxml
- 图片的渲染
- picker组件
- input组件
### 招募界面 volunteer:
#### 1.发布志愿招募信息
- input.js
- 管理员身份检验
    - 从云端集合获取信息，如果_openid不存在，便视为没有权限，弹出错误提示
    - 管理员身份检验后，进入志愿信息填写界面
    - 将志愿信息上传到云端集合volunteer
#### 2.招募信息公示
- volunteer.js
- 从云端集合volunteer中获取志愿信息，并以列表形式展示
- 在button“报名志愿”被点击触发后，触发报名志愿的函数：
    1. 合法性检验：包括是否已经报名过，以及是否还有剩余的名额
    2. 除法云函数add，将云端数据库的内容更改（剩余人数-1）
    3. 将志愿信息上传至云端集合list（会显示在个人界面）
    4. 同时从person集合获得一些个人信息，一起上传至list集合
# 友情支持
### colorUI
#### colorUI提供了非常多的前端模板可供选择，我的主页面就是在colorUI界面基础上做的修改
### WeUI
#### WeUI是官方提供的组件模板，我的图文列表是在他的功能列表基础上进行的修改