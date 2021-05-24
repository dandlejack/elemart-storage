import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from '../Auth/auth-context';
import Cookie from 'js-cookie'
export const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const { myAccount } = useAuth()
    const cpAccount = JSON.parse(JSON.stringify(myAccount))
    const getCookie = Cookie.get('profile')

    return (
        <Route {...rest} render={routeProps => (
            cpAccount.login || getCookie !== undefined ? <Component {...routeProps} /> : <Redirect to='/login' />
        )
        } />
    )
}