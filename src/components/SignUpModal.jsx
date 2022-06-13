import React from 'react';
import { useState, setShow, render } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from '../styles/Home.module.css';
import Router from 'next/router';
import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';


export default function SignUpModal (props) {
    const router = useRouter();
    const locale = router.locale;
    const [show, setShow] = useState(false);

    const [cookie, setCookie] = useCookies(["user"]);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showSignup, setShowSignup] = useState(false);
    const [showFailed, setShowFailed] = useState(false);

    const [input, setInput] = useState({
      email: '',
      password:'',
    }
    );

    const handleSubmit = async () => {
      //console.log(input.email);
      const creds = {email: input.email, password: input.password};
      const response  = await fetch('/api/signup', {
        method:'POST',
        body: JSON.stringify(creds),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      if (response.status === 203){
        setShowFailed(true);
      }
      else if (response.status === 202){
        setShowFailed(false);
        setShowSignup(true);
        const data = await response.json();

        // Below cookies code implemeneted with the aid of: https://dev.to/lizlaffitte/persisting-data-using-cookies-in-react-apps-45pn and https://medium.com/swlh/how-to-use-cookies-to-persist-state-in-nextjs-934bed5e6da5
        setCookie("user", JSON.stringify(response.status), {
          path: '/',
          maxAge: 3600,
          sameSite: true,
        })
        
        await fetch('/api/prefsetup', {
          method:'POST',
          body: JSON.stringify(data.message.id),
          headers: {
              'Content-Type': 'application/json'
          }
        })

        handleClose();
        Router.push('/account/' + data.message.id, '/account/' + data.message.id, {locale: locale})

      }
    }
    
    function handleClick () {
      handleSubmit();
    }
      

    const styles = {
      customButton: {
          paddingRight: '0.8rem'
      }
  };
  
    return (
      <>
        <Button styles={styles.customButton}size='lg' variant="outline-light" onClick={handleShow}>
        {props.signup_button} &rarr;
        </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.signup_button}</Modal.Title>
          </Modal.Header>
          <Form>
          <Modal.Body>
            
            <Form.Group>
                <Form.Label>{props.username_label}</Form.Label>
                <Form.Control 
                              required type="email" placeholder={props.user_prompt}
                              onChange={e => setInput({...input, email : e.target.value})}
                />
                <Form.Text className="text-muted">
                {props.details}
                </Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Label>{props.password_label}</Form.Label>
                <Form.Control 
                            type="password" placeholder={props.password_prompt}
                            onChange={e => setInput({...input, password : e.target.value})}
                />
            </Form.Group>
            </Modal.Body>
          <Modal.Footer>
            <div >
            <Button type="button" variant="outline-dark" onClick={(e) => {handleClick()}}>
            {props.submit}
            </Button>
            </div>
          </Modal.Footer>
          </Form>
            <Alert show={showSignup} variant="success" onClose={() => setShowSignup(false)} dismissible>
                <Alert.Heading>Signing up, please wait...</Alert.Heading>
            </Alert>

            <Alert show={showFailed} variant="danger" onClose={() => setShowFailed(false)} dismissible>
                <Alert.Heading>"Username is already in use."</Alert.Heading>
            </Alert>
        </Modal>
      </>
    );
  }