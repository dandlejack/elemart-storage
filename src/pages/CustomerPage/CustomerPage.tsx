import React, {useEffect,useState} from 'react'
import {Button, Input, Result, Table} from 'antd'
import { Link } from 'react-router-dom';
import { loadCustomers } from '../../services/CustomerService'
import { CustomerApi } from '../../api/CustomerApi'
import {PlusOutlined} from '@ant-design/icons'
import { CustomModal } from '../../components/CustomModal/CustomModal';
import { CustomerForm } from '../../components/CustomerForm/CustomerForm';
const column = [
    {
        title:'ชื่อลูกค้า',
        dataIndex:'customer_name',
        key:'customerName'
    },
    {
        title:'operation',
        dataIndex:'operation',
        render:(text:string,record:any)=><Link to={{ pathname: '/customer/' + record._id }}><Button key={record._id} type='primary'>ดูรายละเอียด</Button></Link>
    }
]
export const CustomerPage:React.FC = () => {
    const [dataSource, setDataSource] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    
    useEffect(()=>{
        console.log('Effect is applied')
        async function fetchCustomer() {
            const response = await CustomerApi.getCustomer(20)
            setDataSource(response)
        }
        fetchCustomer()
        return () =>{            
            console.log('unmount')
        }
    },[])
    
    const handleClose = (p:any) =>{
        localStorage.removeItem('product')
        setModalVisible(false)
    }

    return (
        <div key='customer-page'>
            <div style={{marginTop:15}}>
                <div style={{display:'inline-flex',marginLeft:15,alignItems:'center'}}>
                    <label>ค้นหา</label>
                    <Input/>
                </div>
                <div style={{display:'inline-block',float:'right',marginRight:15}}>
                    <Button type='primary' onClick={e=>setModalVisible(true)}><PlusOutlined twoToneColor="#eb2f96" /></Button>
                </div>
            </div>
            <CustomModal modalTitle='เพิ่มลูกค้า' modalType="customer" modalForm={<CustomerForm/>} modalVisible={modalVisible} getClose={handleClose} />
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
    )
}