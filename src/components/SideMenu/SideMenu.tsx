import React, { useState, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Page } from '../../types/Page';
import { Pages } from '../../Pages';
import { Menu,Typography } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import './style.css'
import { useAuth } from '../Auth/auth-context';
const {Title} = Typography
type SideMenuProps = RouteComponentProps<{}>;

const SideMenu = ({ history }: SideMenuProps) => {
  const [activePage, setActivePage] = useState(Pages[0].title);
  const {myAccount} = useAuth()
  const cpMyAccout = JSON.parse(JSON.stringify(myAccount))
  const navigateToPage = (e:any,page: any) => {
    history.push(page.path);
    setActivePage(page.title);
  };  
  return (
    <>
    <Header className='header'>
          <div>
            <div className='company-title'>
              <Title level={3}>ELE-MART</Title>
            </div>
          </div>
      </Header>
    <Menu 
      key="SideMenu"
      activeKey={activePage}
      defaultSelectedKeys={[activePage]}
      className='outside-menu'
      mode="inline">
      {cpMyAccout.login && Pages.map((page: Page, index: number) => {
        if(!page.show) return <></>
        return (
          <Menu.Item
          onClick={(e) => navigateToPage(e,page)}
            key={page.title}
          >
            <span>{page.title}</span>
          </Menu.Item>
        )
      })}
    </Menu>
    </>
  );
};

export const SideMenuWithRouter = withRouter(SideMenu);
