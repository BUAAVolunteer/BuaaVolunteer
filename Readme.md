# 蓝天志愿者协会小程序V2.0
蓝天志愿者协会作为校内主要的志愿者管理组织，却一直缺乏一个信息化平台。如今每个人都关注了许多的公众号，仅凭公众号的推送不能完全满足宣传需要。而迅速抢完的志愿，众多的志愿qq群，又使得不了解蓝协的人没有合适的途径去获取信息。所以一个微信小程序顺势而生，帮助志愿者了解蓝协，了解志愿。宣传志愿思想，提供反馈渠道，并帮助志愿者完成报名。

# 主要功能

## 1.首页：信息展示(main)

* 近期活动：展示了最近的志愿招募
* 志愿项目介绍：展示所有长期志愿项目的基本信息
* 问题反馈：多个志愿项目及小程序本身，点对点反馈意见
* 蓝协介绍：协会初衷与发展历程
* 联系我们：对外合作主要渠道
* 技术相关：除轮播图外均为静态页面，如添加栏目可以更改底下两处列表

## 2.近期活动(activity)

* 主要转载公众号的推送，服务器问题暂未解决，需要手动更新
* 轮播图随列表进行更新
* 点击列表可以直接跳转推送界面


## 3.志愿项目(introduction)

* 分南北校区展示，为静态页面且UI暂未升级
* 内部详细介绍页(detail)仅包含100字介绍，待扩充功能
* 已与志愿招募页的详细信息按钮联系，可直接跳转

## 4.问题反馈(question)

* 静态界面
* 表单覆盖所有志愿项目，但添加表单选项需手动更改
* 提交的数据暂无公开展示，在管理员界面(comment)可查看

## 5.志愿报名(volunteer)

* 志愿的预告和招募都会在这里发布
* 预告将展示招募具体内容与招募发布时间
* 预告将提供详细信息入口连接(detail)页面
* 报名连接(form)表单页面，解析云端的表单
* 志愿者注册，用户须提交基本信息注册后才可以报名志愿项目
* 参与项目记录：成功报名的项目，可以在个人页面查询到

## 6.志愿信息的发布与报名 (list)

* 志愿信息发布：只有在云端数据库登记openid的管理员才能发布志愿
* 包括志愿详细信息编辑，表单编辑，信息导出，时长确认四大功能
* 分别对应(textarea),(edit),(download),(confirm)四个页面
* edit页面包含主要的表单编辑功能，并提供书写志愿时长与志愿备注的地方，这部分数据将有利于小程序内信息沟通
* textarea仿照群内消息格式，提供各项信息修改功能
* download界面可查看已提交的数据并随时导出
* confirm在志愿结束后操作，确认后数据将直接录入志愿者信息，并可导出时长表

## 7.个人界面(about)

* 信息查询功能，提供志愿历史(history)，志愿积分入口
* 简单成就系统，我的志愿地图(map)入口
* 编辑资料，注册志愿者(person)页面
* “积分细则”与“点我点我”为可更改的推送入口，后者可线上更新
* 右上角蓝小咕为管理员入口(admin)

# 部署步骤

1. 下载微信官方的微信开发者工具，申请微信小程序账号
2. 创建新项目，开发模式选择小程序·云开发
3. 将新建项目中的cloudfunctions和miniprogram文件夹替换成本项目的
4. 再次启动查看效果

# 代码目录结构描述

## 全局配置：

### app.json：包括了小程序的所有页面路径、网络超时时间、底部 tab

* tab栏：main主界面，about个人界面
* 界面路径：activity活动界面，introduction介绍界面等

### app.wxss
* 引入外部样式表：main.wxss,row.wxss等


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

#### 2.0新增页面暂未整理