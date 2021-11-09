import React, { Component } from 'react'
import { Card, Container, Row, Col, Form, } from 'react-bootstrap'
import {Label} from 'semantic-ui-react'
import CustomTextBox from '../../../utils/TextBox'
import CustomButton from '../../../utils/Button'
import axiosInstance from '../../../utils/axiosinstance'
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyFormat from 'react-currency-format'
import { DateFormat } from '../../../utils/DateFormat'
import { Alert } from '../../../utils/Utilities'
import ContPO_list from './ContPO_list'
import swal from 'sweetalert'
import { Popup } from 'semantic-ui-react'

export class ContPO extends Component {
    constructor(props) {
        super(props)

        this.initialState = {
            quotation_id: this.props.quote_id,
            po_id: null,
            cont_id: '',
            po_number: '',
            contrctorname:'Contractor Name',
            po_amount: '',
            po_issue_date: '',
            work_commence: '',
            work_complete: '',
            quote_number:'',
            quote_amount:'',
            show: false,
            contractor_list: [],
            cont_po_list: [],
        }
        this.state = this.initialState
    }
    componentDidMount() {
        // axiosInstance.post(`/contractor/list`,{country:localStorage.getItem('countryid')})
        axiosInstance.post(`/contractor/list`,)
            .then(res => {
                const contractor_list = res.data.response.contractor_list
                this.setState({ contractor_list})
                //console.log(contractor_list);
            
        if (this.props.quote_id !== undefined && this.props.quote_id !== null) {
            axiosInstance.post(`/quotation/get_contractors_by_quote`, { id: this.props.quote_id })
                .then(res => {
                    const cont_po_list = res.data.response.contractor_list
                    this.setState({ cont_po_list, })
                    // console.log(cont_po_list,'po list');
                    let po_amount = 0
                    const latest_cont = cont_po_list[cont_po_list.length - 1]
                    const cont = latest_cont !== undefined ? contractor_list.find(contractor => contractor.id == latest_cont.cont_id):undefined
       
                    latest_cont !== undefined &&  this.props.getContId('contractor_id', latest_cont.cont_id)
                    latest_cont !== undefined &&  this.props.getContId('po_id', latest_cont.id)
                    latest_cont !== undefined && cont !== undefined && 
                            this.props.quote_onChange('cont_id', latest_cont.cont_id,false)
                    latest_cont !== undefined &&this.setState({
                        quote_number:latest_cont.quote_number,
                        quote_amount:latest_cont.quote_amount,
                        cont_id: latest_cont.cont_id,
                        contrctorname:cont !== undefined?cont.name:'Contractor Name',
                        po_id: latest_cont.id,
                        po_number: latest_cont.po_number,
                        po_amount: latest_cont.po_amount,
                        po_issue_date: DateFormat(latest_cont.po_issue_date),
                        work_commence: DateFormat(latest_cont.work_commence),
                        work_complete: DateFormat(latest_cont.work_complete),
                    })
                    cont_po_list.map(po => {
                        po_amount += parseFloat(po.po_amount)
                    })
                    this.props.amountChange('po_amount',parseFloat(po_amount))
                })
        }
    })

    }
    onChange = (e) => {
        // console.log(e.target.value)
        // if (e.target.name === 'po_number') {
        //     this.setState({
        //         po_id:null,
        //         po_amount:'',
        //         po_issue_date:'',
        //         work_commence: '',
        //         work_complete: ''})
        // }
        this.setState({ [e.target.name]: e.target.value },()=>this.props.passData(e.target.name,e.target.value))
    }

    onChangeAmount = (values, name) => {              // amount
        const { formattedValue, value } = values;
        this.setState({ [name]: value },()=>{
            this.props.passData(name,value)
            this.props.amountChange(name,value)
        }
            )
    }
    autoComplete = (value) => {
        const { quote_id } = this.props
        this.props.passData('cont_id',value.id)
        this.props.getContId('contractor_id', value.id)
        // const condition = (quote_id === null || quote_id === undefined) ? Alert('warning', '', 'Please save Quotation') : true

        const po_details = this.state.cont_po_list.filter(po => parseInt(po.cont_id) === parseInt(value.id))

        po_details[0] !== undefined
            ? this.setState({
                cont_id: po_details[0].cont_id,
                // po_id: po_details[0].id,
                // po_number: po_details[0].po_number,
                // po_amount: po_details[0].po_amount,
                // po_issue_date: DateFormat(po_details[0].po_issue_date),
                // work_commence: DateFormat(po_details[0].work_commence),
                // work_complete: DateFormat(po_details[0].work_complete),
            }, () => {
                this.props.quote_onChange('cont_id', value.id,false)
            })

            : this.setState({
                cont_id: value.id,
                // po_id: null,
                // po_number: '',
                // po_amount: '',
                // po_issue_date: '',
                // work_commence: '',
                // work_complete: '',
            }, () => {
                this.props.quote_onChange('cont_id', null,false)
            })

    }

    autoComplete2 = (value) => {
        console.log(value)
        const { quote_id } = this.props
        // this.props.passData('po_number',value.id)
        this.props.getContId('po_id', value.id)
        // const condition = (quote_id === null || quote_id === undefined) ? Alert('warning', '', 'Please save Quotation') : true
        // console.log('Mine')
        const po_details = this.state.cont_po_list.find(po => parseInt(po.id) === parseInt(value.id))

        if(value !== null){
        const contractor = this.state.contractor_list.find(cont => cont.id === value.cont_id)
        // console.log(contractor)
            this.setState({
                quote_number:value.quote_number,
                quote_amount:value.quote_amount,
                po_id:value.id,
                po_number: value.po_number,
                contrctorname:contractor.name,
                po_amount: value.po_amount,
                po_issue_date: DateFormat(value.po_issue_date),
                work_commence: DateFormat(value.work_commence),
                work_complete: DateFormat(value.work_complete),
            }, () => {
                this.props.quote_onChange('po_number', value.id,false)
                this.props.passData('quote_number',value.quote_number)
                this.props.passData('quote_amount',value.quote_amount)
                this.props.passData('po_id',value.id)
                this.props.passData('po_number',value.po_number)
                this.props.passData('po_amount',value.po_amount)
                this.props.passData('po_issue_date',DateFormat(value.po_issue_date))
                this.props.passData('work_commence',DateFormat(value.work_commence))
                this.props.passData('work_complete',DateFormat(value.work_complete))
            })
        }
        else{
            this.setState({
                po_amount:'',
                po_issue_date: '',
                quote_number:'',
                quote_amount:'',
                work_commence:'',
                work_complete: '',
            })
        }

        

    }

    onSubmit = () => {
        const { cont_id, po_number, po_amount, po_issue_date, work_commence, work_complete,cont_po_list,quote_number,quote_amount,po_id } = this.state
        const data = {
            quotation_id: this.props.quote_id,
            cont_id,
            // po_id,
            quote_number,
            quote_amount,
            po_number,
            po_amount,
            po_issue_date,
            work_commence,
            work_complete,
        }
        let margin_po = 0
        cont_po_list.map(po => {
            margin_po += parseFloat(po.po_amount)
        })
        this.props.amountChange('po_amount',parseFloat(po_amount)+parseFloat(margin_po))
        //console.log(data)
        const duplicate = cont_po_list.find(po => po.po_number == po_number)
        const condition = this.props.quote_id === undefined ? Alert("error","Error!","Please Save the Quotation") : 
                                duplicate !== undefined ? Alert("error","Error!","PO Number Already Exists"): true
                                // const duplicate = cont_po_list.find(po => po.id == po_id)
                                // const condition = this.props.quote_id === undefined ? Alert("error","Error!","Please Save the Quotation") : true
                                                        // duplicate !== undefined ? Alert("error","Error!","PO Number Already Exists"): true
        //     (cont_id === "") ? this.props.swalAlert("Contractor Name", "cont_id") :
        //         (po_number === "") ? this.props.swalAlert("PO Number", "po_number") :
        //             (po_amount === "") ? this.props.swalAlert("PO Amount", "po_amount") :
        //                 (po_issue_date === "") ? this.props.swalAlert("PO Issued Date", "po_issue_date") : true

        if (condition === true) {
            axiosInstance.post(`/quotation/contractor_po_add`, data)
                .then((res) => {
                    // console.log(res,'success');
                    if (res.data.message.success !== undefined) {
                        this.setState({ po_id: res.data.response.contractorpo_id })
                        this.props.quote_onChange('cont_id', cont_id,true)
                        this.props.callEdit()
                        this.componentDidMount()
                        this.props.getContId('po_id', res.data.response.contractorpo_id)
                        Alert("success", "success!", `${res.data.message.success}`,)
                    } else {
                        Alert("error", "error!", `${res.data.message.error}`,)
                    }
                })
                .catch((e) => {
                    //console.log(e)
                })
        }
    }

    onEdit = () => {
        const { po_id, cont_id, po_number, po_amount, po_issue_date, work_commence, work_complete,quote_amount,quote_number } = this.state
        // console.log(po_id)
        const data = {
            id: po_id,
            quotation_id: this.props.quote_id,
            cont_id,
            quote_amount,quote_number,
            po_number,
            po_amount,
            po_issue_date,
            work_commence,
            work_complete,
        }
        //console.log(data)

        // const condition =
        //     (cont_id === "") ? this.props.swalAlert("Contractor Name", "cont_id") :
        //         (po_number === "") ? this.props.swalAlert("PO Number", "po_number") :
        //             (po_amount === "") ? this.props.swalAlert("PO Amount", "po_amount") :
        //                 (po_issue_date === "") ? this.props.swalAlert("PO Issued Date", "po_issue_date") : true

        // if (condition) {
            axiosInstance.post(`/quotation/contractor_po_edit`, data)
                .then((res) => {
                    //console.log(res);
                    if (res.data.message.success !== undefined) {
                        this.setState({ po_id: res.data.response.contractorpo_id })
                        this.props.quote_onChange('cont_id', cont_id)
                        this.componentDidMount()
                        Alert("success", "success!", `${res.data.message.success}`,)
                    } else {
                        Alert("error", "error!", `${res.data.message.error}`,)
                    }
                })
                .catch((e) => {
                    //console.log(e)
                })
        // }
    }

    onDelete = (po_id, cont_id) => {
        swal({
            title: "Are you sure want to delete?",
            text: "The action will delete the associated invoices..!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axiosInstance.post(`/invoice/list`)
                        .then(res => {
                            const invoice_list = res.data.response.invoice_list
                            const cont_inv = [];
                            invoice_list.map(inv => this.props.list.map(id => (parseInt(id) === parseInt(inv.id) && parseInt(inv.cust_id) === parseInt(cont_id)) && cont_inv.push(id)))
                            //console.log(cont_inv)
                            if (cont_inv.length !== 0) {
                                console.log(cont_inv,'cont-e')
                                cont_inv.map(id =>{ 
                                    // axiosInstance.post(`/invoice/delete`, { id })
                                    this.props.invoiceRemove('clientInvoice_list', id) 
                                })
                            }

                        })
                    .then(() => {
                        axiosInstance.post(`/quotation/contractor_po_delete`, { id:po_id })
                            .then((res) => {
                                //console.log(res);
                                if (res.data.message.success !== undefined) {
                                    this.setState(this.initialState, () => this.componentDidMount())
                                    Alert("success", "success!", `${res.data.message.success}`,)
                                } else {
                                    Alert("error", "error!", `${res.data.message.error}`,)
                                }
                            })
                            .catch((e) => {
                                //console.log(e)
                            })
                    })

                } else {
                    swal("Quotation Record is safe!");
                }
            })
            .catch(function (error) {
                //console.log(error);
            })

    }

    handleChange = () => {
        this.setState({ show: !this.state.show })
    }

    render() {
        const { po_id, po_number, po_amount, po_issue_date, work_commence, work_complete, show, contractor_list, cont_po_list,quote_number,quote_amount } = this.state
        return (
            <>
                <Card style={{ marginTop: '15px', }} >
                <Row>
                       <Col lg={3}>
                       <Form.Label>CONTRACTOR QUOTATION</Form.Label>
                       <hr/>
                       </Col>
                       {/* <Col lg={3}></Col>
                       <Col lg={3}>
                      
                       </Col>
                       <Col lg={1}>
                       <Form.Group >
                           <Form.Label>PO ID</Form.Label>
                           </Form.Group>
                       </Col>
                       <Col lg={2} > */}
                            
                            {/* <Form.Label > PO ID</Form.Label> */}                          
                            {/* <Autocomplete
                               options={cont_po_list}
                               onChange={(e, value) => this.autoComplete2(value)}
                               getOptionLabel={(option) => option.id}
                            //    disabled={this.props.permission}
                               renderInput={(params) => (
                                   <div ref={params.InputProps.ref} class="input-group">
                                       <Form.Control placeholder='PO ID' type="text" {...params.inputProps} name='po_id' value={this.state.po_id} onChange={this.onChange} />
                                   </div>
                               )}
                           /> */}
                          
                                
                        {/* </Col> */}
                       
                   </Row>
                    <Row>
                    
                            
                            
                        <Col lg={3} >
                            <Form.Group >
                            <Form.Label > PO Number</Form.Label>
                            
                            <Autocomplete
                               options={cont_po_list}
                               onChange={(e, value) => this.autoComplete2(value)}
                               getOptionLabel={(option) => option.po_number}
                            //    disabled={this.props.permission}
                               renderInput={(params) => (
                                   <div ref={params.InputProps.ref} class="input-group">
                                       <Form.Control placeholder='PO Number' type="text" {...params.inputProps} name='po_number' value={this.state.po_number} onChange={this.onChange} />
                                   </div>
                               )}
                           />
                           {/* <CustomTextBox
                                    txtBoxID='po_number'
                                    txtBoxLabel="PO Number"
                                    txtBoxType="text"
                                    txtBoxName="po_number"
                                    txtBoxValue={po_number}
                                    txtBoxPH="PO Number"
                                    changeEvent={this.onChange}
                                    disabled={this.props.permission}
                                    // disabled={user.quotation_client_sec === "1"?true:false}
                                    // readonly
                                /> */}

                            </Form.Group>
                                
                        </Col>
                        {this.props.Viewpermission?
                        <>
                        <Col lg={3} >
                        <Form.Group >
                        <Form.Label > Contractor Name</Form.Label>
                                <Autocomplete
                                    id='cont_id'
                                    options={contractor_list}
                                    onChange={(e, value) => value !== null ? this.autoComplete(value) : this.setState({ cont_id: '' }, () => this.props.quote_onChange('cont_id', ''))}
                                    disabled={this.props.permission}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <Form.Control placeholder={this.state.contrctorname} type="text" {...params.inputProps} />
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
                                    value={po_amount}
                                    placeholder=" Amount "
                                    onValueChange={(values) => this.onChangeAmount(values, 'po_amount')}
                                    disabled={this.props.permission}
                                    thousandSeparator={true} />
                            </Form.Group>
                        </Col>
                        <Col lg={3} >
                            {/* <CustomTextBox
                                txtBoxID='po_issue_date'
                                txtBoxLabel="PO Issued Date"
                                txtBoxType="date"
                                txtBoxName="po_issue_date"
                                txtBoxValue={po_issue_date}
                                changeEvent={this.onChange}
                                disabled={this.props.permission}
                                /> */}
                                <Form.Group >
                                <Form.Label>PO Issued Date</Form.Label>
                                 <Form.Control
                                        id='po_issue_date'
                                        type="date"
                                        name="po_issue_date"
                                        value={po_issue_date}
                                        onChange={this.onChange}
                                        disabled={this.props.permission}
                                       
                                    />
                                 </Form.Group>
                                
                        </Col>
                        </>:''}
                        <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='quote_number'
                                    txtBoxLabel="Quotation No"
                                    txtBoxType="text"
                                    txtBoxName="quote_number"
                                    txtBoxValue={quote_number}
                                    txtBoxPH=" Quotation No"
                                    changeEvent={this.onChange}
                                    disabled={this.props.permission}
                                    // disabled={user.quotation_client_sec === "1"?true:false}
                                    // readonly
                                />
                            </Col>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label >Quote Amount</Form.Label>
                                    <CurrencyFormat
                                        className='form-control'
                                         value={quote_amount}
                                        placeholder="Amount"
                                        disabled={this.props.permission}
                                         onValueChange={(values) => this.onChangeAmount(values, 'quote_amount')}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                       
                    {this.props.Viewpermission?
                  <>
                        <Col lg={3}>
                            {/* <CustomTextBox
                                txtBoxLabel="Work Commence"
                                txtBoxType="date"
                                txtBoxName="work_commence"
                                txtBoxValue={work_commence}
                                txtBoxPH="Commense"
                                changeEvent={this.onChange}
                                disabled={this.props.permission}
                                /> */}
                                <Form.Group >
                                <Form.Label>Work Commence</Form.Label>
                                 <Form.Control
                                        id='work_commence'
                                        type="date"
                                        name="work_commence"
                                        value={work_commence}
                                        onChange={this.onChange}
                                        disabled={this.props.permission}
                                       
                                    />
                                 </Form.Group>
                        </Col>
                        <Col lg={3}>
                            {/* <CustomTextBox
                                txtBoxLabel="Work Complete"
                                txtBoxType="date"
                                txtBoxName="work_complete"
                                txtBoxValue={work_complete}
                                txtBoxPH="work_complete"
                                changeEvent={this.onChange}
                                disabled={this.props.permission}
                                /> */}
                                <Form.Group >
                                <Form.Label>Work Complete</Form.Label>
                                 <Form.Control
                                        id='work_complete'
                                        type="date"
                                        name="work_complete"
                                        value={work_complete}
                                        onChange={this.onChange}
                                        disabled={this.props.permission}
                                       
                                    />
                                 </Form.Group>
                        </Col><Row><hr/></Row>
                        <Row>
                        <Col lg={3} sm={6} md={6} xs={12}>
                        <Row>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <Popup content="Add Contractor PO" trigger={<button className='button'  disabled={this.props.permission} onClick={this.onSubmit}>Add</button>}/>
                            </Col>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <Popup content="Edit Contractor PO" trigger={<button className='button'  disabled={this.props.permission} onClick={this.onEdit}>Edit</button>}/>
                            </Col>
                            </Row> <br/>                         
                        </Col>
                        <Col lg={3} sm={6} md={6} xs={12}>
                        <Row>
                            <Col lg={6} sm={6}  md={6} xs={6}>
                            <button className='button'  onClick={this.handleChange}  >List Contractors</button>
                            <ContPO_list
                                show={show}
                                handleClose={this.handleChange}
                                list={cont_po_list}
                                cont_list={contractor_list}
                                onDelete={this.onDelete}
                            />
                            </Col>
                            </Row>   
                        </Col>
                        </Row>  
                   </> :''}</Row>
                </Card>
            </>
        )
    }
}

export default ContPO
