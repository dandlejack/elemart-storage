import { Table, Card, Descriptions, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { PaidApi } from '../../api/PaidApi'
import { ProductApi } from '../../api/ProductApi'
import { ReceivedApi } from '../../api/ReceivedApi'
import { productDetailColumn } from '../../mocks/ColumnMocks'
import { generateExcel } from '../Excel/ExcelComponent'
import './style.css'
interface ProductProps {
    createdDate: Date
    product_id: string
    product_name: string
    history_table: Array<string>
    current_amount: number
    updateDate: Date
    raw_id: string
}
export const ProductInfo: React.FC<{ match: any }> = ({ match }) => {
    const [dataSource, setDataSource] = useState([] as Array<Object>)
    const [storeFetchData, setStoreFetchData] = useState([] as Array<Object>)
    const [productData, setProductData] = useState({} as ProductProps)
    const [productID, setProductID] = useState('')
    useEffect(() => {
        const { id } = match.params;
        const getProductFromId = async (id: string) => {
            const res = await ProductApi.getProductById(id)
            setProductData(res[0])
        }
        getProductFromId(id)
        setProductID(id)
        return () => {

        }
    }, [match])

    useEffect(() => {
        if (productData.history_table !== undefined) {
            const len = productData.history_table.length
            if (productData.history_table.length > 0) {
                const storeData: object[] = []
                const fetchPaid = async (id: string, index: number) => {
                    const res = await PaidApi.getPaidInvoiceById(id).then(re => {

                        if (re.length > 0) storeData.push(re[0])
                        return storeData
                    })
                    if (index + 1 === productData.history_table.length) {
                        // setStoreFetchData(res)
                        return res
                    }
                }
                const fetchReceived = async (id: string, index: number) => {
                    const res = await ReceivedApi.getReceivedInvoiceById(id).then(re => {
                        if (re.length > 0) storeData.push(re[0])
                        return storeData
                    })
                    if (index + 1 === productData.history_table.length) {
                        // setStoreFetchData(res)
                        return res
                    }
                }
                const ts = async () => {
                    const t: any[] = []
                    await productData.history_table.map(async (id: string, index: number) => {
                        const re2 = await fetchReceived(id, index)
                        const re = await fetchPaid(id, index)
                        if (re2 !== undefined && re !== undefined) {
                            setStoreFetchData(re2)
                        }
                        return re2
                    })
                }
                ts()
            }
        }
        return () => {

        }
    }, [productData])

    useEffect(() => {
        const store: any[] = []

        storeFetchData.map((data: any) => {
            const storeObj: any = {}
            if (data.seller !== undefined) {
                Object.assign(storeObj, { invoice_date: data.invoice_date, invoice_id: data.invoice_id, seller: data.seller })
            } else {
                Object.assign(storeObj, { invoice_date: data.invoice_date, invoice_id: data.invoice_id, customer_name: data.customer_name })
            }
            data.data_table.map((inTable: any) => {
                if (productID === inTable.raw_id) {
                    if (inTable.received_amount !== undefined) {
                        // Object.assign(storeObj, { product_price: inTable.product_price, received_amount: inTable.received_amount, paid_amount: 0, total_price: inTable.total_price })
                        Object.assign(storeObj, { product_price: 0, received_amount: inTable.received_amount, paid_amount: 0, total_price: 0 })
                    } else {
                        // Object.assign(storeObj, { product_price: inTable.product_price, received_amount: 0, paid_amount: inTable.paid_amount, total_price: inTable.total_price })
                        Object.assign(storeObj, { product_price: 0, received_amount: 0, paid_amount: inTable.paid_amount, total_price: 0 })
                    }
                }

            })
            store.push(storeObj)
        })
        setDataSource(store)
    }, [storeFetchData])

    const summaryData = (pageData: any) => {
        let total = 0;
        let buy = 0
        let paid = 0
        pageData.forEach((data: any) => {
            buy += data.received_amount
            paid += data.paid_amount
            if (data.paid_amount > 0) {
                total += Number.parseFloat(data.total_price);
            } else if (data.received_amount > 0) {
                total -= Number.parseFloat(data.total_price);
            }
        });
        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>คงเหลือ</Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>{buy + ' - ' + paid + ' = ' + (buy - paid)}</Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>{ }</Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell index={5} className='' >{total}</Table.Summary.Cell>
                </Table.Summary.Row>
            </>
        );
    };

    return <>
        <div className='paid-content'>
            <div>
                <Button
                    type='primary'
                    style={{ backgroundColor: '#2ec500', borderRadius: '5px', marginBottom: 15 }}
                    onClick={e =>
                        generateExcel(productDetailColumn, productData.product_id+'--'+productData.product_name, dataSource)
                    }
                >
                    Generate Excel
                </Button>
            </div>
            <Card>
                <Descriptions title={`${productData.product_id} : ${productData.product_name}`} layout="vertical" bordered>
                    <Descriptions.Item label='จำนวนคงเหลือ'>{productData.current_amount}</Descriptions.Item>
                </Descriptions>
                <div className='paid-form editable-table'>
                    <Table
                        rowKey={(record: any) => record.invoice_id}
                        columns={productDetailColumn}
                        dataSource={dataSource}
                        bordered
                        pagination={false}
                        summary={tableData => summaryData(tableData)}
                        rowClassName={(record: any, index: any) => (record.received_amount > 0 ? "red" : "green")}
                    />
                </div>
            </Card>
        </div>
    </>
}