import { templateVue as Vue } from "../src/index";
const childCom = {
  template:
    '<div @click="onClick"><slot name="header" :user="user"></slot></div>',
  props: {
    size: {
      type: Number
    }
  },
  data() {
    return {
      user: {
        firstName: "liu"
      },
      message: "test"
    };
  },
  methods: {
    onClick() {
      this.$emit("click", "childClick");
    }
  },
  updated() {
    console.log("child");
  },
  mounted() {
    console.log(this);
  }
};
const com = {
  template: "<div>123</div>"
};
const app = new Vue({
  template:
    "<div @click='onClick' :class='{ red: show }'><child-com size='1'><template v-slot:header>123</template></child-com></div>",
  // components: {
  //   com
  // },
  data() {
    return {
      // showContent: "展示",
      // notShowContent: "不展示",
      user: {
        firstName: "liu"
      },
      items: [1, 2, 3],
      show: true,
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
Vue.component("com", com);
app.$mount("#app");
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
