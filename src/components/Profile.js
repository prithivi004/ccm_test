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
import CustomTextBox from './utils/TextBox'
import Logo from '../components/img/logo-light.png'
import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import ProfileForgotpassword from './auth/ProfileForgotPassword'
import axiosInstance from './utils/axiosinstance'
import ListCountries from './administration/landingPage/ListCountries';
import { Alert } from './utils/Utilities';


export class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',
            full_name: '',
            user_name: '',
            country: '',
            email: '',
            department: '',
            address: '',
            mobile: '',
            role: '',
            country_list: [],
            resetPassword: false,
            countrynames:[],
            contact_person:'',
        }
    }
    componentDidMount() {
        axiosInstance.post(`/country/list`)
            .then(res => {
                const country_list = res.data.response.country_list
                // console.log(res.data.session)
                this.setState({ country_list })
                // console.log(country_list);
                const user_details = res.data.session.users
                // console.log(user_details)
                const newcountry = user_details.country.split(',')
                const selected = newcountry.map(id => country_list.find(count => count.id == id))
                let array = []
                if(user_details.role == '2'){
                selected.map(country => array.push(country.name))
                }
                this.setState({
                    id: user_details.id,
                    full_name: user_details.fname,
                    user_name: user_details.name,
                    country: user_details.country,
                    email: user_details.email,
                    address: user_details.address,
                    mobile: user_details.phone,
                    role: user_details.role,
                    countrynames:array,
                    contact_person:user_details.contact_person
                })
            })
        
        // console.log(user_details)
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onEdit = (e) => {
        e.preventDefault();
        const { id,full_name, user_name, country, email,address,mobile, user_type, position, contact_person } = this.state;
        const data = {id,fname: full_name, email, address, phone:mobile,department:"test",contact_person:"test"}
        axiosInstance.post(`/profile/edit/${id}`,data)
        .then(res=>{
            // console.log(res.data)
            Alert("success","Success",`${res.data.message.success}`)
            this.componentDidMount()
        })
    }
    setPassword = () => {
        this.setState({ resetPassword: !this.state.resetPassword })
    }

    render() {
        const { full_name, user_name, country,countrynames, email, department, password, address, mobile, resetPassword, id, country_list, role } = this.state;
        return (
            <div>
                {resetPassword ? <ProfileForgotpassword Back={this.setPassword} id={id} /> :
                    <div className="component">

                        <Row  >
                            <Col lg={3} style={{ marginTop: '100px' }}>
                                <Image src={Logo} className="profile-img" ></Image>
                            </Col>

                            <Col lg={4} >
                                <CustomTextBox
                                    txtBoxLabel="User name"
                                    txtBoxType="text"
                                    txtBoxName="user_name"
                                    txtBoxValue={user_name}
                                    txtBoxPH="User Name"
                                    changeEvent={this.onChange}
                                    disabled='true'
                                />
                                <CustomTextBox
                                    txtBoxLabel="Full name"
                                    txtBoxType="text"
                                    txtBoxName="full_name"
                                    txtBoxValue={full_name}
                                    txtBoxPH="Full Name"
                                    changeEvent={this.onChange}
                                />
                                 <CustomTextBox
                                    txtBoxLabel="Address"
                                    txtBoxType="text"
                                    txtBoxName="address"
                                    txtBoxValue={address}
                                    txtBoxID="address"
                                    txtBoxPH="Address"
                                    changeEvent={this.onChange}
                                />
                                {/* <Form.Group >
                                    <Form.Label >Country</Form.Label>
                                    <Form.Control as="select" className="select-style" name="country" value={country} onChange={this.onChange} required>
                                        <option value='0' selected disabled> Country</option>
                                        {country_list.map((country) => {
                                            return <option key={country.id} value={country.id}>{country.name}</option>
                                        })}
                                    </Form.Control>
                                </Form.Group> */}
                            </Col>

                            {/* 2cond col */}

                            <Col lg={4} >
                                {/* <Form.Group >
                                    <Form.Label >Department</Form.Label>
                                    <Form.Control as="select" name="department" value={department} onChange={this.onChange} required>
                                        <option value="" selected disabled> Select</option>
                                        <option value="Admin">department 2</option>
                                        <option value="User">department 3</option>
                                        <option value="Admin">department 4</option>
                                        <option value="User">department 5</option>
                                    </Form.Control>
                                </Form.Group> */}
                                {/* <CustomTextBox
                                    txtBoxLabel=" Password"
                                    txtBoxType="password"
                                    txtBoxName="password"
                                    txtBoxValue={password}
                                    txtBoxID="password"
                                    txtBoxPH="********"
                                    changeEvent={this.onChange}
                                /> */}
                                <CustomTextBox
                                    txtBoxLabel="Email"
                                    txtBoxType="text"
                                    txtBoxName="email"
                                    txtBoxValue={email}
                                    txtBoxPH="Email"
                                    changeEvent={this.onChange}
                                />
                                <CustomTextBox
                                    txtBoxLabel="Phone Number"
                                    txtBoxType="text"
                                    txtBoxName="mobile"
                                    txtBoxValue={mobile}
                                    txtBoxID="mobile"
                                    txtBoxPH="mobile"
                                    changeEvent={this.onChange}
                                />
                               
                            </Col>
                        </Row><br />
                        {/* {role === '2' &&
                        <Row>
                            <Col lg={3} style={{ marginTop: '100px' }}>
                                <div className='ui center aligned container'><div className='ui huge label'>Permissions</div></div>
                            </Col>

                            <Col lg={4} md={12} sm={12}>

                                <Card >

                                    <table className="table table-borderless table-condensed table-hover">
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
                                                <td> <Form.Check type="checkbox" /></td>
                                                <td> <Form.Check type="checkbox" /></td>

                                            </tr>
                                            <tr>
                                                <td scope="row"><label className='h6'>Quotation Contractor Section</label></td>
                                                <td> <Form.Check type="checkbox" /></td>
                                                <td> <Form.Check type="checkbox" /></td>

                                            </tr>
                                            <tr>
                                                <td scope="row"><label className='h6'>Invoice Client Section</label></td>
                                                <td> <Form.Check type="checkbox" /></td>
                                                <td> <Form.Check type="checkbox" /></td>

                                            </tr>
                                            <tr>
                                                <td scope="row"><label className='h6'>Invoice Contractor Section</label></td>
                                                <td> <Form.Check type="checkbox" /></td>
                                                <td> <Form.Check type="checkbox" /></td>

                                            </tr>
                                        </tbody>
                                    </table>
                                </Card><br /></Col>

                            <Col lg={4} >

                                <Card >

                                    <Form.Label >Administration</Form.Label><br />
                                    <div>
                                        <div className='ui checkbox'><input type="checkbox" /><Form.Label >View User</Form.Label></div> <nbsp />
                                        <div className='ui checkbox mx-sm-5'><input type="checkbox" /><Form.Label >Manage User</Form.Label></div>
                                    </div>

                                </Card> <br />

                                <Card >
                                    <Form.Label >Other Privileges</Form.Label><br />
                                    <div>
                                        <div className='ui checkbox'><input type="checkbox" />
                                            <Form.Label >View Dashboard</Form.Label></div></div>
                                </Card>

                            </Col>
                        </Row>} */}
                        <Row>
                            <Col lg={3} >
                                <div className='ui center aligned container'><div className='ui huge label'>Country</div></div>
                            </Col>

                            <Col lg={8} >

                                <Card>
                                    {localStorage.getItem('role')== 'admin'?
                                     <div className='ui six cards mx-sm-2' >
                                     {country_list.map(country =>
                                     <ListCountries country={country.name} profile="test"/>)}
                                 </div>:
                                    <div className='ui six cards mx-sm-2' >
                                        {countrynames.map(country =>
                                        <ListCountries country={country} profile="test"/>)}
                                    </div>}

                                </Card></Col>
                        </Row>
                        <Row className='d-flex justify-content-md-center' style={{ marginTop: "2%" }}>
                            
                                <Button onClick={this.onEdit} >Save</Button>
                                <Button onClick={this.setPassword} >Reset Password</Button>
                            
                        </Row>

                    </div>}

            </div>
        )
    }
}

export default Profile
