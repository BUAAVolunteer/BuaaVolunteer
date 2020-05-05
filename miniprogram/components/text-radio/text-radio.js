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
        }
    },
    data: {
        radio_choose: '',
    },
    behaviors: ['wx://component-export'],
    //组件最终对外导出的数据
    data: {
        input_text: '',
        hx_index: 0,
        items: [],
        id: 0,
        choose: [
            [],
            []
        ]
    },
    /**
     * 组件的方法列表
     */
    ready: function () {
        console.log(this.properties.forminfo);
        var id = parseInt(this.properties.forminfo.id)
        this.setData({
            items: this.properties.forminfo.data,
            id
        })
    },
    methods: {
        radioChange: function (e) {
            //返回一个二维数组
            //第一行是组件id，第二行是选项数组
            //第三行是时长
            let ID = parseInt(this.properties.forminfo.id.substr(1))
            let that = this
            let v = e.detail.value;
            let a = v.split(',');
            let input_text = [];
            input_text.push(a[0])
            let value = [];
            value.push(parseInt(a[1]));

            let id = [];
            id.push(ID);

            let duration = [];
            if (parseInt(a[2]))
                duration.push(parseInt(a[2]))
            else
                duration.push(0)
            let choose = [];
            choose.push(id, value, duration);

            //console.log('ID', ID, input_text, choose)
            this.triggerEvent('radio', {
                type: 'radio',
                ID,
                input_text,
                choose
            })
        },
    }
})