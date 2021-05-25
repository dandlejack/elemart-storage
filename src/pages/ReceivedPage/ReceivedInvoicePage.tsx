import { PlusOutlined } from '@ant-design/icons'
import { Input, Button, Table, Popconfirm, Select, DatePicker } from 'antd'
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
import { InputSearch } from '../../components/SearchBar/InputSearch'

const onCancel = (e: any) => { };
const onConfirm = (id: string) => {
    ReceivedApi.deleteReceivedInvoiceById(id);
    window.location.reload();
};
const { RangePicker } = DatePicker

const fetchDefaultReceivedData = async (params: any) => {
    return await ReceivedApi.getAllReceivedInvoice({
        filterObject: params
    }).then(res => {
        return res
    })
}
const convertCustomerIdToCustomerName = (data: any) => {
    const localCustomerData = localStorage.getItem('customer')
    if (localCustomerData !== null) {
        const customerData = JSON.parse(localCustomerData)
        data.data.map((data: any) => {
            const findData = customerData.find((cusData: any) => cusData._id === data.seller)
            data.seller = findData.customer_name
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
    const { signIn, myAccount } = useAuth();
    useEffect(() => {
        console.log('Effect is applied')
        async function fetchPaidInvoice() {
            const response = await ReceivedApi.getAllReceivedInvoice({
                limitPage: 0
            })
            const localCustomerData = localStorage.getItem('customer')
            if (localCustomerData !== null) {
                const customerData = JSON.parse(localCustomerData)
                response.data.map((data: any) => {
                    const findData = customerData.find((cusData: any) => cusData._id === data.seller)
                    data.seller = findData.customer_name
                })
                setDataSource(response)
            }

        }
        async function fetchCustomer() {
            const response = await CustomerApi.getAllCustomer()
            localStorage.setItem('customer', JSON.stringify(response))
        }

        fetchCustomer()
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
        localStorage.removeItem('product')
        setModalVisible(false)
    }

    const handleClick = async () => {
        if (fetchInput.selectType === 'date') {
            const startDate = new Date(fetchInput.range_date[0])
            const endDate = new Date(fetchInput.range_date[1])
            await ReceivedApi.getAllReceivedInvoice({
                filterObject: { createdDate: { '$gte': startDate, '$lte': endDate } }
            }).then(res => {
                console.log(res)
                setDataSource(res)
            })
            const fetchData = await fetchDefaultReceivedData({createdDate: { '$gte': startDate, '$lte': endDate } })
            const result = convertCustomerIdToCustomerName(fetchData)
            setDataSource(result)

        } else {
            const fetchData = await fetchDefaultReceivedData({invoice_id: { '$regex': `.*${fetchInput.invoice_id}.*` }})
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
        const fetchData = await fetchDefaultReceivedData({})
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
            {fetchInput.selectType === 'date' ? <RangePicker style={{marginRight:15}} onChange={(date, dateString) => setFetchInput({
                selectType: fetchInput.selectType,
                invoice_id: fetchInput.invoice_id,
                range_date: dateString
            })} /> :
                <Input style={{ width: 200,marginRight:15 }} value={fetchInput.invoice_id} onChange={e => setFetchInput({
                    selectType: fetchInput.selectType,
                    invoice_id: e.target.value.toUpperCase(),
                    range_date: fetchInput.range_date
                })} />
            }
            <Button style={{ marginRight: 10 }} type='primary' onClick={handleClick} >ค้นหา</Button>
            <Button type='primary' danger onClick={handleReset} >RESET</Button>
            {/* <InputSearch selectType={['date','invoice']} thaiwordSelect={['วันที่','หมายเลข Invoice']}  /> */}
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
            dataSource={dataSource.data}
            pagination={{
                pageSize: 20
            }}
        />
    </div>
}