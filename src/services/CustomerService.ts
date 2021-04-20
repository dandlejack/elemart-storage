import {CustomerApi} from '../api/CustomerApi'

export const loadCustomers = (limitPage: any) => {
    CustomerApi.getCustomer((res:any)=>{
    }).then((result:any)=>{
        return result
    })
  };