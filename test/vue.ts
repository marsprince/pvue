import { templateVue as Vue } from "../src/index";
const app = new Vue({
  template:
    '<div @click="onClick"><div v-if="show">{{arr[0].a}}</div><div v-else>{{a.b.c}}</div></div>',
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
    onClick() {
      // this.arr[0].a = Math.random();
      // if (this.arr.length === 0) {
      //   this.$set(this.arr, "0", {});
      // } else {
      //   this.$set(this.arr[0], "a", Math.random());
      // }
      this.a.b.c = Math.random();
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

let x = Vue.component("x", {
  data() {
    return {
      a: 1
    };
  }
});
let y = Vue.component("y", {
  data() {
    return {
      a: 1
    };
  }
});
// console.log(x.options, y.options);
app.$on("test", function(msg) {
  console.log(msg);
});
// app.$emit("test", "hi");
// => "hi"
// app.$emit("test", "hi");
// app.$off("test");
// // app.$emit("test", "hi");
