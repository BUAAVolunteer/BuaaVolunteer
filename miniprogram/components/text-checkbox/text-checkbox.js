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
        choose: [
            [],
            []
        ]
    },
    /**
     * 组件的方法列表
     */
    ready: function () {
        //console.log(this.properties.forminfo);
        this.setData({
            items: this.properties.forminfo.data
        })
    },
    methods: {
        checkboxChange: function (e) {
            //返回一个二维数组
            //第一行是组件id，第二行是选项数组
            //第三行是时长
            console.log(e);
            let ID = parseInt(this.properties.forminfo.id.substr(1))
            console.log('ID', ID)
            let that = this
            let v = e.detail.value;
            let l = v.length;
            let input_text = [];
            let value = [];
            let id = [];
            let duration = [];
            for (var i = 0; i < l; i++) {
                let a = v[i].split(',');

                input_text.push(a[0]);
                id.push(ID)
                value.push(parseInt(a[1]));
                if (parseInt(a[2]))
                    duration.push(parseInt(a[2]))
                else
                    duration.push(0)
            }
            let choose = [];
            choose.push(id, value, duration)
            this.triggerEvent('checkbox', {
                type: 'checkbox',
                ID,
                input_text,
                choose
            })
        }
    }
})