import { templateVue as Vue } from "../src/index";
let A = {
  template: '<div class="a"><p>A Comp</p></div>',
  name: "A",
  activated() {
    console.log("activated A");
  },
  deactivated() {
    console.log("deactivated A");
  }
};

let B = {
  template: '<div class="b"><p>B Comp</p></div>',
  name: "B",
  activated() {
    console.log("activated b");
  },
  deactivated() {
    console.log("deactivated b");
  }
};

let vm = new Vue({
  template:
    "<div>" +
    "<keep-alive>" +
    '<component :is="currentComp">' +
    "</component>" +
    "</keep-alive>" +
    '<button @click="change">switch</button>' +
    "</div>",
  data() {
    return {
      currentComp: "A"
    };
  },
  methods: {
    change() {
      this.currentComp = this.currentComp === "A" ? "B" : "A";
    }
  },
  components: {
    A,
    B
  }
});

vm.$mount("#app");
