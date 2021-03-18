
import { Button, DatePicker, Input, InputNumber, Select } from 'antd'
import {useEffect,useState} from 'react'
import { CustomerApi } from '../../api/CustomerApi'
import { PaidApi } from '../../api/PaidApi'
import { ProductApi } from '../../api/ProductApi'
import { useAuth,AuthContext, AuthProps } from '../Auth/auth-context'
import {EditableTable} from '../EditTable/EditableTable'

export const ProductForm:React.FC = props => {
    const au = useAuth()
    const [product, setProduct] = useState('')
    const [productId, setProductId] = useState('')
    const [productAmount, setProductAmount] = useState(0)
    const onSave = async () =>{
        const cpUser = JSON.parse(JSON.stringify(au))
        const allData = {
            product_name: product,
            product_id:productId,
            current_amount:productAmount ,
            createdBy : cpUser.myAccount.me._id ,
            history_table:[],
        }
        console.log(allData)
        // ProductApi.insertProduct(allData).then(res=>{
        //     window.location.reload()
        // })
        
    }
    console.log(au.myAccount)

    return (
        <div className='paid-content'>
            <div className='paid-form invoice-form'>
                    <span>รหัสสินค้า</span>
                    <div>
                        <Input className={'input-width'} onChange={e=>setProductId(e.target.value)} />
                    </div>           
            </div>
            <div className='paid-form product-form'>    
                <span>ชื่อสินค้า</span>
                <div>
                    <Input className={'input-width'} onChange={e=>setProduct(e.target.value)} />
                </div>
            </div>
            <div className='paid-form product-form'>
                <span>จำนวน</span>
                <div>
                    <InputNumber min={0} className={'input-width'} onChange={(e:any)=>setProductAmount(e)} />
                </div>
            </div>
            <div >
                <Button type='primary' onClick={onSave}>บันทึก</Button>
            </div>
        </div>
    )
}