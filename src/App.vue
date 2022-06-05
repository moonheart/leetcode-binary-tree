<template>
  <a-row>
    <a-col :span="8" :offset="8">
      <a-input v-model:value="binaryTree" placeholder="[0,2,4,1,null,3,-1,5,1,null,6,null,8]"/>
    </a-col>
  </a-row>
  <a-row v-if="errmsg !== ''">
    <a-col :span="8" :offset="8">
      <a-alert :message="errmsg" type="error" show-icon/>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24">
      <figure>
        <v-chart class="chart" :option="chartData" autoresize/>
      </figure>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import VChart from "vue-echarts";
import {TreeChart, TreeSeriesOption} from "echarts/charts"
import {ComposeOption, use} from "echarts/core";
import {TooltipComponent, TooltipComponentOption} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";
import type {TreeSeriesNodeItemOption} from "echarts/types/src/chart/tree/TreeSeries";

use([
  TreeChart,
  TooltipComponent,
  CanvasRenderer
])

function constructTree(array: (number | null)[] | null): TreeSeriesNodeItemOption | null {
  if (array == null || array.length == 0 || array[0] == null) {
    return null;
  }

  let index = 0;
  let length = array.length;

  let root = {name: array[0]} as TreeSeriesNodeItemOption;
  let nodeQueue: TreeSeriesNodeItemOption[] = [];
  nodeQueue.push(root);
  let currNode: TreeSeriesNodeItemOption;
  while (index < length) {
    index++;
    if (index >= length) {
      return root;
    }
    currNode = nodeQueue.shift()!;
    currNode.children = currNode.children ?? []
    let leftChild = array[index];
    if (leftChild != null) {
      let left = {name: leftChild} as TreeSeriesNodeItemOption
      currNode.children.push(left);
      nodeQueue.push(left);
    } else {
      let left = {name: "_"} as TreeSeriesNodeItemOption
      currNode.children.push(left);
      // nodeQueue.push(left);
    }
    index++;
    if (index >= length) {
      return root;
    }
    let rightChild = array[index];
    if (rightChild != null) {
      let right = {name: rightChild} as TreeSeriesNodeItemOption
      currNode.children.push(right)
      nodeQueue.push(right);
    } else {
      let right = {name: "_"} as TreeSeriesNodeItemOption
      currNode.children.push(right)
      // nodeQueue.push(right);
    }
  }

  return root;
}

function getOption(seriesData: TreeSeriesNodeItemOption): ComposeOption<TooltipComponentOption | TreeSeriesOption> {
  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [seriesData],
        left: '2%',
        right: '2%',
        top: '8%',
        bottom: '20%',
        symbol: 'emptyCircle',
        orient: 'vertical',
        expandAndCollapse: false,
        itemStyle: {},
        label: {
          // position: 'insideTop',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: '2em'
        },
        leaves: {
          label: {
            position: 'bottom',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        animationDurationUpdate: 750,
        lineStyle: {
          curveness: 0,
          width: 5
        }
      }
    ]
  }
}

export default defineComponent({
  name: 'App',
  setup() {
    const binaryTree = ref("[0,2,4,1,null,3,-1,5,1,null,6,null,8]")
    const errmsg = ref("")

    function getArray(str: string) {
      let arr: (number | null)[]
      try {
        arr = eval(str)
        errmsg.value = ""
      } catch (e: any) {
        console.log(typeof e)
        errmsg.value = e.message
        arr = []
      }
      return arr
    }

    const chartData = computed(() => {
      let tree = constructTree(getArray(binaryTree.value));
      if (tree != null)
        return getOption(tree)
      else {
        return null
      }
    })
    return {binaryTree, chartData, errmsg}
  },
  components: {
    VChart,
    // ARow,
    // ACol
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

figure {
  height: 500px;
}
</style>
