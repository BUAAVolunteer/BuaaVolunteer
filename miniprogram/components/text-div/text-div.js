// components/my-form/my-input.js
Component({
    /**
     * 组件的初始数据
     */
    options: {
        addGlobalClass: true,
    },
    properties: {
    },
    data: {
        input_text: '',
    },
    behaviors: ['wx://component-export'],
    //组件最终对外导出的数据
    export () {
    },
    /**
     * 组件的方法列表
     */
    ready: function() {
        //console.log(this.properties);
    },
    methods: {
        
    }
})