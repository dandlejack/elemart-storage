import { Table, Card, Descriptions, Button, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { PaidApi } from '../../api/PaidApi'
import { ProductApi } from '../../api/ProductApi'
import { ReceivedApi } from '../../api/ReceivedApi'
import { receivedColumn } from '../../mocks/ColumnMocks'
import { removeDuplicate } from '../../utils/removeDuplicate'
import { EditableTable } from '../EditTable/EditableTable'
import {useAuth} from '../Auth/auth-context'
import './style.css'
import { generateExcel } from '../Excel/ExcelComponent'
interface ReceivedProps {
    createdDate: Date
    seller: string
    data_table: Array<Object>
    invoice_date: string
    invoice_id: string
    updateDate: Date
    received_description?: string
    updatedBy:string
    _id: string
}
export const ReceivedInfo: React.FC<{ match: any }> = ({ match }) => {
    const { id } = match.params;
    const [dataSource, setDataSource] = useState({} as ReceivedProps)
    const [storeDataSource, setStoreDataSource] = useState([] as any)
    const [currentUserID, setCurrentUserID] = useState('')
    const [editable, setEditable] = useState(false)
    const {myAccount} = useAuth()
    
    useEffect(() => {
        const localCustomerData = localStorage.getItem('customer')
        const getPaidFromId = async (id: string) => {
            const res = await ReceivedApi.getReceivedInvoiceById(id)
            if(localCustomerData !== null){
                const findCustomer = JSON.parse(localCustomerData).find((cusData:any)=>cusData._id === res[0].seller)
                res[0].seller = findCustomer.customer_name
                setDataSource(res[0])
                setCurrentUserID(findCustomer._id)
                setStoreDataSource(JSON.parse(JSON.stringify(res[0])))
            }
        }
        getPaidFromId(id)
        return () => {

        }
    }, [id])

    useEffect(() => {
        async function fetchProduct() {
            if(editable){
                const response = await ProductApi.getAllProduct({
                    limitPage:100
                })
                localStorage.setItem('product',JSON.stringify(response))
            }
        }
        fetchProduct()
        return () => {
            console.log('unmount')
        }
    }, [editable])

    const handleData = (data:Array<Object>) =>{
        dataSource.data_table = data
    }

    const onUpdate = async() => {
        const { id } = match.params;
        const getProduct = localStorage.getItem('product')        
        let key
        const cpMyAccount = JSON.parse(JSON.stringify(myAccount))
        dataSource.updatedBy = cpMyAccount.me
        dataSource.seller = currentUserID
        await ReceivedApi.updateReceivedInvoiceById(id,dataSource).then(res=>{
            return res
        })

        if(getProduct !== null){
            dataSource.data_table.map(async(data:any,index:number)=>{
                const diff:any = {}
                const getProduct = await ProductApi.getProductById(data.raw_id).then(res=>{
                    return res
                })
                const filterData = getProduct[0]
                for(key in storeDataSource.data_table[index]){
                    if(data.hasOwnProperty(key) && key !== 'operation'){ /// compare old and update data to keep object change
                        if(data[key] !== storeDataSource.data_table[index][key]){                            
                               Object.assign(diff,data)
                        }
                    }
                }
                let oldVal = storeDataSource.data_table.find((data:any)=>data.raw_id===diff.raw_id)
                if(oldVal !== undefined){
                    if(diff.received_amount > oldVal.received_amount  ) filterData.current_amount = filterData.current_amount + (diff.received_amount - oldVal.received_amount)                    
                    if(diff.received_amount < oldVal.received_amount  ) filterData.current_amount -= diff.received_amount       
                }else{
                    filterData.current_amount += data.received_amount
                }
                filterData.history_table.push(id)
                filterData.history_table = removeDuplicate(filterData.history_table)
                ProductApi.updateProductById(data.raw_id,filterData).then(res=>{
                    window.location.reload()
                })
                
            })
        }
    }

    return <>
        <div className='paid-content'>
        <div className='switch-style'>
                <Switch checkedChildren={'ยกเลิก'} unCheckedChildren={'แก้ไข'} onChange={(e)=>setEditable(e)} />
            </div>
            <div>
                <Button
                    type='primary'
                    style={{backgroundColor:'#2ec500',borderRadius:'5px',marginBottom:15}}
                    onClick={e =>
                        generateExcel(receivedColumn, dataSource.invoice_id,dataSource.data_table)
                    }
                >
                Generate Excel
                </Button>
            </div> 
            <Card>
                <Descriptions title={`${dataSource.invoice_id}`} layout="vertical" bordered>
                    <Descriptions.Item label='วันที่' span={2}>{dataSource.invoice_date}</Descriptions.Item>
                    <Descriptions.Item label='ลูกค้า' span={2}>{dataSource.seller}</Descriptions.Item>
                    <Descriptions.Item span={3} label='รายละเอียด' >{dataSource.received_description}</Descriptions.Item>
                </Descriptions>
                <div className='paid-form editable-table'>
                {editable
                    ?
                    ( 
                        <>
                        <EditableTable column={receivedColumn} getData={handleData} oldData={dataSource.data_table} updateData={true} ablePagination={
                            {hideOnSinglePage:true,
                            pageSize:100}}
                            startCount={dataSource.data_table.length+1}
                            
                         />
                        <Button type='primary' style={{marginTop:15}} onClick={onUpdate} >Update</Button>
                        </>
                    )
                    :
                    (<Table columns={receivedColumn} dataSource={dataSource.data_table} bordered pagination={false} />)
                }
                </div>
            </Card>
        </div>
    </>
}