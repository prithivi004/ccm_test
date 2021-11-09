import React from 'react'
import { Modal,ListGroup,Button } from 'react-bootstrap'
function SaveAlert({show,close,msg}) {
    return (
        <div>
            <Modal show={show} onHide={close} centered>
                <Modal.Body>
                   
                        <ListGroup variant="flush">
                        {msg !== undefined && 
                            msg.map(message =>
                            <ListGroup.Item style={{display:'flex'}}>
                                {message.success == undefined ?
                                    <>
                                        <i className="fa fa-times" style={{fontSize:'18px',color:'red',marginTop:'15px'}}>
                                        </i>
                                        <h5 style={{marginLeft:'20px'}}>{message.error}</h5>
                                    </>:
                                    <>
                                    <i className="fa fa-check" style={{fontSize:'18px',color:'green'}}></i>
                                    <h5 style={{marginLeft:'20px'}}>{message.success}</h5>
                                    </>
                                    }</ListGroup.Item>)}
                        </ListGroup>
                </Modal.Body>
                
                <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SaveAlert
