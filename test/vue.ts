import { templateVue as Vue } from "../src/index";

const a = {
  template: '<div class="a"><p>A Comp</p></div>',
  name: "A",
  activated() {
    console.log("activated A");
  },
  deactivated() {
    console.log("deactivated A");
  }
};

const A = () => {
  return {
    component: Promise.resolve(a)
  };
};

// Vue.component("A", A);

let vm = new Vue({
  template: "<div><A></A></div>",
  data() {
    return {};
  },
  components: {
    A
  }
});

vm.$mount("#app");
