import {CustomerApi} from '../api/CustomerApi'

export const loadCustomers = (limitPage: any) => {
    CustomerApi.getCustomer((res:any)=>{
        console.log(res)
    }).then((result:any)=>{
        console.log(result)
        return result
    })
  };