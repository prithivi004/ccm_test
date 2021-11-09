// import React, { Component } from 'react'
// import { Bar, Pie } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import {
//     Container,
//     Card,
//     Form,
//     Row,
//     Col,
//     Button,
//     Image,
//     DropdownButton,
//     Dropdown,
//     Spinner,
// } from 'react-bootstrap';
// import { PieOptions } from './ChartData'
// import axiosInstance from '../../utils/axiosinstance'
// import { DateFormat } from '../../utils/DateFormat'
// import { DateFilter } from '../../utils/DateFilter'
// import Curreny from 'currency-codes'
// import { CurrencyConvertor } from '../../utils/Calculator'

// export class ChartCard extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             fromDate: '',
//             currency: 'INR',
//             country:'', 
//             client:'',
//             toDate: DateFormat(new Date()),
//             client_labels: ["Total", "Received", "Remaining"],
//             cont_labels: ["Total", "Paid", "Remaining"],
//         }
//     }
//     componentDidMount() {
//         const { fromDate, user, currency_list, currency, margin, country, client} = this.props
//         // //console.log(data,"data")
//         this.setState({ fromDate, user, currency_list, currency, margin,country, client,toDate:DateFormat(new Date()) })
//         const data = { from_date: fromDate, to_date: DateFormat(new Date()), country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
//         // //console.log(data, 'calender')            
//         axiosInstance.post(`/dashboard/chart`, data)
//             .then((res) => {
//                 const chart_list = res.data.response.chart_list
//                 //console.log(chart_list,"Date")
//                 const data = CurrencyConvertor(currency, chart_list, currency_list)
//                 this.setState({ data: data[user], margin: data.margin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), currency, user, country, client })
//             })
//     }
//     componentDidUpdate() {
//         const { user, currency,country, client } = this.props
//         const { fromDate, toDate, currency_list, } = this.state

//         if (currency !== this.state.currency ||country !== this.state.country || client !== this.state.client) {
 
//             const data = { from_date: fromDate, to_date: toDate, country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
//             //console.log(data, 'calender')            
//             axiosInstance.post(`/dashboard/chart`, data)
//                 .then((res) => {
//                     const chart_list = res.data.response.chart_list
//                     //console.log(chart_list,"Date")
//                     const data = CurrencyConvertor(currency, chart_list, currency_list)
//                     this.setState({ data: data[user], margin: data.margin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), currency, user, country, client })
//                 })
//         }
//     }

//     onChange = (e) => {
//         this.setState({ [e.target.name]: e.target.value },()=>this.DateFilter())
//     }
//     DateFilter = () => {
//         const { fromDate, invoice, currency_list, currency, user,country,client,toDate } = this.state;
//         // const { value, name } = e.target

//         // if (fromDate !== '' && value !== '') {
//             const data = { from_date: fromDate, to_date:toDate , country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }

//             axiosInstance.post(`/dashboard/chart`, data)
//                 .then((res) => {
//                     const chart_list = res.data.response.chart_list
//                     const data = CurrencyConvertor(currency, chart_list, currency_list)
//                     this.setState({ data: data[user], margin: data.margin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
//                 })
//         // }
//         // this.setState({ [name]: value })
//     }
//     render() {
//         const { labels, data, fromDate, toDate, client_labels, cont_labels, margin } = this.state;
//         //console.log(data)
//         const dataset = {
//             labels: this.props.user === 'client' ? client_labels : cont_labels,
//             datasets: [
//                 {
//                     data: data,
//                     toolTipContent: "{label}:${data}",
//                     borderWidth: 1,
//                     backgroundColor: [
//                         '#9B9D9F',
//                         '#438EEB',
//                         '#FD7F59',
//                     ],
//                 }],
//         }
//         const Options = PieOptions()
//         const button = {
//             border: 'none',
//             backgroundColor: "#ECF87F",
//             color: 'black',
//             padding: '8px',
//             fontWeight:'bold'
//         }
//         const label = {
//             paddingTop: '5px',
//         }
//         const labelAmount = {
//             paddingTop: '5px',
//             color: '#2A6BA4',
//         }
//         //console.log("calendar")
//         return (
//             <>
//                 <Col xl='4'>
//                 <Row>
//                     <Row>
//                         <Col > <h6 style={{ marginTop: '10px' }}> {this.props.text}</h6> </Col>
//                         <Col lg='4'>
//                             <Form.Control
//                                 type="date"
//                                 name="fromDate"
//                                 value={fromDate}
//                                 onChange={this.onChange}
//                                 style={{ boxShadow: 'none', border: 'none', borderBottom: '3px solid grey', }}
//                             /><br />
//                         </Col>
//                         <Col lg='4'>
//                             <Form.Control
//                                 type="date"
//                                 name="toDate"
//                                 value={toDate}
//                                 onChange={this.onChange}
//                                 min={fromDate}
//                                 max={DateFormat(new Date())}
//                                 style={{ boxShadow: 'none', border: 'none', borderBottom: '3px solid grey', }}
//                             /><br />
//                         </Col>
//                     </Row>
//                     </Row>

//                     <Row className='chartCard'>
//                         <Row>
//                         <Col sm='4'>
//                                 <Col>
//                                     <h6 style={{ paddingTop: '5px',color:'#9B9D9F' }} > TOTAL </h6>
//                                 </Col>
//                                 <Col>
//                                     <h6 style={{ paddingTop: '5px',color:'#438EEB' }}> {this.props.user === 'client' ? 'RECEIVED' : 'PAYED'}  </h6>
//                                 </Col>
//                                 <Col>
//                                     <h6 style={{ paddingTop: '5px',color:'#FD7F59' }}> REMAINING </h6>
//                                 </Col>
//                             </Col>
//                             <Col sm={{ offset: '1', span: '5' }}>
//                                 {data !== undefined && data.map(data =>
//                                     <Col>
//                                         <label style={{ color: '#2A6BA4', paddingTop: '10px' }} >{parseFloat(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</label>
//                                     </Col>
//                                 )}
//                             </Col>
//                         </Row>
//                         <Row>
//                             <div style={{ maxHeight: '500px', maxWidth: '500px',marginTop: '20px' }}>
//                                 <Pie data={dataset} options={Options} />
//                             </div>

//                             <div style={{ position: 'relative', bottom: '20px', left: '15%', marginTop: '40px' }} >
//                             <Row>
//                             <Col lg={2}/>
                               
//                                 <Col lg={6}>
//                                 <button style={button} >Profit = {margin} </button>
//                                 </Col>
//                             </Row>
//                             </div>
//                         </Row>
//                     </Row>
//                 </Col>
               
//             </>
//         )
//     }
// }

// export default ChartCard


import React, { Component } from 'react'
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Image,
    DropdownButton,
    Dropdown,
    Spinner,
} from 'react-bootstrap';
import { PieOptions } from './ChartData'
import axiosInstance from '../../utils/axiosinstance'
import { DateFormat } from '../../utils/DateFormat'
import { DateFilter } from '../../utils/DateFilter'
import Curreny from 'currency-codes'
import { CurrencyConvertor } from '../../utils/Calculator'

export class ChartCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fromDate: '',
            currency: 'INR',
            country:'', 
            client:'',
            toDate: DateFormat(new Date()),
            client_labels: ["Total", "Received", "Remaining"],
            cont_labels: ["Total", "Paid", "Remaining"],
        }
    }
    componentDidMount() {
        const { fromDate, user, currency_list, currency, margin, country, client} = this.props
        // //console.log(data,"data")
        this.setState({ fromDate, user, currency_list, currency, margin,country, client,toDate:DateFormat(new Date()) })
        const data = { from_date: fromDate, to_date: DateFormat(new Date()), country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
        // //console.log(data, 'calender')            
        axiosInstance.post(`/dashboard/chart`, data)
            .then((res) => {
                const chart_list = res.data.response.chart_list
                //console.log(chart_list,"Date")
                const data = CurrencyConvertor(currency, chart_list, currency_list)
                this.setState({ data: data[user], margin: data.margin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), currency, user, country, client })
            })
    }
    componentDidUpdate() {
        const { user, currency,country, client } = this.props
        const { fromDate, toDate, currency_list, } = this.state

        if (currency !== this.state.currency ||country !== this.state.country || client !== this.state.client) {
 
            const data = { from_date: fromDate, to_date: toDate, country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
            //console.log(data, 'calender')            
            axiosInstance.post(`/dashboard/chart`, data)
                .then((res) => {
                    const chart_list = res.data.response.chart_list
                    //console.log(chart_list,"Date")
                    const data = CurrencyConvertor(currency, chart_list, currency_list)
                    this.setState({ data: data[user], margin: data.margin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), currency, user, country, client })
                })
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value },()=>this.DateFilter())
    }
    DateFilter = () => {
        const { fromDate, invoice, currency_list, currency, user,country,client,toDate } = this.state;
        // const { value, name } = e.target

        // if (fromDate !== '' && value !== '') {
            const data = { from_date: fromDate, to_date:toDate , country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }

            axiosInstance.post(`/dashboard/chart`, data)
                .then((res) => {
                    const chart_list = res.data.response.chart_list
                    const data = CurrencyConvertor(currency, chart_list, currency_list)
                    this.setState({ data: data[user], margin: data.margin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
                })
        // }
        // this.setState({ [name]: value })
    }
    render() {
        const { labels, data, fromDate, toDate, client_labels, cont_labels, margin } = this.state;
        //console.log(data)
        const dataset = {
            labels: this.props.user === 'client' ? client_labels : cont_labels,
            datasets: [
                {
                    data: data,
                    toolTipContent: "{label}:${data}",
                    borderWidth: 1,
                    backgroundColor: [
                        '#9B9D9F',
                        '#438EEB',
                        '#FD7F59',
                    ],
                }],
        }
        const Options = PieOptions()
        const button = {
            border: 'none',
            backgroundColor: "#ECF87F",
            color: 'black',
            padding: '8px',
            fontWeight:'bold',
            borderRadius:3,
            width:150
        }
        const label = {
            paddingTop: '5px',
        }
        const labelAmount = {
            paddingTop: '5px',
            color: '#2A6BA4',
        }
        //console.log("calendar")
        return (
            <>
                <Col xl='4'>
                
                    <Row style={{marginBottom:10}}>
                        {/* <Col lg='12'> <h6 style={{ marginTop: '10px' }}> {this.props.text}</h6> </Col> */}
                        {/* <Col lg='6'>
                            <Form.Control
                                type="date"
                                name="fromDate"
                                value={fromDate}
                                onChange={this.onChange}
                                style={{ boxShadow: 'none', border: 'none', borderBottom: '3px solid grey', }}
                            /><br />
                        </Col> */}
                        {/* <Col lg='6'>
                            <Form.Control
                                type="date"
                                name="toDate"
                                value={toDate}
                                onChange={this.onChange}
                                min={fromDate}
                                max={DateFormat(new Date())}
                                style={{ boxShadow: 'none', border: 'none', borderBottom: '3px solid grey', }}
                            /><br />
                        </Col> */}
                    </Row>
                   

                    <Row className='chartCard'>
                        <Row>
                        <Col lg='6'>
                            <Form.Control
                                type="date"
                                name="fromDate"
                                value={fromDate}
                                onChange={this.onChange}
                                style={{ boxShadow: 'none', border: 'none', border: '2px solid grey',marginTop:20,marginLeft:10 }}
                            /><br />
                        </Col>
                        <Col lg='6'>
                            <Form.Control
                                type="date"
                                name="toDate"
                                value={toDate}
                                onChange={this.onChange}
                                min={fromDate}
                                max={DateFormat(new Date())}
                                style={{ boxShadow: 'none', border: 'none', border: '2px solid grey',marginTop:20,marginLeft:10  }}
                            /><br />
                        </Col><hr/>
                        <Col xl='3' sm='3' lg='3' md='2' className="d-none d-md-block" style={{marginTop:10}}>
                                <Col>
                                <div style={{marginTop: '5px',marginBottom:'10px',marginLeft: '10px',height:25,width:50,backgroundColor:'#9B9D9F',borderRadius:3}}></div>
                                </Col>
                                <Col>
                                <div style={{marginTop: '5px',marginBottom:'10px',marginLeft: '10px',height:25,width:50,backgroundColor:'#438EEB',borderRadius:3}}></div>
                                </Col>
                                <Col>
                                <div style={{marginTop: '5px',marginLeft: '10px',height:25,width:50,backgroundColor:'#FD7F59',borderRadius:3}}></div>
                                </Col>
                            </Col>
                        <Col xl='4' sm='6' md='4' lg='4' xs='6' style={{marginTop:10}}>
                                <Col>
                                    <h6 style={{ paddingTop: '10px',marginBottom:'10px',color:'#9B9D9F' }} > TOTAL </h6>
                                </Col>
                                <Col>
                                    <h6 style={{ paddingTop: '5px',marginBottom:'10px',color:'#438EEB' }}> {this.props.user === 'client' ? 'RECEIVED' : 'PAYED'}  </h6>
                                </Col>
                                <Col>
                                    <h6 style={{ paddingTop: '5px',color:'#FD7F59' }}> REMAINING </h6>
                                </Col>
                            </Col>                    
                            <Col xl='4' sm={{ offset: '1', span: '5' }} sm={{ offset: '1', span: '5' }} lg={{ offset: '1', span: '4' }}  xs={{  span: '6' }} style={{marginTop:10}}>
                                {data !== undefined && data.map(data =>
                                    <Col>
                                        <h6 style={{ textAlign:'right', paddingTop: '7px',marginBottom:'10px' }} >{parseFloat(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h6>
                                    </Col>
                                )}
                            </Col>
                        </Row>
                        <Row >
                            <div style={{marginLeft: '5px', maxHeight: '500px', maxWidth: '500px',marginTop: '20px' }}>
                                <Pie data={dataset} options={Options} />
                            </div>

                            <div style={{marginLeft: '10px', position: 'relative', bottom: '20px', marginTop: '30px' }} >
                            <Row>       
                                <Col lg={6}>
                                <button style={button} >Profit = {margin} </button>
                                </Col>
                            </Row>
                            </div>
                        </Row>
                    </Row>
                </Col>
               
            </>
        )
    }
}

export default ChartCard

