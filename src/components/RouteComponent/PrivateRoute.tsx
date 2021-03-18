import React from 'react'
import {Redirect,Route} from 'react-router-dom'
import { useAuth } from '../Auth/auth-context';

export const PrivateRoute = ({component : Component, ...rest}:any) => {
    const {myAccount} = useAuth()
    const cpAccount = JSON.parse(JSON.stringify(myAccount))
    return(
        <Route {...rest} render={routeProps => (
            cpAccount.login ? <Component {...routeProps}/> : <Redirect to='/login'/>
        )} />
    )
}