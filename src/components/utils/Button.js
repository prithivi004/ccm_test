import React from 'react';
import {
    Button
} from 'react-bootstrap';

//customized button
const CustomButton = (props) =>{
    return (
        <Button disabled={props.disabledButton} type = {props.btnType} className="col btnBlue" onClick={props.ClickEvent} style={{backgroundColor : props.bgColor }}  >{props.BtnTxt}</Button>  
    )
}

export default CustomButton;