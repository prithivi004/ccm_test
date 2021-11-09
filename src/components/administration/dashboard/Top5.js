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
    ListGroup,
} from 'react-bootstrap';
import {Table,Header,Rating} from 'semantic-ui-react'
// import { CurrencyConvertor } from '../../utils/Calculator';

export class Top5 extends Component {
    constructor(props){
        super(props)
        this.state = {
            currency:'SGD'
        }
    }
    componentDidMount(){
        // console.log(this.props.currency,"amt")
        this.setState({currency:this.props.currency})
    }
    componentDidUpdate(previousProps, previousState){
        // this.setState({currency:this.props.currency})
        if (previousProps.currency !== this.props.currency) {
            this.setState({currency:this.props.currency})
        }
        // console.log(this.props.currency)
    }
    Converter = (currency,list,amount) =>{
       const data =  parseFloat(amount) * (list[this.state.currency] / list[currency])
    //   console.log(data,'Mine')
       return data.toFixed(2)
    }
    render() {
        const list = this.props.list
        const currency_list = this.props.currency_list
        // console.log(list)
        const amount = {
            color:this.props.color
        }
        const label = {
            // padding: '11px 10px',
            fontSize: '1 em',
            
        }
        // return (
        //     <>
        //     <Row className='chartCard' >
        //         <ListGroup variant="flush">
        //         {list.map(data=>
        //             <ListGroup.Item style={label} >
        //                 <Row style={{height:'42px'}}>
        //                     <Col style={amount}> <h6> {data.name} </h6></Col>
        //                     {/* <Col lg='4'>{data.num}</Col> */}
        //                     <Col>{this.Converter(data.currency,currency_list,data.receivables).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </Col>
        //                 </Row>
        //             </ListGroup.Item>)}
        //             </ListGroup>
        //         </Row>
        //     </>
        // )

        return(
            <div className='chartCard'>
            <Table celled padded>
            <Table.Header >
              <Table.Row >
                <Table.HeaderCell style={{color:this.props.color}} >{this.props.name}</Table.HeaderCell>
                <Table.HeaderCell style={{color:this.props.color}}>Amount</Table.HeaderCell>
              </Table.Row>
            </Table.Header>      
            <Table.Body style={{backgroundColor:'#E8F3FA'}}>
            {list.map(data=>
              <Table.Row>
                <Table.Cell style={{width:500}}>
                {data.name}
                </Table.Cell>
                <Table.Cell >{this.Converter(data.currency,currency_list,data.receivables).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Table.Cell>
              </Table.Row>
            )}
            </Table.Body>            
          </Table>
          </div>
        )
    }
}

export default Top5