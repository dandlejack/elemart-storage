import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, Layout, Popconfirm, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductApi } from '../../api/ProductApi'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { ProductForm } from '../../components/ProductForm/ProductForm'
import { productMocks } from '../../mocks/ProductMocks'
import { addFilter } from '../../components/FilterTables/FilterTables'

const { Header } = Layout

const onCancel = (e: any) => { };
const onConfirm = (id: string) => {
    ProductApi.deleteProductById(id);
    window.location.reload();
};
const column = [
    {
        title: 'รหัสสินค้า',
        dataIndex: 'product_id',
        dataType: 'string',
        key: 'product_id',
    },
    {
        title: 'ชื่อสินค้า',
        dataIndex: 'product_name',
        dataType: 'string',
        key: 'product_name',
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => <>
            <Link to={'/product/' + record._id}>
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

export const ProductPage: React.FC = () => {
    const [dataSource, setDataSource] = useState({
        data: [],
        message: '',
        pageNumber: 1,
        totalDocument: 1,
        totalPage: 1,
        pageSize: 20
    })
    const [fetchInput, setFetchInput] = useState({
        searchType: 'product_id',
        inputData: ''
    })
    const [modalVisible, setModalVisible] = useState(false)

    const fetchDefaultProductData = async () => {
        const res = await ProductApi.getAllProduct({
            limitPage: dataSource.pageSize,
            pageNumber: dataSource.pageNumber
        })
        return res
    }

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetchDefaultProductData()
            setDataSource(res)
        }
        fetchProduct()
        return () => {
            console.log('unmount')
        }
    }, [])


    useEffect(() => {
        const fetchProduct = async () => {
            if (fetchInput.inputData === '') {
                const res = await fetchDefaultProductData()
                setDataSource(res)
            } else {
                const result = await ProductApi.getAllProduct({
                    limitPage: dataSource.pageSize,
                    pageNumber: dataSource.pageNumber,
                    filterObject: { product_id: { '$regex': `.*${fetchInput.inputData}.*` } }
                }).then(res => {
                    setDataSource(res)
                    return res.data
                })
            }

        }
        fetchProduct()
        return () => {
            console.log('unmount')
        }
    }, [dataSource.pageNumber])

    const handleClose = () => {
        setModalVisible(false)
    }

    const handleClick = async () => {
        if (fetchInput.searchType === 'product_id') {
            const result = await ProductApi.searchProduct({
                filterObject: { product_id: { '$regex': `.*${fetchInput.inputData}.*` } }
            }).then(res => {
                setDataSource(res)
                return res.data
            })
            return result
        } else {
            const result = await ProductApi.searchProduct({
                filterObject: { product_name: { '$regex': `.*${fetchInput.inputData}.*` } }
            }).then(res => {
                setDataSource(res)
                return res.data
            })
            return result
        }
    }

    const handleReset = async () => {
        setFetchInput(
            {
                inputData: '',
                searchType: fetchInput.searchType
            }
        )
        const res = await fetchDefaultProductData()
        setDataSource(res)

    }
    return <div key='invoice-page' className={'invoice-page'}>
        <div style={{ marginTop: 15 }}>
            <div style={{ display: 'inline-block', float: 'right', marginRight: 15 }}>
                <Button type='primary' onClick={e => setModalVisible(true)}><PlusOutlined twoToneColor="#eb2f96" /></Button>
            </div>
            <div>
                <Select defaultValue='product_id' style={{ marginRight: 10, marginLeft: 15 }} onChange={e => setFetchInput({
                    searchType: e,
                    inputData: fetchInput.inputData
                })} >
                    <Select.Option value='product_id'>รหัสสินค้า</Select.Option>
                    <Select.Option value='product_name'>ชื่อสินค้า</Select.Option>
                </Select>
                <Input style={{ width: 200, marginRight: 10 }} value={fetchInput.inputData} onChange={e => setFetchInput({
                    searchType: fetchInput.searchType,
                    inputData: e.target.value.toUpperCase()
                })} onPressEnter={handleClick} />
                <Button style={{ marginRight: 10 }} type='primary' onClick={handleClick} >ค้นหา</Button>
                <Button type='primary' danger onClick={handleReset} >RESET</Button>
            </div>
        </div>
        <CustomModal modalTitle='สินค้า' modalType="received-invoice" modalForm={<ProductForm />} modalWidth={380} modalVisible={modalVisible} getClose={handleClose} />
        <Table
            style={{ margin: '15px 15px' }}
            bordered
            dataSource={dataSource.data}
            columns={column}
            pagination={{
                onChange: (page: any, pageSize: any) => {
                    setDataSource({
                        ...dataSource,
                        pageNumber: page,
                        pageSize: pageSize
                    })
                },
                current: dataSource.pageNumber,
                total: dataSource.totalDocument,
                pageSize: dataSource.pageSize,
                defaultCurrent: 1,
                defaultPageSize: dataSource.pageSize,
                pageSizeOptions: ['20', '50', '100', '250']
            }}
        />
    </div>
}