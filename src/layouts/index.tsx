// src/layouts/index.tsx
import { Outlet } from "umi";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { Link } from "umi";

const { Header, Content, Sider } = Layout;

export default function LayoutComponent() {
  // 菜单项配置
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/">首页</Link>,
    },
    {
      key: "/page1",
      label: "页面1",
      children: [
        { key: "/page1/sub1", label: <Link to="/page1/sub1">子页面1</Link> },
        { key: "/page1/sub2", label: <Link to="/page1/sub2">子页面2</Link> },
      ],
    },
    {
      key: "3",
      label: <Link to="/page2">页面2</Link>,
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 左侧菜单栏 */}
      <Sider collapsible>
        <div style={{ height: 32, margin: 16, background: "rgba(255, 255, 255, 0.2)" }} />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
      </Sider>

      {/* 右侧内容区 */}
      <Layout>
        <Header style={{ padding: 0, background: "#fff" }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
