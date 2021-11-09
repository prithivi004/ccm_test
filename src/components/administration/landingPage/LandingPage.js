// import React, { Component } from 'react'
// import { Card, Row, Col, Form, Button, Image, Table } from 'react-bootstrap'
// import CountryFlags from './CountryFlags'
// import { Link } from "react-router-dom";
// import axios from '../../utils/axiosinstance'
// import Logo from '../../img/logo-light.png'
// export default class LandingPage extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             countries: [],
//             client_list: [],
//             clients: [],
//         }
//     }

//     componentDidMount() {
//         axios.post('/country/list')
//             .then((res) => {
//                 const countries = res.data.response.country_list
//                 const countriesloc = localStorage.getItem('country').split(',')

//                 const country_list = countriesloc.map(country=> countries.find(count => count.id == country))
//                 // console.log(country_list)
//                 if(localStorage.getItem('role')=='admin'){
//                     this.setState({countries})
//                 }
//                 else{
//                 this.setState({countries:country_list})
//                 }// countriesloc.map(country => {
//                 // const data = countries.find(count => count.id == country)
//                 // if(data !== undefined){
//                 //     array.push(data)
//                 // }
//                 // })
                
//             })
//         axios.post('/client/list')
//             .then((res) => {
//                 const client_list = res.data.response.client_list
//                 this.setState({ client_list })
//                 // console.log(client_list)
//             })
//     }
//     onChange = (e) => {
//         const { name, value } = e.target;

//         if (value !== '') {
//             axios.post('/country/search', { s: value })
//                 .then((res) => {
//                     const countries = res.data.response.country_list
//                     this.setState({ countries })
//                 })
//             return
//         }
//         axios.post('/country/list')
//             .then((res) => {
//                 const countries = res.data.response.country_list
//                 this.setState({ countries })
//             })

//     }


//     countryClick = (id) => {
//         // const clients = this.state.client_list.filter(client => parseInt(client.country) === parseInt(id))
//         // this.setState({ clients })
//         localStorage.setItem('countryid',id)
//         window.location.replace('/cwr-summary')
//     }
//     render() {
//         const { countries, clients } = this.state
//         return (
//             <div>
//                 <div className="component">
//                     <h4>Country List</h4>

//                     <Row>
//                         <Col>
//                             <Card lg={4} >
//                                 <Col lg={4}>
//                                     <Form.Control
//                                         type="text"
//                                         id="search"
//                                         placeholder="Search"
//                                         onChange={this.onChange}
//                                         name="search"
//                                     />
//                                     <button className='iconButtton' >
//                                         <i className="fa fa-search" onClick={this.onSearch} ></i>
//                                     </button><br />
//                                 </Col>
//                                 <Row>
//                                 <Col lg={4}>
//                                 {countries.slice(0,Math.floor(countries.length / 2)).map((country, i) => (
//                                     <CountryFlags key={i} id={country.id} country={country.name} onChange={this.countryClick} />))}
//                                     </Col>
//                                     <Col lg={4}>
//                                     {countries.slice(Math.floor(countries.length / 2)).map((country, i) => (
//                                     <CountryFlags key={i} id={country.id} country={country.name} onChange={this.countryClick} />))}
//                                     </Col>
//                                     {/* <Col lg={4}>
//                                     {countries.slice(Math.floor(countries.length / 3),countries.length-1).map((country, i) => (
//                                     <CountryFlags key={i} id={country.id} country={country.name} onChange={this.countryClick} />))}
//                                     </Col> */}
//                                     </Row>
//                             </Card>
//                             <Card >
//                                 <Row style={{alignSelf:'center' }}>
//                                     {localStorage.getItem('role') == 'admin'?<Link to="/country"><button className='button'>Add Country</button></Link>:''}
//                                 </Row>
//                                 </Card>
//                         </Col>
                       

//                     </Row>


//                 </div>
//             </div>
//         )
//     }
// }

import React, { Component } from 'react'
import { Card, Row, Col, Form, Button, Image, Table } from 'react-bootstrap'
import CountryFlags from './CountryFlags'
import { Link } from "react-router-dom";
import axios from '../../utils/axiosinstance'
import Logo from '../../img/logo-light.png'
const LandingPage=(props)=> {

            const [countries,setCountries] = React.useState([])
            const [client_list,setClient_list] = React.useState([])
            const [clients,setClients] = React.useState([])
       

    React.useEffect(()=>{
        axios.post('/country/list')
            .then((res) => {
                const countries = res.data.response.country_list
                const countriesloc = localStorage.getItem('country').split(',')

                const country_list = countriesloc.map(country=> countries.find(count => count.id == country))
        
                if(localStorage.getItem('role')=='admin'){
                   setCountries(countries)
                }
                else{
                setCountries(country_list)
                }// countriesloc.map(country => {
                // const data = countries.find(count => count.id == country)
                // if(data !== undefined){
                //     array.push(data)
                // }
                // })
                
            })
        axios.post('/client/list')
            .then((res) => {
                const client_list = res.data.response.client_list
                setClient_list(client_list )
                // console.log(client_list)
            })
    },[])

    const onChange = (e) => {
        const { name, value } = e.target;

        if (value !== '') {
            axios.post('/country/search', { s: value })
                .then((res) => {
                    const countries = res.data.response.country_list
                   setCountries( countries )
                })
            return
        }
        axios.post('/country/list')
            .then((res) => {
                const countries = res.data.response.country_list
                setCountries( countries )
            })

    }


    const countryClick = (id) => {
        // const clients = this.state.client_list.filter(client => parseInt(client.country) === parseInt(id))
        // this.setState({ clients })
        localStorage.setItem('countryid',id)
        window.location.replace('/cwr-summary')
    }

    const gridCols = [[],[],[],[]];
  
    countries.forEach( ( country,i )=>{
          const comp = (
              <CountryFlags key={i} id={country.id} country={country.name} onChange={countryClick} />
          );
          const colNumber = i % 4;
          gridCols[colNumber].push( comp );
  
      } );
   
        return (
            <div>
                <div className="component">
                    <h4>Country List</h4>

                    <Row>
                        <Col>
                            <Card lg={4} >
                                <Col lg={3}>
                                    <Form.Control
                                        type="text"
                                        id="search"
                                        placeholder="Search"
                                        onChange={onChange}
                                        name="search"
                                    />
                                    <button className='iconButtton' >
                                        <i className="fa fa-search"  ></i>
                                    </button><br />
                                </Col>                               
                                <Row>
                               <Col lg={3}>
                                {gridCols[0]}
                                    </Col>
                                    <Col lg={3}>
                                    {gridCols[1]}
                                    </Col>
                                    <Col lg={3}>
                                    {gridCols[2]}
                                    </Col>
                                    <Col lg={3}>
                                    {gridCols[3]}
                                    </Col>
                                    </Row>
                            </Card>
                            <Card >
                                <Row style={{alignSelf:'center' }}>
                                    {localStorage.getItem('role') == 'admin'?<Link to="/country"><button className='button'>Add Country</button></Link>:''}
                                </Row>
                                </Card>
                        </Col>
                       

                    </Row>


                </div>
            </div>
        )
    }


export default LandingPage