import { CodeTabs } from "E:/Program/Code/demo/AI Demo/acg-blog/node_modules/.pnpm/@vuepress+plugin-markdown-t_d748ea0ef82c6895ef3467b30dd0bdc8/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "E:/Program/Code/demo/AI Demo/acg-blog/node_modules/.pnpm/@vuepress+plugin-markdown-t_d748ea0ef82c6895ef3467b30dd0bdc8/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "E:/Program/Code/demo/AI Demo/acg-blog/node_modules/.pnpm/@vuepress+plugin-markdown-t_d748ea0ef82c6895ef3467b30dd0bdc8/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
