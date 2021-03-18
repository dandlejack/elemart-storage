import { Table, Card, Descriptions, Switch, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { PaidApi } from '../../api/PaidApi'
import { ProductApi } from '../../api/ProductApi'
import { paidColumn } from '../../mocks/ColumnMocks'
import { removeDuplicate } from '../../utils/removeDuplicate'
import { EditableTable } from '../EditTable/EditableTable'
import {useAuth} from '../Auth/auth-context'
import './style.css'
import { generateExcel } from '../Excel/ExcelComponent'
interface PaidProps {
    createdDate: Date
    customer_name: string
    data_table: Array<Object>
    invoice_date: string
    invoice_id: string
    updateDate: Date
    updatedBy:string
    _id: string
}
export const PaidInfo: React.FC<{ match: any }> = ({ match }) => {
    const { id } = match.params;
    const [dataSource, setDataSource] = useState({} as PaidProps)
    const [storeDataSource, setStoreDataSource] = useState([] as any)
    const [currentUserID, setCurrentUserID] = useState('')
    const [editable, setEditable] = useState(false)
    const {myAccount} = useAuth()
    useEffect(() => {
        const localCustomerData = localStorage.getItem('customer')        
        const getPaidFromId = async (id: string) => {
            const res = await PaidApi.getPaidInvoiceById(id)
            if(localCustomerData !== null){
                const findCustomer = JSON.parse(localCustomerData).find((cusData:any)=>cusData._id === res[0].customer_name)
                console.log(findCustomer)
                res[0].customer_name = findCustomer.customer_name
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
        dataSource.customer_name = currentUserID
        await PaidApi.updatePaidInvoiceById(id,dataSource).then(res=>{
            return res
        })
        if(getProduct !== null){
            const p = JSON.parse(getProduct)
            dataSource.data_table.map(async(data:any,index:number)=>{
                const diff:any = {}
                const getProduct = await ProductApi.getProductById(data.raw_id).then(res=>{
                    return res
                })
                const filterData = getProduct[0]
                // const filterData = p.filter((pFilter:any) => pFilter._id === data.raw_id)[0]
                for(key in storeDataSource.data_table[index]){
                    if(data.hasOwnProperty(key) && key !== 'operation'){ /// compare old and update data to keep object change
                        if(data[key] !== storeDataSource.data_table[index][key]){                            
                               Object.assign(diff,data)
                        }
                    }
                }
                let oldVal = storeDataSource.data_table.find((data:any)=>data.raw_id===diff.raw_id)
                if(oldVal !== undefined){
                    if(oldVal.paid_amount > diff.paid_amount) filterData.current_amount = filterData.current_amount + (oldVal.paid_amount - diff.paid_amount)                    
                    if(oldVal.paid_amount < diff.paid_amount) filterData.current_amount -= diff.paid_amount       
                }else{
                    filterData.current_amount -= data.paid_amount
                }
                filterData.history_table.push(id)
                filterData.history_table = removeDuplicate(filterData.history_table)
                ProductApi.updateProductById(data.raw_id,filterData).then(res=>{
                    window.location.reload()
                })
                
            })
        }
    }

    const summaryData = (pageData: any) => {
        let summary = 0;
          pageData.forEach((data: any) => {
            summary += Number.parseFloat(data.total_price);
          });
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{summary}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}></Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );        
      };

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
                        generateExcel(paidColumn, dataSource.invoice_id,dataSource.data_table)
                    }
                >
                Generate Excel
                </Button>
            </div>    
            <Card>
                <Descriptions title={`${dataSource.invoice_id}`} layout="vertical" bordered>
                    <Descriptions.Item label='วันที่'>{dataSource.invoice_date}</Descriptions.Item>
                    <Descriptions.Item label='ลูกค้า'>{dataSource.customer_name}</Descriptions.Item>
                </Descriptions>
                <div className='paid-form editable-table'>
                    {editable
                    ?
                    ( 
                        <>
                        <EditableTable column={paidColumn} getData={handleData} oldData={dataSource.data_table} updateData={true} ablePagination={
                            {hideOnSinglePage:true,
                            pageSize:100}}
                            startCount={dataSource.data_table.length+1}
                            
                         />
                        <Button type='primary' style={{marginTop:15}} onClick={onUpdate} >Update</Button>
                        </>
                    )
                    :
                    (
                        <Table 
                            columns={paidColumn} 
                            dataSource={dataSource.data_table} 
                            bordered
                            pagination={false}
                            summary={tableData=>summaryData(tableData)}
                            />
                    )}
                </div>
            </Card>
        </div>
    </>
}