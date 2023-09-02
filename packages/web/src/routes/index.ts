import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/claim/:encounterId",
      name: "Claim",
      component: () => import("../views/Claim.vue"),
    },
    {
      path: "/game/:encounterId",
      name: "Game",
      component: () => import("../views/Game.vue"),
    },
  ],
});
