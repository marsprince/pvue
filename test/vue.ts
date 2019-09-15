import { templateVue as Vue } from "../src/index";
Vue.mixin({
  beforeCreate() {
    console.log("全局混入");
  }
});
const childCom = {
  template: '<div @click="onClick">child render!</div>',
  methods: {
    onClick() {
      this.$emit("click", "childClick");
    }
  }
};
const app = new Vue({
  template: '<div><child-com @click="onClick"></child-com></div>',
  // components: {
  //   childCom
  // },
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
  // computed: {
  //   com() {
  //     return this.a.b.c + 2;
  //   }
  // },
  // watch: {
  //   "a.b.c": function(newVal, oldVal) {
  //     console.log(newVal, oldVal);
  //   }
  // },
  methods: {
    onClick(ms) {
      // this.arr[0].a = Math.random();
      // if (this.arr.length === 0) {
      //   this.$set(this.arr, "0", {});
      // } else {
      //   this.$set(this.arr[0], "a", Math.random());
      // }
      console.log(ms);
    }
  },
  // 生命周期
  beforeCreate() {
    console.log("beforeCreate", JSON.parse(JSON.stringify(this)));
  },
  created() {
    console.log("created", JSON.parse(JSON.stringify(this)));
  },
  beforeMount() {
    console.log("beforeMount", JSON.parse(JSON.stringify(this)));
  },
  mounted() {
    console.log("mounted", this);
  },
  beforeUpdate() {
    console.log("beforeUpdate", this);
  },
  updated() {
    console.log("updated", this);
  }
});
Vue.component("childCom", childCom);
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

// console.log(x.options, y.options);
app.$on("test", function(msg) {
  console.log(msg);
});
// app.$emit("test", "hi");
// => "hi"
// app.$emit("test", "hi");
// app.$off("test");
// // app.$emit("test", "hi");
