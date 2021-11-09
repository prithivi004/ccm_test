import React, { Component } from 'react'
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Image,
    Table,
} from 'react-bootstrap';

class Invoice extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
           
        }
    }
    
    render() {
        return (
            <>
          <tr className={this.props.id % 2 === 0 ? "rowtable":""}>
              
            <th>INVOICE NUMBER</th>
            <th>DATE ISSUED</th>
            <th>CLIENT</th>
            <th>DESCRIPTION</th>
            <th>INVOICE AMOUNT</th>
            <th>QUOTE APPROVAL</th>

          </tr>
           <tr className={this.props.id % 2 === 0 ? "rowtable":""}>   
           <td>123456778</td>
           <td>12/03/2020</td>
           <td>boruto</td>
           <td>Description </td>
           <td>87697</td>
           <td>pending</td>
         </tr>

         <tr className={this.props.id % 2 === 0 ? "rowtable":""}>   
           <td>123456778</td>
           <td>12/03/2020</td>
           <td>boruto</td>
           <td>Description </td>
           <td>87697</td>
           <td>pending</td>
         </tr>

         <tr className={this.props.id % 2 === 0 ? "rowtable":""}>   
           <td>123456778</td>
           <td>12/03/2020</td>
           <td>boruto</td>
           <td>Description </td>
           <td>87697</td>
           <td>pending</td>
         </tr>

         <tr className={this.props.id % 2 === 0 ? "rowtable":""}>   
           <td>123456778</td>
           <td>12/03/2020</td>
           <td>boruto</td>
           <td>Description </td>
           <td>87697</td>
           <td>pending</td>
         </tr>
        </>
        )
    }
}

export default Invoice
