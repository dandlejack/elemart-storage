import { PlusOutlined } from '@ant-design/icons'
import {Button, Input, Layout, Popconfirm, Table} from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductApi } from '../../api/ProductApi'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { ProductForm } from '../../components/ProductForm/ProductForm'
import { productMocks } from '../../mocks/ProductMocks'
import {addFilter} from '../../components/FilterTables/FilterTables'
const {Header} = Layout

const column = [
    {
        title:'รหัสสินค้า',
        dataIndex:'product_id',
        dataType:'string',
        key:'product_id',
        ...addFilter('product_id')
    },
    {
        title:'ชื่อสินค้า',
        dataIndex:'product_name',
        dataType:'string',
        key:'product_name',
        ...addFilter('product_name')
    },
    {
        title:'Operation',
        dataIndex:'operation',
        key:'operation',
        render:(text:string,record:any)=><>
        <Link to={'/product/'+record._id}>
            <Button type='primary'>ดูรายละเอียด</Button>
        </Link>
        </>
    }
]

export const ProductPage:React.FC = () => {
    const [dataSource, setDataSource] = useState({
        data:[],
        message:'',
        pageNumber:1,
        totalDocument:1,
        totalPage:1,
        pageSize:20
    })
    const [modalVisible, setModalVisible] = useState(false)
    useEffect(() => {
        const fetchProduct = async() => {
            const res = await ProductApi.getAllProduct({
                limitPage:dataSource.pageSize,
                pageNumber:dataSource.pageNumber
            })
            setDataSource(res)
        }
        fetchProduct()
        return () => {
            console.log('unmount')
        }
    }, [])

    // useEffect(() => {
    //     const fetchProduct = async() => {
    //         const res = await ProductApi.getAllProduct({
    //             limitPage:dataSource.pageSize,
    //             pageNumber:dataSource.pageNumber
    //         })
    //         setDataSource(res)
    //     }
    //     fetchProduct()
    //     return () => {
    //         console.log('unmount')
    //     }
    // }, [dataSource.pageNumber])

    // useEffect(() => {        
    //     const fetchProduct = async() => {
    //         const res = await ProductApi.getAllProduct({
    //             limitPage:dataSource.pageSize,
    //             pageNumber:dataSource.pageNumber
    //         })
    //         setDataSource(res)
    //     }
    //     if(dataSource.pageSize !== undefined){
    //         fetchProduct()            
    //     }
    //     return () => {
    //         console.log('unmount')
    //     }
    // }, [dataSource.pageSize])

    const handleClose = () =>{
        setModalVisible(false)
    }
    return <div key='invoice-page' className={'invoice-page'}>
    <div style={{ marginTop: 15 }}>
        <div style={{ display: 'inline-block', float: 'right', marginRight: 15 }}>
            <Button type='primary' onClick={e => setModalVisible(true)}><PlusOutlined twoToneColor="#eb2f96" /></Button>
        </div>
    </div>
    <CustomModal modalTitle='สินค้า' modalType="received-invoice" modalForm={<ProductForm />} modalWidth={380} modalVisible={modalVisible} getClose={handleClose} />
    <Table
        style={{ margin: '15px 15px' }}
        bordered
        dataSource={dataSource.data}
        columns={column}
        pagination={{
            onChange:(page:any,pageSize:any)=>{
                setDataSource({
                    ...dataSource,
                    pageNumber:page,
                    pageSize:pageSize
                })
            },
            current:dataSource.pageNumber,
            total:dataSource.totalDocument,
            pageSize:dataSource.pageSize,
            defaultCurrent:1,
            defaultPageSize:dataSource.pageSize,
            pageSizeOptions:['20','50','100','250']
        }}            
    />
</div>
}