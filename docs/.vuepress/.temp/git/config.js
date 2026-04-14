import { GitContributors } from "E:/Program/Code/demo/AI Demo/acg-blog/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_1faedf3934f0ae0a307cc0aa34ee10fc/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "E:/Program/Code/demo/AI Demo/acg-blog/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_1faedf3934f0ae0a307cc0aa34ee10fc/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
