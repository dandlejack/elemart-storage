
import { Button, DatePicker, Input, Select } from 'antd'
import {useEffect,useState} from 'react'
import { CustomerApi } from '../../api/CustomerApi'
import { PaidApi } from '../../api/PaidApi'
import { ProductApi } from '../../api/ProductApi'
import {EditableTable} from '../EditTable/EditableTable'

interface TableProps {
    column:Array<Object>
}

export const PaidInvoiceForm:React.FC<TableProps> = props => {
    const [dataTable, setdataTable] = useState([] as Array<Object>)
    const [invoice, setInvoice] = useState('')
    const [customer, setCustomer] = useState('')
    const [customers, setCustomers] = useState([] as Array<Object>)
    const [dateData, setDateData] = useState('')

    useEffect(()=>{
        async function fetchAllCustomer() {
            const response = await CustomerApi.getAllCustomer()
            setCustomers(response)
        }
        fetchAllCustomer()
        return () =>{            
            console.log('unmount')
        }
    },[])

    const getTableData = (data:Array<Object>) => {
        setdataTable(data)
    }

    const onSave = async () =>{
        const getProduct = localStorage.getItem('product')
        const allData = {
            invoice_date:dateData,
            invoice_id:'IV'+invoice,
            customer_name:customer,
            data_table:dataTable,
        }
        const id = await PaidApi.insertInvoice(allData).then(res=>{
            return res._id
        })
        if(getProduct !== null){
            const p = JSON.parse(getProduct)
            dataTable.map((data:any,index:number)=>{
                const filterData = p.filter((pFilter:any) => pFilter._id === data.raw_id)[0]
                filterData.current_amount -= data.paid_amount
                filterData.history_table.push(id)
                ProductApi.updateProductById(data.raw_id,filterData).then(res=>{
                    window.location.reload()
                })
            })
        }
    }

    return (
        <div className='paid-content'>
            <div className='paid-form date-form'>
                <span>วันที่</span>
                <div>
                    <DatePicker format='DD/MM/YYYY' className={'input-width'} onChange={(date,dateString) =>setDateData(dateString)} />
                </div>                
            </div>
            <div className='paid-form invoice-form'>
                <span>หมายเลข Invoice</span>
                <div>
                    <Input addonBefore='IV' className={'input-width'} onChange={e=>setInvoice(e.target.value)} />
                </div>                
            </div>
            <div className='paid-form customer-form'>
                <span>ลูกค้า</span>
                <div>
                    <Select className={'input-width'} showSearch onChange={e=>setCustomer(e.toString())}>
                        {customers.map((data:any)=>{
                            return <Select.Option key={data._id} value={data._id}>{data.customer_name}</Select.Option>
                        })}
                    </Select>
                </div>
            </div>
            <div className='paid-form editable-table'>
                <EditableTable column={props.column} getData={getTableData} oldData={[]} ablePagination={{disabled:false}} startCount={1} />
            </div>
            <div >
                <Button type='primary' onClick={onSave}>บันทึก</Button>
            </div>
        </div>
    )
}