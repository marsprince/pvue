import Vue from "../src/index";
const app = new Vue({
  template:
    '<div @click="onClick"><div v-if="show">{{arr[0].a}}</div><div v-else>{{test}}</div></div>',
  data() {
    return {
      showContent: "展示",
      notShowContent: "不展示",
      show: false,
      testSet: {
        m: 111
      },
      arr: [],
      a: 1,
      b: 2
    };
  },
  computed: {
    test() {
      return this.testA + this.a;
    },
    testA() {
      return this.a + this.b;
    }
  },
  methods: {
    onClick() {
      // this.arr[0].a = Math.random();
      // if (this.arr.length === 0) {
      //   this.$set(this.arr, "0", {});
      // } else {
      //   this.$set(this.arr[0], "a", Math.random());
      // }
      this.a = 2;
      this.b = 0;
    }
  }
});

app.$mount("#app");
