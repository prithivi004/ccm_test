import React, { Component } from 'react'
import {
    Form, Row, Col
} from 'react-bootstrap';

export class TextBox extends Component {   
    render() {
        return (

            <Form.Group >
                <Form.Label  >{this.props.txtBoxLabel}</Form.Label>
                <Form.Control
                    type={this.props.txtBoxType}
                    id={this.props.txtBoxID}
                    placeholder={this.props.txtBoxPH}
                    value={this.props.txtBoxValue}
                    onChange={this.props.changeEvent}
                    name={this.props.txtBoxName}
                    disabled={this.props.disabled}
                    className={this.props.style}
                    ref={this.props.ref}
                    // {this.props.disabled=='true'?readonly:''}
                    disabled={this.props.disabled}
                    required
                />
            </Form.Group>
        )
    }
}

export default TextBox
