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

export class ChartCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: '',
            dataObj: '',
            client_labels: ["Total", "Received", "Remaining"],
            cont_labels: ["Total", "Paid", "Remaining"],
        }
    }

    render() {
        const { client_labels, cont_labels, client_data, cont_data, } = this.state;
        const dataset = {
            labels: this.props.user === 'client' ? client_labels : cont_labels,
            datasets: [
                {
                    data: this.props.data,
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
        return (
            <>
                <Col xl='4' >
                    <Row style={{marginTop:10}}>
                        
                    </Row>
                    <Row className='chartCard'>
                        <Row>
                        <Col > <h6 style={{ marginTop: '35px',marginBottom:30 ,textAlign:'center'}}> {this.props.text}</h6> </Col><br/>
                        <hr/>
                        <Col xl='3' sm='3' lg='3' md='2' className="d-none d-sm-block" style={{marginTop:10}}>
                                <Col>
                                <div style={{marginLeft: '10px',borderRadius:3,marginTop: '5px',marginBottom:'10px',height:25,width:50,backgroundColor:'#9B9D9F'}}></div>
                                </Col>
                                <Col>
                                <div style={{marginLeft: '10px',borderRadius:3,marginTop: '5px',marginBottom:'10px',height:25,width:50,backgroundColor:'#438EEB'}}></div>
                                </Col>
                                <Col>
                                <div style={{marginLeft: '10px',borderRadius:3,marginTop: '5px',height:25,width:50,backgroundColor:'#FD7F59'}}></div>
                                </Col>
                            </Col>
                            <Col xl='4' sm='4' md='4' lg='3' xs='6' style={{marginTop:10}}>
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
                            <Col xl='4' sm={{ offset: '1', span: '4' }} lg={{ offset: '1', span: '5' }}  xs={{ offset: '1', span: '5' }}  style={{marginTop:10}}>
                                {this.props.data !== undefined && this.props.data.map(data =>
                                    <Col>
                                        <h6 style={{textAlign:'right', paddingTop: '7px',marginBottom:'10px'  }} >{parseFloat(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} </h6>
                                    </Col>
                                )}
                            </Col>
                        </Row>
                        <Row >
                            <div style={{marginLeft: '5px', maxHeight: '500px', maxWidth: '500px',marginTop: '20px' }}>
                                <Pie data={dataset} options={Options} />
                            </div>

                            <div style={{ marginLeft: '10px',position: 'relative', bottom: '20px',  marginTop: '30px' }} >
                            <Row>
                            
                               
                                <Col lg={6}>
                                <button style={button} >Profit = {this.props.margin} </button>
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
