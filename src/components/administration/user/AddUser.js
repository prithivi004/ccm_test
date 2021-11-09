import React, { Component } from 'react'
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Image
} from 'react-bootstrap';
import CustomTextBox from '../../utils/TextBox'
import CustomButton from '../../utils/Button'
import Logo from '../../img/logo-light.png'
import axiosInstance from '../../utils/axiosinstance'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Select from '@material-ui/core/Select';

import ReactCountryFlag from "react-country-flag"
import ReactFlagsSelect from 'react-flags-select';
import { Us } from 'react-flags-select';
import Forgotpassword from '../../auth/Forgotpassword';
import { Alert } from '../../utils/Utilities'
import ListCountries from '../landingPage/ListCountries'
import { indexOf } from 'ramda';

var token = localStorage.getItem('access_token')
const validEmailRegex = RegExp(/^[a-z0-9]{1,15}\.?[a-z0-9]{1,15}?@[a-z]{4,20}\.[a-z]{2,5}(\.[a-z]{2,})?$/);

// form error validation
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
}

class AddUser extends Component {
    constructor(props) {
        super(props)

        this.initialState = {
            user_id: this.props.id,
            full_name: "",
            user_name: "",
            country: 0,
            email: "",
            address: "",
            phone: "",
            country_list: [],
            role: "1",
            setPassword: false,
            invoice_client_sec_view:false,
            invoice_cont_sec_view:false,
            quotation_client_sec_view:false,
            quotation_cont_sec_view:false,
            invoice_client_sec_edit:false,
            invoice_cont_sec_edit:false,
            quotation_client_sec_edit:false,
            quotation_cont_sec_edit:false,
            view_cont:false,
            view_client:false,
            view_dashboard:false,
            selectedcountries:[],
            selectedcountrynames:[],
            selected:[],
            copiedcountry_list:[],
            errors: {
                email: '',
            }

        }
        this.state = this.initialState
    }
    componentDidMount() {
        console.log(this.state.user_id, "this.state.user_id")
        axiosInstance.post(`/country/list`)
            .then((res) => {
                const country_list = res.data.response.country_list
                this.setState({ country_list,copiedcountry_list:country_list })
            })
            .then(()=>{

        if (this.state.user_id !== null) {
            axiosInstance.post(`/user/get_user_details`, { id: this.state.user_id })
                .then(res => {
                    // console.log(res.data.response.user_details)
                    const user_details = res.data.response.user_details
                    if( user_details.role != '1'){
                    this.calcountryName(user_details)
                    }
                    this.setState({
                        user_name: user_details.name,
                        full_name: user_details.fname,
                        address: user_details.address,
                        country: user_details.country,
                        phone: user_details.phone,
                        email: user_details.email,
                        department: user_details.department,
                        role: user_details.role,
                        contact_person: user_details.contact_person,
                        invoice_cont_sec_view:user_details.invoice_cont_sec == '1'?true:false,
                        invoice_cont_sec_edit:user_details.invoice_cont_sec == '2'?true:false,
                        invoice_client_sec_view:user_details.invoice_client_sec == '1'?true:false,
                        invoice_client_sec_edit:user_details.invoice_client_sec == '2'?true:false,
                        quotation_cont_sec_view:user_details.quotation_cont_sec == '1'?true:false,
                        quotation_cont_sec_edit:user_details.quotation_cont_sec == '2'?true:false,
                        quotation_client_sec_view:user_details.quotation_client_sec == '1'?true:false,
                        quotation_client_sec_edit:user_details.quotation_client_sec == '2'?true:false,
                        view_dashboard:user_details.view_dash == '1'?true:false,
                        view_client:user_details.view_client == '1'?true:false,
                        view_cont:user_details.view_cont == '1'?true:false,
                    })
                })
        }
    })

    }

    calcountryName = (details) =>{
        const { country_list } = this.state
        const newcountry = details.country.split(',')
        const selected = newcountry.map(id => country_list.find(count => count.id == id))
        // console.log(selected)
        let arr =[]
        const unselected = country_list.map(count =>{
            const found = newcountry.find(id => count.id == id)
            if ( found === undefined)
                arr.push(count)
        })
        this.setState({copiedcountry_list:arr})

        // const unselected = newcountry.map(id => country_list.filter(count => count.id != id))
        // console.log(unselected,"unsel")
        let array = []
        selected.map(country => array.push(country.name))
        // console.log(array,newcountry,"res")
        this.setState({selectedcountrynames:array,selectedcountries:newcountry})
    }
    onChange = (e) => {
        const { name, value } = e.target;
        let errors = this.state.errors;

        switch (name) {
            case 'email':
                errors.email = validEmailRegex.test(value) ? '' : 'Email is not valid!';
                break;
            default:
                break;
        }

        this.setState({ errors, [name]: value })
    }
    onChangeCheckbox = e =>{
        this.setState({[e.target.name]:e.target.checked},()=>console.log(this.state))

    }

    onSubmit = (e) => {
        const { 
            user_name, 
            full_name,
            // country, 
            email, 
            address, 
            department, 
            contact_person, 
            phone, 
            role, 
            errors,
            quotation_client_sec_edit,
            quotation_client_sec_view,
            quotation_cont_sec_edit,
            quotation_cont_sec_view,
            invoice_client_sec_edit,
            invoice_client_sec_view,
            invoice_cont_sec_edit,
            invoice_cont_sec_view,
            view_dashboard,selectedcountries } = this.state;

        const quotation_client_sec = role == '1'? 2 : quotation_client_sec_edit ? 2 : quotation_client_sec_view ? 1:0
        const quotation_cont_sec = role == '1'? 2 : quotation_cont_sec_edit ? 2 : quotation_cont_sec_view ? 1:0
        const invoice_cont_sec = role == '1'? 2 : invoice_cont_sec_edit ? 2 : invoice_cont_sec_view ? 1:0
        const invoice_client_sec = role == '1'? 2 : invoice_client_sec_edit ? 2 : invoice_client_sec_view ? 1:0
        const view_dash = role == '1' ? 1 : view_dashboard ? 1 : 0
        const view_client = role == '1' ? 1 : this.state.view_client ? 1 : 0 
        const view_cont = role == '1' ? 1 : this.state.view_cont ? 1 : 0
        const country = role == '1' ? ["2"] : selectedcountries
        const data = { name: user_name, fname: full_name, email, address, phone, role, status: 1, quotation_client_sec,quotation_cont_sec,invoice_cont_sec,invoice_client_sec,view_dash,view_cont,view_client,country}
    //    console.log(data)
        if (validateForm(errors)) {
            axiosInstance.post(`/user/add`, data)
                .then((res) => {
                    // console.log(res);
                    if (res.data.message.success !== undefined) {
                        swal("success!", `${res.data.message.success}`, "success").then(() => this.onCancel())
                    } else {
                        swal("error!", `${res.data.message.error}`, "error")
                    }
                    this.props.Back()
                })
                .catch((e) => {
                    // console.log(e)
                })
        } else {
            Alert('error', 'error', 'Invalid Form')
        }

    }
    onUpdate = (e) => {
        const { user_id, user_name, full_name, email, address, phone, role,
            quotation_client_sec_edit,
            quotation_client_sec_view,
            quotation_cont_sec_edit,
            quotation_cont_sec_view,
            invoice_client_sec_edit,
            invoice_client_sec_view,
            invoice_cont_sec_edit,
            invoice_cont_sec_view,view_dashboard,selectedcountries } = this.state;
            // console.log(selectedcountries,"selected")
        
        const country = role == '1' ? ["2"] : selectedcountries
        const quotation_client_sec = role == '1'? 2 : quotation_client_sec_edit ? 2 : quotation_client_sec_view ? 1:0
        const quotation_cont_sec = role == '1'? 2 : quotation_cont_sec_edit ? 2 : quotation_cont_sec_view ? 1:0
        const invoice_cont_sec = role == '1'? 2 : invoice_cont_sec_edit ? 2 : invoice_cont_sec_view ? 1:0
        const invoice_client_sec = role == '1'? 2 : invoice_client_sec_edit ? 2 : invoice_client_sec_view ? 1:0
        const view_dash = role == '1' ? 1 : view_dashboard ? 1 : 0
        const view_client = role == '1' ? 1 : this.state.view_client ? 1 : 0 
        const view_cont = role == '1' ? 1 : this.state.view_cont ? 1 : 0 
        const data = { name: user_name, fname: full_name, email, country, address, phone, role, status: 1, quotation_client_sec,quotation_cont_sec,invoice_cont_sec,invoice_client_sec,view_dash,view_cont,view_client,country}
        // console.log(data, user_id)

        axiosInstance.post(`/user/edit/` + user_id, data)
            .then((res) => {
                // console.log(res);
                if (res.data.message.success !== undefined) {
                    swal("success!", `${res.data.message.success}`, "success").then(() => this.onCancel())
                } else {
                    swal("error!", `${res.data.message.error}`, "error")
                }
                this.props.Back()
            })
            .catch((e) => {
                // console.log(e)
            })
    }

    onCancel = () => {
        this.setState(this.initialState)
    }
    setPassword = () => {
        this.setState({ setPassword: !this.state.setPassword })
    }

    handleChangeMultiple = (e) => {
        const { selectedcountries,selectedcountrynames } = this.state
        this.setState({
            selectedcountries:[...selectedcountries,e.target.value],
            selectedcountrynames:[...selectedcountrynames,e.target.selectedOptions[0].text]
        },()=>{
            const countries = this.state.copiedcountry_list.filter(country => country.id != e.target.value)
            this.setState({copiedcountry_list:countries})
            // console.log(this.state.selectedcountries,this.state.selectedcountrynames,"countries")
        })
      };
    removeCountry = (country) =>{
       const {selectedcountrynames,country_list,selectedcountries,copiedcountry_list} = this.state
       let arr = [...selectedcountrynames]
       for( let i = 0; i < arr.length; i++){ 
                                   
        if ( arr[i] === country) { 
            arr.splice(i, 1); 
            i--; 
        }
    }
        this.setState({selectedcountrynames:arr})
        // console.log(arr)
    
       const sel_cont = country_list.find(count => count.name == country)

       this.setState({copiedcountry_list:[...copiedcountry_list,sel_cont]})
    
       let newarr = [...selectedcountries]

       for( let i = 0; i < newarr.length; i++){ 
                                   
        if ( newarr[i] === sel_cont.id) { 
            newarr.splice(i, 1); 
            i--; 
        }
    }
    this.setState({selectedcountries:newarr})
    // console.log(newarr)
    //    console.log(selectedcountries.splice(i,1),"removedid")
    //    //    console.log(i)
    //    this.setState({selectedcountries:selectedcountries.splice(i,1)})
      
    }
    render() {
        const { full_name, user_name,selectedcountries, country, email, address, phone, country_list, role, setPassword, errors,selectedcountrynames } = this.state;
        return (
            <div>
                <p style={{ fontSize: "20px" }}>User Profile</p>
                {setPassword ? <Forgotpassword Back={this.setPassword} id={this.props.id} /> :
                    <div className="component">
                        <Card style={{ marginTop: "20px" }}>
                            <Row style={{ marginTop: "20px" }}>
                                <Col lg={2}>
                                    <Image src={Logo} className="profile-img" style={{ marginTop: '100px' }} ></Image>
                                </Col>
                                <Col lg={3}>
                                    <CustomTextBox
                                        style="label-style"
                                        txtBoxLabel="User name"
                                        txtBoxType="text"
                                        txtBoxName="user_name"
                                        txtBoxValue={user_name}
                                        txtBoxID="user_name"
                                        txtBoxPH="User Name"
                                        changeEvent={this.onChange}
                                    />
                                    <CustomTextBox
                                        style="label-style"
                                        txtBoxLabel="Full name"
                                        txtBoxType="text"
                                        txtBoxName="full_name"
                                        txtBoxValue={full_name}
                                        txtBoxID="full_name"
                                        txtBoxPH="Full Name"
                                        changeEvent={this.onChange}
                                    />
                                    <Form.Group as={Col}>
                                        <Form.Label >Role</Form.Label>
                                        <Col>
                                            <Form.Control as="select" className="select-style" name="role" value={role} onChange={this.onChange} required>
                                                <option value="" disabled> Role</option>
                                                <option value="1">Admin</option>
                                                <option value="2">User</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                </Col>
                                <Col lg={3}>
                                    <CustomTextBox
                                        style="label-style"
                                        txtBoxLabel="Email"
                                        txtBoxType="text"
                                        txtBoxName="email"
                                        txtBoxValue={email}
                                        txtBoxID="email"
                                        txtBoxPH="Email"
                                        changeEvent={this.onChange}
                                    />
                                    {errors.email.length > 0 && (
                                        <span className="error">{errors.email}</span>
                                    )}
                                    <CustomTextBox
                                        style="label-style"
                                        txtBoxLabel="Address"
                                        txtBoxType="text"
                                        txtBoxName="address"
                                        txtBoxValue={address}
                                        txtBoxID="address"
                                        txtBoxPH="Address"
                                        changeEvent={this.onChange}
                                    />

                                </Col>
                                <Col lg={3}>
                                    {/* <Form.Group as={Col}>
                                        <Form.Label >Department</Form.Label>
                                        <Col>
                                            <Form.Control as="select" className="select-style" name="department" value={department} onChange={this.onChange} required>
                                                <option value="" disabled> Select Department</option>
                                                <option value="department 1">department 1</option>
                                                <option value="department 2">department 2</option>
                                                <option value="department 3">department 3 </option>
                                                <option value="department 4">department 4</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group> */}
                                    <CustomTextBox
                                        style="label-style"
                                        txtBoxLabel="Phone Number"
                                        txtBoxType="text"
                                        txtBoxName="phone"
                                        txtBoxValue={phone}
                                        txtBoxID="phone"
                                        txtBoxPH="Phone Number"
                                        changeEvent={this.onChange}
                                    />
                                    {/* <Form.Group as={Col}>
                                        <Col>
                                            <Form.Label >Country</Form.Label>
                                            <Form.Control as="select" className="select-style" name="country" value={country} onChange={this.onChange} required>
                                                <option value='0' selected disabled> Country</option>
                                                {country_list.map((country) => {
                                                    return <option key={country.id} id={country.name} value={country.id}>{country.name}</option>
                                                })}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group> */}
                                </Col>
                            </Row>
                            {role !== "1" ?
                                <div>
                                    <Row style={{ marginTop: "20px" }} >
                                        <Col lg={2} style={{ marginTop: "80px" }}>
                                            <div className='ui center aligned container'><div className='ui huge label'>Permissions</div></div>
                                        </Col>

                                        <Col lg={5} md={12} sm={12}>

                                            <Card style={{ backgroundColor: 'white' }}>
                                                <table className="table table-borderless table-condensed table-hover" >
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Quotations/Invoice Management</th>
                                                            <th scope="col">View</th>
                                                            <th scope="col">Edit</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td scope="row"> <label className='h6'>Quotation Client Section</label></td>
                                                            <td> <Form.Check type="checkbox" name="quotation_client_sec_view" onChange={this.onChangeCheckbox} checked={this.state.quotation_client_sec_view}/></td>
                                                            <td> <Form.Check type="checkbox" name="quotation_client_sec_edit" onChange={this.onChangeCheckbox} checked={this.state.quotation_client_sec_edit}/></td>

                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><label className='h6'>Quotation Contractor Section</label></td>
                                                            <td> <Form.Check type="checkbox" name="quotation_cont_sec_view" onChange={this.onChangeCheckbox} checked={this.state.quotation_cont_sec_view}/></td>
                                                            <td> <Form.Check type="checkbox" name="quotation_cont_sec_edit" onChange={this.onChangeCheckbox} checked={this.state.quotation_cont_sec_edit}/></td>

                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><label className='h6'>Invoice Client Section</label></td>
                                                            <td> <Form.Check type="checkbox" name="invoice_client_sec_view" onChange={this.onChangeCheckbox} checked={this.state.invoice_client_sec_view}/></td>
                                                            <td> <Form.Check type="checkbox" name="invoice_client_sec_edit" onChange={this.onChangeCheckbox} checked={this.state.invoice_client_sec_edit}/></td>

                                                        </tr>
                                                        <tr>
                                                            <td scope="row"><label className='h6'>Invoice Contractor Section</label></td>
                                                            <td> <Form.Check type="checkbox" name="invoice_cont_sec_view" onChange={this.onChangeCheckbox} checked={this.state.invoice_cont_sec_view}/></td>
                                                            <td> <Form.Check type="checkbox" name="invoice_cont_sec_edit" onChange={this.onChangeCheckbox} checked={this.state.invoice_cont_sec_edit}/></td>

                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Card><br /></Col>

                                        <Col lg={4} >

                                            <Card style={{ backgroundColor: 'white' }} >
                                                <Form.Label >Administration</Form.Label><br />
                                                <div>
                                                    <div className='ui checkbox'><input type="checkbox" onChange={this.onChangeCheckbox} name="view_cont" checked={this.state.view_cont}/><Form.Label >View Contrators</Form.Label></div> <nbsp />
                                                    <div className='ui checkbox '><input type="checkbox" onChange={this.onChangeCheckbox} name="view_client" checked={this.state.view_client}/><Form.Label >View Clients</Form.Label></div>
                                                </div>

                                            </Card> <br />

                                            <Card style={{ backgroundColor: 'white' }}>
                                                <Form.Label >Other Privileges</Form.Label><br />
                                                <div>
                                                    <div className='ui checkbox'><input type="checkbox" name="view_dashboard" onChange={this.onChangeCheckbox} checked={this.state.view_dashboard}/>
                                                        <Form.Label >View Dashboard</Form.Label></div></div>
                                            </Card>

                                        </Col>
                                    </Row><br />

                                    <Row style={{ marginTop: "20px" }}>
                                        <Col lg={2}>
                                            <div className='ui center aligned container'><div className='ui huge label'>Country</div></div>
                                        </Col>

                                        <Col lg={3}>
                                            <Form.Control as="select" className="select-style" name="selected_country"  onChange={this.handleChangeMultiple} style={{ padding: "10px" }} required>
                                                <option value='0' selected > Country</option>
                                                {this.state.copiedcountry_list.map((country) => {
                                                    return <option key={country.id} value={country.id}>{country.name}</option>
                                                })}
                                            </Form.Control>
                                             {/* <Select
                                            multiple
                                            native
                                            value={selectedcountries}
                                            style={{width:"150px",backgroundColor:"white"}}
                                            onChange={this.handleChangeMultiple}
                                            inputProps={{
                                                id: 'select-multiple-native',
                                            }}
                                            >
                                                {country_list.map((country) => {
                                                    return <option id={country.id} key={country.id} value={country.id}>{country.name}</option>
                                                })}
                                            </Select> */}
                                        </Col>
                                        <Col lg={6}>
                                        <div className='ui six cards mx-sm-2' style={{backgroundColor:'white'}}>
                                            {selectedcountrynames.length >0 && selectedcountrynames.map(countryname => 
                                                    // <div style={{display:"flex"}}>
                                                    <ListCountries country={countryname} remove={this.removeCountry}/>
                                                    // </div>
                                            )}
                                        </div>
                                        </Col>
                                    </Row>
                                </div> : ''}

                            <Row className="row justify-content-md-center" style={{ marginTop: "3%" }}>
                                <CustomButton btnType="reset" BtnTxt="Back" ClickEvent={this.props.Back} />
                                {this.props.id === null ?
                                    <CustomButton btnType="reset" BtnTxt="Save" ClickEvent={this.onSubmit} /> :
                                    <CustomButton btnType="reset" BtnTxt="Save" ClickEvent={this.onUpdate} />}
                                <CustomButton btnType="reset" BtnTxt="Cancel" ClickEvent={this.onCancel} />
                                {this.props.id !== null && <CustomButton btnType="reset" BtnTxt="Reset Password" ClickEvent={this.setPassword} />}

                            </Row>

                        </Card>
                    </div>}
            </div>
        )
    }
}

export default AddUser;
