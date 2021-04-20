import React from 'react';
import './App.css';
import { Layout } from 'antd'
import { Pages } from './Pages';
import { Page } from './types/Page';
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { SideMenuWithRouter } from './components/SideMenu/SideMenu';
import { AuthProvider } from './components/Auth/auth-context';
import { PublicRoute } from './components/RouteComponent/PublicRoute';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { PrivateRoute } from './components/RouteComponent/PrivateRoute';
const { Sider, Content, Header } = Layout
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout className='main' style={{ height: '100%' }} key='layout-main'>
        <Router>
          <Layout className='content' >
            <Sider className='sider'>
              <SideMenuWithRouter /> 
            </Sider>
            <Content id="content-main">
              <Switch>
                <PublicRoute component={LoginPage} path='/login' />
                {Pages.map((page: Page) => {
                  return (
                    <PrivateRoute component={page.component} path={page.path} exact />
                  );
                })}
              </Switch>
            </Content>
          </Layout>
        </Router>
      </Layout>
    </AuthProvider>
  );
}
