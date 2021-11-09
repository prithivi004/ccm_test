import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_URL}`
// const baseUrl = `https://tamilmaligai.com/ccm/api1/public`

 const axiosInstance = axios.create({
    baseURL : baseUrl,
    headers : {
        Authorization : {
            username: 'ccm_auth',
            password: 'ccm_digi123#'
            }
        },
        params:{
            access_token:localStorage.getItem('access_token')
        }
       
    }
)
export default axiosInstance;
