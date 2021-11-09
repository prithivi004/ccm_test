import React, { Component } from 'react'
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
import CustomTextBox from './CustomBox/TextBox'
import swal from 'sweetalert'


import axios from 'axios'
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, subMonths, addYears, subYears } from "date-fns";

export class Dashboard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
           Date_From:null,
           Date_To:null,
           select_month: new Date(),
           total_amount:0,
           received_amount:0,
           remaining_amount:0,
           quotation:[],
           invoice:[],
           loading:false,
        }
    }

    componentDidMount() {
        const {invoice,quotation,select_month}=this.state;
        axios('https://www.json-generator.com/api/json/get/cfrDwSAQMO?indent=2' )
        .then(res =>{
            const quotation = res.data
            this.setState({quotation})
            // console.log(quotation,"quotation")
            
        }).then(
        axios('https://www.json-generator.com/api/json/get/cguvqhaVQi?indent=2' )
        .then(res =>{
            const invoice = res.data
            this.setState({invoice})
            // console.log(invoice,"invoice")   
        }) )
        .then(
            ()=>{
            const month=this.state.select_month.getMonth()
            const year=this.state.select_month.getFullYear()
            // console.log(month,"month")
            // console.log(year,"year")
            let sum=0;
            let amount=0;
    
            this.state.quotation.map(quotation=>{
                
                const quotation_date = new Date(quotation.date)
                // console.log(quotation_date,"quotation_date")
                const quotation_month=quotation_date.getMonth()
                const quotation_year=quotation_date.getFullYear()
                
                if(quotation_month==month && quotation_year==year){
                   
                    sum = sum + quotation.amount
                    
        
                    this.state.invoice.map(invoice=>{
                        if(invoice.quotation_no==quotation.quotation_no){
                            
                            amount=amount+invoice.amount
                        }
                    })
                }
                
            }) 
            this.setState({
                check:"entered",
                total_amount:sum,
                received_amount:amount,
                remaining_amount:sum-amount,
            },()=>{console.log(this.state,"state")})
        }
            
        ) 
    }
    
    chartData = ()=>{
         const data= { 
             labels: [
                "Total",
                "Received",
                "Remaining"
            ],
            datasets: [
                {
                    data: [this.state.total_amount,this.state.received_amount,this.state.remaining_amount],
                    toolTipContent: "{label}:${data}",
                    borderWidth: 1,
                    backgroundColor: [
                        'rgba(236,242,63,0.3)',
                        'rgba(38, 211, 211,0.3)',
                        'rgba(247, 7, 55, 0.3)',
                    ],
                    borderColor:  [
                        'rgba(236,242,63,0.80)',
                        'rgba(38, 211, 211)',
                        'rgba(247, 7, 55, 0.80)',
                    ],
                    hoverBackgroundColor: [
                        'rgba(236,242,63,0.80)',
                        'rgba(38, 211, 211)',
                        'rgba(247, 7, 55, 0.80)',
                    ],
            
                }],
                
        }
        const options = {
            legend: {
                position:'right',
                padding:20,
                labels: {
                    fontSize:15,
                    fontColor:"black",
                    fontWeight:'bold'
                }
            }, 
            plugins: {
                datalabels: {
                    color: 'black',
                    font:{
                        size:'20',
                        weight:'bold',
                    },
                    formatter: function(value, data) {
                        return "$"+value;
                    },
                }
            },
            tooltips: {
                titleSpacing: 6,
                xPadding: 20,
                yPadding: 20,
                titleFontSize: 15,
                bodyFontSize:20,
                callbacks: {
                    title: function(tooltipItem, data) {
                    return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function(tooltipItem, data) {
                    return "$" + data['datasets'][0]['data'][tooltipItem['index']];
                    },
                },
            },
        }
        
        return {data, options} ;
    }    

    setDate = (date, name)=>{
        const { Date_From,Date_To,total_amount,invoice_amount,remaining_amount,quotation,invoice} = this.state;

        // console.log(this.state, "state")

        if(name=="Date_To"){
                
            
            if(Date_From!=null && date!=null){
               
                let sum=0;
                let amount=0;
                this.state.quotation.map(quotation=>{
                    
                    const quotation_date = Date.parse(quotation.date)
                    const from = Date.parse(Date_From)
                    const end = Date.parse(date)
                    
                    if(quotation_date>=from && quotation_date<=end){
                       
                        sum = sum + quotation.amount
                        

                        this.state.invoice.map(invoice=>{
                            if(invoice.quotation_no==quotation.quotation_no){
                                
                                amount=amount+invoice.amount
                            }
                        })
                    }
                }) 
            
                this.setState({
                    Date_To:date,
                    total_amount:sum,
                    received_amount:amount,
                    remaining_amount:sum-amount,
                },()=>{console.log(this.state,"state")})
            }
            return
        }

        if(name=="select_month"){

            const month=date.getMonth()
            const year=date.getFullYear()
            // console.log(month,"month")
            // console.log(year,"year")
            
                let sum=0;
                let amount=0;
                this.state.quotation.map(quotation=>{
                    
                    const quotation_date = new Date(quotation.date)
                    // console.log(quotation_date,"quotation_date")
                    const quotation_month=quotation_date.getMonth()
                    const quotation_year=quotation_date.getFullYear()
                    
                    if(quotation_month==month && quotation_year==year){
                       
                        sum = sum + quotation.amount
                        

                        this.state.invoice.map(invoice=>{
                            if(invoice.quotation_no==quotation.quotation_no){
                                
                                amount=amount+invoice.amount
                            }
                        })
                    }
                    
                }) 
                    this.setState({
                        select_month:date,
                        total_amount:sum,
                        received_amount:amount,
                        remaining_amount:sum-amount,
                    },()=>{console.log(this.state,"state")})
    
                
                return
            }
        

        this.setState({
            [name]:date
        },()=>{console.log(date,"value")})
    } 

    render() {
        const barData = this.chartData(); 
        const {Date_From,Date_To,select_month,total_amount,remaining_amount,received_amount,loading}= this.state;
        return (
            <div>
                
                <div className="component">

                <Row style={{marginTop:"30px"}}>
                       <Col lg={{span:2, offset:1}}>
                           <Form.Label className="search-title" >DASHBOARD</Form.Label></Col>
                       <Col lg={{span:5, offset:1}}>
                                <Form.Control type="text"  
                                    placeholder="Search"
                                    onChange={this.onChange}
                                    value=""
                                    name=""
                                    onChange=""
                                    className="search-input"
                                    />
                                    <button style={{position:"relative",
                                                bottom:"30px",
                                                left:"73%",backgroundColor:"white",border:"none"}} onClick={this.search}>
                                    <i className="fa fa-search" 
                                        ></i>
                                        </button>
                        </Col>
                </Row>
                   
                    <Card style={{marginTop:"10px"}}>
                        <Row >
                            <Col lg={2}>
                            
                            <Form.Control as="select" className="select" name=""  value="" onChange="" required>
                                        <option value="January 2021" >Country </option>
                                        <option value="February 2021">February 2021</option>
                                        <option value="March 2021">March 2021</option>
                                        <option value="April 2021">April 2021</option>
                            </Form.Control><i class="fa fa-angle-down" style={{position:"relative",bottom:"24px" , left:"65%",fontSize:"20px"}} ></i>
                            </Col>
                            <Col lg={2}>
                            <Form.Control as="select" className="select" name=""  value="" onChange="" required>
                                        <option value="January 2021" >Client </option>
                                        <option value="February 2021">February 2021</option>
                                        <option value="March 2021">March 2021</option>
                                        <option value="April 2021">April 2021</option>
                            </Form.Control><i class="fa fa-angle-down" style={{position:"relative",bottom:"24px" , left:"65%",fontSize:"20px"}} ></i>
                            </Col>
                            <Col lg={2}>
                            <Form.Control as="select" className="select" name=""  value="" onChange="" required>
                                        <option value="January 2021" >Contractor</option>
                                        <option value="February 2021">Contractor 1</option>
                                        <option value="March 2021">Contractor 2</option>
                                        <option value="April 2021">Contractor 3</option>
                            </Form.Control><i class="fa fa-angle-down" style={{position:"relative",bottom:"24px" , left:"65%",fontSize:"20px"}} ></i>
                            </Col>
                           
                        </Row>
                        
                    <Row >
                        <Col lg={8} className="inner-card">
                            <Row>
                                <Col xl={3} >
                                <Form.Group>
                                    <label className="inner-title">From</label>
                                    <DatePicker
                                        className="date-style"
                                        selected={Date_From}
                                        onChange={(date)=>{this.setDate(date, 'Date_From')}}
                                        name="Date_From"
                                        dateFormat="YYY/MM/dd"
                                        minDate={subYears(new Date(), 5)}
                                        maxDate={new Date()}
                                        placeholderText="From"
                                        />    
                                 </Form.Group>
                                </Col>

                                <Col xl={3}>
                                <Form.Group>
                                    <label className="inner-title">To</label>    
                                    <DatePicker
                                        className="date-style"
                                        selected={Date_To}
                                        onChange={(date)=>{this.setDate(date, 'Date_To')}}
                                        name="Date_To"
                                        dateFormat="YYY-MM-dd"
                                        minDate={subYears(new Date(), 5)}
                                        maxDate={new Date()}
                                        placeholderText="To"
                                        />
                                </Form.Group>
                                </Col>
                                
                                <Col xl={{span:4, offset:2}}>
                                    <DatePicker
                                        className="select-bold"
                                        selected={select_month}
                                        onChange={(date)=>{this.setDate(date, 'select_month')}}
                                        name="select_month"
                                        minDate={subYears(new Date(), 5)}
                                        maxDate={new Date()}
                                        dateFormat="MMMM, yyyy"
                                        showMonthYearPicker
                                        />
                                </Col>   
                            </Row>

                        {total_amount!=0 ? 
                        <Pie data={barData.data} options={barData.options}  height="110"> </Pie> : 
                        <div className="no-data">No Data Found...</div> 
                        }
                        </Col>

                        <Col lg={4}>
                        <Row>
                                <div className="inner-title">Client Amount</div>
                                <Row  className="inner-row" style={{backgroundColor:"rgb(33,213,155)"}}>
                                    <Col lg={4} sm={4} className="in-in-col">
                                        
                                        <label style={{color:"rgb(33,213,155)"}}>Total</label>
                                        <div>${total_amount}</div>
                                        
                                    </Col>
                                    <Col lg={4} sm={4} className="in-in-col">
                                    
                                        <label style={{color:"rgb(33,213,155)"}}>Received</label>
                                        <div>${received_amount}</div>
                                    
                                    </Col>
                                    <Col lg={4} sm={4} className="in-in-col">

                                        <label style={{color:"rgb(33,213,155)"}}>Remaining</label>
                                        <div>${remaining_amount}</div>

                                    </Col>
                                </Row>
                            </Row>
                            <Row>
                                <div className="inner-title">Contractor Amount</div>
                                <Row  className="inner-row" style={{backgroundColor:"rgb(87,98,214)"}}>
                                    <Col lg={4} sm={4} className="in-in-col" >

                                        <label style={{color:"rgb(87,98,214)"}}>Total</label>
                                        <div > ${total_amount} </div>

                                    </Col>
                                    <Col lg={4}  sm={4} className="in-in-col">

                                        <label style={{color:"rgb(87,98,214)"}}>Paid</label>
                                        <div>${received_amount}</div>

                                    </Col>
                                    <Col lg={4} sm={4} className="in-in-col" >

                                        <label style={{color:"rgb(87,98,214)"}}>Remaining</label>
                                        <div>${remaining_amount}</div>

                                    </Col>
                                </Row>
                            </Row>
                            <Row >
                            <div className="inner-title">Profit(Margin)</div>
                                <Row className="inner-row" style={{backgroundColor:"rgb(250, 143, 214)"}}>
                                    <Col lg={4}  sm={4} className="in-in-col">

                                        <label style={{color:"rgb(250, 143, 214)"}}>P&L</label>

                                    </Col >
                                    <Col lg={8} sm={8} >

                                        <label className="center-col">+5280K</label>

                                    </Col>
                                </Row>
                            </Row>
                            
                        </Col>
                    </Row>
                            
                        

                       
                    </Card>
               </div> 
            </div>
        )
    }
}

export default Dashboard
