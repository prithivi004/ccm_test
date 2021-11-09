import React, { Component } from 'react'
import { Card, Container, Row, Col, Form} from 'react-bootstrap'
import {Label} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import CustomTextBox from '../../utils/TextBox'
import CustomButton from '../../utils/Button'
import axiosInstance from '../../utils/axiosinstance'
import CurrencyFormat from 'react-currency-format'
import Autocomplete from '@material-ui/lab/Autocomplete';
import ClientInvoice from './invoice/ClientInvoice'
import ContractorInvoice from './invoice/ContractorInvoice';
import { CategoryList } from '../../utils/CategoryList'
import { Alert } from '../../utils/Utilities'
import { DateFormat } from '../../utils/DateFormat'
import Curreny, { data } from 'currency-codes'
import $ from 'jquery'
import swal from 'sweetalert';
import ContPO from './contractor/ContPO'
import { getParamByParam } from 'iso-country-currency'
import Snackbar from '@material-ui/core/Snackbar';
// import interval from '../../utils/setInterval'
import SaveAlert from '../../utils/SaveAlert'
import { Popup } from 'semantic-ui-react'
import { isEmpty } from 'ramda'
import axios from 'axios'
export class EditQuotation extends Component {
    constructor(props) {
        super(props)

        // this.textLog = React.createRef();

        this.initialState = {
            quote_id: this.props.match.params.id,
            parent_id: '0',
            parent_QuoteNum: '',
            categories: '',

            quotation_num: '',
            description: '',
            client_id: '',
            clientName: '',
            client_po: '',
            quotationDate: '',
            quoteAmount: '',
            quotationStatus: '2',

            margin: 0,
            margin_amount: 0,

            cont_id: '',

            clientInvoice_list: [],
            contInvoice_list: [],

            jobComplete: '',
            ticket_no: '',
            comments2:'',
            quote_comments:'',
            job_status: '2',
            currency: '',
            timestamp:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Date.now()),
           
            client_amount: 0,
            cont_amount: 0,
            quote_number:'',
            quote_amount:'',
            client_list: [],
            contractor_list: [],
            client_invoice: [],
            contractor_invoice: [],
            user:{},
            showSnak:false,
            vertical:'top',
            horizontal:'right',
            snaklist:{},
            po_amount:0,
            clientinvaddedClicked:false,
            continvaddedClicked:false,
            POaddClicked:false,
            contractor_id:'',
            rerender:true,
            po_amount:0,
            usrname:'',
            saveshow:false,
        }
        this.client_invoice = {}
        this.cont_invoice = {}
        this.cont_po = {}
        this.state = this.initialState
        this.msg = []
    }
    // componentDidUpdate() {
    //     this.textLog.current.scrollTop = this.textLog.current.scrollHeight;
    // }
    componentDidMount() {
        if(this.props.match.params.id === undefined){
            
        
        axiosInstance.post('/country/list')
        .then(res=>{
            const countries = res.data.response.country_list
            const findcountry = countries.find(country => country.id == localStorage.getItem('countryid'))
            if(findcountry !== undefined){
            const currency = getParamByParam('countryName',findcountry.name,'currency')
            // ////console.log(currency)
            this.setState({currency})
            }

        })
    }

    axiosInstance.post(`/quotation/search`)
    .then(res=>{
        const quotation_list2 = res.data.response.quotation_list 
        this.setState({quotation_list2})
        if (this.props.match.params.id !== undefined) {
            const quote_detail = quotation_list2.find(quote => parseInt(quote.id) === parseInt(this.props.match.params.id))
            const parent_quote = quotation_list2.find(quote => parseInt(quote.id) === parseInt(quote_detail.parent_id))
            this.setState({parent_QuoteNum: parent_quote !== undefined ? parent_quote.quotation_num : '--parent quote--'})
        }

    })
        axiosInstance.post(`/quotation/list`)
            .then(res => {
                const quotation_list = res.data.response.quotation_list
                const filtered_quotes = quotation_list.filter(quote => quote.country_id == localStorage.getItem('countryid'))
                ////console.log(filtered_quotes)
                const user = res.data.session.users
                ////console.log(user)
                this.setState({ quotation_list,user})
                //////console.log(quotation_list);
                const usrname=res.data.session.users.name
                this.setState({usrname})

                if (this.props.match.params.id !== undefined) {
                   this.notification(this.props.match.params.id)
                    const quote_detail = quotation_list.find(quote => parseInt(quote.id) === parseInt(this.props.match.params.id))
                    console.log(quote_detail)
                    const parent_quote = quotation_list.find(quote => parseInt(quote.id) === parseInt(quote_detail.parent_id))
                    // this.notification(this.props.match.params.id)
                    this.setState({
                        quote_id: this.props.match.params.id,
                        parent_id: quote_detail.parent_id,
                        parent_QuoteNum: parent_quote !== undefined ? parent_quote.quotation_num : '--parent quote--',
                        categories: quote_detail.categories ==''?'--catogories--':quote_detail.categories,
                        quote_comments:quote_detail.quote_comments,
                        quotation_num: quote_detail.quotation_num,
                        description: quote_detail.description,
                        client_id: quote_detail.client_id,
                        client_po: quote_detail.client_po,
                        quotationDate: DateFormat(quote_detail.qut_date_issue),
                        quoteAmount: parseFloat(quote_detail.quotation_amt).toFixed(2),
                        quotationStatus: quote_detail.qut_status,
                        margin:quote_detail.margin,
                        margin_amount:quote_detail.margin_amount,
                        // cont_id: quote_detail.cont_id,
                        // PO_number: quote_detail.cont_po_num,
                        // PO_amount: parseFloat(quote_detail.cont_po_amt).toFixed(2),
                        // PO_date: DateFormat(quote_detail.cont_date),
                        // workCommence: DateFormat(quote_detail.work_com_date),
                        // workComplete: DateFormat(quote_detail.work_complete_date),
                        clientInvoice_list: quote_detail.client_invoice_id,
                        contInvoice_list: quote_detail.cont_invoice_id,
                        job_status:quote_detail.job_status,
                        jobComplete: DateFormat(quote_detail.job_complete_date),
                        ticket_no: quote_detail.ticket_no !== '0' ? quote_detail.ticket_no : '',
                        currency: quote_detail.currency

                    }, () => {
                        axiosInstance.post(`/client/list`,{country:localStorage.getItem('countryid')})
                            .then(res => {
                                const client_list = res.data.response.client_list
                                const client = client_list.find(client => parseInt(client.id) === parseInt(quote_detail.client_id))
                                this.setState({ client_list, clientName: client.name })
                                //////console.log(client_list);
                            })
                        axiosInstance.post(`/contractor/list`,{country:localStorage.getItem('countryid')})
                            .then(res => {
                                const contractor_list = res.data.response.contractor_list
                                this.setState({ contractor_list, })
                                // ////console.log(contractor_list);
                            })
                    })
                    axiosInstance.post(`/quotation/activity/${this.props.match.params.id}`)
                    .then(res=> this.handleNotificationResponse(res)) 
                } else {
                    axiosInstance.post(`/client/list`,{country:localStorage.getItem('countryid')})
                        .then(res => {
                            const client_list = res.data.response.client_list
                            this.setState({ client_list, })
                            //////console.log(client_list);
                        })
                    axiosInstance.post(`/contractor/list`,{country:localStorage.getItem('countryid')})
                        .then(res => {
                            const contractor_list = res.data.response.contractor_list
                            this.setState({ contractor_list, })
                            //////console.log(contractor_list);
                        })
                }
            })

            const timestamp = Date.now(); // This would be the timestamp you want to format

            console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp));  

    }

    marginCalc = () => {
        let { quoteAmount, po_amount ,creditAmount,credit_amount} = this.state;
        // console.log("calculated")
        // console.log(quoteAmount,"quoteAmount")
        // console.log(po_amount,"po_amount")
        // console.log(creditAmount,"creditAmount")
        // console.log(credit_amount,"credit_amount")

        if(credit_amount == NaN || credit_amount == undefined || credit_amount == ''){
            credit_amount=0
        }
        if(creditAmount == NaN || creditAmount == undefined || creditAmount == ''){
            creditAmount=0
        }

        if (parseInt(quoteAmount) !== 0 || parseInt(po_amount) !== 0) {              // for prevent NaN values
            const marginAmount = parseFloat(quoteAmount) - parseFloat(po_amount) + parseFloat(credit_amount) - parseFloat(creditAmount)
            // console.log(`marginAmount = ${parseFloat(quoteAmount)} - ${parseFloat(po_amount)} + ${parseFloat(credit_amount)} - ${parseFloat(creditAmount)}`)
            let margin = '';

            if (parseInt(po_amount) !== 0 && parseInt(quoteAmount) > parseInt(po_amount)) {        // to prevent negative values
                margin = parseFloat((marginAmount / parseFloat(po_amount)) * 100).toFixed(1)
            }
            // console.log(margin,"margin")
            // console.log(marginAmount,"marginAmount")
            this.setState({ margin_amount: parseFloat(marginAmount).toFixed(2), margin })
        }
        else{
            this.setState({ margin_amount: 0.00, margin:0 })
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    checkboxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked })
    }
    onChangeAmount = (values, name) => {              // amount
        const { formattedValue, value } = values;
        this.setState({ [name]: value }, () => this.marginCalc())
    }
    autoComplete = (e, value, name) => {
        value !== null && this.setState({ [name]: value[name], })
    }
    invoiceAdd = (name, value) => {
        this.state[name].push(value)
        this.setState({clientinvaddedClicked:true})
        this.onEdit('invoice')           // we need to call quotation_edit api for auto store invoice_id to quotattion.
    }
    ContinvoiceAdd = (name, value) => {
        this.state[name].push(value)
        this.setState({continvaddedClicked:true})
        this.onEdit('invoice')           // we need to call quotation_edit api for auto store invoice_id to quotattion.
    }
    invoiceRemove = (name, id) => {
        const index = this.state[name].indexOf(id)
        this.state[name].splice(index, 1)
        this.onEdit('invoice')                  // we need to call quotation_edit api for auto remove invoice_id from quotattion.
    }
    amountChange = (name, value) => {
        this.setState({ [name]: value }, () => this.marginCalc())
    }
    swalAlert = (name, id) => {        // alert message & focus
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
    AddClientInv = (data) =>{
        const newData = {...data,quotation_id:this.state.quote_id} 
        axiosInstance.post(`/invoice/add`, newData)
        .then((res) => {
            //console.log(res);
            if (res.data.message.success !== undefined) {
                this.msg.push(res.data.message)
                // if(isEmpty(this.cont_invoice) && isEmpty(this.cont_po)){
                this.setState({saveshow:true})
                // }
                this.client_invoice = {}
                this.invoiceAdd('clientInvoice_list', res.data.response.invoice_id)
                // Alert("success", "success!", `${res.data.message.success}`,)
            } else {
                    this.msg.push(res.data.message)
                    if(isEmpty(this.cont_invoice) && isEmpty(this.cont_po)){
                    this.setState({saveshow:true})
                }
                this.client_invoice = {}
                    // Alert("error", "error!", `${res.data.message.error}`,)
            }
        })
    }

    AddComment=()=>{
        const newData={comments:this.state.comments2,id:this.state.quote_id}
        axiosInstance.post(`/quotation/addComments`,newData)
        .then((res)=>{
            if (res.data.message.success !== undefined) {
                this.componentDidMount()
                this.setState({comments2:''})
            
                 Alert("success", "success!", `${res.data.message.success}`,)
                console.log(res.data.message.success)
            }else {
                Alert("error", "error!", `${res.data.message.error}`,)
                console.log(res.data.message.error)
            }
        })
    }

    AddContInv = (data,temp) =>{
        var newData = {}
        if(temp == 'edit'){
            newData = {...data,quotation_id:this.state.quote_id,po_id:this.state.po_id} 
        }
        else{
            newData = {...data,quotation_id:this.state.quote_id} 
        }
        axiosInstance.post(`/invoice/add`, newData)
                .then((res) => {
                    //console.log(res);
                    if (res.data.message.success !== undefined) {
                        this.msg.push(res.data.message)
                        this.cont_invoice = {}
                        this.invoiceAdd('contInvoice_list', res.data.response.invoice_id)  // add invoice_id to quotation 
                        // Alert("success", "success!", `${res.data.message.success}`,)
                        // this.onCancel()
                        this.setState({saveshow:true})
                    } else {
                        // Alert("error", "error!", `${res.data.message.error}`,)
                        this.msg.push(res.data.message)
                        this.setState({saveshow:true})
                        this.cont_invoice = {}
                    }
                })
    }

    AddcontPo = (id,data) =>{
        const po_data = {
            quotation_id: id,
            cont_id:this.state.contractor_id,
            quote_number:this.cont_po.quote_number === undefined?'':this.cont_po.quote_number,
            quote_amount:this.cont_po.quote_amount === undefined?'':this.cont_po.quote_amount,
            po_number:this.cont_po.po_number === undefined?'':this.cont_po.po_number,
            po_amount:this.cont_po.po_amount === undefined?'':this.cont_po.po_amount,
            po_issue_date:this.cont_po.po_issue_date === undefined?'':this.cont_po.po_issue_date,
            work_commence:this.cont_po.work_commence === undefined?'':this.cont_po.work_commence,
            work_complete:this.cont_po.work_complete === undefined?'':this.cont_po.work_complete,
        }
        axiosInstance.post(`/quotation/contractor_po_add`, po_data)
                .then((res) => {
                    //console.log(res);
                    if (res.data.message.success !== undefined) {
                        this.msg.push(res.data.message)
                        console.log(this.cont_invoice)
                        // if(isEmpty(this.cont_invoice)){
                            this.setState({saveshow:!this.state.saveshow})
                        // }
                        this.cont_po = {}
                        if(this.state.continvaddedClicked == false &&
                            this.cont_invoice.invoiceNo !== undefined){
                                this.setState({po_id:res.data.response.contractorpo_id})
                                const Cont_data = {...data,po_id:res.data.response.contractorpo_id}
                                this.AddContInv(Cont_data)
                            }
                    } else {
                        this.msg.push(res.data.message)
                        // if(isEmpty(this.cont_invoice)){
                            this.setState({saveshow:true})
                        // }
                        this.cont_po = {}
                        // Alert("error", "error!", `${res.data.message.error}`,)
                    }
                })
    }
    onSubmit = () => {
        const { categories, parent_id, quotation_num, client_id, quoteAmount, quotationDate, client_po, description, quotationStatus,
            cont_id, PO_number, PO_amount, PO_date, workCommence, workComplete, clientInvoice_list, margin_amount, margin, contInvoice_list, jobComplete, ticket_no, job_status, currency,comments2, quote_amount,
            quote_number,quote_comments} = this.state;
        
        const { invoiceNo, invoiceAmount, issuedDate, receivedDate, receivedAmount, invoiceCredit, creditAmount, creditNote, creditDate} = this.client_invoice
        
        const Invoicedata = {
            cust_type: '1',
            cust_id: client_id,
            num: invoiceNo,
            invoice_amount: invoiceAmount === undefined?'':invoiceAmount,
            invoice_date: issuedDate === undefined?'':issuedDate,
            amount_received_date: receivedDate === undefined?'':receivedDate,
            price: receivedAmount === undefined?'':parseFloat(receivedAmount).toFixed(2),
            credit_note: creditNote === undefined?'':creditNote,
            credit_amount: creditAmount === undefined?'':parseFloat(creditAmount).toFixed(2),
            credit_date: creditDate === undefined ?'':creditDate,
        }

        const Cont_data = {
            cust_type: '2',
            cust_id: this.state.contractor_id,
            po_id:this.state.po_id,
            num: this.cont_invoice.invoiceNo,
            invoice_amount: this.cont_invoice.invoiceAmount === undefined?'':this.cont_invoice.invoiceAmount,
            invoice_date: this.cont_invoice.receivedDate=== undefined?'':this.cont_invoice.receivedDate,
            amount_received_date: this.cont_invoice.paidDate === undefined?'':this.cont_invoice.paidDate,
            tax_invoice:this.cont_invoice.tax === undefined?'':this.cont_invoice.tax,
            price: this.cont_invoice.paidAmount === undefined?'':parseFloat(this.cont_invoice.paidAmount).toFixed(2),
            credit_note: this.cont_invoice.creditNote  === undefined?'':this.cont_invoice.creditNote,
            credit_amount: this.cont_invoice.creditAmount === undefined ?'':parseFloat(this.cont_invoice.creditAmount).toFixed(2),
            credit_date: this.cont_invoice.creditDate  === undefined?'':this.cont_invoice.creditDate,
        }

        
        
        const data = {
            parent_id, categories,
            quotation_num, description, client_id, client_po,
            qut_date_issue: quotationDate,
            quotation_amt: quoteAmount,
            qut_status: quotationStatus,

            cont_id,
            // cont_po_num: PO_number,
            cont_po_amt: PO_amount,
            quote_amount,
            quote_number,
            cont_date: PO_date,
            work_com_date: workCommence,
            work_complete_date: workComplete,
            client_invoice_id: clientInvoice_list,
            cont_invoice_id: contInvoice_list,
            country_id:localStorage.getItem('countryid'),
            job_complete_date: jobComplete,
            ticket_no,
            quote_comments,
            job_status,
            margin_amount,
            margin,
            currency,
        }
        
        ////console.log(data)
        const condition =
            (quotation_num === "") ? this.swalAlert("Quotation No", "quotation_num") :
                (currency === "") ? this.swalAlert("Currency", "currency") :
                    (client_id === "") ? this.swalAlert("Client Name", "client_id") : true

        if (condition === true) {

            axiosInstance.post(`/quotation/add`, data)
                .then((res) => {
                    ////console.log(res);
                    if (res.data.message.success !== undefined) {
                        this.msg.push(res.data.message)
                        this.setState({ quote_id: res.data.response.quotation_id },
                            ()=>{
                                // if(isEmpty(this.client_invoice) && isEmpty(this.cont_invoice) && isEmpty(this.cont_po)){
                                //     // this.setState({saveshow:!this.state.saveshow})
                                // }
                                if(this.state.clientinvaddedClicked == false &&
                                    invoiceNo !== undefined){
                                    this.AddClientInv(Invoicedata,)
                                }
                                if(this.state.POaddClicked == false &&
                                    this.state.contractor_id !== undefined &&
                                    this.cont_po.po_number !== undefined){
                                        // //console.log("addpo")
                                    this.AddcontPo(res.data.response.quotation_id,Cont_data)
                                }
                               
                                Alert("success", "success!", `${res.data.message.success}`,)
                                
                            })
                    
                    } else {
                        Alert("error", "error!", `${res.data.message.error}`,)
                        // this.msg.push(res.data.message)
                    }
                })
                .then(()=>{
                    this.oldState(this.state.quote_id)
                })
                .catch((e) => {
                    ////console.log(e)
                })
        }
    }

    oldState = (id) =>{
        setTimeout(()=>{
            axiosInstance.post(`/quotation/list`)
            .then(res=>{
                // this.setState({rerender:false})
                const quotation_list = res.data.response.quotation_list
                const quote_detail = quotation_list.find(quote => parseInt(quote.id) === parseInt(id))
                console.log(quote_detail)
                const parent_quote = quotation_list.find(quote => parseInt(quote.id) === parseInt(quote_detail.parent_id))
                this.setState({
                    rerender:false,
                    quote_id: id,
                    parent_id: quote_detail.parent_id,
                    parent_QuoteNum: parent_quote !== undefined ? parent_quote.quotation_num : '--parent quote--',
                    categories: quote_detail.categories ==''?'--catogories--':quote_detail.categories,
    
                    quotation_num: quote_detail.quotation_num,
                    description: quote_detail.description,
                    client_id: quote_detail.client_id,
                    client_po: quote_detail.client_po,
                    quotationDate: DateFormat(quote_detail.qut_date_issue),
                    quoteAmount: parseFloat(quote_detail.quotation_amt).toFixed(2),
                    quotationStatus: quote_detail.qut_status,
                    margin:quote_detail.margin,
                    marginAmount:quote_detail.margin_amount,
                    // cont_id: quote_detail.cont_id,
                    // PO_number: quote_detail.cont_po_num,
                    // PO_amount: parseFloat(quote_detail.cont_po_amt).toFixed(2),
                    // PO_date: DateFormat(quote_detail.cont_date),
                    // workCommence: DateFormat(quote_detail.work_com_date),
                    // workComplete: DateFormat(quote_detail.work_complete_date),
                    clientInvoice_list: quote_detail.client_invoice_id,
                    contInvoice_list: quote_detail.cont_invoice_id,
                    job_status:quote_detail.job_status,
                    jobComplete: DateFormat(quote_detail.job_complete_date),
                    ticket_no: quote_detail.ticket_no !== '0' ? quote_detail.ticket_no : '',
                    quote_comments:quote_detail.quote_comments,
                    currency: quote_detail.currency
                }, () => {
                    this.setState({rerender:true})
                    axiosInstance.post(`/client/list`,{country:localStorage.getItem('countryid')})
                        .then(res => {
                            const client_list = res.data.response.client_list
                            const client = client_list.find(client => parseInt(client.id) === parseInt(quote_detail.client_id))
                            this.setState({ client_list, clientName: client.name })
                            //////console.log(client_list);
                        })
                    axiosInstance.post(`/contractor/list`,{country:localStorage.getItem('countryid')})
                        .then(res => {
                            const contractor_list = res.data.response.contractor_list
                            this.setState({ contractor_list})
                            // ////console.log(contractor_list);
                        })
                })
            })
        },2000)
        
    }

    onEdit = (value) => {
        const { quote_id, categories, parent_id, quotation_num, client_id, quoteAmount, quotationDate, client_po, description, quotationStatus,
            cont_id, PO_number, PO_amount, PO_date, workCommence, workComplete, clientInvoice_list, contInvoice_list, jobComplete, job_status, ticket_no, margin_amount, margin, currency,comments2, quote_amount,
            quote_number,quote_comments } = this.state;
            const { invoiceNo, invoiceAmount, issuedDate, receivedDate, receivedAmount, invoiceCredit, creditAmount, creditNote, creditDate,timestamp} = this.client_invoice
        
            const Invoicedata = {
                cust_type: '1',
                cust_id: client_id,
                num: invoiceNo,
                invoice_amount: invoiceAmount === undefined?'':invoiceAmount,
                invoice_date: issuedDate === undefined?'':issuedDate,
                amount_received_date: receivedDate === undefined?'':receivedDate,
                price: receivedAmount === undefined?'':parseFloat(receivedAmount).toFixed(2),
                credit_note: creditNote === undefined?'':creditNote,
                credit_amount: creditAmount === undefined?'':parseFloat(creditAmount).toFixed(2),
                credit_date: creditDate === undefined ?'':creditDate,
            }
    
            const Cont_data = {
                cust_type: '2',
                cust_id: this.state.contractor_id,
                po_id:this.state.po_id,
                num: this.cont_invoice.invoiceNo,
                invoice_amount: this.cont_invoice.invoiceAmount === undefined?'':this.cont_invoice.invoiceAmount,
                invoice_date: this.cont_invoice.receivedDate=== undefined?'':this.cont_invoice.receivedDate,
                amount_received_date: this.cont_invoice.paidDate === undefined?'':this.cont_invoice.paidDate,
                tax_invoice:this.cont_invoice.tax === undefined?'':this.cont_invoice.tax,
                price: this.cont_invoice.paidAmount === undefined?'':parseFloat(this.cont_invoice.paidAmount).toFixed(2),
                credit_note: this.cont_invoice.creditNote  === undefined?'':this.cont_invoice.creditNote,
                credit_amount: this.cont_invoice.creditAmount === undefined ?'':parseFloat(this.cont_invoice.creditAmount).toFixed(2),
                credit_date: this.cont_invoice.creditDate  === undefined?'':this.cont_invoice.creditDate,
            }
        const data = {
            parent_id, categories,

            quotation_num, description, client_id, client_po,
            qut_date_issue: quotationDate,
            quotation_amt: quoteAmount,
            qut_status: quotationStatus,

            cont_id,
            quote_comments,
            comments:comments2,
            cont_po_amt: PO_amount,
            cont_date: PO_date,
            work_com_date: workCommence,
            work_complete_date: workComplete,
            client_invoice_id: clientInvoice_list,
            cont_invoice_id: contInvoice_list,
            country_id:localStorage.getItem('countryid'),
            job_complete_date: jobComplete,
            ticket_no,
            job_status,
            margin_amount,
            quote_amount,
            quote_number,
            margin,
            currency
        }
        ////console.log(data)
        const condition =
            (quotation_num === "") ? this.swalAlert("Quotation No", "quotation_num") :
                (currency === "") ? this.swalAlert("Currency", "currency") :
                    (client_id === "") ? this.swalAlert("Client Name", "client_id") : true

        if (condition === true) {
            axiosInstance.post(`/quotation/edit/` + quote_id, data)
                .then((res) => {
                    ////console.log(res);
                    if(value !== 'invoice'){
                        if (res.data.message.success !== undefined) {
                            if(this.state.clientinvaddedClicked == false &&
                                invoiceNo !== undefined && 
                                invoiceAmount !== undefined){
                                this.AddClientInv(Invoicedata)
                            }
                            if(this.state.POaddClicked == false &&
                                this.state.contractor_id !== undefined &&
                                this.cont_po.po_number !== undefined){
                                    // //console.log("addpo")
                                this.AddcontPo(quote_id,Cont_data)
                            }
                            else if(this.state.continvaddedClicked == false &&
                                this.cont_invoice.invoiceNo !== undefined &&
                                this.cont_invoice.invoiceAmount !== undefined){
                                    this.AddContInv(Cont_data,"edit")
                                }
                            value !== 'invoice' && Alert("success", "success!", `${res.data.message.success}`,)
                        } else {
                            value !== 'invoice' && Alert("error", "error!", `${res.data.message.error}`,)
                        }
                    }
                    
                })
                .then(()=>{
                    this.setState({rerender:false},()=>{
                        this.componentDidMount()
                        this.setState({rerender:true})
                    })
                })
                .catch((e) => {
                    ////console.log(e)
                })
        }
    }
    notification = (quoteid) =>{
        
        setInterval(() => {
           axiosInstance.post(`/quotation/activity/${quoteid}`)
                   .then(res=>this.handleNotificationResponse(res)) 
        },600000);
    }

    handleNotificationResponse = (res) =>{
        const { user } = this.state
        const { id } = user
        ////console.log(id)
        const data = res.data.response.data.current_activity
        const filtered = data.find(single => single.user_id != id)
        if( filtered !== undefined){
            this.setState({showSnak:!this.state.showSnak,snaklist:filtered})
        }
        ////console.log(filtered)
    }

    onComplete = (fun) => {
        const { jobComplete, } = this.state
        const condition = (jobComplete === "" || jobComplete === '0000-00-00') ? this.swalAlert("Job Complete Date", "jobComplete") : true

        if (condition) {
            fun === 'submit'
                ? this.setState({ job_status: '1' }, () => this.onSubmit())
                : this.setState({ job_status: '1' }, () => this.onEdit())
        }
    }
    collectClientInvData = (name,value) => {
        this.client_invoice = {...this.client_invoice,[name]:value}
        if(name == 'credit_amount'){
            this.marginCalc()
        }
        //console.log(this.client_invoice)
    }

    collectConttInvData = (name,value) => {
        this.cont_invoice = {...this.cont_invoice,[name]:value}
        if(name == 'creditAmount'){
            this.marginCalc()
        }
        //console.log(this.cont_invoice)
    }

    collectPOData = (name,value) => {
        this.cont_po = {...this.cont_po,[name]:value}
        // console.log(this.cont_po)
    }
    // onJobcancel = (fun)

    

    onCancel = () => {
        this.setState(this.initialState)                                           // clear input field values
        this.componentDidMount()
        this.componentDidMount()
        this.componentDidMount()
    }

    ClientInvoice = () => {
        const { client_po, client_id } = this.state;
        const condition =
            (client_po === "") ? this.swalAlert("Client PO", "client_po") :
                (client_id === "") ? this.swalAlert("Client Name", "client_id") : true
        if (condition) {
            return
        }
    }
    QuoteChange = (name, value,clicked) => this.setState({ [name]: value,POaddClicked:clicked })
    handleCloseSnack = () => {
        this.setState({showSnak:!this.state.showSnak})
    }
    Edit = (value) =>{
        console.log("Edit Called")
        const { quote_id, categories, parent_id, quotation_num, client_id, quoteAmount, quotationDate, client_po, description, quotationStatus,
            cont_id, PO_number, PO_amount, PO_date, workCommence, workComplete, clientInvoice_list, contInvoice_list, jobComplete, job_status, ticket_no, margin_amount, margin, currency,comments, quote_amount,
            quote_number,quote_comments } = this.state;

        const data = {
            parent_id, categories,

            quotation_num, description, client_id, client_po,
            qut_date_issue: quotationDate,
            quotation_amt: quoteAmount,
            qut_status: quotationStatus,

            cont_id,
            quote_comments,
            // comments:comments2,
            cont_po_amt: PO_amount,
            cont_date: PO_date,
            work_com_date: workCommence,
            work_complete_date: workComplete,
            client_invoice_id: clientInvoice_list,
            cont_invoice_id: contInvoice_list,
            country_id:localStorage.getItem('countryid'),
            job_complete_date: jobComplete,
            ticket_no,
            job_status,
            margin_amount,
            margin,
            currency,
            quote_amount,
            quote_number,
        }
        ////console.log(data)
        const condition =
            (quotation_num === "") ? this.swalAlert("Quotation No", "quotation_num") :
                (currency === "") ? this.swalAlert("Currency", "currency") :
                    (client_id === "") ? this.swalAlert("Client Name", "client_id") : true

        if (condition === true) {
            axiosInstance.post(`/quotation/edit/` + quote_id, data)
                .then((res) => {
                    ////console.log(res);
                    if (res.data.message.success !== undefined) {
                        this.componentDidMount()
                        // value !== 'invoice' && Alert("success", "success!", `${res.data.message.success}`,)
                    } else {
                        value !== 'invoice' && Alert("error", "error!", `${res.data.message.error}`,)
                    }
                })
                .catch((e) => {
                    ////console.log(e)
                })
        }
    }
    render() {
        const { quote_id, clientName, parent_id, categories, quotation_num, quotationDate, client_id, quoteAmount, description, quotationStatus, client_po, margin, margin_amount,
            workCommence, workComplete, contName, cont_id, PO_number, PO_amount, PO_date,
            jobComplete, ticket_no, clientInvoice_list, contInvoice_list,po_id,
            quotation_list, client_list, contractor_list, parent_QuoteNum, contractor_invoice, client_invoice,
            client_amount, cont_amount, currency,user,vertical,horizontal,showSnak,rerender, comments2 ,quote_comments} = this.state;

            

        return (
            <div>
                {rerender?<>
                <div className="component">
                    <Row>
                    <Col lg={1}>
                    {this.props.match.params.id !== undefined ? <Button primary onClick={this.props.Back} >Back</Button>:
                        <Button primary onClick={()=>window.history.back()} >Back</Button>}
                    </Col>
                        {/* <Col lg={2}>
                        {quote_id === undefined ?
                            <h5 style={{ fontSize: "20px",marginTop:6 }}>Add Quotation</h5>:<h5 style={{ fontSize: "20px",marginTop:6 }}>Edit Quotation</h5>
                        }
                        </Col> */}

                        <Col className='d-flex justify-content-end'>
                            <div style={{ margin: '0px 10px' }}>
                                <Autocomplete
                                    id='currency'
                                    options={Curreny.codes()}
                                    onChange={(e, value) => value !== null ? this.setState({ currency: value }) : this.setState({ currency: '' })}
                                    getOptionLabel={(option) => option}
                                    value={currency}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            {quote_id === undefined ? <Form.Control placeholder={currency} value={currency} type="text" {...params.inputProps} style={{ padding: '8px' }} />
                                                : <Form.Control placeholder={currency} type="text" {...params.inputProps} style={{ padding: '8px' }} />}
                                        </div>
                                    )}
                                />
                            </div>
                            <div style={{ margin: '0px 5px' }}>
                                <Autocomplete
                                    options={quotation_list !== undefined && quotation_list.filter(quote => quote.parent_id === '0' && quote.country_id == localStorage.getItem('countryid'))}
                                    onChange={(e, value) => value !== null ? this.setState({ parent_id: value.id, ticket_no: value.ticket_no }) : this.setState({ parent_id: '' })}
                                    getOptionLabel={(option) => option.quotation_num}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            {quote_id === undefined ? <Form.Control placeholder='--parent quote--' type="text" {...params.inputProps} style={{ padding: '8px' }} />
                                                : <Form.Control placeholder={parent_QuoteNum} type="text" {...params.inputProps} style={{ padding: '8px' }} />}
                                        </div>
                                    )}
                                />
                            </div>
                            <div style={{ margin: '0px 10px' }}>
                                <Autocomplete
                                    options={CategoryList}
                                    onChange={(e, value) => value !== null ? this.setState({ categories: value.text }) : this.setState({ categories: '' })}
                                    getOptionLabel={(option) => option.text}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            {quote_id === undefined ? <Form.Control placeholder='--category--' type="text" {...params.inputProps} style={{ padding: '8px' }} />
                                                : <Form.Control placeholder={categories} type="text" {...params.inputProps} style={{ padding: '8px' }} />}
                                        </div>
                                    )}
                                />
                            </div>


                        </Col>
                    </Row><br />
                    {user.quotation_client_sec == 0?'':
                    <Card>
                   <Row>
                       <Col lg={3}>
                      <Form.Label>CLIENT QUOTATION</Form.Label>
                      <hr/>
                       </Col>
                   </Row>
                        <Row>                     
                            <Col lg={3}>
                           
                                <CustomTextBox
                                    txtBoxID='quotation_num'
                                    txtBoxLabel="Quotation No"
                                    txtBoxType="text"
                                    txtBoxName="quotation_num"
                                    txtBoxValue={quotation_num}
                                    txtBoxPH=" Quotation No"
                                    changeEvent={this.onChange}
                                    // disabled={user.quotation_client_sec == '1'?true:false}
                                    disabled={user.quotation_client_sec === "1"?true:false}
                                    // readonly
                                />
                            </Col>
                            <Col lg={3}>
                                <Form.Group >
                                    <Form.Label > Client</Form.Label>
                                    <Autocomplete
                                        id='client_id'
                                        options={client_list}
                                        // disabled={user.quotation_client_sec == '1'?'true':'false'}
                                        disabled={user.quotation_client_sec == '1'?true:false}
                                        onChange={(e, value) => value !== null ? this.setState({ client_id: value.id }) : this.setState({ client_id: '' })}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                {quote_id === undefined ? <Form.Control placeholder='Client Name' type="text" {...params.inputProps} />
                                                    : <Form.Control placeholder={clientName} type="text" {...params.inputProps} />}
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
                                        value={quoteAmount}
                                        placeholder="Amount"
                                        disabled={user.quotation_client_sec == '1'?true:false}
                                        onValueChange={(values) => this.onChangeAmount(values, 'quoteAmount')}
                                        thousandSeparator={true} />
                                </Form.Group>
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='client_po'
                                    txtBoxLabel="Client PO"
                                    txtBoxType="text"
                                    txtBoxName="client_po"
                                    txtBoxValue={client_po}
                                    txtBoxPH=" Client PO"
                                    changeEvent={this.onChange}
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
                                    txtBoxValue={quotationDate}
                                    txtBoxPH="Price Amount"
                                    changeEvent={this.onChange}
                                    disabled={user.quotation_client_sec == '1'?true:false}
                                    
                                />
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxLabel="Description"
                                    txtBoxType="text"
                                    txtBoxName="description"
                                    txtBoxValue={description}
                                    txtBoxPH="description"
                                    changeEvent={this.onChange}
                                    disabled={user.quotation_client_sec == '1'?true:false}
                                    
                                />
                            </Col>


                            <Col lg={3}>
                                <Form.Group >
                                    <Form.Label >Quote Approval</Form.Label>
                                    <Form.Control as="select" name="quotationStatus" value={quotationStatus} onChange={this.onChange} disabled={user.quotation_client_sec == '1'?true:false}>
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
                        <hr/>
                    </Card>}
                    {user.invoice_client_sec == 0?'':
                    <ClientInvoice
                        client_id={client_id}
                        quote_id={quote_id}
                        client_PO={client_po}
                        list={clientInvoice_list}
                        invoiceAdd={this.invoiceAdd}
                        invoiceRemove={this.invoiceRemove}
                        amountChange={this.amountChange}
                        swalAlert={this.swalAlert}
                        callEdit={this.Edit}
                        passData = {this.collectClientInvData}
                        permission = {user.invoice_client_sec == '1'?true:false}
                        marginAmt={margin_amount}
                    />}
                    {/* {user.quotation_cont_sec == 0?'': */}
                    <ContPO
                        quote_id={quote_id}
                        swalAlert={this.swalAlert}
                        list={contInvoice_list}
                        amountChange={this.amountChange}
                        invoiceRemove={this.invoiceRemove}
                        permission = {user.quotation_cont_sec == '1'?true:false}
                        quote_onChange={this.QuoteChange}
                        passData={this.collectPOData}
                        callEdit={this.Edit}
                        getContId={(name,value)=>this.setState({[name]:value})}
                        Viewpermission = {user.quotation_cont_sec == 0?false:true}
                    />
                    {/* } */}
                    {user.invoice_cont_sec == 0?'':
                    <ContractorInvoice
                        quote_id={quote_id}
                        cont_id={cont_id}
                        po_id={po_id}
                        list={contInvoice_list}
                        permission = {user.invoice_cont_sec == '1'?true:false}
                        invoiceAdd={this.ContinvoiceAdd}
                        invoiceRemove={this.invoiceRemove}
                        amountChange={this.amountChange}
                        swalAlert={this.swalAlert}
                        callEdit={this.Edit}
                        marginAmt={margin_amount}
                        passData={this.collectConttInvData}
                    />}

                    <Card style={{ marginTop: '15px', backgroundColor: '#C0BFBF' }}>
                        <Row>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='ticket_no'
                                    txtBoxLabel="CCM Ticket Number"
                                    txtBoxType="text"
                                    txtBoxName="ticket_no"
                                    txtBoxValue={ticket_no}
                                    txtBoxPH="Ticket Number"
                                    changeEvent={this.onChange}
                                />
                            </Col>
                            <Col lg={3}>
                                <CustomTextBox
                                    txtBoxID='jobComplete'
                                    txtBoxLabel="Job Complete"
                                    txtBoxType="date"
                                    txtBoxName="jobComplete"
                                    txtBoxValue={jobComplete}
                                    changeEvent={this.onChange}
                                />
                            </Col>
                            <Col lg={3}>
                            </Col>
                            <Col lg={3}>
                                <Form.Group>
                                <Form.Label>Quotation Status</Form.Label>
                                    <Form.Control as='select' name="job_status" value={this.state.job_status} onChange={this.onChange} >
                                        <option value='' disabled> Status </option>
                                        <option value='2' selected>Pending</option>
                                        <option value='1'>Completed</option>
                                        <option value='3'>Cancelled</option>
                                    </Form.Control>
                                    </Form.Group>
                                </Col>
                        </Row>
                  
                   </Card><Card style={{ marginTop: '15px'}}>
                    <Row>
                        <Col lg='6'>
                        <div class="form-group">
                            <Form.Label >Comments</Form.Label>
                            <textarea  className="form-control" rows="5" id='quote_comments' name='quote_comments' value={quote_comments} onChange={this.onChange}  disabled></textarea>
                        </div>
                        </Col>
                        {/* <Col lg={2} style={{marginTop:55}}>
                        <CustomTextBox
                                    txtBoxID='usrname'
                                    // txtBoxLabel="usrname"
                                    txtBoxType="text"
                                    txtBoxName="usrname"
                                    txtBoxValue={usrname}
                                    changeEvent={this.onChange}
                                    disabled='true'
                                />
                        </Col> */}
                        <Col lg={3}  style={{marginTop:101}}>
                        <CustomTextBox
                                    txtBoxID='comments2'
                                    // txtBoxLabel="usrname"
                                    txtBoxType="text"
                                    txtBoxName="comments2"
                                    txtBoxPH="Comment something..."
                                    txtBoxValue={comments2}
                                    changeEvent={this.onChange}
                                />
                        </Col>
                        <Col lg={1}  style={{marginTop:101}}> 
                        <Button circular icon='arrow right' style={{marginTop:37}} color='blue' onClick={this.AddComment}/>
                         </Col>
                    </Row>
                    {/* <Row>
                        <Col lg={2}>
                        <CustomTextBox
                                    txtBoxID='usrname'
                                    // txtBoxLabel="usrname"
                                    txtBoxType="text"
                                    txtBoxName="usrname"
                                    txtBoxValue={usrname}
                                    changeEvent={this.onChange}
                                    disabled='true'
                                />
                        </Col>
                        <Col lg={4}>
                        <CustomTextBox
                                    txtBoxID='comments'
                                    // txtBoxLabel="usrname"
                                    txtBoxType="text"
                                    txtBoxName="comments"
                                    // txtBoxValue={comments}
                                    changeEvent={this.onChange}
                                />
                        </Col>
                        <Col lg={2}> 
                        <Button circular icon='settings' style={{marginTop:37}}/>
                         </Col>
                    </Row> */}
                    {/* <CustomTextBox
                                    txtBoxID='comments'
                                    txtBoxLabel="Comments"
                                    txtBoxType="text"
                                    txtBoxName="comments"
                                    txtBoxValue={comments}
                                    txtBoxPH="Comments"
                                    changeEvent={this.onChange}
                                /> */}
                                
                    </Card>
                    <Row className='d-flex justify-content-end' style={{ marginTop: '20px' }}>
                        {this.props.match.params.id !== undefined ? <CustomButton btnType="reset" BtnTxt="Back" ClickEvent={()=>window.history.back()} />:
                        <CustomButton btnType="reset" BtnTxt="Back" ClickEvent={()=>window.history.back()} />}
                        {/* {quote_id === undefined
                            ? <CustomButton btnType="reset" BtnTxt="Complete" ClickEvent={() => this.onComplete('submit')} />
                            : <CustomButton btnType="reset" BtnTxt="Complete" ClickEvent={() => this.onComplete('edit')} />} */}
                        {quote_id === undefined
                            ? <CustomButton btnType="reset" BtnTxt="Save" ClickEvent={this.onSubmit} />
                            : <CustomButton btnType="reset" BtnTxt="Save" ClickEvent={this.onEdit} />}
                            {/* <CustomButton btnType="reset" BtnTxt="Cancel" /> */}
                    </Row>
                </div>
                <Snackbar
                    anchorOrigin={{vertical,horizontal}}
                    open={showSnak}
                    onClose={this.handleCloseSnack}
                    message={`${this.state.snaklist.name} working on this Same Quotation`}
                    // key={vertical + horizontal}
                />
                </>:''}
                <SaveAlert
                    show={this.state.saveshow}
                    close={()=>this.setState({saveshow:!this.state.saveshow},()=>this.msg=[])}
                    msg={this.msg}/>
            </div>
           
        )
    }
}

export default EditQuotation
