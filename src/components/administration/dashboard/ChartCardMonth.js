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
            client_labels: ["Payables","Receivables"],
            cont_labels: ["Total", "Paid", "Remaining"],
        }
    }

    render() {
        //console.log(this.props.data)
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
            backgroundColor: "#52AF66",
            color: 'white',
            padding: '8px',
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
                <Col xl='4'>
                    <Row style={{marginTop:11}}>
                        
                    </Row>
                    <Row className='chartCard'>
                        <Row>
                        <Col > <h6 style={{ marginTop: '35px',marginBottom:30,textAlign:'center' }}> {this.props.text}</h6> </Col><br/>
                        <hr/>
                        <Col xl='3' sm='3' lg='3' md='2' className="d-none d-sm-block" style={{marginTop:10}}>
                                <Col>
                                <div style={{borderRadius:3,marginTop: '5px',marginBottom:'10px',marginLeft: '10px',height:25,width:50,backgroundColor:'#9B9D9F'}}></div>
                                </Col>
                                <Col>
                                <div style={{borderRadius:3,marginTop: '5px',marginLeft: '10px',height:25,width:50,backgroundColor:'#438EEB'}}></div>
                                </Col>
                                
                            </Col>
                            <Col xl='4' sm='4' lg='3' md='4' xs='6' style={{marginTop:10}}>
                                
                                <Col>
                                    <h6 style={{ paddingTop: '10px',marginBottom:'10px',color:'#9B9D9F'  }}>PAYABLES</h6>
                                </Col>
                                <Col>
                                    <h6 style={{ paddingTop: '5px',color:'#438EEB' }}> RECEIVABLES</h6>
                                </Col>
                               
                            </Col>
                            <Col xl='4' sm={{ offset: '1', span: '4' }} lg={{ offset: '1', span: '5' }} xs={{ offset: '1', span: '5' }} style={{marginTop:10}}>
                                {this.props.data !== undefined && this.props.data.map(data =>
                                    <Col>
                                        <h6 style={{ textAlign:'right', paddingTop: '7px',marginBottom:'10px' }} >{data == NaN?0.00:parseFloat(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} </h6>
                                    </Col>
                                )}
                            </Col>
                        </Row>
                        <Row >
                            <div style={{marginLeft: '5px', maxHeight: '500px', maxWidth: '500px',marginTop: '25px' }}>
                                <Pie data={dataset} options={Options} />
                            </div>

                            <div style={{ position: 'relative',  marginTop: '75px' }} >
                           <br/>
                                {/* <h6 > Profit </h6>
                                <button style={button} > {this.props.margin} </button> */}
                            </div>
                        </Row>
                    </Row>
                </Col>
            </>
        )
    }
}

export default ChartCard
