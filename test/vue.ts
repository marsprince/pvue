import { templateVue as Vue } from "../src/index";
const childCom = {
  template: '<div @click="onClick">{{ size.z }}</div>',
  props: {
    size: {
      type: Number
    }
  },
  data() {
    return {
      message: "test"
    };
  },
  methods: {
    onClick() {
      this.$emit("click", "childClick");
    }
  },
  updated() {
    console.log("child up");
  },
  mounted() {
    console.log(this);
  }
};
const app = new Vue({
  template:
    '<div><div ref="p">1</div><div @click="show = !show">cccc</div></div>',
  // components: {
  //   childCom
  // },
  data() {
    return {
      // showContent: "展示",
      // notShowContent: "不展示",
      items: [1, 2, 3],
      show: false,
      size: {
        z: 1
      },
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
      this.size.z = Math.random();
    }
  },
  mounted() {
    console.log(this);
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
