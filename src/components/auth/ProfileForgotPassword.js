import React, { Component } from 'react'
import { Card, Form, Row, Col, Button, Image } from 'react-bootstrap'
import Logo from '../img/logo-light.png'
import axios from 'axios'
import CustomTextBox from '../utils/TextBox'
import { Alert } from '../utils/Utilities'
import axiosInstance from '../utils/axiosinstance'

export class ProfileForgotpassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Password: '',
            ConfirmPassword: '',
            oldPassword:'',
        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = () => {
        const { Password, ConfirmPassword,oldPassword } = this.state

        if (Object.values(this.state).every(x => x)) {
            if (Password !== ConfirmPassword) {
                Alert("error", "Oops", "Password Mismatched!")
                return
            }
            const data = { old_password:oldPassword, password: Password, confirm_password: ConfirmPassword }
            axiosInstance.post(`/profile/reset_password`,data)
                .then((res) => {

                    if(res.data.message.error === undefined){
                        Alert("success", "Success", "Password Reset Successful")
                        this.props.Back()
                    }
                    else{
                        Alert("error","Warning",`${res.data.message.error}`)
                    }
                    // console.log(res.data)

                })
        }
        else {
            Alert("error", "Oops", "Please Fillout All Fields!")
        }
    }

    render() {
        const { Password, ConfirmPassword,oldPassword } = this.state
        return (
            <div>
                <div className="component">
                    <Card border="dark" sm={6} >
                        <Row>
                            <Col sm={4}>
                                <Image src={Logo} rounded style={{ width: "100px", marginLeft: "30%", marginTop: "20%" }} />
                            </Col>
                            <Col sm={4} style={{ marginTop: '50px' }}>
                                <CustomTextBox
                                    txtBoxLabel="Old Password"
                                    txtBoxType="password"
                                    txtBoxName="oldPassword"
                                    txtBoxValue={oldPassword}
                                    txtBoxPH="Old Password"
                                    changeEvent={this.onChange}
                                />
                                <CustomTextBox
                                    txtBoxLabel="Password"
                                    txtBoxType="password"
                                    txtBoxName="Password"
                                    txtBoxValue={Password}
                                    txtBoxPH="Password"
                                    changeEvent={this.onChange}
                                />
                                <CustomTextBox
                                    txtBoxLabel="Confirm Password"
                                    txtBoxType="password"
                                    txtBoxName="ConfirmPassword"
                                    txtBoxValue={ConfirmPassword}
                                    txtBoxPH="ConfirmPassword"
                                    changeEvent={this.onChange}
                                />
                            </Col>
                        </Row>
                        <Row className='d-flex justify-content-center' style={{ marginTop: "10%" }}>
                            <Button onClick={this.props.Back}>Back</Button>
                            <Button onClick={this.onSubmit}>Reset</Button>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

export default ProfileForgotpassword

