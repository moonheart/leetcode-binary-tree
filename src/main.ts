import {createApp} from 'vue'
import {Row,Col,Input,Alert} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
// import ECharts from 'vue-echarts'
// import "echarts";
import {use} from "echarts/core"

// // 手动引入 ECharts 各模块来减小打包体积
import {CanvasRenderer} from 'echarts/renderers'
import {TreeChart} from 'echarts/charts'
import {TooltipComponent} from 'echarts/components'

use([
    TreeChart,
    CanvasRenderer,
    TooltipComponent
]);

createApp(App)
    .use(Row)
    .use(Input)
    .use(Alert)
    .use(Col)
    // .component('v-chart', ECharts)
    .mount('#app')
