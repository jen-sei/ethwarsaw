import "./assets/index.css";

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { UseWagmiPlugin } from "use-wagmi";
import { config as wagmiConfig } from "./plugins/wagmi";
import router from "./routes";

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(UseWagmiPlugin, wagmiConfig)
  .mount("#app");
