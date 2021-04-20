import {BACKEND_API} from '../config'
import axios from 'axios'
export class ProductApi {
    static PRODUCT_API_URL = `${BACKEND_API}/product`
    
    static async getProduct(params:any) {
        try {
            const result = await axios.get(this.PRODUCT_API_URL+'/findall', {
              params,
            });            
            return result.data;
          } catch {
            alert('Cannot fetch data');
            return [];
          }
    }

    static async getAllProduct(params:any) {
      try {
          const result = await axios.get(this.PRODUCT_API_URL+'/findall',{
            params,
          });
          return result.data;
        } catch {
          alert('Cannot fetch data');
          return [];
        }
    }
    
    static async insertProduct(data:object) {
        const result = await axios.post(this.PRODUCT_API_URL,data).then(response => {
            return response;
          });
        return result;
    }

    static async updateProductById(id:string,data:any){
      const result = await axios.put(this.PRODUCT_API_URL+'/'+id,data).then(response=>{
        return response
      })
      return result
    }

    static async getProductById(id:string){
      try {
        const result = await axios.get(this.PRODUCT_API_URL+'/'+id);            
        return result.data;
      } catch {
        alert('Cannot fetch data');
        return [];
      }
    }

    static async deleteProductById(id:string){
      await axios.delete(this.PRODUCT_API_URL+'/'+id)
    }
}