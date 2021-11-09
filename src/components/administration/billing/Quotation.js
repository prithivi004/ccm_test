import React,{useState,useEffect} from 'react'
import { Card, Container, Row, Col, Form, } from 'react-bootstrap'
import CustomTextBox from '../../utils/TextBox'
import CustomButton from '../../utils/Button'
import axiosInstance from '../../utils/axiosinstance'
import CurrencyFormat from 'react-currency-format'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { CategoryList } from '../../utils/CategoryList'
import { Alert } from '../../utils/Utilities'
import { DateFormat } from '../../utils/DateFormat'
import Curreny from 'currency-codes'
import $ from 'jquery'
import swal from 'sweetalert';
import { getParamByParam } from 'iso-country-currency'
import Snackbar from '@material-ui/core/Snackbar';
import { Popup } from 'semantic-ui-react'



function Quotation(props) {

    //States Section
    const [currency, setcurrency] = useState('')
    const [QuotationList, setQuotationList] = useState([])
    const [ParentQuotationList, setParentQuotationList] = useState([])
    const [ParentQuoteId, setParentQuoteId] = useState('')
    const [QuoteID, setQuoteID] = useState('')
    const [category, setcategory] = useState('')
    const [user, setuser] = useState({})

    const [QuotationNumber, setQuotationNumber] = useState('')
    const [clientList, setclientList] = useState([])
    const [ClientID, setClientID] = useState('')
    const [QuoteAmount, setQuoteAmount] = useState('')
    const [ClientPo, setClientPo] = useState('')
    const [QuotationIssuedDate, setQuotationIssuedDate] = useState('')
    const [QuotationStatus, setQuotationStatus] = useState('2')
    const [margin, setmargin] = useState(0)
    const [margin_amount, setmargin_amount] = useState(0)
    const [description, setdescription] = useState('')

    const [clientInvNo, setclientInvNo] = useState('')
    const [clientInvList, setclientInvList] = useState([])
    const [ClientInvoiceNumber, setClientInvoiceNumber] = useState('')
    const [ClientInvoiceAmount, setClientInvoiceAmount] = useState('')
    const [ClientIssuedDate, setClientIssuedDate] = useState('')
    const [ClientReceivedDate, setClientReceivedDate] = useState('')
    const [ClientReceivedAmount, setClientReceivedAmount] = useState('')
    const [clientInvoiceCredit, setclientInvoiceCredit] = useState(false)
    const [ClientCreditAmount, setClientCreditAmount] = useState('')
    const [ClientCreditDate, setClientCreditDate] = useState('')
    const [ClientCreditNote, setClientCreditNote] = useState('')
    const [ClientInvId, setClientInvId] = useState('')

    const [ContPoList, setContPoList] = useState([])
    const [contPoNumber, setcontPoNumber] = useState('')
    const [contPoAmount, setcontPoAmount] = useState('')
    const [ContPoIssuedDate, setContPoIssuedDate] = useState('')
    const [ContWorkCommence, setContWorkCommence] = useState('')
    const [ContWorkComplete, setContWorkComplete] = useState('')

    const [ContractorInvoiceList, setContractorInvoiceList] = useState([])
    const [ContInvNo, setContInvNo] = useState('')
    const [ContInvAmount, setContInvAmount] = useState('')
    const [ContReceivedDate, setContReceivedDate] = useState('')
    const [TaxNo, setTaxNo] = useState('')
    const [ContPaidAmount, setContPaidAmount] = useState('')
    const [ContPaidDate, setContPaidDate] = useState('')
    const [ContInvCrredit, setContInvCrredit] = useState(false)
    const [ContCreditAmount, setContCreditAmount] = useState('')
    const [ContCreditDate, setContCreditDate] = useState('')
    const [ContCreditNote, setContCreditNote] = useState('')

    const [TicketNo, setTicketNo] = useState('')
    const [JobComplete, setJobComplete] = useState('')
    const [JobStatus, setJobStatus] = useState('2')

    let clientInvoiceIds = []
    //Effects Section
    useEffect(()=>{ 
        
        //for Default country specific currency
        axiosInstance.post('/country/list')
        .then(res=>{
            const countries = res.data.response.country_list
            const findcountry = countries.find(country => country.id == localStorage.getItem('countryid'))
            if(findcountry !== undefined){
                const currency = getParamByParam('countryName',findcountry.name,'currency')
                setcurrency(currency)}
            })
        
        // total quotations
        axiosInstance.post(`/quotation/list`)
            .then(res =>{
                const quotation_list = res.data.response.quotation_list
                // console.log(quotation_list)
                setuser(res.data.session.users)
                setQuotationList(quotation_list)
            })
        
        //Parent Quotation
        axiosInstance.post(`/quotation/filter`,{country_id:localStorage.getItem('countryid')})
            .then(res =>{
                const parent = res.data.response.quotation_list
                setParentQuotationList(parent)
            })
            
        //ClientList
        axiosInstance.post(`/client/list`,{country:localStorage.getItem('countryid')})
            .then(res => {
                const client_list = res.data.response.client_list
                setclientList(client_list)
            })
    },[])



// Functions Section
const swalAlert = (name, id) => {        // alert message & focus
    swal({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fillout ' + name,
        button: {
            OK: true
        },
    }).then((value) => {
        $("#" + id).focus()
    });
}

const ClientInvAutoComplete = () =>{

}

const SaveQuote = () =>{

    const condition =
    (QuotationNumber === "") ? swalAlert("Quotation No", "quotation_num") :
        (currency === "") ? swalAlert("Currency", "currency") :
            (ClientID === "") ? swalAlert("Client Name", "client_id") : true
 
    if (condition === true) {

        axiosInstance.post(`/quotation/add`, 
            {
                parent_id:ParentQuoteId,
                categories:category,
                quotation_num:QuotationNumber,
                description,
                client_id:ClientID,
                client_po:ClientPo,
                qut_date_issue:QuotationIssuedDate,
                quotation_amt:QuoteAmount,
                qut_status:QuotationStatus,
                country_id:localStorage.getItem('countryid'),
                job_status:JobStatus
            })
            .then((res) => {
                if (res.data.message.success !== undefined) {
                    setQuoteID(res.data.response.quotation_id)
                    Alert("success", "success!", `${res.data.message.success}`)
                }
                else {
                    Alert("error", "error!", `${res.data.message.error}`,)
                }
            })
    }
}

 const EditQuote = () =>{
        axiosInstance.post(`/quotation/add`, 
        {
            parent_id:ParentQuoteId,
            categories:category,
            quotation_num:QuotationNumber,
            description,
            client_id:ClientID,
            client_po:ClientPo,
            qut_date_issue:QuotationIssuedDate,
            quotation_amt:QuoteAmount,
            qut_status:QuotationStatus,
            country_id:localStorage.getItem('countryid'),
            job_status:JobStatus
        }).then(res =>{
            if (res.data.message.success !== undefined) {
                Alert("success", "success!", `${res.data.message.success}`)
            } else {
                Alert("error", "error!", `${res.data.message.error}`,)
            }
        })
 }

 const AddClientInv = () =>{
    const condition =
    (ClientInvoiceAmount === "") ? swalAlert("Invoice Amount", "invoiceAmount") :
        (ClientIssuedDate === "") ? swalAlert("Invoice Issued Date", "issuedDate") : true

        if (condition) {
            axiosInstance.post(`/invoice/add`, {
                cust_type: '1',
                cust_id: ClientID,
                num: ClientInvoiceNumber,
                invoice_amount: ClientInvoiceAmount,
                invoice_date: ClientIssuedDate,
                amount_received_date: ClientReceivedDate,
                price: parseFloat(ClientReceivedAmount).toFixed(2),
                credit_note: ClientCreditNote,
                credit_amount: parseFloat(ClientCreditAmount).toFixed(2),
                credit_date: ClientCreditDate,
            })
                .then((res) => {
                    // console.log(res);
                    if (res.data.message.success !== undefined) {
                        Alert("success", "success!", `${res.data.message.success}`)
                    } else {
                        Alert("error", "error!", `${res.data.message.error}`,)
                    }
                })
                .catch((e) => {
                    // console.log(e)
                })
        }
 }

 const EditClientInv = () =>{
    axiosInstance.post(`/invoice/edit`+ClientInvId, {
        cust_type: '1',
        cust_id: ClientID,
        num: ClientInvoiceNumber,
        invoice_amount: ClientInvoiceAmount,
        invoice_date: ClientIssuedDate,
        amount_received_date: ClientReceivedDate,
        price: parseFloat(ClientReceivedAmount).toFixed(2),
        credit_note: ClientCreditNote,
        credit_amount: parseFloat(ClientCreditAmount).toFixed(2),
        credit_date: ClientCreditDate,
    })
        .then((res) => {
            // console.log(res);
            if (res.data.message.success !== undefined) {
                Alert("success", "success!", `${res.data.message.success}`,)
            } else {
                Alert("error", "error!", `${res.data.message.error}`,)
            }
        })
        .catch((e) => {
            // console.log(e)
        })
 }

 const AddContPo = () =>{

 }

 const EditContPo = () =>{

 }
 
    return (
        <div>
        <div className="component">
            {/* Top Section */}
                    <Row>
                        <Col>
                            <p style={{ fontSize: "20px" }}>Add Quotation</p>
                        </Col>

                        <Col className='d-flex justify-content-end'>
                            <div style={{ margin: '0px 10px' }}>
                                <Autocomplete
                                    id='currency'
                                    options={Curreny.codes()}
                                    onChange={(e, value) => value !== null ? setcurrency(value) : setcurrency('')}
                                    getOptionLabel={(option) => option}
                                    value={currency}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            {'' === '' ? <Form.Control placeholder={currency} value={currency} type="text" {...params.inputProps} style={{ padding: '8px' }} />
                                                : <Form.Control placeholder={currency} type="text" {...params.inputProps} style={{ padding: '8px' }} />}
                                        </div>
                                    )}
                                />
                            </div>
                            <div style={{ margin: '0px 5px' }}>
                                <Autocomplete
                                    options={ParentQuotationList}
                                    onChange={(e, value) =>{
                                        value !== null ? setParentQuoteId(value.id) && setTicketNo(value.ticket_no) : setParentQuoteId('')}
                                        }
                                    getOptionLabel={(option) => option.quotation_num}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            {'' === '' ? <Form.Control placeholder='--parent quote--' type="text" {...params.inputProps} style={{ padding: '8px' }} />
                                                : <Form.Control placeholder='--parent quote--' type="text" {...params.inputProps} style={{ padding: '8px' }} />}
                                        </div>
                                    )}
                                />
                            </div>
                            <div style={{ margin: '0px 10px' }}>
                                <Autocomplete
                                    options={CategoryList}
                                    onChange={(e, value) => value !== null ? setcategory(value.text) : setcategory('')}
                                    getOptionLabel={(option) => option.text}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            {'' === '' ? <Form.Control placeholder='--category--' type="text" {...params.inputProps} style={{ padding: '8px' }} />
                                                : <Form.Control placeholder={category} type="text" {...params.inputProps} style={{ padding: '8px' }} />}
                                        </div>
                                    )}
                                />
                            </div>
                        </Col>
                    </Row><br/>
                
                {/* Quotation Section */}
                    {user.quotation_client_sec == 0?'':
                        
                        <Card>
                        <Row>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='quotation_num'
                                    txtBoxLabel="Quotation No"
                                    txtBoxType="text"
                                    txtBoxName="quotation_num"
                                    txtBoxValue={QuotationNumber}
                                    txtBoxPH=" Quotation No"
                                    changeEvent={(e)=>setQuotationNumber(e.target.value)}
                                    disabled={user.quotation_client_sec === "1"?true:false}
                                />
                            </Col>
                            <Col lg={3}>
                                <Form.Group >
                                    <Form.Label > Client</Form.Label>
                                    <Autocomplete
                                        id='client_id'
                                        options={clientList}
                                        disabled={user.quotation_client_sec == '1'?true:false}
                                        onChange={(e, value) => value !== null ? setClientID(value.id) : setClientID('')}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                {'' === '' ? <Form.Control placeholder='Client Name' type="text" {...params.inputProps} />
                                                    : <Form.Control placeholder='Client Name' type="text" {...params.inputProps} />}
                                            </div>
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label >Quote Amount</Form.Label>
                                    <CurrencyFormat
                                        className='form-control'
                                        value={QuoteAmount}
                                        placeholder="Amount"
                                        disabled={user.quotation_client_sec == '1'?true:false}
                                        onValueChange={(values) => setQuoteAmount(values.value)}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='client_po'
                                    txtBoxLabel="Client PO"
                                    txtBoxType="text"
                                    txtBoxName="client_po"
                                    txtBoxValue={ClientPo}
                                    txtBoxPH=" Client PO"
                                    changeEvent={(e)=>setClientPo(e.target.value)}
                                    disabled={user.quotation_client_sec == '1'?true:false}
                                    
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="Date Issued"
                                    txtBoxType="date"
                                    txtBoxName="quotationDate"
                                    txtBoxValue={QuotationIssuedDate}
                                    changeEvent={(e)=>setQuotationIssuedDate(e.target.value)}
                                    disabled={user.quotation_client_sec == '1'?true:false}
                                    
                                />
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="description"
                                    txtBoxType="text"
                                    txtBoxName="description"
                                    txtBoxValue={description}
                                    txtBoxPH="description"
                                    changeEvent={(e)=>setdescription(e.target.value)}
                                    disabled={user.quotation_client_sec == '1'?true:false}
                                    
                                />
                            </Col>


                            <Col lg={3}>
                                <Form.Group >
                                    <Form.Label >Quote Approval</Form.Label>
                                    <Form.Control as="select" name="quotationStatus" value={QuotationStatus} onChange={(e)=>setQuotationStatus(e.target.value)} disabled={user.quotation_client_sec == '1'?true:false}>
                                        <option value="" disabled>Quote Approval</option>
                                        <option value="1">Approved</option>
                                        <option value="2">Pending</option>
                                        <option value="4">Rejected</option>
                                        <option value="3">Cancelled</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col lg={1} >
                                {margin_amount >= 0 ? <CustomTextBox
                                    txtBoxLabel="Margin"
                                    txtBoxType="text"
                                    txtBoxName="margin"
                                    txtBoxValue={`${margin}%`}
                                    txtBoxPH="%"
                                    disabled="true"
                                /> :
                                    <CustomTextBox
                                        txtBoxLabel="Margin"
                                        txtBoxType="text"
                                        txtBoxName="margin"
                                        txtBoxValue={`${margin}%`}
                                        txtBoxPH="%"
                                        disabled="true"
                                        style={{ color: 'red' }}
                                    />}
                            </Col>
                            <Col lg={2} >
                                {margin_amount >= 0 ?
                                    <CurrencyFormat
                                        className='form-control'
                                        placeholder="Amount"
                                        value={margin_amount}
                                        thousandSeparator={true}
                                        disabled="true"
                                        style={{ marginTop: "47px" }}
                                    />
                                    : <CurrencyFormat
                                        className='form-control'
                                        placeholder="Amount"
                                        value={margin_amount}
                                        thousandSeparator={true}
                                        disabled="true"
                                        style={{ marginTop: "47px", color: 'red' }} />}
                            </Col>
                        </Row>
                        </Card>}

                        {/* ClientInvoice Section */}
                    
                    {user.invoice_client_sec == 0?'':
                    <Card style={{ marginTop: '15px', }} >
                         <Row>

                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label > Client Invoice No</Form.Label>
                                    <Autocomplete
                                        options={clientInvList}
                                        onChange={(e, value) => ClientInvAutoComplete(value, 'invoiceNo')}
                                        getOptionLabel={(option) => option.num}
                                        disabled={user.invoice_client_sec == '1'?true:false}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref} class="input-group">
                                                <Form.Control placeholder='Invoice No' type="text" {...params.inputProps} name='invoiceNo' value={ClientInvoiceNumber} onChange={(e)=>setClientInvoiceNumber(e.target.value)} />
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
                                        value={ClientInvoiceAmount}
                                        disabled={user.invoice_client_sec == '1'?true:false}
                                        placeholder="Client Invoice Amount"
                                        onValueChange={(values) => setClientInvoiceAmount(values.value)}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='issuedDate'
                                    txtBoxLabel="Invoice Issued Date"
                                    txtBoxType="date"
                                    txtBoxName="issuedDate"
                                    txtBoxValue={ClientIssuedDate}
                                    txtBoxPH="Commense"
                                    changeEvent={(e)=>setClientIssuedDate(e.target.value)}
                                    disabled={user.invoice_client_sec == '1'?true:false}
                                />
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="Payment Received Date"
                                    txtBoxType="date"
                                    txtBoxName="receivedDate"
                                    txtBoxValue={ClientReceivedDate}
                                    txtBoxPH="Commense"
                                    disabled={user.invoice_client_sec == '1'?true:false}
                                    changeEvent={(e)=>setClientIssuedDate(e.target.value)}
                                />
                            </Col>
                        </Row>

                        <Row>
                        <Col lg={3}>
                            <Form.Group>
                                <Form.Label >Received Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    disabled={user.invoice_client_sec == '1'?true:false}
                                    value={ClientReceivedAmount}
                                    placeholder="Received Amount"
                                    onValueChange={(values) => setClientReceivedAmount(values.value)}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>
                        <Col lg={1}>
                            <div style={{marginTop:"50px"}}>
                                {'' === '' ? <Popup content="Add Invoice" trigger={<button className='ui primary button' onClick={AddClientInv}>Add</button>}/>
                                : <Popup content="Edit Invoice" trigger={<button className='ui primary button' onClick={EditClientInv}>Edit</button>}/>}
                            </div>
                        </Col>
                        <Col lg={2}>
                            <button className='ui primary button' style={{ marginTop: '50px' }} >List Invoice</button>
                            {/* <Payment
                                show={paymentShow}
                                handleClose={this.paymentChange}
                                list={client_invoice}
                                onDelete={this.onDelete}
                                user='Client'
                            /> */}
                        </Col>

                        <Col lg={2} style={{ marginTop: '40px', marginLeft: '20px' }}>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check
                                    style={{ fontSize: '1.3em', fontWeight: 'bold' }}
                                    name='invoiceCredit'
                                    disabled={user.invoice_client_sec == '1'?true:false}
                                    checked={clientInvoiceCredit}
                                    type="checkbox"
                                    label="Submit Credit Note"
                                    onChange={(e)=>setclientInvoiceCredit(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                        
                    </Row>
                    {clientInvoiceCredit &&
                        <Row>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label >Credit Note Amount</Form.Label>
                                    <CurrencyFormat
                                        className='form-control'
                                        disabled={user.invoice_client_sec == '1'?true:false}
                                        value={ClientCreditAmount}
                                        placeholder="Credit Note Amount"
                                        onValueChange={(values) => setClientCreditAmount(values.value)}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note Issued Date"
                                    txtBoxType="date"
                                    txtBoxName="creditDate"
                                    txtBoxValue={ClientCreditDate}
                                    disabled={user.invoice_client_sec == '1'?true:false}
                                    changeEvent={(e)=>setClientCreditDate(e.target.value)}
                                />
                            </Col>
                            <Col lg={6}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note No"
                                    txtBoxType="text"
                                    txtBoxName="creditNote"
                                    txtBoxValue={ClientCreditNote}
                                    txtBoxPH="No"
                                    disabled={user.invoice_client_sec == '1'?true:false}
                                    changeEvent={(e)=>setClientCreditNote(e.target.value)}
                                />
                            </Col>
                        </Row>}
                    </Card>}

                    {/* Contractor PO Section */}
                    {user.quotation_cont_sec == 0?'':
                     <Card style={{ marginTop: '15px', }} >
                        
                        <Row>
                            <Col lg={3} >
                                <Form.Group >
                                    <Form.Label > PO Number</Form.Label>
                                    <Autocomplete
                                        id='cont_id'
                                        options={ContPoList}
                                        // onChange={(e, value) => value !== null && }
                                        disabled={user.quotation_cont_sec == '1'?true:false}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <Form.Control placeholder="PO Number" onChange={(e)=>setcontPoNumber(e.target.value)} type="text" {...params.inputProps} />
                                            </div>
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={3} >
                            <Form.Group >
                                <Form.Label > Contractor Name</Form.Label>
                                <Autocomplete
                                    id='cont_id'
                                    options={ContPoList}
                                    // onChange={(e, value) => value !== null ? this.autoComplete(value) : this.setState({ cont_id: '' }, () => this.props.quote_onChange('cont_id', ''))}
                                    disabled={user.quotation_cont_sec == '1'?true:false}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <Form.Control placeholder="Contractor Name" type="text" {...params.inputProps} />
                                        </div>
                                    )}
                                />
                            </Form.Group>
                                
                            </Col>

                            
                            <Col lg={3} >
                                <Form.Group>
                                    <Form.Label >PO Amount</Form.Label>
                                    <CurrencyFormat
                                        id='po_amount'
                                        className='form-control'
                                        value={contPoAmount}
                                        placeholder=" Amount "
                                        onValueChange={(values) => setcontPoAmount(values.value)}
                                        disabled={user.quotation_cont_sec == '1'?true:false}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3} >
                                <CustomTextBox
                                    txtBoxID='po_issue_date'
                                    txtBoxLabel="PO Issued Date"
                                    txtBoxType="date"
                                    txtBoxName="po_issue_date"
                                    txtBoxValue={ContPoIssuedDate}
                                    changeEvent={(e)=>setContPoIssuedDate(e.target.value)}
                                    disabled={user.quotation_cont_sec == '1'?true:false}
                                    />
                            </Col>
                        </Row>
                        <Row>
                        <Col lg={3}>
                            <CustomTextBox
                                txtBoxLabel="Work Commence"
                                txtBoxType="date"
                                txtBoxName="work_commence"
                                txtBoxValue={ContWorkCommence}
                                txtBoxPH="Commense"
                                changeEvent={(e)=>setContWorkCommence(e.target.value)}
                                disabled={user.quotation_cont_sec == '1'?true:false}
                                />
                        </Col>
                        <Col lg={3}>
                            <CustomTextBox
                                txtBoxLabel="Work Complete"
                                txtBoxType="date"
                                txtBoxName="work_complete"
                                txtBoxValue={ContWorkComplete}
                                txtBoxPH="work_complete"
                                changeEvent={(e)=>setContWorkComplete(e.target.value)}
                                disabled={user.quotation_cont_sec == '1'?true:false}
                                />
                        </Col>
                        <Col lg={1}>
                            {'' === ''
                                ? <Popup content="Add Contractor PO" trigger={<button className='ui primary button' style={{ marginTop: '55px' }} onClick={AddContPo}>Add</button>}/>
                                : <Popup content="Edit Contractor PO" trigger={<button className='ui primary button' style={{ marginTop: '55px' }} onClick={EditContPo}>Edit</button>}/>}
                        </Col >
                        <Col lg={2}>
                            <button className='ui primary button' style={{ marginTop: '55px' }} >List Contractors</button>
                            {/* <ContPO_list
                                show={show}
                                handleClose={this.handleChange}
                                list={cont_po_list}
                                cont_list={contractor_list}
                                onDelete={this.onDelete}
                            /> */}
                        </Col>
                    </Row>
                    </Card>}

                    {/* Contractor Invoice Section */}
                    {user.invoice_cont_sec == 0?'':
                    <Card style={{ marginTop: '15px' }}>
                    <Row>
                        <Col lg={3}>
                            <Form.Group >
                                <Form.Label > Contractor Invoice No</Form.Label>
                                <Autocomplete
                                    options={ContractorInvoiceList}
                                    // onChange={(e, value) => this.autoComplete(value, 'invoiceNo')}
                                    disabled={user.invoice_cont_sec == '1'?true:false}
                                    getOptionLabel={(option) => option.num}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref} class="input-group">
                                            <Form.Control placeholder='Invoice No' type="text" {...params.inputProps} name='invoiceNo' value={ContInvNo} onChange={(e)=>setContInvNo(e.target.value)} />
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
                                    disabled={user.invoice_cont_sec == '1'?true:false}
                                    value={ContInvAmount}
                                    placeholder=" Amount "
                                    onValueChange={(values) => setContInvAmount(values.value)}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <CustomTextBox
                                txtBoxID='receivedDate'
                                txtBoxLabel="Invoice Received Date"
                                txtBoxType="date"
                                disabled={user.invoice_cont_sec == '1'?true:false}
                                txtBoxName="receivedDate"
                                txtBoxValue={ContReceivedDate}
                                changeEvent={(e)=>setContReceivedDate(e.target.value)}
                            />
                        </Col>
                        <Col lg={3}>
                            <CustomTextBox
                                txtBoxLabel="Tax Invoice No"
                                txtBoxType="text"
                                txtBoxName="tax"
                                txtBoxValue={TaxNo}
                                txtBoxPH="Tax Invoice No"
                                disabled={user.invoice_cont_sec == '1'?true:false}
                                changeEvent={(e)=>setTaxNo(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={3}>
                            <Form.Group>
                                <Form.Label >Paid Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    value={ContPaidAmount}
                                    placeholder=" Amount "
                                    disabled={user.invoice_cont_sec == '1'?true:false}
                                    onValueChange={(values) => setContPaidAmount(values.value)}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <Form.Group>
                                <CustomTextBox
                                    txtBoxLabel="Paid Date"
                                    txtBoxType="date"
                                    txtBoxName="paidDate"
                                    disabled={user.invoice_cont_sec == '1'?true:false}
                                    txtBoxValue={ContPaidDate}
                                    changeEvent={(e)=>setContPaidDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={1}>
                        <div style={{marginTop:"50px"}}>
                            {'' === '' ? <Popup content="Add Invoice" trigger={<button className='ui primary button' >Add</button>}/>
                            :<Popup content="Edit Invoice" trigger={<button className='ui primary button'>Edit</button>} />}
                            </div>
                        </Col>
                        <Col lg={2}>
                            <button className='ui primary button' style={{ marginTop: '50px' }} >List Invoice</button>
                            {/* <Payment
                                show={paymentShow}
                                handleClose={this.paymentChange}
                                list={contractor_invoice}
                                onDelete={this.onDelete}
                                user='Contractor'
                            /> */}
                        </Col>
                        <Col lg={2} style={{ marginTop: '40px', marginLeft: '20px' }}>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check
                                    style={{ fontSize: '1.3em', fontWeight: 'bold' }}
                                    name='invoiceCredit'
                                    checked={ContInvCrredit}
                                    type="checkbox"
                                    label="Submit Credit Note"
                                    onChange={(e)=>setContInvCrredit(e.target.checked)}
                                    disabled={user.invoice_cont_sec == '1'?true:false}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {ContInvCrredit &&
                        <Row>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label >Credit Note Amount</Form.Label>
                                    <CurrencyFormat
                                        className='form-control'
                                        value={ContCreditAmount}
                                        placeholder="Credit Note Amount"
                                        onValueChange={(values) => setContCreditAmount(values.value)}
                                        disabled={user.invoice_cont_sec == '1'?true:false}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note Issued Date"
                                    txtBoxType="date"
                                    txtBoxName="creditDate"
                                    txtBoxValue={ContCreditDate}
                                    changeEvent={(e)=>setContCreditDate(e.target.value)}
                                    disabled={user.invoice_cont_sec == '1'?true:false}
                                />
                            </Col>
                            <Col lg={6}>
                                <CustomTextBox
                                    txtBoxLabel="Credit Note No"
                                    txtBoxType="text"
                                    txtBoxName="creditNote"
                                    txtBoxValue={ContCreditNote}
                                    txtBoxPH="No"
                                    changeEvent={(e)=>setContCreditNote(e.target.value)}
                                    disabled={user.invoice_cont_sec == '1'?true:false}
                                />
                            </Col>
                        </Row>}
                    </Card>}

                    {/* Job Section */}
                    <Card style={{ marginTop: '15px', backgroundColor: '#C0BFBF' }}>
                        <Row>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='ticket_no'
                                    txtBoxLabel="CCM Ticket Number"
                                    txtBoxType="text"
                                    txtBoxName="ticket_no"
                                    txtBoxValue={TicketNo}
                                    txtBoxPH="Ticket Number"
                                    changeEvent={(e)=>setTicketNo(e.target.value)}
                                />
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='jobComplete'
                                    txtBoxLabel="Job Complete"
                                    txtBoxType="date"
                                    txtBoxName="jobComplete"
                                    txtBoxValue={JobComplete}
                                    changeEvent={(e)=>setJobComplete(e.target.value)}
                                />
                            </Col>
                            <Col lg={3}>
                            </Col>
                            <Col lg={3}>
                                <Form.Group>
                                <Form.Label>Quotation Status</Form.Label>
                                    <Form.Control as='select' name="job_status" value={JobStatus} onChange={(e)=>setJobStatus(e.target.value)} >
                                        <option value='' disabled> Status </option>
                                        <option value='2' selected>Pending</option>
                                        <option value='1'>Completed</option>
                                        <option value='3'>Cancelled</option>
                                    </Form.Control>
                                    </Form.Group>
                                </Col>
                        </Row>
                    </Card>
                    <Row className='d-flex justify-content-end' style={{ marginTop: '20px' }}>
                        {props.id !== undefined ? <CustomButton btnType="reset" BtnTxt="Back" ClickEvent={props.Back} />:
                        <CustomButton btnType="reset" BtnTxt="Back" ClickEvent={()=>window.history.back()} />}
                        {/* {quote_id === undefined
                            ? <CustomButton btnType="reset" BtnTxt="Complete" ClickEvent={() => this.onComplete('submit')} />
                            : <CustomButton btnType="reset" BtnTxt="Complete" ClickEvent={() => this.onComplete('edit')} />} */}
                        {'' === ''
                            ? <CustomButton btnType="reset" BtnTxt="Save" ClickEvent={SaveQuote}/>
                            : <CustomButton btnType="reset" BtnTxt="Save" ClickEvent={EditQuote}/>}
                            {/* <CustomButton btnType="reset" BtnTxt="Cancel" /> */}
                    </Row>
            </div>
        </div>
    )
}

export default Quotation
