import { defineConfig } from "umi";

export default defineConfig({
  plugins: ["@umijs/plugins/dist/antd", "@umijs/plugins/dist/tailwindcss"],
  antd: {},
  routes: [
    {
      path: "/",
      // component: "@/layouts/index", // 使用我们的布局组件
      routes: [
        { path: "/", component: "@/pages/index" },
        // { path: "/page1", component: "@/pages/page1" },
        {
          path: "/page1",
          // component: "@/pages/page1/layout", // page1的布局组件
          routes: [
            { path: "/page1/sub1", component: "@/pages/page1/sub1" },
            { path: "/page1/sub2", component: "@/pages/page1/sub2" },
          ],
        },
        { path: "/page2", component: "@/pages/page2" },
      ],
    },
  ],

  npmClient: "pnpm",
  tailwindcss: {},
});
