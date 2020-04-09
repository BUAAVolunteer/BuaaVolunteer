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
    export () {
        return {
            choose: this.data.choose,
            input_text: this.data.input_text,
            force: this.properties.forminfo.force,
            role: this.properties.forminfo.role,
            limit: this.properties.forminfo.limit,
            label: this.properties.forminfo.label,
            type: this.properties.forminfo.type,
            duration: this.properties.forminfo.duration,
            detail: this.properties.forminfo.detail,
            data: this.properties.forminfo.data
        }
    },
    /**
     * 组件的方法列表
     */
    ready: function() {
        console.log(this.properties.forminfo);
        var id = parseInt(this.properties.forminfo.id)
        this.setData({
            items: this.properties.forminfo.data,
            id
        })
    },
    methods: {
        radioChange: function(e) {
            //返回一个二维数组
            //第一行是组件id，第二行是选项数组
            //第三行是时长
            var ID = parseInt(this.properties.forminfo.id.substr(1))

            var that = this

            var v = e.detail.value;
            var a = v.split(',');
            var input_text = a[0];

            var value = [];
            value.push(parseInt(a[1]));

            var id = [];
            id.push(ID);

            var duration = [];
            if (parseInt(a[2]))
                duration.push(parseInt(a[2]))
            else
                duration.push(0)
            var choose = [];
            choose.push(id, value, duration);

            console.log('ID', ID, input_text, choose)

            that.setData({
                input_text,
                choose
            });
        },
    }
})