import React, { Children, useEffect, useReducer, useState } from 'react'
import Cookie from 'js-cookie'
import { UserApi } from '../../api/UserApi'
export interface AuthProps {
    signIn:Function;
    signOut:Function;
    myAccount:Object;
    setMyAccount:Function;
}

export const AuthContext = React.createContext<AuthProps>({
    signIn: () => null,
    signOut: () => null,
    myAccount: {
        me:'',
        login:false
    },
    setMyAccount:() =>null
})

export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }:any) => {
    
    const [checkLogin,setLogin] = useState(false)
    const [userData,setUserData] = useState('')
    const [myAccount,setMyAccount] = useState({
        me:'',
        login:false
    })

    useEffect(()=>{
        const checkCookie = Cookie.get('profile')
        if(checkCookie!== undefined){
            const profile = JSON.parse(checkCookie)
            setMyAccount({
                me:profile.username,
                login:true
            })
        }else{
            setMyAccount({
                me:'',
                login:false
            })
        }
    },[])

    const signIn = async (data:any) => {
        setLogin(true)
        const result = await UserApi.Login(data).then(res=>{
            return res
        })
        if(result.msg === 'username or password wrong'){
            return result.msg
        }else{
            Cookie.set('profile',JSON.stringify(result.user))
            setMyAccount({
                me:result.user,
                login:true
            })
            return result.user
        }
    }
    const signOut = () => {            
        Cookie.remove('profile')
        return 'sign out'
    }
    return (
        <AuthContext.Provider value={{myAccount,setMyAccount,signIn,signOut}}>
            {children}
        </AuthContext.Provider>
    )
}