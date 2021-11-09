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
    InputGroup,
    FormControl,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosinstance'
import axios from 'axios'
import Invoice from '../../../Invoice'
import DatePicker from "react-datepicker";
import AddQuotation from '.././AddQuotation'
import "bootstrap/js/src/collapse.js";
import { Alert } from '../../../utils/Utilities'
import { Radio } from 'semantic-ui-react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import swal from 'sweetalert'
import Swal from 'sweetalert2'
import Payment from '.././invoice/Payment'
import Clientcontinvoice from '.././invoice/Clientcontinvoice';
import { Popup } from 'semantic-ui-react'
import EditQuotation from '.././EditQuotation';
var token = localStorage.getItem('access_token')

export default class Cancelled extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quote_id: null,
            emailSearch: '',
            countrySearch: '',
            fromDate: '',
            toDate: '',
            status: '3',

            visible: false,
            childQuote_list: [],
            parent_list: [],

            addQuotation: false,
            country_list: [],
            list: [],
            quotation_list: [],
            client_list: [],
            client_invoice:[],
            paymentShow:false,
            invoice_list:[],
            cont_invoice:[],
            pagenumber:1,
            perpage:10,
            total_pages:null,
            singleCountry:'',
            newquote:[],
            client_id:''
        }
    }

    componentDidMount() {
        axiosInstance.post(`/country/list`)
            .then((res) => {
                const country_list = res.data.response.country_list
                const singleCountry = country_list.find(country => country.id == localStorage.getItem('countryid'))
                const filtered_contries = country_list.filter(country => country.id == localStorage.getItem('countryid'))
                if(localStorage.getItem('role') == 'admin'){
                    this.setState({country_list,singleCountry})
                }
                else{
                    this.setState({ country_list:filtered_contries,singleCountry })
                }
                // //console.log(country_list)
            })
            // axiosInstance.post(`/quotation/list`).then(res=>{
            //     const list = res.data.response.quotation_list
            //     this.setState({list})
            // })
        axiosInstance.post(`/quotation/filter`,{from_date:this.state.fromDate,client_id:this.state.client_id,to_date:this.state.toDate,s:this.state.emailSearch,job_status:this.state.status,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
            .then(res => {
                console.log(res)
                if(localStorage.getItem('countryid') === null){
                    this.setState({ list:[], quotation_list:[], parent_list:[] })

                }
                else{
                
                const total_pages = res.data.response.paging_details.total
                // const quotation_list = list.filter(quote => quote.parent_id === '0')
                const parent_list = res.data.response.quotation_list
                // console.log(parent_list)
                
                // console.log(quotation_list, list, "quotation_list")
                this.setState({ parent_list,total_pages })
                }
            })
        axiosInstance.post(`/client/list`)
            .then(res => {
                const client_list = res.data.response.client_list
                this.setState({ client_list })
                // //console.log(client_list, 'client_list');
            })
        axiosInstance.post(`/invoice/list`)
            .then(res => {
                const invoice_list = res.data.response.invoice_list
                this.setState({invoice_list})
                //console.log(invoice_list, 'invoice');
            })
    }
    childQuote = (id) => {

        const { status } = this.state;
        // console.log(id)
        // const childQuote_list = list.filter(quote => parseInt(quote.parent_id) === parseInt(id))
        //console.log(childQuote_list, 'childQuote_list')
        axiosInstance.post(`quotation/sub_list`,{id}).then(res=>{
            const childQuote_list = res.data.response.sub_quotation_list
            // console.log(childQuote_list)
            this.setState({ childQuote_list, visible: !this.state.visible, visibleParent: id })
        })
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, },()=>this.onChangeDate())
        
    }
    onChangeDate = () =>{
        const {fromDate,toDate,pagenumber,perpage,emailSearch,status} = this.state
        const data = {from_date:fromDate,to_date:toDate,page:pagenumber,client_id:this.state.client_id,per_page:perpage,country_id:localStorage.getItem('countryid'),job_status:status,s:emailSearch}
        axiosInstance.post(`quotation/filter`,data)
    .then(res=>{
        const parent_list = res.data.response.quotation_list
        // const total_pages = res.data.response.paging_details.total
        // const parent_list = list.filter(li => li.country_id == localStorage.getItem('countryid'))
        // console.log(parent_list)
        this.setState({parent_list})
    })
    }
    statusFilter = (e) => {
        const { quotation_list,emailSearch,fromDate,toDate } = this.state;
        // const parent_list = quotation_list.filter(quote => quote.job_status == e.target.value)
        // //console.log( e.target.value,parent_list)
        // axiosInstance.post(`quotation/filter`,{job_status:e.target.value})
        axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,s:emailSearch,client_id:this.state.client_id,job_status:this.state.status,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
        .then(res =>{
            const parent_list = res.data.response.quotation_list
            // console.log(parent_list,"Parent")
            this.setState({parent_list})
        })
        this.setState({ [e.target.name]: e.target.value })
        window.location.replace(`/cwr-summary/${e.target.value}`)
    }
    countryFilter = (name, value) => {
        const { quotation_list, client_list, status } = this.state;
        const client = client_list.find(client => client.country === value)
        let filter = ''
        if (client !== undefined) {
            filter = quotation_list.filter(quote => quote.client_id === client.id && quote.job_status === status)
        }
        this.setState({ [name]: value, parent_list: filter })
        //console.log(filter, 'country filter')
    }

    clientFilter = (name, value) => {
        const { quotation_list,emailSearch,fromDate,toDate } = this.state;
        // const parent_list = quotation_list.filter(quote => quote.job_status == e.target.value)
        // //console.log( e.target.value,parent_list)
        // axiosInstance.post(`quotation/filter`,{job_status:e.target.value})
        axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,client_id:value,s:emailSearch,job_status:this.state.status,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
        .then(res =>{
            const parent_list = res.data.response.quotation_list
            // console.log(parent_list,"Parent")
            this.setState({parent_list})
        })
        this.setState({ client_id: value })
        //console.log(filter, 'country filter')
    }

    // quotationfilter = (quoteno) => {
    //     const { quotation_list, client_list, status } = this.state;
    //     const filter = quotation_list.filter(quote=>quote.quotation_num === quoteno)
    //     this.setState({parent_list:filter})
    // }
    search = (e) =>{
        const {fromDate,toDate,status} = this.state
        axiosInstance.post(`quotation/filter`,{from_date:fromDate,client_id:this.state.client_id,to_date:toDate,s:e.target.value,page:1,job_status:status,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
        .then(res=>{
            const parent_list = res.data.response.quotation_list
            // const parent_list = list.filter(li => li.country_id == localStorage.getItem('countryid'))
            this.setState({parent_list})
        })
        this.setState({emailSearch:e.target.value})
    }
    setDate = (date, name) => {
        this.setState({
            [name]: date
        })
    }

    clientName = (client_id) => {
        ////console.log(this.state.client_list, parseInt(client_id))
        const client = this.state.client_list.find(client => parseInt(client.id) === parseInt(client_id))
        if (client !== undefined) {
            return client.name
        } else {
            return ''
        }
    }

    onDelete = (id, client_invoice, cont_invoice,) => {
        swal({
            title: "Are you sure?",
            text: "Deleted Record can be found in Bin for 7 Days",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axiosInstance.post(`/quotation/trash`, { id })
                        .then((res) => {
                            //console.log(res);
                            if (res.data.message.success !== undefined) {
                                Alert("success", "success", `${res.data.message.success}`,)
                                this.componentDidMount()
                                this.setState({ visible: false })
                            } else {
                                Alert("error", "error", `${res.data.message.error}`,)
                            }
                        })
                } else {
                    swal("Quotation Record is safe!");
                }
            })
            .catch(function (error) {
                //console.log(error);
            })
    }
    trashQuote = (id, client_invoice, cont_invoice, name,sublist) => {
        // const { childQuote_list } = this.state
        if (name === 'child') {
            this.onDelete(id, client_invoice, cont_invoice,)
        } else {
            // const childQuote_list = this.state.list.filter(quote => parseInt(quote.parent_id) === parseInt(id))
            if (sublist != 0) {
                Alert('error', 'error', 'Parent quotation could not be deleted without deleting the child first!..')
            } else {
                this.onDelete(id, client_invoice, cont_invoice,)
            }
        }
    }
    pagination = (condition) =>{
        const { pagenumber,perpage,total_pages,fromDate,toDate } = this.state
        if(condition === 'inc')
        {
            const page = pagenumber >= total_pages ? total_pages:pagenumber+1
            this.setState({pagenumber:page})
            localStorage.getItem('countryid') !==null && axiosInstance.post(`/quotation/filter`,{page,per_page:perpage,s:this.state.emailSearch,client_id:this.state.client_id,job_status:this.state.status,country_id:localStorage.getItem('countryid'),from_date:fromDate,to_date:toDate})
            .then(res => {
                //console.log(res)
                const list = res.data.response.quotation_list
                // //console.log(list)
                const quotation_list = list.filter(quote => quote.parent_id === '0')
                const parent_list = quotation_list.filter(quote => quote.job_status == this.state.status)
                // //console.log(quotation_list, list, "quotation_list")
                this.setState({ list, quotation_list, parent_list })
            })
        }
        else{
            const page = pagenumber <= 1 ? 1 : pagenumber-1
            this.setState({pagenumber: page})
            localStorage.getItem('countryid') !==null && axiosInstance.post(`/quotation/filter`,{page,per_page:perpage,job_status:this.state.status,s:this.state.emailSearch,client_id:this.state.client_id,country_id:localStorage.getItem('countryid'),from_date:fromDate,to_date:toDate})
            .then(res => {
                //console.log(res)
                const list = res.data.response.quotation_list
                // //console.log(list)
                const quotation_list = list.filter(quote => quote.parent_id === '0')
                const parent_list = quotation_list.filter(quote => quote.job_status == this.state.status)
                // //console.log(quotation_list, list, "quotation_list")
                this.setState({ list, quotation_list, parent_list })
            })
        }
    }
   

    renderComponent = (id) => {
        // window.location.replace(`/editQuotation/${id}`)
        this.setState({
            editQuote: true,
            quote_id: id,
        })
    }
    Back = () => {
        this.setState({
            editQuote: false,
            quote_id: null,
        })
        this.componentDidMount()
    }

    paymentChange = (id,data) =>{
        const { parent_list,invoice_list,paymentShow,childQuote_list} = this.state

                if(data == 'child'){
                    // console.log(id)
                        const newquote = childQuote_list.find(quote=>quote.id == id)
                        const client_invoice =  newquote.client_invoice_id.map(clinv => invoice_list.find(inv=>inv.id == clinv))
                        const cont_invoice = newquote.cont_invoice_id.map(clinv => invoice_list.find(inv=>inv.id == clinv))
                        this.setState({client_invoice,cont_invoice,newquote})
                        this.setState({paymentShow:!this.state.paymentShow})
                }
                else{
                    // console.log(id)
                    const newquote = parent_list.find(quote=>quote.id == id)
                    const client_invoice =  newquote.client_invoice_id.map(clinv => invoice_list.find(inv=>inv.id == clinv))
                    const cont_invoice = newquote.cont_invoice_id.map(clinv => invoice_list.find(inv=>inv.id == clinv))
                    this.setState({client_invoice,cont_invoice,newquote})
                    this.setState({paymentShow:!this.state.paymentShow})
                }
                
    }
    payment = (id) =>{
        const { paymentShow } = this.state
        this.setState({paymentShow:!this.state.paymentShow})
    }

    handleTrash = () =>{
        // axiosInstance.post(``)
    }
    render() {
        const { visible,pagenumber,client_list,singleCountry, paymentShow,visibleParent,client_invoice, editQuote, childQuote_list, parent_list, quotation_list, country_list, emailSearch, countrySearch, fromDate, toDate, status, } = this.state;
        return (
            <div>
                {editQuote ? <AddQuotation id={this.state.quote_id} Back={this.Back} /> :
                    <div className="component">
                        <h4>{singleCountry !== undefined?singleCountry.name:''}</h4>
                        {/* <Card>
                        <Row >
                        <Col lg={2}></Col>
                        <Col lg={2}>
                            <Link to='/cwr-summary/pending'>
                            <Radio label='Pending'  />
                            </Link>
                            </Col>
                            <Col lg={2}>
                            <Link to='/cwr-summary/completed'>
                            <Radio label='Completed'  />
                            </Link>
                                </Col>
                                <Col lg={2}>
                                <Link to='/cwr-summary/cancelled'>
                                <Radio label='Cancelled' checked /></Link>
                                </Col>
                                <Col lg={2}>
                                <Link to='/cwr-summary/allQ'>
                                <Radio label='All Qutotations' />
                                </Link>
                                </Col>
                        </Row>                            
                        </Card> */}
                        <Card style={{ marginTop: "30px" }} >
                            <Row  >
                                <Col lg={3}>
                                    <Form.Control
                                        type="text"
                                        name='emailSearch'
                                        placeholder="Search"
                                        value={emailSearch}
                                        onChange={this.search}
                                    />
                                    <button className='iconButtton' >
                                        <i className="fa fa-search" ></i>
                                    </button><br />
                                    {/* <Autocomplete
                                        options={quotation_list!==undefined?quotation_list:[]}
                                        onChange={(e, value) => value !== null ? this.quotationfilter(value.quotation_num) : this.setState({ parent_list: quotation_list.filter(quote => quote.job_status === status) })}
                                        getOptionLabel={(option) => option.quotation_num}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <Form.Control placeholder='Quotation' type="text" {...params.inputProps} />
                                            </div>
                                        )}
                                    /> */}
                                </Col>
                                {/* <Col lg={2}>
                                    <Autocomplete
                                        options={country_list}
                                        onChange={(e, value) => value !== null ? this.countryFilter('countrySearch', value.id) : this.setState({ parent_list: quotation_list.filter(quote => quote.job_status === status) })}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <Form.Control placeholder='Country' type="text" {...params.inputProps} />
                                            </div>
                                        )}
                                    />
                                </Col> */}
                                <Col lg={1}>
                                    <Form.Control
                                        type="date"
                                        name="fromDate"
                                        value={fromDate}
                                        onChange={this.onChange}
                                    /><br /> 
                                </Col>
                                <Col lg={1}>
                                    <Form.Control
                                        type="date"
                                        name="toDate"
                                        value={toDate}
                                        onChange={this.onChange}
                                    /><br />
                                </Col>
                                <Col lg={2}>
                                    <Form.Control as='select' value={status} name="status" onChange={this.statusFilter} >
                                        <option value='' disabled selected> Status </option>
                                        <option value='2' selected>Pending</option>
                                        <option value='1'>Completed</option>
                                        <option value='3'>Cancelled</option>
                                        <option value='4'>All Quotations</option>
                                    </Form.Control><br />
                                </Col>
                                <Col lg={2}>
                                    <Autocomplete
                                        options={singleCountry.id === '' ? client_list : client_list.filter(client => parseInt(client.country) === parseInt(singleCountry.id))}
                                        onChange={(e, value) => value !== null ? this.clientFilter('client_id', value.id) :''}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <Form.Control placeholder='Client' {...params.inputProps} />
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col lg={1}>
                                    <Link to='/addQuotation' >
                                        <Popup content="Add Quotation" trigger={<button className='addIcon' >
                                        <i className="fa fa-plus" style={{ fontSize: "20px", color: "white" }}></i>
                                    </button>}/>
                                    </Link>
                                </Col>
                                <Col lg={1}>
                                    <Popup content="Refresh"
                                    trigger={<button className='addIcon' onClick={()=>window.location.reload()}>
                                        <i className="fa fa-retweet" style={{ fontSize: "20px", color: "white" }}></i>
                                    </button>}/>
                                </Col>
                                <Col lg={1}>
                                    <Popup content="Recycle Bin"
                                    trigger={<Link to="/trash"><button className='addIcon' onClick={this.handleTrash}>
                                        <i className="fa fa-trash" style={{ fontSize: "20px", color: "white" }}></i>
                                    </button></Link>}/>
                                </Col>
                            </Row>
                        </Card>
                        <Card style={{ marginTop: "30px", backgroundColor: "white" }}>
                            <Row>
                                <Table style={{ backgroundColor: "white" }} responsive>
                                    <thead>
                                        <tr>
                                            <th>EDIT</th>
                                            <th>VIEW_INV</th>
                                            <th >QUOTE NO</th>
                                            <th >DATE ISSUED</th>
                                            <th >CLIENT</th>
                                            <th >DESCRIPTION</th>
                                            <th style={{textAlign:'right'}}>QUOTE AMT</th>
                                            <th >QUOTE APPROVAL</th>
                                            <th>CLIENT PO</th>
                                            <th>MARGIN %</th>
                                            <th style={{textAlign:'right'}}>MARGIN AMT</th>
                                            <th>CCM TKT NO</th>
                                            <th>COMPLETION DATE</th>
                                            <th>DELETE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {quotation_list.map(this.renderTable)} */}
                                        {parent_list.length !== 0 && parent_list.map((quote, i) =>
                                            <>
                                                <tr key={quote.quotation_num}
                                                
                                                    className={quote.job_complete_date !== '0000-00-00'? "greenish" : ""}
                                                    onClick={() => this.childQuote(quote.id)}
                                                    style={{ height: "50px", padding: "10px" }}
                                                    >
                                                    
                                                    <td>
                                                    {/* <Link to={`/editQuotation/${quote.id}`}> */}
                                                    <button onClick={() => this.renderComponent(quote.id)} className='buttonStyle'><i className='green edit link icon' style={{ fontSize: "18px", }} ></i></button>
                                                    {/* </Link> */}
                                                    </td>
                                                    <td><button onClick={()=>this.paymentChange(quote.id)} className='buttonStyle'><i className='fa fa-book' style={{ fontSize: "18px", color: "blue", margin: '5px' }} ></i></button></td>
                                                    {quote.sub_list == 0 ?<td> {quote.quotation_num} </td>:
                                                    <Popup content="View Child Quote" trigger={<td style={{cursor:'pointer'}}> {quote.quotation_num} </td>}/>}
                                                    
                                                    <td >{quote.qut_date_issue !== '0000-00-00' ? quote.qut_date_issue.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''}  </td>
                                                    <td >{this.clientName(quote.client_id)} </td>
                                                    <td >{quote.description} </td>
                                                    <td style={{textAlign:'right'}}>{quote.quotation_amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                    <td >{quote.qut_status === '1' ? 'Approved' : quote.qut_status === '2' ? 'Pending' : quote.qut_status === '3' ? 'Canceled' : quote.qut_status === '4' ? 'Rejected' : ''} </td>
                                                    <td > {quote.client_po} </td>
                                                    {parseInt(quote.margin_amount) > 0 ?
                                                        <>
                                                            <td style={{textAlign:'right'}}>{quote.qut_status === '1' ?
                                                                `${quote.margin}%`:''} </td>
                                                            <td style={{textAlign:'right'}}>{quote.qut_status === '1' ?
                                                                quote.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                        </>
                                                        : parseInt(quote.margin_amount) === 0 ?
                                                            <>
                                                            <td style={{textAlign:'right'}}>{quote.qut_status === '1' ? '0.00 %' :''}</td>
                                                                <td style={{textAlign:'right'}}>{quote.qut_status === '1' ? '0.00' :''}</td>
                                                            </> :
                                                            <>
                                                                <td ></td>
                                                                <td style={{ color: 'red',textAlign:'right' }} >{quote.qut_status === '1' ?
                                                                    quote.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                            </>}
                                                    <td >{quote.ticket_no !== '0' ? quote.ticket_no : ''} </td>
                                                    <td >{quote.job_complete_date !== '0000-00-00' ? quote.job_complete_date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''} </td>
                                                    <td><button onClick={(e) => this.trashQuote(quote.id, quote.client_invoice_id, quote.cont_invoice_id, 'parent',quote.sub_list)} className='buttonStyle'><i className='fa fa-trash' style={{ fontSize: "18px", color: "red", margin: '5px' }} ></i></button></td>
                                                </tr>
                                                <React.Fragment >
                                                    {(visible === true && visibleParent == quote.id) && childQuote_list.map(child =>
                                                        <tr key={child.quotation_num}
                                                            className="rowtable"
                                                            style={{ height: "50px", padding: "10px" }}>
                                                            <td><button onClick={() => this.renderComponent(child.id)} className='buttonStyle'><i className='green edit link icon' style={{ fontSize: "18px", backgroundColor: '#C3E7FB' }} ></i></button></td>
                                                            <td><button onClick={()=>this.paymentChange(child.id,"child")} className='buttonStyle'><i className='fa fa-book' style={{ fontSize: "18px", color: "blue", margin: '5px' }} ></i></button></td>
                                                            <td > {child.quotation_num} </td>
                                                            <td >{child.qut_date_issue !== '0000-00-00' ? child.qut_date_issue.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''}  </td>
                                                            <td >{this.clientName(child.client_id)} </td>
                                                            <td >{child.description} </td>
                                                            <td  style={{textAlign:'right'}}>{child.quotation_amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                            <td >{child.qut_status === '1' ? 'Approved' : child.qut_status === '2' ? 'Pending' : child.qut_status === '3' ? 'Canceled' : child.qut_status === '4' ? 'Rejected' : ''} </td>
                                                            <td > {child.cont_po_num} </td>
                                                            {parseInt(child.margin_amount) > 0 ?
                                                                <>
                                                                    <td style={{textAlign:'right'}}>{quote.qut_status === '1' ?
                                                                        `${child.margin}%`:''} </td>
                                                                    <td  style={{textAlign:'right'}}>{quote.qut_status === '1' ?
                                                                        child.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                                </>
                                                                : parseInt(child.margin_amount) === 0 ?
                                                                    <>
                                                                        <td ></td>
                                                                        <td ></td>
                                                                    </> : <>
                                                                        <td ></td>
                                                                        <td style={{ color: 'red',textAlign:"right" }} >{quote.qut_status === '1' ?
                                                                            child.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                                    </>}
                                                            <td >{child.ticket_no !== '0' ? child.ticket_no : ''} </td>
                                                            <td >{child.job_complete_date !== '0000-00-00' ? child.job_complete_date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''} </td>
                                                            <td><button onClick={(e) => this.trashQuote(child.id, child.client_invoice_id, child.cont_invoice_id, 'child')} className='buttonStyle'><i className='fa fa-trash' style={{ fontSize: "18px", color: "red", margin: '5px', backgroundColor: '#C3E7FB' }} ></i></button></td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            </>
                                        )}
                                    </tbody>
                                </Table>
                            </Row>
                        </Card>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:"50px"}}>
                                <button  style={{
                                        marginLeft:"20px",
                                        border:"5px solid white",
                                        backgroundColor:"#4A88DC",
                                        padding:"10px",
                                        color:"white",
                                        borderRadius:"10px"
                                        }}
                                        onClick={()=>this.pagination('dec')}><i className="fa fa-arrow-left" style={{fontSize:"15px"}}></i></button>
                                <p style={{marginLeft:"20px",fontSize:"18px",marginTop:"15px"}}>{pagenumber}</p>
                                <button 
                                    style={{
                                        marginLeft:"20px",
                                        border:"5px solid white",
                                        backgroundColor:"#4A88DC",
                                        padding:"10px",
                                        color:"white",
                                        borderRadius:"10px"
                                        }}
                                        onClick={()=>this.pagination('inc')}><i className="fa fa-arrow-right" style={{fontSize:"15px"}}></i></button>
                            </div>
                    </div>}
                    {/* <Payment
                        show={paymentShow}
                        handleClose={this.paymentChange}
                        list={client_invoice}
                        onDelete={this.onDelete}
                        user='Client'
                    /> */}
                    <Clientcontinvoice
                    show={paymentShow}
                    handleClose={this.payment}
                    client_list={client_invoice}
                    cont_list={this.state.cont_invoice}
                    quote={this.state.newquote}
                    />
                   
            </div>
        )
    }
}


// const renderInvoice = () => {
//     return (
//         <Card>

//         </Card>
//     )
// }
