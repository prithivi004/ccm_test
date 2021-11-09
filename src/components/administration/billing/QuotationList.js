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
import axiosInstance from '../../utils/axiosinstance'
import TextField from '@mui/material/TextField';
import axios from 'axios'
import Invoice from '../../Invoice'
import DatePicker from "react-datepicker";
import AddQuotation from './AddQuotation'
import "bootstrap/js/src/collapse.js";
import { Alert } from '../../utils/Utilities'
import Autocomplete from '@material-ui/lab/Autocomplete';
import swal from 'sweetalert'
import Swal from 'sweetalert2'
import Payment from './invoice/Payment'
import Clientcontinvoice from './invoice/Clientcontinvoice';
import { Popup,Pagination,Dropdown } from 'semantic-ui-react'
import EditQuotation from './EditQuotation';
import SearchAccordion from './Status/SearchAccordion';

var token = localStorage.getItem('access_token')

export default class quotation_list extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quote_id: null,
            emailSearch: '',
            countrySearch: '',
            fromDate: '',
            toDate: '',
            status: '2',
            quoteStatus:'2',
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
            activeIndex: 0,
            activePage: 1,
            tags:[]
        }
        this.clientName=this.clientName.bind(this)
        this.paymentChange=this.paymentChange.bind(this)
        this.renderComponent=this.renderComponent.bind(this)
        this.trashQuote=this.trashQuote.bind(this)
        this.childQuote=this.childQuote.bind(this)
        this.pagination1=this.pagination1.bind(this)
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
            // if(this.state.emailSearch==''){
                axiosInstance.post(`/quotation/filter`,{from_date:this.state.fromDate,client_id:this.state.tags.toString(),to_date:this.state.toDate,s:this.state.emailSearch,job_status:this.state.status,qut_status:this.state.quoteStatus,page:this.state.activePage,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
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
                    // console.log(total_pages,'pages')
                    // console.log(quotation_list, list, "quotation_list")
                    this.setState({ parent_list,total_pages })
                    }
                })
            // }else{
            //     axiosInstance.post(`/quotation/filter`,{from_date:this.state.fromDate,client_id:this.state.client_id,to_date:this.state.toDate,s:this.state.emailSearch,job_status:this.state.status,page:1,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
            // .then(res => {
            //     console.log(res)
            //     if(localStorage.getItem('countryid') === null){
            //         this.setState({ list:[], quotation_list:[], parent_list:[] })

            //     }
            //     else{
                
            //     const total_pages = res.data.response.paging_details.total
            //     // const quotation_list = list.filter(quote => quote.parent_id === '0')
            //     const parent_list = res.data.response.quotation_list
            //     // console.log(parent_list)
                
            //     // console.log(quotation_list, list, "quotation_list")
            //     this.setState({ parent_list,total_pages })
            //     }
            // })
            // }
        
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
        const data = {from_date:fromDate,to_date:toDate,page:pagenumber,client_id:this.state.client_id,per_page:perpage,country_id:localStorage.getItem('countryid'),job_status:this.state.status,qut_status:this.state.quoteStatus,s:emailSearch}
        axiosInstance.post(`quotation/filter`,data)
    .then(res=>{
        const parent_list = res.data.response.quotation_list
        const total_pages = res.data.response.paging_details.total
        // const total_pages = res.data.response.paging_details.total
        // const parent_list = list.filter(li => li.country_id == localStorage.getItem('countryid'))
        // console.log(parent_list)
        this.setState({parent_list,total_pages})
    })
    }
    qutstatusFilter = (e) => {
        const { quotation_list,emailSearch,fromDate,toDate } = this.state;
        // const parent_list = quotation_list.filter(quote => quote.job_status == e.target.value)
        // //console.log( e.target.value,parent_list)
        // axiosInstance.post(`quotation/filter`,{job_status:e.target.value})
        axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,client_id:this.state.client_id,s:emailSearch,qut_status:e.target.value,job_status:this.state.status,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
        .then(res =>{
            const parent_list = res.data.response.quotation_list
            const total_pages = res.data.response.paging_details.total
            // console.log(parent_list,"Parent")
            this.setState({parent_list,total_pages})
        })
        this.setState({ [e.target.name]: e.target.value })
       
        // window.location.replace(`/cwr-summary/${e.target.value}`)
    }
    jobstatusFilter = (e) => {
        const { quotation_list,emailSearch,fromDate,toDate } = this.state;
        // const parent_list = quotation_list.filter(quote => quote.job_status == e.target.value)
        // //console.log( e.target.value,parent_list)
        // axiosInstance.post(`quotation/filter`,{job_status:e.target.value})
        axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,client_id:this.state.client_id,s:emailSearch,job_status:e.target.value,qut_status:this.state.quoteStatus,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
        .then(res =>{
            const parent_list = res.data.response.quotation_list
            const total_pages = res.data.response.paging_details.total
            // console.log(parent_list,"Parent")
            this.setState({parent_list,total_pages})
        })
        this.setState({ [e.target.name]: e.target.value })
       
        // window.location.replace(`/cwr-summary/${e.target.value}`)
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
        console.log(value)
        axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,client_id:value,s:emailSearch,job_status:this.state.status,qut_status:this.state.quoteStatus,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
        .then(res =>{
            const parent_list = res.data.response.quotation_list
            const total_pages = res.data.response.paging_details.total
            // console.log(parent_list,"Parent")
            this.setState({parent_list,total_pages})
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
        axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,s:e.target.value,client_id:this.state.client_id,page:1,job_status:this.state.status,qut_status:this.state.quoteStatus,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
        .then(res=>{
            const parent_list = res.data.response.quotation_list
            const total_pages = res.data.response.paging_details.total
            // const parent_list = list.filter(li => li.country_id == localStorage.getItem('countryid'))
            this.setState({parent_list,total_pages})
            // console.log(this.state.parent_list,'parent')
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
            localStorage.getItem('countryid') !==null && axiosInstance.post(`/quotation/filter`,{page,per_page:perpage,s:this.state.emailSearch,job_status:this.state.status,client_id:this.state.client_id,country_id:localStorage.getItem('countryid'),from_date:fromDate,to_date:toDate})
            .then(res => {
                //console.log(res)
                const list = res.data.response.quotation_list
                // //console.log(list)
                const quotation_list = list.filter(quote => quote.parent_id === '0')
                let parent_list
                if(this.state.status=='4'){
                     parent_list=quotation_list
                }else{
                     parent_list=quotation_list.filter(quote => quote.job_status == this.state.status)
                }
                // const parent_list = quotation_list.filter(quote => quote.job_status == this.state.status)
                // //console.log(quotation_list, list, "quotation_list")
                // console.log(parent_list,page,'after','parent')
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
                // const parent_list = quotation_list.filter(quote => quote.job_status == this.state.status)
                // //console.log(quotation_list, list, "quotation_list")
                let parent_list
                if(this.state.status=='4'){
                     parent_list=quotation_list
                }else{
                     parent_list=quotation_list.filter(quote => quote.job_status == this.state.status)
                }
                // console.log(parent_list,page,'before','parent')
                this.setState({ list, quotation_list, parent_list })
            })
        }
    }

    pagination1 = (page) =>{
        const { pagenumber,perpage,total_pages,fromDate,toDate } = this.state
       
            localStorage.getItem('countryid') !==null && axiosInstance.post(`/quotation/filter`,{page,per_page:perpage,s:this.state.emailSearch,job_status:this.state.status,client_id:this.state.tags.toString(),country_id:localStorage.getItem('countryid'),from_date:fromDate,to_date:toDate})
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

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ activePage })
        this.pagination2(activePage)
      }

    pagination2 = (page) =>{
        const { pagenumber,perpage,total_pages,fromDate,toDate } = this.state
       
            localStorage.getItem('countryid') !==null && axiosInstance.post(`/quotation/filter`,{page,per_page:perpage,s:this.state.emailSearch,job_status:this.state.status,qut_status:this.state.quoteStatus,client_id:this.state.tags.toString(),country_id:localStorage.getItem('countryid'),from_date:fromDate,to_date:toDate})
            .then(res => {
                //console.log(res)
                const list = res.data.response.quotation_list
                // //console.log(list)
                const quotation_list = list.filter(quote => quote.parent_id === '0')
                let parent_list
                if(this.state.status=='4'){
                     parent_list=quotation_list
                }else{
                     parent_list=quotation_list.filter(quote => quote.job_status == this.state.status)
                }
                // //console.log(quotation_list, list, "quotation_list")
                this.setState({ list, quotation_list, parent_list })
            })
    }

    onTagsChange = (event, values) => {
        const { quotation_list,emailSearch,fromDate,toDate } = this.state;
        let arr=[]
        let arr2=[]
        let arr3=[]
        const result = values.map( ({ id }) =>arr.push(id) );
        const result2 = values.map( ({ name }) =>arr2.push(name) );
        const result3 = values.map( ({ name,id }) =>arr3.push({name:name,id:id}) );
        this.setState({
          tags: arr,
          multi:arr2.toString(),
          tagMulti:arr3
        }, () => {
          // This will output an array of objects
          // given by Autocompelte options property.
         
          axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,client_id:arr.toString(),s:emailSearch,job_status:this.state.status,qut_status:this.state.quoteStatus,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
          .then(res =>{
              const parent_list = res.data.response.quotation_list
              const total_pages = res.data.response.paging_details.total
              // console.log(parent_list,"Parent")
              this.setState({parent_list,total_pages})
          })
        //   this.setState({ client_id: arr.toString() })
          console.log(arr.toString());
          console.log(arr3)
        });
      }
   onRemove=(e)=>{
    const { quotation_list,emailSearch,fromDate,toDate } = this.state;
    this.setState({tags: this.state.tags.filter(person => person !== e.target.value),
                    tagMulti: this.state.tagMulti.filter(person => person.id !== e.target.value)
});
    axiosInstance.post(`quotation/filter`,{from_date:fromDate,to_date:toDate,client_id:this.state.tags.toString(),s:emailSearch,job_status:this.state.status,page:this.state.pagenumber,per_page:this.state.perpage,country_id:localStorage.getItem('countryid')})
    .then(res =>{
        const parent_list = res.data.response.quotation_list
        const total_pages = res.data.response.paging_details.total
        // console.log(parent_list,"Parent")
        this.setState({parent_list,total_pages})
    })
    console.log(this.state.tags)
   }
   
    renderComponent = (id) => {
        // window.location.replace(`/editQuotation/${id}`)  
        this.setState({
            editQuote: true,
            quote_id: id,        
        })
        // console.log(this.state.parent_list,'before')
    }
    Back = () => {       
        this.setState({
            editQuote: false,
            quote_id: null,
        })
        // console.log(this.state.parent_list,'after')
        // this.componentDidMount()
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
        const { visible,pagenumber,singleCountry,client_list, paymentShow,visibleParent,client_invoice, editQuote, childQuote_list, parent_list, quotation_list, country_list, emailSearch, countrySearch, fromDate, toDate, status, } = this.state;
        return (
            <div>
                {editQuote ? <AddQuotation id={this.state.quote_id} Back={this.Back} /> :
                    <div className="component"><br/>
                    <Row>
                    <Col lg={3}>
                        <h4>CWR  {singleCountry !== undefined?singleCountry.name:''}</h4><br/>
                        </Col>
                        <Col lg={6}/>
                        <Col lg={3}>
                                    <Row>
                                    <Col lg={6} sm={5} md={4} xs={6}>
                                    <a href={`https://ccmanagement.group/quote_api/public/report/excel?country_id=${localStorage.getItem('countryid')}&client_id=${this.state.client_id===undefined ? ' ':this.state.client_id}&from_date=${fromDate}&to_date=${toDate}&qut_status=${this.state.quoteStatus}&job_status=${this.state.status}`}>
                                    <button className='button' >Export</button></a></Col>
                                <Col lg={2} sm={1}  md={1} xs={2}>
                                    <Link to='/addQuotation' >
                                        <Popup content="Add Quotation" trigger={<button className='button' style={{width:40}} >
                                        <i className="fa fa-plus" style={{ fontSize: "20px" }}></i>
                                    </button>}/>
                                    </Link>
                                </Col>
                                <Col lg={2} sm={1}  md={1} xs={2}>
                                    <Popup content="Refresh"
                                    trigger={<button className='button' style={{width:40}} onClick={()=>window.location.reload()} >
                                        <i className="fa fa-retweet" style={{ fontSize: "20px" }}></i>
                                    </button>}/>
                                </Col>
                                <Col lg={2} sm={1}  md={1} xs={2}>
                                    <Popup content="Recycle Bin"
                                    trigger={<Link to="/trash"><button className='button' style={{width:40}} onClick={this.handleTrash}>
                                        <i className="fa fa-trash" style={{ fontSize: "20px" }}></i>
                                    </button></Link>}/>
                                </Col>
                                </Row>
                                </Col>
                                </Row>
                        <Card style={{ marginTop: "30px" }} >
                            <Row style={{marginTop:5 }} >
                                <Col lg={2}>
                                <h6>Search</h6>
                                    <Form.Control
                                        type="text"
                                        name='emailSearch'
                                        placeholder="Search"
                                        value={emailSearch}
                                        onChange={this.search}
                                    /><br/>
                                    {/* <button className='iconButtton' >
                                        <i className="fa fa-search" ></i>
                                    </button><br /> */}
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
                                <Col lg={2}>
                                <h6>From</h6>
                                    <Form.Control
                                        type="date"
                                        name="fromDate"
                                        value={fromDate}
                                        onChange={this.onChange}
                                    /><br /> 
                                </Col>
                                <Col lg={2}>
                                <h6>To</h6>
                                    <Form.Control
                                        type="date"
                                        name="toDate"
                                        value={toDate}
                                        onChange={this.onChange}
                                    /><br />
                                </Col>
                                <Col lg={2}>
                                <h6>Overall Status</h6>
                                    <Form.Control as='select' value={status} name="status" onChange={this.jobstatusFilter} >
                                        <option value='' disabled selected> Status </option>
                                        <option value='2' selected>Pending</option>
                                        {/* <option value="1">Approved</option> */}
                                        <option value='1'>Completed</option>
                                        {/* <option value="4">Rejected</option> */}
                                        <option value='3'>Cancelled</option>
                                        <option value='4'>All Quotations</option>
                                    </Form.Control><br />
                                </Col>
                                <Col lg={2}>
                                <h6>Approval Status</h6>
                                    <Form.Control as='select' value={this.state.quoteStatus} name="quoteStatus" onChange={this.qutstatusFilter} >
                                    <option value="" disabled>Quote Approval</option>
                                        <option value="1">Approved</option>
                                        <option value="2">Pending</option>
                                        <option value="4">Rejected</option>
                                        <option value="3">Cancelled</option>
                                        <option value=' '>All Quotations</option>
                                    </Form.Control><br />
                                </Col>
                                <Col lg={2}>
                                <h6>Client</h6>
                                    <Autocomplete
                                        multiple
                                        limitTags={2}
                                        id="size-small-standard-multi"
                                        size="small"
                                        disableCloseOnSelect
                                        options={singleCountry.id === '' ? client_list : client_list.filter(client => parseInt(client.country) === parseInt(singleCountry.id))}
                                        onChange={this.onTagsChange}
                                        // onChange={(e, value) => value !== null ? this.clientFilter('client_id', value.id) :this.clientFilter('client_id', '')}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                 <TextField {...params} variant="standard"   placeholder={this.state.multi} />
                                            </div>
                                        )}
                                    />

                                    {/* <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={singleCountry.id === '' ? client_list : client_list.filter(client => parseInt(client.country) === parseInt(singleCountry.id))}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      onChange={(e, value) => value !== null ? this.clientFilter('client_id', value.id) :this.clientFilter('client_id', '')}
      renderOption={(props, option,  selected ) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      style={{ width: 250}}
      renderInput={(params) => (
        <TextField {...params} label="Clients" placeholder="eg.GUCCI" />
      )}
    /> */}
                                </Col>
                               
                            </Row>
                        </Card>
                            {/* <>
                              <table>
                                  <tbody>
                                  {
                                    this.state.tagMulti && this.state.tagMulti.length !==0 && this.state.tagMulti.map((tagi)=>
                                    <tr key={tagi.id}>
                                        <td>{tagi.name}</td>
                                        <td>{tagi.id}</td>
                                        <td><button value={tagi.id} onClick={this.onRemove}>Delete</button></td>
                                    </tr>
                                    )}
                                  </tbody>
                              </table>  
                            </> */}
                            
                        {/* {this.state.emailSearch==''? */}
                        <Card style={{ marginTop: "30px", backgroundColor: "white" }}>
                            <Row>
                                <Table style={{ backgroundColor: "white" }} responsive>
                                    <thead>
                                        <tr>
                                            <th>EDIT</th>
                                            <th>INVOICE</th>
                                            <th >QUOTE NO</th>
                                            <th >DATE ISSUED</th>
                                            <th >CLIENT</th>
                                            <th >DESCRIPTION</th>
                                            <th style={{textAlign:'right'}}>QUOTE AMT</th>
                                            <th >STATUS</th>
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
                        
                        {/* <SearchAccordion 
                        search={this.state.emailSearch}
                        list={parent_list}
                        paymentChange={this.paymentChange}
                        visible={visible}
                        visibleParent={visibleParent}
                        childQuote_list={childQuote_list}
                        clientName={this.clientName}
                        renderComponent={this.renderComponent}
                        trashQuote={this.trashQuote}
                        childQuote={this.childQuote}
                        pagination={this.pagination1}
                        pagenumber={pagenumber}
                        totalPages={this.state.total_pages}
                        /> */}
                       
                        {/* {this.state.emailSearch==''? */}
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:"20px"}}>
                                {/* <button  style={{
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
                                        onClick={()=>this.pagination('inc')}><i className="fa fa-arrow-right" style={{fontSize:"15px"}}></i></button> */}

                                        <Pagination defaultActivePage={this.state.activePage}  onPageChange={this.handlePaginationChange} totalPages={this.state.total_pages} />
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
