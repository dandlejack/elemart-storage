import { Page } from './types/Page'
import { App } from './App'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { ProductPage } from './pages/ProductPage/ProductPage'
import { CustomerPage } from './pages/CustomerPage/CustomerPage'
import { PaidInvoicePage } from './pages/PaidInvoicePage/PaidInvoicePage'
import { ReceivedInvoicePage } from './pages/ReceivedPage/ReceivedInvoicePage'
import { PaidInfo } from './components/PaidInfo/PaidInfo'
import { ReceivedInfo } from './components/ReceivedInfo/ReceivedInfo'
import { ProductInfo } from './components/ProductInfo/ProductInfo'
import { CustomerInfo } from './components/CustomerInfo/CustomerInfo'
import Cookie from 'js-cookie';
import { LogoutComponent } from './components/LogoutComponent/LogoutComponent'
export const Pages: Page[] = [
    {
        title: 'สินค้า',
        component: ProductPage,
        path: '/',
        show: true,
        privateRoute: true
    },
    {
        title: 'รายงานรับ',
        component: ReceivedInvoicePage,
        path: '/received',
        show: true,
        privateRoute: true
    },
    {
        title: 'รายงานขาย',
        component: PaidInvoicePage,
        path: '/paid',
        show: true,
        privateRoute: true
    },
    {
        title: 'Customer',
        component: CustomerPage,
        path: '/customer',
        show: true,
        privateRoute: true
    },
    {
        title: 'รายการขาย',
        path: '/paid/:id',
        component: PaidInfo,
        show: false,
        privateRoute: true
    },
    {
        title: 'รายการซื้อ',
        path: '/received/:id',
        component: ReceivedInfo,
        show: false,
        privateRoute: true
    },
    {
        title: 'สินค้า',
        path: '/product/:id',
        component: ProductInfo,
        show: false,
        privateRoute: true
    },
    {
        title: 'ลูกค้า',
        path: '/customer/:id',
        component: CustomerInfo,
        show: false,
        privateRoute: true
    },
    {
        title: 'Logout',
        path: '/logout',
        component:LogoutComponent,
        show: true,
        privateRoute: true
    }
]