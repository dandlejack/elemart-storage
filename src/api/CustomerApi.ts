import { BACKEND_API } from '../config'
import axios from 'axios'
export class CustomerApi {
  static CUSTOMER_API_URL = `${BACKEND_API}/customer`

  static async getCustomer(params: any) {
    try {
      const result = await axios.get(this.CUSTOMER_API_URL + '/findall', {
        params,
      });
      return result.data;
    } catch {
      alert('Cannot fetch data');
      return [];
    }
  }

  static async getAllCustomer() {
    try {
      const result = await axios.get(this.CUSTOMER_API_URL + '/findall');
      return result.data;
    } catch {
      alert('Cannot fetch data');
      return [];
    }
  }

  static async insertCustomer(customerName: object) {
    const result = await axios.post(this.CUSTOMER_API_URL, customerName).then(response => {
      return response;
    });
    return result;
  }

  static async getCustomerById(id: string) {
    const result = await axios.get(this.CUSTOMER_API_URL + '/' + id).then(res => {
      return res
    })
    return result.data
  }

  static async deleteCustomerById(id:string){
    await axios.delete(this.CUSTOMER_API_URL+'/'+id)
  }

}