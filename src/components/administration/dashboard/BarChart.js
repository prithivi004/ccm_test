import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
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
import { BarOptions, BarOptions2 } from './ChartData'
import axiosInstance from '../../utils/axiosinstance'
import { DateFormat } from './../../utils/DateFormat'
import { DateFilter } from './../../utils/DateFilter'
import { CurrencyConvertor } from '../../utils/Calculator'

export class BarChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: 'client',
            currency:'SGD',
            labels: [],
            country:'', 
            client:'',
        }
    }
    componentDidMount() {
        const { currency_list, user,currency,country, client } = this.props
        const month_list = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

        let total = []
        let received = []
        let remaining = []
        let labels = []

        const month = new Date().getMonth()
        const year = (new Date().getFullYear())

        let promises = []
        for (let i = month; i < month + 12; i++) {
            if (i < 11) {
                const from_date = DateFormat(new Date(year - 1, i + 1, 1))
                const to_date = DateFormat(new Date(year - 1, i + 2, 0))

                const data = { from_date, to_date }
                promises.push(axiosInstance.post(`/dashboard/chart`, data))
                labels.push(month_list[(i + 1)])

            } else {
                const from_date = DateFormat(new Date(year, i - 11, 1))
                const to_date = DateFormat(new Date(year, i - 10, 0))

                const data = { from_date, to_date }
                promises.push(axiosInstance.post(`/dashboard/chart`, data))
                labels.push(month_list[(i - 11)])
            }

        }
        Promise.all(promises).then(results => {
            results.map(res => {
                const chart_list = res.data.response.chart_list
                const data = CurrencyConvertor(currency, chart_list, currency_list)
                // console.log(data)
                total.push(data[user][0] !== '0.00' ? data[user][0] : '')
                received.push(data[user][1] !== '0.00' ? data[user][1] : '')
                remaining.push(data[user][2] !== '0.00' ? data[user][2] : '')
            })
            // console.log(total, received, remaining, labels, 'barcartkguhuh')
            this.setState({ user, total, received, remaining, labels, currency, currency_list,country, client })
        })
    }
    componentDidUpdate() {
        const { user, currency,country, client } = this.props
        const { currency_list,  } = this.state
        if (user !== this.state.user || currency !== this.state.currency ||country !== this.state.country || client !== this.state.client) {
            this.setState({ user, currency,country, client })
            // console.log('componentDidUpdate barchart')
            let total = []
            let received = []
            let remaining = []

            const month = new Date().getMonth()
            const year = (new Date().getFullYear())
    
            let promises = []
            for (let i = month; i < month + 12; i++) {
                if (i < 11) {
                    const from_date = DateFormat(new Date(year - 1, i + 1, 1))
                    const to_date = DateFormat(new Date(year - 1, i + 2, 0))
    
                    const data = { from_date, to_date, country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
                    promises.push(axiosInstance.post(`/dashboard/chart`, data))
    
                } else {
                    const from_date = DateFormat(new Date(year, i - 11, 1))
                    const to_date = DateFormat(new Date(year, i - 10, 0))
    
                    const data = { from_date, to_date, country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
                    promises.push(axiosInstance.post(`/dashboard/chart`, data))
                }
    
            }
           
            Promise.all(promises).then(results => {
                results.map(res => {
                    const chart_list = res.data.response.chart_list
                    const data = CurrencyConvertor(currency, chart_list, currency_list)
                    // console.log(data)
                    total.push(data[user][0] !== '0.00' ? data[user][0] : '')
                    received.push(data[user][1] !== '0.00' ? data[user][1] : '')
                    remaining.push(data[user][2] !== '0.00' ? data[user][2] : '')
                })
                // console.log(total, received, remaining, 'update barchart')
                this.setState({  total, received, remaining, })
            })
        }
    }

    render() {
        const { total, received, remaining, labels } = this.state
        const BarData = {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Total',
                    backgroundColor: '#9B9D9F',
                    // borderWidth: 2,
                    // fill: false,
                    data: total,
                },
                {
                    type: 'bar',
                    label: 'Received',
                    backgroundColor: '#438EEB',
                    
                    data: received,
                },
                {
                    type: 'bar',
                    label: 'Remaining',
                    backgroundColor: '#FD7F59',
                    data: remaining,
                },
            ]
        };
        const Options = BarOptions()
        const Options2 = BarOptions2()
        return (
            <div>
            <Col style={{position:'relative'}} >
            <Row className='chartCard'>
                <Col >
                    <Bar data={BarData} options={Options} />
                </Col>
            </Row>
            </Col>   
             {/* <Col style={{position:'relative'}} className='d-block d-md-none'>
             <Row className='chartCard'>
                 <Col >
                     <Bar data={BarData} options={Options2} />
                 </Col>
             </Row>
             </Col>   */}
             </div>
        )
    }
}

export default BarChart