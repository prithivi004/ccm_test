import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2';
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
import { SidebarOptions } from './ChartData'

export class Sidebar extends Component {  
    render() {
        const Data = {
            labels: ['0-30 DAYS', '30-60 DAYS', '> 60 DAYS'],
            datasets: [
                {
                    barThickness: 20,
                    backgroundColor: this.props.color,
                    data: this.props.data,
                }
            ]
        };
        const Options = SidebarOptions()
        return (
            <>
                <Row className='chartCard' >
                    <div style={{  maxWidth: '577px' }}>
                        <HorizontalBar data={Data} options={Options} />
                    </div>
                </Row>
            </>
        )
    }
}

export default Sidebar
