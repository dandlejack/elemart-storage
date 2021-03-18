import {BACKEND_API} from '../config'
import axios from 'axios'
export class PaidApi {
    static PAID_API_URL = `${BACKEND_API}/paid`
    
    static async getPaidInvoice(params:any) {
        try {
            const result = await axios.get(this.PAID_API_URL+'/findall', {
              params,
            });            
            return result.data;
          } catch {
            alert('Cannot fetch data');
            return [];
          }
    }

    static async insertInvoice(data:object) {
        const result = await axios.post(this.PAID_API_URL,data).then(response => {
            return response;
          });
        return result.data;
    }

    static async getPaidInvoiceById(id:string){
      try {
        const result = await axios.get(this.PAID_API_URL+'/'+id);
        return result.data;
      } catch {
        alert('Cannot fetch data');
        return [];
      }
    }

    static async updatePaidInvoiceById(id:string,data:object){
      const result = await axios.put(this.PAID_API_URL+'/'+id,data).then(response => {
        return response;
      });
    }

    static async deleteInvoiceById(id:string){
      await axios.delete(this.PAID_API_URL+'/'+id)
    }
}