import React, { Component } from 'react'
import { Form, Row, Col, Card } from 'react-bootstrap'
import {Label} from 'semantic-ui-react'
import axiosInstance from '../../../utils/axiosinstance'
import CurrencyFormat from 'react-currency-format'
import Autocomplete from '@material-ui/lab/Autocomplete';
import CustomTextBox from '../../../utils/TextBox'
import { Alert } from '../../../utils/Utilities'
import Payment from './Payment'
import { DateFormat } from '../../../utils/DateFormat'
import { Popup } from 'semantic-ui-react'
import MulipleClientInvPayments from '../Payments/MulipleClientInvPayments'
export class ClientInvoice extends Component {
    constructor(props) {
        super(props)

        this.initialState = {
            invoice_id: null,
            client_id: this.props.client_id,
            invoiceNo: '',
            invoiceAmount: '',
            issuedDate: '',
            receivedDate: '',
            receivedAmount: '',
            creditAmount: '',
            invoiceCredit: false,
            creditNote: '',
            creditDate: '',
            tempamt:'0.00',
            paymentShow: false,
            clipaymentShow: false,
            first:true,
            totalPayment:0,
        }
        this.state = this.initialState
    }
    componentDidMount() {
        this.setState({
            client_id:this.props.client_id
        })
        axiosInstance.post(`/invoice/list/${this.props.quote_id}`)
            .then(res => {
                const invoice_list = res.data.response.invoice_list
                // console.log(invoice_list,'client')
                //filtering quotation client invoicelist from total invoice
                const client_invoice = [];
                invoice_list.map(inv => this.props.list.map(id => (parseInt(id) === parseInt(inv.id)) && client_invoice.push(inv)))
                this.setState({ client_invoice, client_id: this.props.client_id, })

                //client amount calculation
                
                // console.log(inv)
                // console.log(client_invoice)
                if (client_invoice.length !== 0) {
                    axiosInstance.post(`invoice/invoice_credit_lists`,{invoice_ids:this.props.list})
                    .then(res =>{
                        const list = res.data.response.invoice_credit_list
                        let ClientcreditAmount = 0
                        list.map(credit => {
                            if(credit !== undefined){
                                ClientcreditAmount += parseFloat(credit.credit_amount)
                            }
                        })
                        this.props.amountChange('creditAmount',ClientcreditAmount) // pass client_amount to quotation page
                        // this.props.callEdit()
                    })
                    const date = new Date(Math.max(...client_invoice.map(e => new Date(e.modified)))); 
                    const latest_invoice = client_invoice.find(invoice => new Date(invoice.modified) >= new Date(date))
                    // const latest_invoice = client_invoice[client_invoice.length - 1]
                    // //console.log(latest_invoice)
                     
                    if (this.state.first){
                        latest_invoice !== undefined && axiosInstance.post(`invoice/invoice_payment_list`,{invoice_id:latest_invoice.id})
                        .then(res =>{
                        const list = res.data.response.invoice_payment_list
                        let amount = 0
                        list.map(inv => amount+= parseFloat(inv.price))
                        const date = new Date(Math.max(...list.map(e => new Date(e.payment_date))));
                        this.setState({receivedDate:DateFormat(date),totalPayment:amount})
                    })
                    latest_invoice !== undefined && this.setState({
                        invoice_id: latest_invoice.id,
                        invoiceNo: latest_invoice.num !== null ? latest_invoice.num : '',
                        invoiceAmount: latest_invoice.invoice_amount !== null ? latest_invoice.invoice_amount : '',
                        issuedDate: latest_invoice.invoice_date !== null ? DateFormat(latest_invoice.invoice_date) : '',
                        // receivedDate: latest_invoice.amount_received_date !== null ? DateFormat(latest_invoice.amount_received_date) : '',
                        receivedAmount: latest_invoice.price !== null ? latest_invoice.price : '',
                        creditAmount: latest_invoice.credit_amount !== null ? latest_invoice.credit_amount : '',
                        invoiceCredit: true,
                        tempamt: latest_invoice.price !== null ? latest_invoice.price : '0.00',
                        creditNote: latest_invoice.credit_note !== null ? latest_invoice.credit_note : '',
                        creditDate: latest_invoice.credit_date !== null ? DateFormat(latest_invoice.credit_date) : '',
                    })
                }
                }

            })
    }
    componentDidUpdate(previousProps,previousState) {
        //console.log(previousProps.client_id,"client")
        if (previousProps.client_id !== this.props.client_id) {
            this.componentDidMount()
           this.cancel()
        }

    }
    cancel = () =>{
        this.setState({
            invoice_id: '',
            invoiceNo: '',
            invoiceAmount: '',
            issuedDate: '',
            receivedDate: '',
            receivedAmount: '',
            creditAmount: '',
            invoiceCredit: false,
            creditNote: '',
            creditDate: '',
        })
    }
    onChange = (e) => {
        const { quote_id, client_id, client_PO } = this.props
        const condition =
                (client_id === "" || client_id==='0') ? this.props.swalAlert("Client Name", "client_id") :
                    // (client_PO === "") ? this.props.swalAlert("Client PO", "client_po") :
                     true

        // if (e.target.name === 'invoiceNo' && this.state.invoiceNo === '') {
        //     this.setState(this.initialState)
        // }
        if(e.target.name == 'invoiceNo'){
            this.setState({receivedAmount:''})
        }
        this.setState({ [e.target.name]: e.target.value },()=>this.props.passData(e.target.name,e.target.value))
    }
    checkboxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked })
    }
    onChangeAmount = (values, name) => {
        const { formattedValue, value } = values;
        this.setState({ [name]: value },()=>this.props.passData(name,value))
        if(name === 'creditAmount'){
            this.props.amountChange('creditAmount',value)
        }
    }
    autoComplete = (value) => {
        console.log(value)

        if(value !== null){
                this.setState({                    // invoce edit fields
                    invoice_id: value.id,
                    invoiceNo: value.num !== null ? value.num : '',
                    invoiceAmount: value.invoice_amount !== null ? value.invoice_amount : '',
                    issuedDate: value.invoice_date !== null ? DateFormat(value.invoice_date) : '',
                    receivedDate: value.amount_received_date !== null ? DateFormat(value.amount_received_date) : '',
                    receivedAmount: value.price !== null ? value.price : '',
                    creditAmount: value.credit_amount !== null ? value.credit_amount : '',
                    invoiceCredit: true,
                    creditNote: value.credit_note !== null ? value.credit_note : '',
                    creditDate: value.credit_date !== null ? DateFormat(value.credit_date) : '',
                })
            }
            else{
                this.setState({
                    invoice_id: '',
                    invoiceNo: '',
                    invoiceAmount: '',
                    issuedDate: '',
                    receivedDate: '',
                    receivedAmount: '',
                    creditAmount: '',
                    invoiceCredit: false,
                    creditNote: '',
                    creditDate: '',
                })
            }

    }

    onAdd = () => {
        const { client_invoice, client_id, invoiceNo, invoiceAmount, issuedDate, receivedDate, receivedAmount, invoiceCredit, creditAmount, creditNote, creditDate, } = this.state;
        const data = {
            cust_type: '1',
            cust_id: this.props.client_id,
            quotation_id:this.props.quote_id,
            num: invoiceNo,
            invoice_amount: invoiceAmount,
            invoice_date: issuedDate,
            amount_received_date: receivedDate,
            price: parseFloat(receivedAmount).toFixed(2),
            credit_note: creditNote,
            credit_amount: parseFloat(creditAmount).toFixed(2),
            credit_date: creditDate,
        }
        //console.log(data)
        const duplicate = client_invoice.find(inv => inv.num == invoiceNo)

        const condition = this.props.quote_id === undefined ? Alert("error","Error!","Please Save the Quotation") : 
                            duplicate !== undefined ? Alert("error","Error!","Invoice Number Already Exists"): true
            // (invoiceAmount === "") ? this.props.swalAlert("Invoice Amount", "invoiceAmount") :
            //     (issuedDate === "") ? this.props.swalAlert("Invoice Issued Date", "issuedDate") : true

        if (condition === true) {
            axiosInstance.post(`/invoice/add`, data)
                .then((res) => {
                    //console.log(res);
                    if (res.data.message.success !== undefined) {
                        this.props.invoiceAdd('clientInvoice_list', res.data.response.invoice_id)
                        // if(receivedAmount != ''){
                        //     axiosInstance.post('invoice/save_invoice_payment',
                        //     {
                        //         invoice_id:res.data.response.invoice_id,
                        //         payments:[{
                        //             price:parseFloat(receivedAmount),
                        //             payment_date:receivedDate
                        //         }]
                        //     }).then(res=>console.log(res.data))
                        // }
                        Alert("success", "success!", `${res.data.message.success}`,)
                        this.onCancel()
                    } else {
                        Alert("error", "error!", `${res.data.message.error}`,)
                    }
                })
                .catch((e) => {
                    //console.log(e)
                })
        }
    }

    onEdit = (value) => {
        const { client_invoice, invoice_id, client_id, invoiceNo, invoiceAmount, issuedDate, receivedDate, receivedAmount, invoiceCredit, creditAmount, creditNote, creditDate, } = this.state;
        const data = {
            cust_type: '1',
            cust_id: this.props.client_id,
            quotation_id:this.props.quote_id,
            num: invoiceNo,
            invoice_amount: invoiceAmount,
            invoice_date: issuedDate,
            amount_received_date: receivedDate,
            price: parseFloat(receivedAmount).toFixed(2),
            credit_note: creditNote,
            credit_amount: parseFloat(creditAmount).toFixed(2),
            credit_date: creditDate,
        }

        if(value == 'edit'){
            axiosInstance.post(`/invoice/edit/` + invoice_id, data)
            .then(res => this.componentDidMount())
        }
        else{
            if(this.state.totalPayment > parseFloat(invoiceAmount)){
                Alert("error", "Error!", "Invoice amount should not smaller than total payments")
            }
            else{
                axiosInstance.post(`/invoice/edit/` + invoice_id, data)
                .then((res) => {
                    if (res.data.message.success !== undefined) {
                        // if(receivedAmount != ''){
                        //     axiosInstance.post('invoice/save_invoice_payment',
                        //     {
                        //         invoice_id:invoice_id,
                        //         payments:[{
                        //             price:parseFloat(receivedAmount),
                        //             payment_date:receivedDate
                        //         }]
                        //     }).then(res=>console.log(res.data))
                        // }
                        Alert("success", "success!", `${res.data.message.success}`,)
                        this.onCancel()
                    } else {
                        Alert("error", "error!", `${res.data.message.error}`,)
                    }
                })
                .catch((e) => {
                    //console.log(e)
                })
            }
            
        }
            
            
    }
    onDelete = (id) => {
        axiosInstance.post(`/invoice/delete`, { id })
            .then((res) => {
                //console.log(res);
                if (res.data.message.success !== undefined) {
                    this.props.invoiceRemove('clientInvoice_list', id)
                    Alert("success", "success!", `${res.data.message.success}`,)
                    this.onCancel()
                } else {
                    Alert("error", "error!", `${res.data.message.error}`,)
                }
            })
            .catch((e) => {
                //console.log(e)
            })
    }
    onCancel = () => {
        this.setState(this.initialState)
        this.componentDidMount()
    }
    paymentChange = () => {
        this.setState({ paymentShow: !this.state.paymentShow })
    }
    clipaymentchange = () => {
        this.setState({ clipaymentShow: !this.state.clipaymentShow })
    }
    checkDisable = () =>{
        if(this.props.permission){
            if(this.props.quote_id != undefined){
                const flag = this.state.receivedAmount == ''?false:true
                return flag
            }
        }
        else{
            return false
        }
    }
    render() {
        const { client_invoice, invoice_id,tempamt, invoiceNo,clipaymentShow, invoiceAmount, issuedDate, receivedDate, receivedAmount, invoiceCredit, creditAmount, creditNote, creditDate, paymentShow } = this.state;
        // //console.log(this.props.permission)
        return (
            <>
                <Card style={{ marginTop: '15px', }} >
                <Row>
                       <Col lg={3}>
                       <Form.Label>CLIENT INVOICE</Form.Label>
                      <hr/>
                       </Col>
                   </Row>
                    <Row>
                        <Col lg={3}>
                            <Form.Group>
                                <Form.Label > Client Invoice No</Form.Label>
                                <Autocomplete
                                    options={client_invoice}
                                    onChange={(e, value) => this.autoComplete(value)}
                                    onInputChange={(inputValue)=>console.log(inputValue)}
                                    getOptionLabel={(option) => option.num}
                                    disabled={this.props.permission}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref} class="input-group">
                                            <Form.Control placeholder='Invoice No' type="text" {...params.inputProps} name='invoiceNo' value={invoiceNo} onChange={this.onChange} />
                                        </div>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <Form.Group>
                                <Form.Label >Client Invoice Amount</Form.Label>
                                <CurrencyFormat
                                    id='invoiceAmount'
                                    className='form-control'
                                    value={invoiceAmount}
                                    disabled={this.props.permission}
                                    placeholder="Client Invoice Amount"
                                    onValueChange={(values) => this.onChangeAmount(values, 'invoiceAmount')}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            {/* <CustomTextBox
                                txtBoxID='issuedDate'
                                txtBoxLabel="Invoice Issued Date"
                                txtBoxType="date"
                                txtBoxName="issuedDate"
                                txtBoxValue={issuedDate}
                                txtBoxPH="Commense"
                                changeEvent={this.onChange}
                                disabled={this.props.permission}
                            /> */}
                            <Form.Group >
                                <Form.Label>Invoice Issued Date</Form.Label>
                                 <Form.Control
                                        id='issuedDate'
                                        type="date"
                                        name="issuedDate"
                                        value={issuedDate}
                                        onChange={this.onChange}
                                        disabled={this.props.permission}
                                    />
                                 </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <CustomTextBox
                                txtBoxLabel="Last Received Date"
                                txtBoxType="date"
                                txtBoxName="receivedDate"
                                txtBoxValue={receivedDate}
                                txtBoxPH="Commense"
                                disabled={true}
                                changeEvent={this.onChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3}>
                            <Form.Group>
                                <Form.Label >Received Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    disabled={true}
                                    value={receivedAmount}
                                    placeholder="Received Amount"
                                    onValueChange={(values) => this.onChangeAmount(values, 'receivedAmount')}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>                     
                        </Row>
                        <hr/>
                        <Row> 
                        <Col lg={3} sm={6} md={6} xs={12}>
                        <Row>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <div >
                               <Popup content="Add Invoice" trigger={<button className='button'   disabled={this.props.permission} onClick={this.onAdd}>Add</button>}/>
                            </div>
                            </Col>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <div>
                            <Popup content="Edit Invoice" trigger={<button className='button'    disabled={this.props.permission} onClick={this.onEdit}>Edit</button>}/>
                            </div>
                                </Col>
                        </Row><br/>                          
                        </Col>   
                        <Col lg={3} sm={6} md={6} xs={12}>
                        <Row>
                            <Col lg={6} sm={6}  md={6} xs={6}>  
                            <button className='button'  onClick={this.paymentChange} >List Invoice</button>
                            <Payment
                                show={paymentShow}
                                handleClose={this.paymentChange}
                                list={client_invoice}
                                onDelete={this.onDelete}
                                user='Client'
                            />
                            <MulipleClientInvPayments
                                showPayment={clipaymentShow}
                                handleClose={this.clipaymentchange}
                                user='Client'
                                InvNo={invoiceNo}
                                InvAmount={invoiceAmount}
                                issueDate={issuedDate}
                                recvAmt={(name,value,operation)=>
                                    operation == 'add'?this.setState({[name]:parseFloat(value)+parseFloat(receivedAmount)},()=>this.onEdit('edit'))
                                    :operation=='edit'?this.setState({[name]:parseFloat(value)},()=>this.onEdit('edit'))
                                    : this.setState({[name]:parseFloat(receivedAmount)-parseFloat(value)},()=>this.onEdit('edit'))
                                }  
                                recvCredit={(name,value,operation)=>
                                    operation == 'add'?this.setState({[name]:parseFloat(value)+parseFloat(creditAmount)},()=>this.onEdit('edit'))
                                    :operation=='edit'?this.setState({[name]:parseFloat(value)},()=>this.onEdit('edit'))
                                    : this.setState({[name]:parseFloat(creditAmount)-parseFloat(value)},()=>this.onEdit('edit'))
                                }   
                                invId={invoice_id}
                                EditQuote = {this.props.callEdit}
                                clientinvIdList={this.props.list}
                                creditAmt={creditAmount}
                                margin={this.props.amountChange}/>
                            </Col>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <div >
                            <Popup content="Add Payments/Credits" trigger={<button className='button' disabled={this.props.permission} onClick={this.clipaymentchange}>Payments/Credits</button>}/>
                            </div>
                            </Col>
                        </Row>                          
                        </Col>                  
                        
                    </Row>
                        {/* <Col lg={2} style={{ marginTop: '40px', marginLeft: '20px' }}>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check
                                    style={{ fontSize: '1.3em', fontWeight: 'bold' }}
                                    name='invoiceCredit'
                                    disabled={this.props.permission}
                                    checked={invoiceCredit}
                                    type="checkbox"
                                    label="Submit Credit Note"
                                    onChange={this.checkboxChange}
                                />
                            </Form.Group>
                        </Col>
                        
                    {invoiceCredit &&
                        <Row>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label >Credit Note Amount</Form.Label>
                                    <CurrencyFormat
                                        className='form-control'
                                        disabled={this.props.permission}
                                        value={creditAmount}
                                        placeholder="Credit Note Amount"
                                        onValueChange={(values) => this.onChangeAmount(values, 'creditAmount')}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note Issued Date"
                                    txtBoxType="date"
                                    txtBoxName="creditDate"
                                    txtBoxValue={creditDate}
                                    disabled={this.props.permission}
                                    changeEvent={this.onChange}
                                />
                            </Col>
                            <Col lg={6}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note No"
                                    txtBoxType="text"
                                    txtBoxName="creditNote"
                                    txtBoxValue={creditNote}
                                    txtBoxPH="No"
                                    disabled={this.props.permission}
                                    changeEvent={this.onChange}
                                />
                            </Col> */}
                        {/* </Row>} */}


                </Card>
            </>
        )
    }
}

export default ClientInvoice
