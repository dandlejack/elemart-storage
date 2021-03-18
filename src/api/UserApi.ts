import { BACKEND_API } from '../config'
import axios from 'axios'

interface UserData {
    username:string;
    password:string;
}

export class UserApi {
    static async getAllUsers() {
        try {
            const result = await axios.get(BACKEND_API + '/findall');
            return result.data;
        } catch {
            alert('Cannot fetch data');
            return [];
        }
    }

    static async Login(data:UserData) {
        try {
            const result = await axios.post(`${BACKEND_API}/auth/login`,data).then(res=>{
                return res.data
            })
            console.log(result)
            return result
        } catch {
            
        }
    }
}