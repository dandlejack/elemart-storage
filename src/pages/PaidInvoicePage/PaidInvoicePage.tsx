import { PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Input, Layout, Popconfirm, Select, Table } from 'antd'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PaidApi } from '../../api/PaidApi'
import { PaidInvoiceForm } from '../../components/PaidInvoiceForm/PaidInvoiceForm'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { paidColumn } from '../../mocks/ColumnMocks'
import './style.css'
import { ProductApi } from '../../api/ProductApi'

const { Header } = Layout
const { RangePicker } = DatePicker
const onCancel = (e: any) => { };
const onConfirm = (id: string) => {
    PaidApi.deleteInvoiceById(id);
    window.location.reload();
};

const fetchDefaultPaidData = async (params: any) => {
    return await PaidApi.getPaidInvoice({
        filterObject: params
    }).then(res => {
        console.log(res)
        return res
    })
}

const convertCustomerIdToCustomerName = (data: any) => {
    const localCustomerData = localStorage.getItem('customer')
    if (localCustomerData !== null) {
        const customerData = JSON.parse(localCustomerData)
        data.data.map((data: any) => {
            const findData = customerData.find((cusData: any) => cusData._id === data.customer_name)
            data.customer_name = findData.customer_name
        })
        return data
    }
}
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
        title: 'ลูกค้า',
        dataIndex: 'customer_name',
        key: 'customer_name',
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => <>
            <Link to={'/paid/' + record._id}>
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
export const PaidInvoicePage: React.FC = () => {
    const [dataSource, setDataSource] = useState({
        data: [],
        message: '',
        pageNumber: 1,
        totalDocument: 1,
        totalPage: 1,
        pageSize: 20
    })
    const [modalVisible, setModalVisible] = useState(false)
    const [fetchInput, setFetchInput] = useState({
        selectType: 'date',
        invoice_id: '',
        range_date: ['', ''],
    })
    useEffect(() => {
        async function fetchPaidInvoice() {
            const response = await PaidApi.getPaidInvoice(50)
            const localCustomerData = localStorage.getItem('customer')
            if (localCustomerData !== null) {
                const customerData = JSON.parse(localCustomerData)
                response.data.map((data: any) => {
                    const findData = customerData.find((cusData: any) => cusData._id === data.customer_name)
                    data.customer_name = findData.customer_name
                    return findData
                })
                setDataSource(response)
            }
        }

        fetchPaidInvoice()
        return () => {
            console.log('unmount')
        }
    }, [])

    useEffect(() => {
        async function fetchProduct() {
            if (modalVisible) {
                const response = await ProductApi.getAllProduct({
                    limitPage: 0
                })
                localStorage.setItem('product', JSON.stringify(response.data))
            }
        }
        fetchProduct()
        return () => {
            console.log('unmount')
        }
    }, [modalVisible])

    const handleClose = (p: any) => {
        setModalVisible(false)
        localStorage.removeItem('product')
    }
    const handleClick = async () => {
        if (fetchInput.selectType === 'date') {
            const startDate = new Date(fetchInput.range_date[0])
            const endDate = new Date(fetchInput.range_date[1])
            
            const fetchData = await fetchDefaultPaidData({ createdDate: { '$gte': startDate, '$lte': endDate } })
            const result = convertCustomerIdToCustomerName(fetchData)
            setDataSource(result)

        } else {
            const fetchData = await fetchDefaultPaidData({ invoice_id: { '$regex': `.*${fetchInput.invoice_id}.*` } })
            const result = convertCustomerIdToCustomerName(fetchData)
            setDataSource(result)
        }
    }

    const handleReset = async () => {
        setFetchInput(
            {
                invoice_id: '',
                selectType: fetchInput.selectType,
                range_date: []
            }
        )
        const fetchData = await fetchDefaultPaidData({})
        const result = convertCustomerIdToCustomerName(fetchData)
        setDataSource(result)
    }
    return <div key='invoice-page' className={'invoice-page'}>
        <div style={{ marginTop: 15 }}>
            <div style={{ display: 'inline-flex', marginLeft: 15, alignItems: 'center' }}>
                <Select defaultValue='date' style={{ marginRight: 10 }} onChange={e => setFetchInput({
                    selectType: e,
                    invoice_id: fetchInput.invoice_id,
                    range_date: fetchInput.range_date
                })}>
                    <Select.Option value='date'>วันที่</Select.Option>
                    <Select.Option value='invoice'>หมายเลข Invoice</Select.Option>
                </Select>
            </div>
            {fetchInput.selectType === 'date' ? <RangePicker style={{ marginRight: 15 }} onChange={(date, dateString) => setFetchInput({
                selectType: fetchInput.selectType,
                invoice_id: fetchInput.invoice_id,
                range_date: dateString
            })} /> :
                <Input style={{ width: 200, marginRight: 15 }} value={fetchInput.invoice_id} onChange={e => setFetchInput({
                    selectType: fetchInput.selectType,
                    invoice_id: e.target.value.toUpperCase(),
                    range_date: fetchInput.range_date
                })} />
            }
            <Button style={{ marginRight: 10 }} type='primary' onClick={handleClick} >ค้นหา</Button>
            <Button type='primary' danger onClick={handleReset} >RESET</Button>
            <div style={{ display: 'inline-block', float: 'right', marginRight: 15 }}>
                <Button type='primary' onClick={e => setModalVisible(true)}><PlusOutlined twoToneColor="#eb2f96" /></Button>
            </div>
        </div>
        <CustomModal modalTitle='รายการขาย' modalType="paid-invoice" modalForm={<PaidInvoiceForm column={paidColumn} />} modalWidth={1400} modalVisible={modalVisible} getClose={handleClose} />
        <Table
            style={{ margin: '15px 15px' }}
            rowKey={record => record._id}
            bordered
            columns={column}
            dataSource={dataSource.data}
            pagination={{
                pageSize: 50
            }}
        />
    </div>
}