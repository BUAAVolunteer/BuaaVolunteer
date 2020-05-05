// components/my-form/my-input.js
Component({
    /**
     * 组件的初始数据
     */
    options: {
        addGlobalClass: true,
    },
    properties: {
        label: {
            type: String,
            value: '',
        },
        formid: {
            type: String,
            value: '',
        },
        forminfo: {
            type: Object,
            value: {}
        },
        role: {
            type: Object,
            value: {}
        }
    },
    data: {
        input_text: '',
    },
    behaviors: ['wx://component-export'],
    /**
     * 组件的方法列表
     */
    ready: function() {
        //console.log(this.properties);
    },
    methods: {
        enterValue: function(e) {
            //console.log(e.detail.value);
            let input_text = e.detail.value;
            let ID = parseInt(this.properties.forminfo.id.substr(1));
            this.triggerEvent('input', {
                type: 'input',
                ID,
                input_text
            })
        }
    }
})