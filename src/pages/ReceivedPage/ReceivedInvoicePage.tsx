import { PlusOutlined } from '@ant-design/icons'
import { Input, Button, Table, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import { PaidApi } from '../../api/PaidApi'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { PaidInvoiceForm } from '../../components/PaidInvoiceForm/PaidInvoiceForm'
import { ReceivedApi } from '../../api/ReceivedApi'
import { ReceivedInvoiceForm } from '../../components/ReceivedInvoiceForm/ReceivedInvoiceForm'
import { ProductApi } from '../../api/ProductApi'
import { receivedColumn } from '../../mocks/ColumnMocks'
import { CustomerApi } from '../../api/CustomerApi'
import { AuthProvider, useAuth } from '../../components/Auth/auth-context'

const onCancel = (e: any) => { };
const onConfirm = (id: string) => {
    ReceivedApi.deleteReceivedInvoiceById(id);
    window.location.reload();
};



const column = [
    {
        title: 'วันที่',
        dataIndex: 'invoice_date',
        key: 'invoice_date',
    },
    {
        title: 'หมายเลข Invoice',
        dataIndex: 'invoice_id',
        key: 'invoice_id',
    },
    {
        title: 'ผู้ขาย',
        dataIndex: 'seller',
        key: 'seller',
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => <>
            <Link to={'/received/' + record._id}>
                <Button type='primary'>ดูรายละเอียด</Button>
            </Link>
            <Popconfirm
                title="คุณต้องการลบรายงานนี้?"
                onConfirm={() => onConfirm(record._id)}
                onCancel={onCancel}
                okText="Yes"
                cancelText="No"
            >
                <Button type='primary' danger style={{ marginLeft: 10 }}>Delete</Button>
            </Popconfirm>
        </>
    }
]
export const ReceivedInvoicePage: React.FC = () => {
    const [dataSource, setDataSource] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const {signIn,myAccount } = useAuth();
    useEffect(() => {
        console.log('Effect is applied')
        async function fetchPaidInvoice() {
            const response = await ReceivedApi.getAllReceivedInvoice({
                limitPage:0
            })
            const localCustomerData = localStorage.getItem('customer')
            if(localCustomerData !== null){
                const customerData = JSON.parse(localCustomerData)
                response.data.map((data:any)=>{
                    const findData = customerData.find((cusData:any)=> cusData._id === data.seller)
                    data.seller = findData.customer_name
                })
                setDataSource(response.data)
            }

        }        
        async function fetchCustomer() {
                const response = await CustomerApi.getAllCustomer()
                localStorage.setItem('customer',JSON.stringify(response))            
        }

        fetchCustomer()
        fetchPaidInvoice()
        return () => {
            console.log('unmount')
        }
    }, [])

    useEffect(() => {
        async function fetchProduct() {
            if(modalVisible){
                const response = await ProductApi.getAllProduct({
                    limitPage:0
                })
                localStorage.setItem('product',JSON.stringify(response.data))
            }
        }
        fetchProduct()
        return () => {
            console.log('unmount')
        }
    }, [modalVisible])

    const handleClose = (p: any) => {
        localStorage.removeItem('product')
        setModalVisible(false)
    }

    return <div key='invoice-page' className={'invoice-page'}>
        <div style={{ marginTop: 15 }}>
            <div style={{ display: 'inline-flex', marginLeft: 15, alignItems: 'center' }}>
                <label>ค้นหา</label>
                <Input />
            </div>
            <div style={{ display: 'inline-block', float: 'right', marginRight: 15 }}>
                <Button type='primary' onClick={e => setModalVisible(true)}><PlusOutlined twoToneColor="#eb2f96" /></Button>
            </div>
        </div>
        <CustomModal modalTitle='รายการซื้อ' modalType="received-invoice" modalForm={<ReceivedInvoiceForm column={receivedColumn} />} modalWidth={1400} modalVisible={modalVisible} getClose={handleClose} />
        <Table
            style={{ margin: '15px 15px' }}
            rowKey={record => record._id}
            bordered
            columns={column}
            dataSource={dataSource}
            pagination={{
                pageSize: 50
            }}            
        />
    </div>
}