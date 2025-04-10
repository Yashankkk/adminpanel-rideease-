import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import User from './user';
import Contact from './contact'
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('User', 'user', <UserOutlined />), // Use lowercase keys
  getItem('Contact', 'contact', <TeamOutlined />),
  getItem('Files', 'files', <FileOutlined />),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState('1'); // default to first item

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    setCurrentPath(e.key);
  };

  const renderComponent = () => {
    switch (currentPath) {
      case 'user':
        return <User />;
      case 'contact':
        return <Contact />;
      case 'files':
        return 'Here are your files';
      default:
        return <div>Welcome to Dashboard</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={value => setCollapsed(value)}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          }}>
        <div className="demo-logo-vertical" 
         style={{ height: 64, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{currentPath}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderComponent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
