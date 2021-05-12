import {useState,useEffect} from 'react'
import {Button, Input} from 'antd'
import { CustomerApi } from '../../api/CustomerApi'
export const CustomerForm:React.FC = () =>{
    const [customerName, setCustomerName] = useState('')
    const [showHaveAccount, setShowHaveAccount] = useState(false)
    const onSave = async () =>{
        const obj:any = {
            customer_name :customerName
        }
        const res = await CustomerApi.insertCustomer(obj)
        if(typeof(res.data) === 'string'){
            setShowHaveAccount(true)
        }else{
            window.location.reload()
        }
    }
    return <div>
        <div>
            <span>ชื่อลูกค้า</span>
            <Input onChange={e=>setCustomerName(e.target.value)} style={{width:'100%',marginLeft:15}} />
        </div>
        <div style={{margin:'15px auto',textAlign:'center'}}>
            <Button type='primary' onClick={onSave}>Submit</Button>
        </div>
        {showHaveAccount? <span style={{color:'red'}}>มีชื่อลูกค้ารายนี้แล้ว</span>:null}
    </div>
}