import { PlusOutlined } from '@ant-design/icons'
import {Button, Input, Layout, Popconfirm, Table} from 'antd'
import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { PaidApi } from '../../api/PaidApi'
import {PaidInvoiceForm} from '../../components/PaidInvoiceForm/PaidInvoiceForm'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import {paidColumn} from '../../mocks/ColumnMocks'
import './style.css'
import { ProductApi } from '../../api/ProductApi'

const {Header} = Layout

const onCancel = (e: any) => {};
const onConfirm = (id: string) => {
  PaidApi.deleteInvoiceById(id);
  window.location.reload();
};

const column = [
    {
        title:'วันที่',
        dataIndex:'invoice_date',
        key:'invoice_date',
    },
    {
        title:'หมายเลข Invoice',
        dataIndex:'invoice_id',
        key:'invoice_id',
    },
    {
        title:'ลูกค้า',
        dataIndex:'customer_name',
        key:'customer_name',
    },
    {
        title:'Operation',
        dataIndex:'operation',
        key:'operation',
        render:(text:string,record:any)=><>
        <Link to={'/paid/'+record._id}>
            <Button type='primary'>ดูรายละเอียด</Button>
        </Link>
            <Popconfirm
            title="คุณต้องการลบรายงานนี้?"
            onConfirm={() => onConfirm(record._id)}
            onCancel={onCancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type='primary' danger style={{marginLeft:10}}>Delete</Button>
          </Popconfirm>
        </>
    }
]
export const PaidInvoicePage:React.FC = () =>{
    const [dataSource, setDataSource] = useState([])
    const [modalVisible,setModalVisible] = useState(false)

    useEffect(()=>{
        async function fetchPaidInvoice() {
            const response = await PaidApi.getPaidInvoice(50)
            const localCustomerData = localStorage.getItem('customer')
            if(localCustomerData !== null){
                const customerData = JSON.parse(localCustomerData)
                response.data.map((data:any)=>{
                    const findData = customerData.find((cusData:any)=> cusData._id === data.customer_name)
                    data.customer_name = findData.customer_name
                    return findData
                })
                setDataSource(response.data)
            }
        }
        
        fetchPaidInvoice()
        return () =>{            
            console.log('unmount')
        }
    },[])

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
    
    const handleClose = (p:any) =>{
        setModalVisible(false)
        localStorage.removeItem('product')
    }

    return <div key='invoice-page' className={'invoice-page'}>
    <div style={{marginTop:15}}>
        <div style={{display:'inline-flex',marginLeft:15,alignItems:'center'}}>
            <label>ค้นหา</label>
            <Input/>
        </div>
        <div style={{display:'inline-block',float:'right',marginRight:15}}>
            <Button type='primary' onClick={e=>setModalVisible(true)}><PlusOutlined twoToneColor="#eb2f96" /></Button>
        </div>
    </div>
    <CustomModal modalTitle='รายการขาย' modalType="paid-invoice" modalForm={<PaidInvoiceForm column={paidColumn}/>} modalWidth={1400} modalVisible={modalVisible} getClose={handleClose} />
    <Table
    style={{margin:'15px 15px'}}
    rowKey={record => record._id}
    bordered
    columns={column}
    dataSource={dataSource}
    pagination={{
        pageSize:50
    }}
    />
</div>
}