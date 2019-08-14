import Vue from "../src/index";
const app = new Vue({
  template:
    '<div @click="onClick"><div v-if="show">{{showContent}}</div><div v-else>{{notShowContent}}</div></div>',
  data() {
    return {
      showContent: "展示",
      notShowContent: "不展示",
      show: false,
      testSet: {
        m: 111
      },
      count: 0
    };
  },
  methods: {
    onClick() {
      if (this.show) {
        this.notShowContent = Math.random();
      }
      this.show = true;
    }
  }
});

app.$mount("#app");
