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
import Logo from '../../img/logo-light.png';
import axiosinstance from '../../utils/axiosinstance'
import CustomButton from '../../utils/Button'
import { pathOr, equals, head, filter, } from 'ramda';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Alert } from '../../utils/Utilities'

var token = localStorage.getItem('access_token')
const validEmailRegex = RegExp(/^[a-z0-9]{1,15}\.?[a-z0-9]{1,15}?@[a-z]{4,20}\.[a-z]{2,5}(\.[a-z]{2,})?$/);

// form error validation
const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
}

export default class AddClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client_id: this.props.id,
            name: '',
            address: '',
            country: 0,
            phone: '',
            email: '',
            contact_person: '',
            country_list: [],
            errors: {
                email: '',
            }
        }
    }
    componentDidMount() {
        const { client_id } = this.state;
        // console.log(this.props.id)
        axiosinstance.post(`/country/list`)
            .then((res) => {
                const country_list = res.data.response.country_list
                this.setState({ country_list })
            })

        if (client_id !== null) {
            axiosinstance.post(`/client/get_client_details`, { id: client_id })
                .then(res => {
                    // console.log(res, "client details")
                    const client_details = res.data.response.client_details
                    this.setState({
                        name: client_details.name,
                        address: client_details.address,
                        country: client_details.country,
                        phone: client_details.phone,
                        email: client_details.email,
                        contact_person: client_details.contact_person,
                    })
                })
        }
    }

    onChange = e => {
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
    onSubmit = (e) => {

        const { name, address, phone, email, contact_person, country, errors } = this.state
        const data = {
            name,
            address,
            phone,
            email,
            country,
            contact_person,
        }
        // console.log(data)
        // if (validateForm(errors)) {
            // if (name === null || address === '' || phone === '' || email === '' || country === '' || contact_person === '') {
            //     Swal.fire({
            //         icon: 'error',
            //         title: 'Oops...',
            //         text: 'Please Fillout all the Fields!',
            //     })
            // } else {
                axiosinstance.post(`/client/add`, data)
                    .then((res) => {
                        // console.log(res);
                        if (res.data.message.success !== undefined) {
                            swal("success!", `${res.data.message.success}`, "success").then(() => this.onCancel())
                        } else {
                            swal("error!", `${res.data.message.error}`, "error")
                        }
                    })
                    .catch((e) => {
                        // console.log(e)
                    })
            // }
        // } else {
        //     Alert('error', 'error', 'Invalid Form')
        // }
    }
    onUpdate = (e) => {
        const { name, address, phone, email, contact_person, country, client_id } = this.state
        const data = {
            name,
            address,
            phone,
            email,
            country,
            contact_person,
        }
        // if (name === null || address === '' || phone === '' || email === '' || country === '' || contact_person === '') {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Oops...',
        //         text: 'Please Fillout all the Fields!',
        //     })
        // } else {
            axiosinstance.post(`/client/edit/` + client_id, data)
                .then((res) => {
                    // console.log(res);
                    if (res.data.message.success !== undefined) {
                        swal("success!", `${res.data.message.success}`, "success").then(() => this.props.Back())
                    } else {
                        swal("error!", `${res.data.message.error}`, "error")
                    }
                })
                .catch((e) => {
                    // console.log(e)
                })
        // }
    }

    onCancel = () => {
        this.setState({
            client_id: this.props.id,
            name: '',
            address: '',
            country: 0,
            phone: '',
            email: '',
            contact_person: '',
            country_list: [],
        })
        this.componentDidMount();
    }
    render() {
        const { client_id, name, address, phone, email, contact_person, country, country_list, errors } = this.state
        return (
            <div>

                <div className="component">
                    <h5>ADD/EDIT CLIENT PROFILE</h5>
                    <Card style={{ marginTop: "3%" }}>
                        <Form>
                            <Row>
                                <Col lg={3}>
                                    <Image src={Logo} style={{ marginLeft: "30%", marginTop: "80px" }}></Image>
                                </Col>
                                <Col lg={4}>
                                    <Form.Group >
                                        <Form.Label >Client Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="name"
                                            placeholder="Full Name"
                                            name="name"
                                            value={name}
                                            onChange={this.onChange}
                                            style={{ padding: "10px" }}
                                        />
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label >Email</Form.Label>
                                        <Form.Control type="text" id="email"
                                            placeholder="Email"
                                            name="email"
                                            value={email}
                                            onChange={this.onChange}
                                            style={{ padding: "10px" }}
                                        />
                                    </Form.Group>
                                    {errors.email.length > 0 && (
                                        <span className="error">{errors.email}</span>
                                    )}
                                    <Form.Group >
                                        <Form.Label >CWR Country</Form.Label>
                                        <Form.Control as="select" name="country" value={country} onChange={this.onChange} required>
                                            <option value='0' selected disabled> Country</option>
                                            {country_list.map((country) => {
                                                return <option key={country.id} value={country.id}>{country.name}</option>
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col lg={4}>
                                    <Form.Group >
                                        <Form.Label >Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="address"
                                            placeholder="Address"
                                            name="address"
                                            value={address}
                                            onChange={this.onChange}
                                            style={{ padding: "10px" }}
                                        />
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label >Phone Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Phone Number"
                                            name="phone"
                                            value={phone}
                                            onChange={this.onChange}
                                        />
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label >Contact Person</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Full Name"
                                            name="contact_person"
                                            value={contact_person}
                                            onChange={this.onChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="row justify-content-md-center" style={{ marginTop: "10%" }}>
                                <CustomButton btnType="reset" BtnTxt="Back" ClickEvent={this.props.Back} />
                                <CustomButton btnType="reset" BtnTxt="Add" disabledButton={client_id !== null} ClickEvent={this.onSubmit} />
                                <CustomButton btnType="reset" BtnTxt="Update" disabledButton={client_id === null} ClickEvent={this.onUpdate} />
                                <CustomButton btnType="reset" BtnTxt="Cancel" ClickEvent={this.onCancel} />
                            </Row>
                        </Form>
                    </Card>
                </div>

            </div>
        )
    }
}
