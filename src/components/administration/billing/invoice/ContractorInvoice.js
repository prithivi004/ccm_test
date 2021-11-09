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
import MulipleClientInvPayments from '../Payments/MulipleClientInvPayments';
export class ContractorInvoice extends Component {
    constructor(props) {
        super(props)

        this.initialState = {
            invoice_id: null,
            cont_id: null,
            invoiceNo: '',
            invoiceAmount: '',
            receivedDate: '',
            paidAmount: '',
            paidDate: '',
            tax: '',
            invoiceCredit: false,
            creditAmount: '',
            creditNote: '',
            creditDate: '',
            tempamt:'0.00',
            paymentShow: false,
            contpaymentShow:false,
            totalpayment:0,
        }
        this.state = this.initialState
    }
    componentDidMount() {

        axiosInstance.post(`/invoice/list/${this.props.quote_id}`)
            .then(res => {
                const invoice_list = res.data.response.invoice_list
                // console.log(invoice_list,'contractor')

                //filtering invoice_list 
                const contractor_invoice = [];                   // based on cont_id && quote_id
                const total_invoice = [];                        // based on quote_id

                invoice_list.map(inv => this.props.list.map(id => (parseInt(id) === parseInt(inv.id) && parseInt(inv.po_id) === parseInt(this.props.po_id)) && contractor_invoice.push(inv)))
                invoice_list.map(inv => this.props.list.map(id => (parseInt(id) === parseInt(inv.id)) && total_invoice.push(inv)))
                this.setState({ contractor_invoice, })

                //console.log(total_invoice,'total')
                //console.log(contractor_invoice,'continv')
                //contractor amount calculation 
                if (total_invoice.length !== 0) {
                    axiosInstance.post(`invoice/invoice_credit_lists`,{invoice_ids:this.props.list})
                    .then(res =>{
                        let ContcreditAmount = 0
                        const list = res.data.response.invoice_credit_list
                        list.map(credit => {
                            if(credit !== undefined){
                                ContcreditAmount += parseFloat(credit.credit_amount)
                            }
                        })
                        this.props.amountChange('credit_amount',ContcreditAmount)         // pass contractor amount to quotation
                        // this.props.callEdit()
                    })
                    const date = new Date(Math.max(...contractor_invoice.map(e => new Date(e.modified)))); 
                    const latest_invoice = contractor_invoice.find(invoice => new Date(invoice.modified) >= new Date(date))
                    //console.log(latest_invoice,"latest")
                    latest_invoice !== undefined && axiosInstance.post(`invoice/invoice_payment_list`,{invoice_id:latest_invoice.id})
                        .then(res =>{
                        const list = res.data.response.invoice_payment_list
                        let amount = 0
                        list.map(inv => amount += parseFloat(inv.price))
                        const date = new Date(Math.max(...list.map(e => new Date(e.payment_date))));
                        this.setState({paidDate:DateFormat(date),totalpayment:amount})
                    })
                    latest_invoice !== undefined ? this.setState({                                      // invoce edit fields
                        invoice_id: latest_invoice.id,
                        invoiceNo: latest_invoice.num !== null ? latest_invoice.num : '',
                        invoiceAmount: latest_invoice.invoice_amount !== null ? latest_invoice.invoice_amount : '',
                        receivedDate: latest_invoice.invoice_date !== null ? DateFormat(latest_invoice.invoice_date) : '',
                        // paidDate: latest_invoice.amount_received_date !== null ? DateFormat(latest_invoice.amount_received_date) : '',
                        paidAmount: latest_invoice.price !== null ? latest_invoice.price : '',
                        creditAmount: latest_invoice.credit_amount !== null ? latest_invoice.credit_amount : '',
                        invoiceCredit: true,
                        tempamt:latest_invoice.price !== null ? latest_invoice.price : '0.00',
                        tax:latest_invoice.tax_invoice !== null? latest_invoice.tax_invoice:'',
                        creditNote: latest_invoice.credit_note !== null ? latest_invoice.credit_note : '',
                        creditDate: latest_invoice.credit_date !== null ? DateFormat(latest_invoice.credit_date) : '',
                    }):this.setState({
                        invoice_id: null,
                        invoiceNo: '',
                        invoiceAmount: '',
                        receivedDate: '',
                        paidDate: '',
                        paidAmount: '',
                        creditAmount: '',
                        invoiceCredit: true,
                        tax:'',
                        creditNote: '',
                        creditDate: ''})
                }

            })
    }
    componentDidUpdate() {
        if (this.state.po_id !== (this.props.po_id)) {
            this.setState({ po_id: this.props.po_id }, () => this.componentDidMount())
        }

    }
    onChange = (e) => {
        const { quote_id, cont_id, } = this.props
        // const condition =
        //     (cont_id === "") ? this.props.swalAlert("Contractor Name", "cont_id") :
        //         (cont_id === null) ? Alert('warning', '', 'Please save PO details') : true

        if (e.target.name === 'invoiceNo') {
            this.setState({
                [e.target.name]: e.target.value,
                // invoice_id: null,
                // invoiceAmount: '',
                // receivedDate: '',
                paidAmount: '',
                // paidDate: '',
                // tax: '',
                // invoiceCredit: false,
                // creditAmount: '',
                // creditNote: '',
                // creditDate: '',
            },()=>this.props.passData(e.target.name,e.target.value))
            return
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
            this.props.amountChange('credit_amount',value)
        }
    }
    autoComplete = (value) => {

        value !== null && this.setState({                                      // invoce edit fields
            invoice_id: value.id,
            invoiceNo: value.num !== null ? value.num : '',
            invoiceAmount: value.invoice_amount !== null ? value.invoice_amount : '',
            receivedDate: value.invoice_date !== null ? DateFormat(value.invoice_date) : '',
            paidDate: value.amount_received_date !== null ? DateFormat(value.amount_received_date) : '',
            paidAmount: value.price !== null ? value.price : '',
            creditAmount: value.credit_amount !== null ? value.credit_amount : '',
            tax:value.tax_invoice !== null? value.tax_invoice:'',
            invoiceCredit: true,
            creditNote: value.credit_note !== null ? value.credit_note : '',
            creditDate: value.credit_date !== null ? DateFormat(value.credit_date) : '',
        })

    }


    onAdd = () => {
        const { contractor_invoice, cont_id, invoiceNo, invoiceAmount, receivedDate, paidAmount, paidDate, tax, invoiceCredit, creditAmount, creditNote, creditDate, } = this.state;
        const data = {
            cust_type: '2',
            quotation_id:this.props.quote_id,
            po_id:this.props.po_id,
            cust_id: this.props.cont_id,
            num: invoiceNo,
            invoice_amount: invoiceAmount,
            invoice_date: receivedDate,
            amount_received_date: paidDate,
            tax_invoice:tax,
            price: parseFloat(paidAmount).toFixed(2),
            credit_note: creditNote,
            credit_amount: parseFloat(creditAmount).toFixed(2),
            credit_date: creditDate,
        }
        //console.log(data)
        const duplicate = contractor_invoice.find(inv => inv.num == invoiceNo)
        const condition = this.props.quote_id === undefined ? Alert("error","Error!","Please Save the Quotation") : 
        duplicate !== undefined ? Alert("error","Error!","Invoice Number Already Exists"): true
            // (invoiceAmount === "") ? this.props.swalAlert("Invoice Amount", "cont_invoiceAmount") :
            //     (receivedDate === "") ? this.props.swalAlert("Invoice Received Date", "receivedDate") : true

        if (condition === true) {
            axiosInstance.post(`/invoice/add`, data)
                .then((res) => {
                    //console.log(res);
                    if (res.data.message.success !== undefined) {
                        this.props.invoiceAdd('contInvoice_list', res.data.response.invoice_id)  // add invoice_id to quotation 
                        // if(paidAmount != ''){
                        //     axiosInstance.post('invoice/save_invoice_payment',
                        //     {
                        //         invoice_id:res.data.response.invoice_id,
                        //         payments:[{
                        //             price:parseFloat(paidAmount),
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
        const { contractor_invoice, invoice_id, cont_id, invoiceNo, invoiceAmount, receivedDate, paidAmount, paidDate, tax, invoiceCredit, creditAmount, creditNote, creditDate, } = this.state;
        const data = {
            cust_type: '2',
            cust_id: this.props.cont_id,
            quotation_id:this.props.quote_id,
            po_id:this.props.po_id,
            num: invoiceNo,
            invoice_amount: invoiceAmount,
            invoice_date: receivedDate,
            tax_invoice:tax,
            amount_received_date: paidDate,
            price: parseFloat(paidAmount).toFixed(2),
            credit_note: creditNote,
            credit_amount: parseFloat(creditAmount).toFixed(2),
            credit_date: creditDate,
        }
        //console.log(data)
        // if (invoiceNo !== '' && invoiceAmount !== '' && receivedDate !== '') {
            if(value == 'edit'){
                axiosInstance.post(`/invoice/edit/` + invoice_id, data)
                .then(res => this.componentDidMount())
            }
            else{
                if(this.state.totalpayment > parseFloat(invoiceAmount)){
                    Alert("success", "success!", "Invoice amount should not smaller than total payments")
                }
                else{
                    axiosInstance.post(`/invoice/edit/` + invoice_id, data)
                    .then((res) => {
                        //console.log(res);
                        if (res.data.message.success !== undefined) {
                            // if(paidAmount != ''){
                            //     axiosInstance.post('invoice/save_invoice_payment',
                            //     {
                            //         invoice_id:res.invoice_id,
                            //         payments:[{
                            //             price:parseFloat(paidAmount),
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
            
        // } else {
        //     Alert("warning", "warning!", `Please enter required Field`,)
        // }
    }
    onDelete = (id) => {
        axiosInstance.post(`/invoice/delete`, { id })
            .then((res) => {
                //console.log(res);
                if (res.data.message.success !== undefined) {
                    this.props.invoiceRemove('contInvoice_list', id)                  // remove invoice_id from quotation
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
    contpaymentchange = () => {
        this.setState({ contpaymentShow: !this.state.contpaymentShow })
    }

    render() {
        const { contractor_invoice, invoice_id,contpaymentShow,tempamt, invoiceNo, invoiceAmount, receivedDate, paidAmount, paidDate, tax, invoiceCredit, creditAmount, creditNote, creditDate, paymentShow } = this.state;
        return (
            <>
                <Card style={{ marginTop: '15px' }}>
                <Row>
                       <Col lg={3}>
                       <Form.Label>CONTRACTOR INVOICE</Form.Label>
                      <hr/>
                       </Col>
                   </Row>
                    <Row>
                        <Col lg={3}>
                            <Form.Group >
                                <Form.Label > Contractor Invoice No</Form.Label>
                                <Autocomplete
                                    options={contractor_invoice}
                                    onChange={(e, value) => this.autoComplete(value, 'invoiceNo')}
                                    disabled={this.props.permission}
                                    getOptionLabel={(option) => option.num}
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
                                <Form.Label >Contractor Invoice Amount</Form.Label>
                                <CurrencyFormat
                                    id='cont_invoiceAmount'
                                    className='form-control'
                                    disabled={this.props.permission}
                                    value={invoiceAmount}
                                    placeholder=" Amount "
                                    onValueChange={(values) => this.onChangeAmount(values, 'invoiceAmount')}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            {/* <CustomTextBox
                                txtBoxID='receivedDate'
                                txtBoxLabel="Invoice Received Date"
                                txtBoxType="date"
                                disabled={this.props.permission}
                                txtBoxName="receivedDate"
                                txtBoxValue={receivedDate}
                                changeEvent={this.onChange}
                            /> */}
                            <Form.Group >
                                <Form.Label>Invoice Received Date</Form.Label>
                                 <Form.Control
                                        id='issuedDate'
                                        type="date"
                                        name="receivedDate"
                                        value={receivedDate}
                                        onChange={this.onChange}
                                        // disabled={this.props.permission}
                                    />
                                 </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <CustomTextBox
                                txtBoxLabel="Tax Invoice No"
                                txtBoxType="text"
                                txtBoxName="tax"
                                txtBoxValue={tax}
                                txtBoxPH="Tax Invoice No"
                                disabled={this.props.permission}
                                changeEvent={this.onChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3}>
                            <Form.Group>
                                <Form.Label >Paid Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    value={paidAmount}
                                    placeholder=" Amount "
                                    disabled={true}
                                    onValueChange={(values) => this.onChangeAmount(values, 'paidAmount')}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <Form.Group>
                                <CustomTextBox
                                    txtBoxLabel="Last Paid Date"
                                    txtBoxType="date"
                                    txtBoxName="paidDate"
                                    disabled={true}
                                    txtBoxValue={paidDate}
                                    changeEvent={this.onChange}
                                />
                            </Form.Group>
                        </Col>
                        </Row>
                        <hr/>
                        <Row>
                        <Col lg={3} sm={6} md={6} xs={12}>
                        <Row>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <div >
                            <Popup content="Add Invoice" trigger={<button className='button'  disabled={this.props.permission} onClick={this.onAdd}>Add</button>}/>
                            </div>
                            </Col>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <div >
                            <Popup content="Edit Invoice" trigger={<button className='button'  disabled={this.props.permission} onClick={this.onEdit}>Edit</button>} />
                            </div>
                            </Col>
                            </Row>  <br/>                        
                        </Col>  
                        <Col lg={3} sm={6} md={6} xs={12}>
                        <Row>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <button className='button'  onClick={this.paymentChange}  >List Invoice</button>
                                    <Payment
                                        show={paymentShow}
                                        handleClose={this.paymentChange}
                                        list={contractor_invoice}
                                        onDelete={this.onDelete}
                                        user='Contractor'
                                    />
                            </Col>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <div >
                                    <Popup content="Add Payments/Credits"  trigger={<button className='button' disabled={this.props.permission} onClick={this.contpaymentchange}>Payments/Credits</button>} />
                                    <MulipleClientInvPayments
                                        showPayment={contpaymentShow}
                                        handleClose={this.contpaymentchange}
                                        user='Contractor'
                                        InvNo={invoiceNo}
                                        InvAmount={invoiceAmount}
                                        issueDate={receivedDate}
                                        invId={invoice_id}
                                        EditQuote = {this.props.callEdit}
                                        continvIdList={this.props.list}
                                        margin={this.props.amountChange}
                                        recvcontAmt={(name,value,operation)=>
                                            operation == 'add'?this.setState({[name]:parseFloat(value)+parseFloat(paidAmount)},()=>this.onEdit('edit'))
                                            :operation=='edit'?this.setState({[name]:parseFloat(value)},()=>this.onEdit('edit'))
                                            :this.setState({[name]:parseFloat(paidAmount)-parseFloat(value)},()=>this.onEdit('edit'))
                                        }
                                        recvconCredit={(name,value,operation)=>
                                            operation == 'add'?this.setState({[name]:parseFloat(value)+parseFloat(creditAmount)},()=>this.onEdit('edit'))
                                            :operation=='edit'?this.setState({[name]:parseFloat(value)},()=>this.onEdit('edit'))
                                            :this.setState({[name]:parseFloat(creditAmount)-parseFloat(value)},()=>this.onEdit('edit'))
                                        }
                                        />
                                </div>
                            </Col>
                        </Row>                          
                        </Col>   
                        
                            
                              
                            
                                
                                {/* <Col lg={4} style={{ marginTop: '40px', marginLeft: '20px' }}>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check
                                            style={{ fontSize: '1.3em', fontWeight: 'bold' }}
                                            name='invoiceCredit'
                                            checked={invoiceCredit}
                                            type="checkbox"
                                            label="Submit Credit Note"
                                            onChange={this.checkboxChange}
                                            disabled={this.props.permission}
                                        />
                                    </Form.Group>
                                </Col> */}
                            
                      
                        </Row>
                    {/* {invoiceCredit &&
                        <Row>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label >Credit Note Amount</Form.Label>
                                    <CurrencyFormat
                                        className='form-control'
                                        value={creditAmount}
                                        placeholder="Credit Note Amount"
                                        onValueChange={(values) => this.onChangeAmount(values, 'creditAmount')}
                                        disabled={this.props.permission}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note Issued Date"
                                    txtBoxType="date"
                                    txtBoxName="creditDate"
                                    txtBoxValue={creditDate}
                                    changeEvent={this.onChange}
                                    disabled={this.props.permission}
                                />
                            </Col>
                            <Col lg={6}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note No"
                                    txtBoxType="text"
                                    txtBoxName="creditNote"
                                    txtBoxValue={creditNote}
                                    txtBoxPH="No"
                                    changeEvent={this.onChange}
                                    disabled={this.props.permission}
                                />
                            </Col>
                        </Row>} */}
                </Card>
            </>
        )
    }
}

export default ContractorInvoice
