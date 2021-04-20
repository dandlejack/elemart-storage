import React, { useEffect, useState } from 'react';
import './Login.css';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../components/Auth/auth-context';
interface LoginInterface {
  username:string;
  password:string;
}
export const LoginPage: React.FC = () => {
  const [msg, setMsg] = useState('');
  const { signIn, myAccount } = useAuth();

  const onLogin = async (values: any) => {
    // setLoadingState(true);
    try {
      const res = await signIn({
        username: values.username,
        password: values.password,
      });
      if(res === 'username or password wrong') setMsg(res);
    } catch {
      console.log('Login Error');
    }
  };

  return (
          <Form className={'login-form'} onFinish={onLogin}>
            <Form.Item
              label=""
              name="username"
              rules={[{ required: true, message: 'กรุณากรอก Username' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                className={'uinput'}
              />
            </Form.Item>
            <Form.Item
              label=""
              name="password"
              rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                className={'uinput'}
              />
            </Form.Item>
            <div style={{textAlign:'center'}}>
              <span style={{ fontSize: 16, color: 'red'}}>{msg}</span>
            </div>
            <Form.Item>
              <Button type="primary" className="buttonT" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
  );
};
