import React,{useEffect} from 'react'
import {useAuth} from '../Auth/auth-context'

export const LogoutComponent:React.FC = () => {
    const {signOut,setMyAccount} = useAuth()
    useEffect(()=>{
        setMyAccount({
            me:'',
            login:false
        })
    },[])
    return  signOut()
}