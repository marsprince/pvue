import Vue from "../src/index";
const app = new Vue({
  template:
    '<div @click="onClick"><div v-if="show">{{arr[0].a}}</div><div v-else>12</div></div>',
  data() {
    return {
      // showContent: "展示",
      // notShowContent: "不展示",
      show: false,
      // testSet: {
      //   m: 111
      // },
      // arr: [],
      a: {
        b: {
          c: 1
        }
      }
    };
  },
  // watch: {
  //   "a.b.c": function(newVal, oldVal) {
  //     console.log(newVal, oldVal);
  //   }
  // },
  methods: {
    onClick() {
      // this.arr[0].a = Math.random();
      // if (this.arr.length === 0) {
      //   this.$set(this.arr, "0", {});
      // } else {
      //   this.$set(this.arr[0], "a", Math.random());
      // }
      this.a.b.c = Math.random();
    }
  }
});

app.$mount("#app");
app.$watch(
  "a",
  function(newVal, oldVal) {
    console.log("watch:", newVal, oldVal);
  },
  {
    deep: true
  }
);
