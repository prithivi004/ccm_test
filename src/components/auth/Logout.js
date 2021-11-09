import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

export default function Logout() {
    const history = useHistory();

    useEffect(() => {

        axios.get('https://ccmanagement.group/quote_api/public/login/logout',{
            auth: {
                username: 'ccm_auth',
                password: 'ccm_digi123#'
                }
        }) .then((res) => {
                // console.log(res);
                const data = res.data
                if (data.response.is_login === false) {
                    // console.log('loged out')
                }
            })
        localStorage.removeItem('access_token')
        localStorage.removeItem('isLogin')
        localStorage.removeItem('user_details')
        localStorage.removeItem('country')
        localStorage.removeItem('countryid')
        localStorage.removeItem('role')
        history.push('/')

    });
    return <div>logout</div>
}
