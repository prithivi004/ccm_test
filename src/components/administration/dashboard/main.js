import React, { Component } from 'react'
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import {Button} from 'semantic-ui-react'
import ChartCardCalender from './ChartCardCalender'
import ChartCard from './ChartCard'
import PayablesRecieveableChartcard from './ChartCardMonth'
import BarChart from './BarChart'
import Sidebar from './Sidebar'
import Top5 from './Top5'
import axiosInstance from '../../utils/axiosinstance'
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'
import Currency from 'currency-codes'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Curreny from 'currency-codes'
import { CurrencyConvertor, AgedDataCalculator } from '../../utils/Calculator'
import { DateFormat } from '../../utils/DateFormat';
import { getParamByParam } from 'iso-country-currency'
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import BarChart2 from './BarChart2';
import Top5_2 from './Top5_2';

export class main extends Component {
    constructor(props) {
        super(props)

        this.initialstate = {
            country_id: '',
            currency: "SGD",
            client_id: '',
            cont_id: '',

            month_data: '',
            year_data: '',
            aged_30: '',
            aged_60: '',
            aged_above60: '',

            country_list: [],
            client_list: [],
            contractor_list: [],
            // user: false,
            temp: true,
            aged_5_receivables_chart_list:[],
            aged_5_payables:[],
            user:{},
            year_from_date:'',
            summary:[],
            receivablepayableList:[],
        }

        this.state = this.initialstate
    }
    componentDidMount() {
        this.setState({user:JSON.parse(localStorage.getItem('user_details'))})
        axiosInstance.post(`/country/list`)
            .then((res) => {
                const country_list = res.data.response.country_list
                const allCont = {id:'0',name:"All",value:'0'}
                const countriesloc = localStorage.getItem('country').split(',')
                const filtered_contries = countriesloc.map(country=> country_list.find(count => count.id == country))
                ////console.log(filtered_contries)
                if(localStorage.getItem('role') == 'admin'){
                    this.setState({country_list:[...country_list,allCont]})
                }
                else{
                    this.setState({ country_list:[...filtered_contries,allCont] })
                }
                // this.setState({country_list})
                // //////console.log(country_list)
            })
        axiosInstance.post(`/client/search`,{country:localStorage.getItem('role') == 'admin'?'':localStorage.getItem('country')})
            .then(res => {
                const client_list = res.data.response.client_list
                this.setState({ client_list, })
            })
        axiosInstance.post(`/contractor/list`)
            .then(res => {
                const contractor_list = res.data.response.contractor_list
                this.setState({ contractor_list, })
            })
        let currency_list = ''
        axios.get(`https://data.fixer.io/api/latest?access_key=${process.env.REACT_APP_FIXER}`)
            .then(res => {
                currency_list = res.data.rates
                console.log(res.data, 'fixer.io')
                this.setState({ currency_list })
            }).then(() => {
                const date = new Date()
                const month_from_date = DateFormat(new Date(date.getFullYear(), date.getMonth(), 1))
                const year_from_date = DateFormat(new Date(date.getFullYear(), 0, 1))
                this.setState({year_from_date})
                const to_date = DateFormat(new Date())

                //MONTHLY DATA
                const country_id = localStorage.getItem('role') == 'admin'?'':localStorage.getItem('country')
                const month_data = { from_date: month_from_date, to_date: to_date,country_id}
                        ////console.log( month_data, 'month_data')
                axiosInstance.post(`/dashboard/chart`, month_data)
                    .then((res) => {
                        const chart_list = res.data.response.chart_list
                        const marginList = res.data.response.margin
                        // ////console.log(currency_list,chart_list, 'currency_list')
                        const data = CurrencyConvertor(this.state.currency, chart_list, currency_list)
                        // ////console.log( data, 'month_data')
                        this.setState({ month_chart_list: chart_list, month_data: data, month_from_date, to_date })
                    })
                    .then(res => {
                        // YEARLY DATA
                        const year_data = { from_date: year_from_date, to_date: to_date ,country_id}
                        // ////console.log(year_data)
                        axiosInstance.post(`/dashboard/chart`, year_data)
                            .then((res) => {
                                const chart_list = res.data.response.chart_list
                                const marginList = res.data.response.margin
                                // ////console.log(chart_list,'yearlist')
                                const data = CurrencyConvertor(this.state.currency, chart_list, currency_list)
                                ////console.log( data, 'year')
                                this.setState({ year_chart_list: chart_list, year_data: data, year_from_date })
                            })
                    })


                
                var day30 = new Date();
                let last30 = DateFormat(day30.setDate(day30.getDate() - 30))
                var day60 = new Date();
                let last60 = DateFormat(day60.setDate(day60.getDate() - 60))
                //////console.log(last60,"last 60")


                axiosInstance.post(`/dashboard/aged_monthly`, { from_date: last30, to_date: to_date,country_id}).then((res) => {
                    const aged_30_list = res.data.response.chart_list
                    //////console.log(res,'aged_30_list')
                    const aged_30 = AgedDataCalculator(this.state.currency, aged_30_list, currency_list)
                    this.setState({ aged_30, aged_30_list,last30 })
                })
                axiosInstance.post(`/dashboard/aged_monthly`, { from_date: last60, to_date: last30,country_id}).then((res) => {
                    const aged_60_list = res.data.response.chart_list
                    //////console.log(res,'aged_60_list')
                    const aged_60 = AgedDataCalculator(this.state.currency, aged_60_list, currency_list)
                    this.setState({ aged_60, aged_60_list, last60 })
                })
                axiosInstance.post(`/dashboard/aged_monthly`, { from_date: year_from_date, to_date: last60,country_id}).then((res) => {
                    const aged_above60_list = res.data.response.chart_list
                    //////console.log(res,'aged_above60_list')
                    const aged_above60 = AgedDataCalculator(this.state.currency, aged_above60_list, currency_list)
                    // ////console.log(summary)
                    this.setState({ aged_above60, aged_above60_list })
                })


                // Aged 5 receivables
                axiosInstance.post(`/dashboard/aged_5_client_receivables`,{country_id})
                    .then((res) => {
                        const chart_list = res.data.response.chart_list
                        ////console.log(chart_list,"aged_recv")
                        const decre =  this.converter(this.state.currency, chart_list, currency_list)
                        const data = CurrencyConvertor(this.state.currency, chart_list, currency_list)
                        //console.log(data, 'aged_5_receivables')
                        this.setState({ aged_5_receivables_chart_list: decre, year_data: data, year_from_date })
                    })
                    axiosInstance.post(`/dashboard/aged_5_cont_payables`,{country_id})
                    .then(res=>{
                        const aged_5_payables = res.data.response.chart_list
                        const decre =  this.converter(this.state.currency, aged_5_payables, currency_list)
                        this.setState({aged_5_payables:decre})
                        ////console.log(aged_5_payables,'payables')
                    })       
                axiosInstance.post(`/dashboard/monthly`,{country_id})
                .then(res =>{
                    // console.log(res.data.response.chart_list);  
                    const receivablepayableList = res.data.response.chart_list
                    const payableReceivable = this.recPayCalculator(this.state.currency,receivablepayableList,currency_list)
                    this.setState({summary:payableReceivable,receivablepayableList})
                })          

            })
            // const country_id = localStorage.getItem('role') == 'admin'?'':localStorage.getItem('country')
            

    }
    recPayCalculator = (currency,chart_list,currency_list) =>{
        let payables = 0
        let receivables = 0
        const summary = chart_list.map(data =>{
        receivables += parseFloat(data.receivables) * (currency_list[currency]/currency_list[data.currency])
        payables += parseFloat(data.payables) * (currency_list[currency]/currency_list[data.currency])
        // console.log(" parseFloat(data.receivables)",  parseFloat(data.receivables))
        // console.log("currency_list[data.currency]", currency_list);
        // console.log("data.currency" , data.currency)
        // console.log(receivables,"recv")
        // console.log(payables,"pay")
        });
        // console.log(summary)
        return [payables.toFixed(2),receivables.toFixed(2)];
    }
    converter = (currency,chart_list,currency_list) =>{
        const newdata = chart_list.map(data =>{
            const converted = parseFloat(data.receivables * (currency_list[currency]/currency_list[data.currency]))
            return {...data,receivables:converted,currency:'SGD'}
        })
        const sorted = newdata.sort((a,b)=>parseFloat(b.receivables) - parseFloat(a.receivables))
        const neededData = sorted.slice(0,5)
        return neededData
    }
    currencyChange = () => {
        const { month_chart_list, year_chart_list, aged_30_list, aged_60_list,receivablepayableList, aged_above60_list, currency, currency_list } = this.state;
        const month_data = CurrencyConvertor(currency, month_chart_list, currency_list)
        const year_data = CurrencyConvertor(currency, year_chart_list, currency_list)
        const aged_30 = AgedDataCalculator(currency, aged_30_list, currency_list)
        const aged_60 = AgedDataCalculator(currency, aged_60_list, currency_list)
        const aged_above60 = AgedDataCalculator(currency, aged_above60_list, currency_list)
        const summary = this.recPayCalculator(currency, receivablepayableList,currency_list)
        this.setState({ month_data, year_data, aged_30, aged_60, aged_above60,summary })
    }
    filter = (name) => {
        const { month_from_date, year_from_date, to_date, currency_list, currency, country_id, client_id, cont_id, client_list, last30, last60 } = this.state
        const month_data = { from_date: month_from_date, to_date: to_date, country_id: country_id !== '' ? parseInt(country_id) : '', client_id: client_id !== '' ? parseInt(client_id) : '', }
        
        let payables = 0
        let receivables = 0
        axiosInstance.post(`/dashboard/chart`, month_data)
            .then((res) => {
                const month_chart_list = res.data.response.chart_list
                const marginList = res.data.response.margin
                const month_data = CurrencyConvertor(currency, month_chart_list, currency_list,marginList)
                // ////console.log(month_data)

                this.setState({ month_chart_list, month_data, })
            })

        const year_data = { from_date: year_from_date, to_date: to_date, country_id: country_id !== '' ? parseInt(country_id) : '', client_id: client_id !== '' ? parseInt(client_id) : '', }
        axiosInstance.post(`/dashboard/chart`, year_data)
            .then((res) => {
                const year_chart_list = res.data.response.chart_list
                const marginList = res.data.response.margin
                const year_data = CurrencyConvertor(currency, year_chart_list, currency_list,marginList)
                ////console.log(year_data)
                this.setState({ year_chart_list, year_data, })
            })

        const aged30_data = { from_date: last30, to_date: to_date, country_id: country_id !== '' ? parseInt(country_id) : '', client_id: client_id !== '' ? parseInt(client_id) : '', }
        axiosInstance.post(`/dashboard/aged_monthly`,aged30_data)
            .then((res) => {
                const aged_30_list = res.data.response.chart_list
                //////console.log(res,'aged_30_list')
                const aged_30 = AgedDataCalculator(this.state.currency, aged_30_list, currency_list)
                payables += parseFloat(aged_30[1])
                receivables += parseFloat(aged_30[0])
                this.setState({ aged_30, aged_30_list })
            })

        const aged60_data = { from_date: last60, to_date: last30, country_id: country_id !== '' ? parseInt(country_id) : '', client_id: client_id !== '' ? parseInt(client_id) : '', }
        axiosInstance.post(`/dashboard/aged_monthly`, aged60_data)
            .then((res) => {
                const aged_60_list = res.data.response.chart_list
                //////console.log(res,'aged_60_list')
                const aged_60 = AgedDataCalculator(this.state.currency, aged_60_list, currency_list)
                payables += parseFloat(aged_60[1])
                receivables += parseFloat(aged_60[0])
                this.setState({ aged_60, aged_60_list })
            })

        const aged60above_data = { from_date: year_from_date, to_date: last60, country_id: country_id !== '' ? parseInt(country_id) : '', client_id: client_id !== '' ? parseInt(client_id) : '', }
        axiosInstance.post(`/dashboard/aged_monthly`, aged60above_data)
            .then((res) => {
                const aged_above60_list = res.data.response.chart_list
                //////console.log(res, 'aged_above60_list')
                const aged_above60 = AgedDataCalculator(this.state.currency, aged_above60_list, currency_list)
                payables += parseFloat(aged_above60[1])
                receivables += parseFloat(aged_above60[0])
                const summary = []
                summary.push(payables,receivables)
                this.setState({ aged_above60, aged_above60_list,summary })
            })

            const agedrecvData = { from_date: month_from_date, to_date: to_date, country_id: country_id !== '' ? parseInt(country_id) : '', client_id: client_id !== '' ? parseInt(client_id) : '', }
            axiosInstance.post(`/dashboard/aged_5_client_receivables`,agedrecvData)
                    .then((res) => {
                        const chart_list = res.data.response.chart_list
                        ////console.log(chart_list)
                        const list =  this.CountryCurrencyconverterTop5(this.state.currency, chart_list, currency_list)
                        const data = CurrencyConvertor(this.state.currency, chart_list, currency_list)
                        // ////console.log(chart)
                        // console.log(data, 'aged_5_receivables')
                        this.setState({ aged_5_receivables_chart_list: list, year_from_date })
                    })
            const agedpayData = { from_date: month_from_date, to_date: to_date, country_id: country_id !== '' ? parseInt(country_id) : '', client_id: client_id !== '' ? parseInt(client_id) : '', }
            axiosInstance.post(`/dashboard/aged_5_cont_payables`,agedpayData)
            .then(res=>{
                const aged_5_payables = res.data.response.chart_list
                const list =  this.CountryCurrencyconverterTop5(this.state.currency, aged_5_payables, currency_list)
                this.setState({aged_5_payables:list})
                // console.log(list,'payables')
                // console.log(aged_5_payables,'agedpayables')
                    })
                    axiosInstance.post(`/dashboard/monthly`,{country_id})
                    .then(res =>{
                        const receivablepayableList = res.data.response.chart_list
                        const payableReceivable = this.recPayCalculator(this.state.currency,receivablepayableList,currency_list)
                        //console.log(payableReceivable,"payrecv")
                        this.setState({summary:payableReceivable,receivablepayableList})
                    }) 
           
    }
    CountryCurrencyconverterTop5 = (currency,chart_list,currency_list) =>{
        const newdata = chart_list.map(data =>{
            const converted = parseFloat(data.receivables * (currency_list[currency]/currency_list[data.currency]))
            return {...data,receivables:converted,currency}
        })
        const sorted = newdata.sort((a,b)=>parseFloat(b.receivables) - parseFloat(a.receivables))
        const neededData = sorted.slice(0,5)
        return neededData
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSwitchChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked })
    }

    // printPDF() {
    //     const input = document.getElementById('divToPrint');
    //     html2canvas(input, {
    //         onclone: document => {
    //           document.getElementById("print").style.visibility = "hidden";
    //         },
    //         scale: 2,
    //       })
    //       .then((canvas) => {
    //         // // let imgWidth = 208;
    //         // // let imgHeight = canvas.height * imgWidth / canvas.width;
    //         // const imgData = canvas.toDataURL('img/png');
    //         // const pdf = new jsPdf('p', 'mm', 'a4')
    //         //   const imgProps= pdf.getImageProperties(imgData);
    //         //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //         //   const pdfHeight = pdf.internal.pageSize.getHeight();
    //         // // const pdf = new jsPdf('p', 'mm', 'a4');
    //         // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //         // // pdf.output('dataurlnewwindow');
    //         // pdf.save(`${new Date().toISOString()}.pdf`);



    //         // var imgData = canvas.toDataURL('image/png');
    //         // var imgWidth = 210; 
    //         // var pageHeight = 295;  
    //         // var imgHeight = canvas.height * imgWidth / canvas.width;
    //         // var heightLeft = imgHeight;
    //         // var doc = new jsPdf('p', 'mm');
    //         // var position = 0;

    //         // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //         // heightLeft -= pageHeight;

    //         // while (heightLeft >= 0) {
    //         // position = heightLeft - imgHeight;
    //         // doc.addPage();
    //         // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //         // heightLeft -= pageHeight;
    //         // }
    //         // doc.save( 'file.pdf');



    //         const imgData = canvas.toDataURL('image/jpeg');
    //         const imgWidth = 190;
    //         const pageHeight = 290;
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //         let heightLeft = imgHeight;
    //         const doc = new jsPdf('pt', 'mm');
    //         let position = 0;
    //         doc.addImage(imgData, 'JPEG', 10, 0, imgWidth, imgHeight + 25);
    //         heightLeft -= pageHeight;
    //         while (heightLeft >= 0) {
    //             position = heightLeft - imgHeight;
    //             doc.addPage();
    //             doc.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight + 25);
    //             heightLeft -= pageHeight;
    //         }
    //         doc.save(`${new Date().toISOString()}.pdf`);

    //                 })
    //     ;
    //   }
//1880
    // printPDF() {
    //     if(window.screen.width < 1024) {
    //     document.getElementById("viewport").setAttribute("content", "width=1455px");
    // }else{
    //     document.getElementById("viewport").setAttribute("content", "width=1880px");
    // }
    // const data = document.getElementById('divToPrint');
    // html2canvas(data, {
    //     onclone: document => {
    //       document.getElementById("print").style.visibility = "hidden";
    //     },
    //   imageTimeout: 15000,
    //   logging: true,
    //   scale: 2,
    //   useCORS: true
    //   })
    //   .then((canvas) => {
    //          const imgData = canvas.toDataURL('image/jpeg');
    //         const imgWidth = 190;
    //         const pageHeight = 295;
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //         let heightLeft = imgHeight;
    //         const doc = new jsPdf('pt', 'mm');
    //         let position = 0;
    //         doc.addImage(imgData, 'JPEG', 10, 0, imgWidth, imgHeight + 25);
    //         heightLeft -= pageHeight;
    //         while (heightLeft >= 0) {
    //             position = heightLeft - imgHeight;
    //             doc.addPage();
    //             doc.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight + 25);
    //             heightLeft -= pageHeight;
    //         }
    //         doc.save(`${new Date().toISOString()}.pdf`);

    //   if(window.screen.width < 1024) {
    //     document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1");
    //   }else{
    //     document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1"); 
    //   }
    // });
    //   }

    printPDF() {
        if(window.screen.width < 1024) {
            document.getElementById("viewport").setAttribute("content", "width=1455px");
        }else{
            document.getElementById("viewport").setAttribute("content", "width=1880px");
        }
    const data = document.getElementById('divToPrint');
    html2canvas(data, {
        onclone: document => {
          document.getElementById("print").style.visibility = "hidden";
        },
      
      logging: true,
      scale: 2,
      useCORS: true
      })
      .then((canvas) => {
            //  const imgData = canvas.toDataURL('image/jpeg');
                     // let imgWidth = 208;
            // let imgHeight = canvas.height * imgWidth / canvas.width;
            const imgData = canvas.toDataURL('img/jpg');
            const pdf = new jsPdf('p', 'mm')
              const imgProps= pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
            // const pdf = new jsPdf('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            // pdf.output('dataurlnewwindow');
            pdf.save(`${new Date().toISOString()}.pdf`);

            if(window.screen.width < 1024) {
                document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1");
              }else{
                document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1"); 
              }
    });
      }
    

    onChangeCountry = (e,value) =>{
        axiosInstance.post(`/country/list`).then(res=>{
            const country_list = res.data.response.country_list
            const filtered = country_list.find(country=>country.id == value.id)

            // console.log("ygvyw" , filtered)
            if(filtered !== undefined){
                if(filtered.name == 'Cabo Verde'){
                    value !== null ? this.setState({ currency:'CVE',country_id: value.id, client_id: '' }, () => this.filter('country')) : this.setState({ country_id: '' }, () => this.filter())
                }else if(filtered.name == 'Viet Nam'){
                    value !== null ? this.setState({ currency:'VND',country_id: value.id, client_id: '' }, () => this.filter('country')) : this.setState({ country_id: '' }, () => this.filter())
                }
                else{
                    value !== null ? this.setState({ currency:getParamByParam('countryName',filtered.name,'currency'),country_id: value.id, client_id: '' }, () => this.filter('country')) : this.setState({ country_id: '' }, () => this.filter())
                }
            }
            else{
                ////console.log("All")
                this.state = this.initialstate
                this.setState({country_id:'',currency:'SGD'})
                this.componentDidMount()
                this.componentDidMount()
            }
        })
    }
    render() {
        const { country_id, client_id,year_chart_list, currency, country_list, client_list, contractor_list, user, client_invoice, cont_invoice, month_data, year_data, currency_list, aged_30, aged_60, aged_above60 } = this.state;
        //////console.log(year_data, 'year_data')
        const PurpleSwitch = withStyles({
            switchBase: {
                color: '#3A5F85',
                '&$checked': {
                    color: '#3A5F85',
                },
                '&$checked + $track': {
                    backgroundColor: '#3A5F85',
                },
            },
            checked: {},
            track: {},
        })(Switch);
        return (
           <div>
                <div className="component" >
                {this.state.user.view_dash == '0'?<>You Don't Have Permission to Access</>:
                    <>
                    <h4> DASHBOARD </h4>
                    {/* <Card style={{ marginTop: "2%" }}> */}
                    <div id='divToPrint'>
                    <br/>
                    <div className='chartCard'>
                        <Row style={{marginBottom:10,marginTop:10,marginLeft:10,marginRight:10}}>
                            <Col lg='3' md='3'>
                            <h6>Country</h6>
                                <Autocomplete
                                    options={country_list}
                                    onChange={(e, value) => this.onChangeCountry(e,value)}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <Form.Control placeholder='--Select Country--' type="text" {...params.inputProps} style={{ padding: '6px' }} />
                                            {/* <button className='iconButtton' style={{ bottom: '35px', left: '80%' }} ><i className="fa fa-angle-right" onClick={this.onSearch} ></i></button><br /> */}
                                        </div>
                                    )}
                                /><br/>
                            </Col>
                            
                            <Col lg='3'  md='3'>
                            <h6>Currency</h6>
                                <Autocomplete
                                    options={Curreny.codes()}
                                    onChange={(e, value) => value !== null && this.setState({ currency: value }, () => this.currencyChange())}
                                    getOptionLabel={(option) => option}
                                    value={currency}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <Form.Control placeholder={currency}  type="text" {...params.inputProps} style={{ padding: '6px' }} />
                                            {/* <button className='iconButtton' style={{ bottom: '35px', left: '80%' }} ><i className="fa fa-angle-right" onClick={this.onSearch} ></i></button><br /> */}
                                        </div>
                                    )}
                                /><br/>
                            </Col>
                            <Col lg='3'  md='3'>
                            <h6>Client</h6>
                               
                                    <Autocomplete
                                        options={country_id === '' ? client_list : client_list.filter(client => parseInt(client.country) === parseInt(country_id))}
                                        onChange={(e, value) => value !== null ? this.setState({ client_id: value.id }, () => this.filter('client')) : this.setState({ client_id: '' }, () => this.filter())}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <Form.Control placeholder='--Select Client--' {...params.inputProps} style={{ padding: '6px' }} />
                                            </div>
                                        )}
                                    /><br/>
                                
                            </Col>
                            <Col lg='3'  md='3'>
                            <Button id="print" primary style={{marginTop:22}}  onClick={this.printPDF}>Export</Button>

                            </Col>
                            
                        </Row>
                    {/* </Card> */}
                    </div>
                   
<Row>
                    {(year_data !== '' && currency_list !== undefined) &&
                                 < ChartCardCalender
                                     text='CALENDAR'
                                     user='client'
                                     data={year_data.client}
                                     margin={year_data.margin}
                                     currency={currency}
                                     country={country_id}
                                     client={client_id}
                                    currency_list={currency_list}
                                     fromDate={this.state.year_from_date}
                                 />}

                                {(month_data !== '') &&
                                 <ChartCard
                                     text='MONTHLY STATEMENT'
                                     user='client'
                                     margin={month_data.margin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                     data={month_data.client}
                                 />}
                               
                             {(this.state.summary.length > 0) &&
                                 <PayablesRecieveableChartcard
                                     text='PENDING PAYMENTS'
                                     user='client'
                                     // margin={year_data.margin}
                                    data={this.state.summary}
                                 />}
                                
</Row>  
 <Row>        <Col xl='12' className='d-none d-md-block'>           
                             <h5>MONTHLY STATEMENT PER YEAR</h5>
                              {currency_list !== undefined &&
                                <BarChart
                                 currency_list={currency_list}
                                 currency={currency}
                                 user='client'
                                 country={country_id}
                                 client={client_id}
                                />}
                </Col>  
                <Col xl='12' className='d-block d-md-none'>           
                             <h5>MONTHLY STATEMENT PER YEAR</h5>
                              {currency_list !== undefined &&
                                <BarChart2
                                 currency_list={currency_list}
                                 currency={currency}
                                 user='client'
                                 country={country_id}
                                 client={client_id}
                                />}
                </Col>                                      
 </Row>        
 <Row>
                            <Col xl='6'>
                                <h5>AGED RECEIVABLES</h5>
                                {aged_30 !== '' && aged_60 !== '' && aged_above60 !== '' &&
                                    <Sidebar
                                        color='#438EEB'
                                        data={[aged_30[0], aged_60[0], aged_above60[0]]}
                                    />}
                            </Col>
                            <Col xl='6'>
                                <h5>AGED PAYABLES</h5>
                                {aged_30 !== '' && aged_60 !== '' && aged_above60 !== '' &&
                                    <Sidebar
                                        color='#FD7F59'
                                        data={[aged_30[1], aged_60[1], aged_above60[1]]}
                                    />}
                            </Col>
</Row>    
<Row>
                           
                           <Col xl='6' className='d-none d-md-block'>
                               <h5>TOP 5 AGED RECEIVABLES</h5>
                               {(month_data !== '' && currency_list !== undefined) &&
                               <Top5 currency_list={currency_list} name='Clients' currency={this.state.currency} list={this.state.aged_5_receivables_chart_list || []} color='#438EEB' />}
                           </Col>
                           <Col xl='6' className='d-none d-md-block'>
                               <h5>TOP 5 AGED PAYABLES</h5>
                               {(month_data !== '' && currency_list !== undefined) &&
                               <Top5 currency_list={currency_list} name='Contractors' currency={this.state.currency} list={this.state.aged_5_payables || []} color='#FD7F59' />}
                           </Col>
                           <Col xl='6' className='d-block d-md-none'>
                               <h5>TOP 5 AGED RECEIVABLES</h5>
                               {(month_data !== '' && currency_list !== undefined) &&
                               <Top5_2 currency_list={currency_list} name='Clients' currency={this.state.currency} list={this.state.aged_5_receivables_chart_list || []} color='#438EEB' />}
                           </Col>
                           <Col xl='6' className='d-block d-md-none'>
                               <h5>TOP 5 AGED PAYABLES</h5>
                               {(month_data !== '' && currency_list !== undefined) &&
                               <Top5_2 currency_list={currency_list} name='Contractors' currency={this.state.currency} list={this.state.aged_5_payables || []} color='#FD7F59' />}
                           </Col>
</Row>            
  </div>               
                    </>}
                </div>
                </div>
        )
    }
}

export default main

