import { Table, Card, Descriptions, Switch, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomerApi } from '../../api/CustomerApi'
import { PaidApi } from '../../api/PaidApi'
import { ProductApi } from '../../api/ProductApi'
import { ReceivedApi } from '../../api/ReceivedApi'
import { mergeAllInvoice, paidColumn, productDetailColumn } from '../../mocks/ColumnMocks'
import {generateExcel} from '../Excel/ExcelComponent'
import './style.css'
interface PaidProps {
    createdDate: Date
    customer_name: string
    data_table: Array<Object>
    invoice_date: string
    invoice_id: string
    updateDate: Date
    _id: string
}
export const CustomerInfo: React.FC<{ match: any }> = ({ match }) => {
    const { id } = match.params;
    const [dataSource, setDataSource] = useState({} as PaidProps)
    const [customerName, setCustomerName] = useState('')
    const [storeDataSource, setStoreDataSource] = useState([] as any)
    const [editable, setEditable] = useState(false)
    useEffect(() => {
        const localCustomerData = localStorage.getItem('customer')
        if(localCustomerData !== null){
            const findCustomer = JSON.parse(localCustomerData).find((cusData:any)=>cusData._id === id)
            setCustomerName(findCustomer.customer_name)
        }

        const getCustomerInvoice = async (id: string) => {
            const storeData: any = []
            let count = 0
            const receivedInvoice = await ReceivedApi.getAllReceivedInvoice({
                filterObject: {
                    seller: id
                }
            })

            const paidInvoice = await PaidApi.getPaidInvoice({
                filterObject: {
                    customer_name: id
                }
            })
            receivedInvoice.data.map((ivData: any) => {
                ivData.data_table.map((dataTable: any) => {
                    Object.assign(dataTable, {_id:ivData._id, invoice_date: ivData.invoice_date, invoice_id: ivData.invoice_id, invoice_type: 'รับ', key: count })
                    storeData.push(dataTable)
                    count++
                })
            })

            paidInvoice.data.map((ivData: any) => {
                ivData.data_table.map((dataTable: any) => {
                    Object.assign(dataTable, {_id:ivData._id, invoice_date: ivData.invoice_date, invoice_id: ivData.invoice_id, invoice_type: 'ขาย', key: count })
                    storeData.push(dataTable)
                    count++
                })
            })
            
            setDataSource({
                ...dataSource,
                data_table: storeData
            })
        }
        getCustomerInvoice(id)
        return () => {

        }
    }, [id])

    useEffect(() => {
        async function fetchProduct() {
            if (editable) {
                const response = await ProductApi.getAllProduct({
                    limitPage: 100
                })
                localStorage.setItem('product', JSON.stringify(response))
            }
        }
        fetchProduct()
        return () => {
        }
    }, [editable])

    const summaryData = (pageData: any) => {
        let summary = 0;
        pageData.forEach((data: any) => {
            summary += Number.parseFloat(data.total_price);
        });
        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>Total : {summary}</Table.Summary.Cell>
                </Table.Summary.Row>
            </>
        );
    };
    return <>
        <div className='paid-content'>
            <div>
                <Button
                    type='primary'
                    style={{backgroundColor:'#2ec500',borderRadius:'5px',marginBottom:15}}
                    onClick={e =>
                        generateExcel(mergeAllInvoice, customerName,dataSource.data_table)
                    }
                >
                Generate Excel
                </Button>
            </div>            
            <Card>
                <div className='paid-form editable-table'>
                    <Descriptions title={`ลูกค้า ${customerName}`}></Descriptions>
                    <Table
                        columns={mergeAllInvoice}
                        dataSource={dataSource.data_table}
                        bordered
                        pagination={false}
                        summary={tableData => summaryData(tableData)}
                    />
                </div>
            </Card>
        </div>
    </>
}