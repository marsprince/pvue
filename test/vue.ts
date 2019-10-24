import { templateVue as Vue } from "../src/index";

const a = {
  functional: true,
  render(h) {
    return h("div", {}, "acomp");
  }
};

const A = a;

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
