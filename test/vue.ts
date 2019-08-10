import Vue from "../src/index";
const app = new Vue({
  template:
    '<div @click="onClick">第三次提交：静态渲染<div>第二次提交：vue渲染</div></div>',
  methods: {
    onClick() {
      console.log("click!");
    }
  }
});

app.$mount("#app");
