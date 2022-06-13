import React from 'react';
import { useState, setShow } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Router from 'next/router';
import Alert from 'react-bootstrap/Alert';

export default function DeleteModal (props) {

    const id = props.id;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleDelete = async () => {
      setShowDelete(true);
        const response  = await fetch('/api/delete', {
            method:'POST',
            body: JSON.stringify(id),
            headers: {
                'Content-Type': 'application/json'
            }
          })
        
        handleClose();
        Router.push("/");
    }

    return (
        <>
        <Button variant="danger" onClick={handleShow}>
        Delete Account
        </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Account</Modal.Title>
          </Modal.Header>
          <Form>
          <Modal.Body>
            
            <p>Are you sure you wish to delete your account?</p>
            
            </Modal.Body>
          <Modal.Footer>
            {/* Buttons handles input submit and close modal*/}
            <Button type="button" variant="outline-warning" onClick={(e) => {handleClose()}}>
              No go back
            </Button>
            <Button type="button" variant="outline-success" onClick={(e) => {handleDelete()}}>
              Yes I'm sure
            </Button>
          </Modal.Footer>
          </Form>
          <Alert show={showDelete} variant="danger" onClose={() => setShowDelete(false)} dismissible>
                <Alert.Heading>"Deleting account, please wait..."</Alert.Heading>
          </Alert>
        </Modal>
      </>
    );
  }