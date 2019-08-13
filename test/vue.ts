import Vue from "../src/index";
const app = new Vue({
  template: '<div @click="onClick">{{content}}</div>',
  data() {
    return {
      content: "渲染支持data双向绑定"
    };
  },
  methods: {
    onClick() {
      this.content = "他改变了中国";
      console.log(this);
      console.log("click!");
    }
  }
});

app.$mount("#app");
