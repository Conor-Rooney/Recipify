import React from 'react';
import { useRef, useState, setShow } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Router from 'next/router';
import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';

export default function LoginModal (props) {
    const router = useRouter();
    const locale = router.locale;

    const location = useRef(null);
    const user_id = useRef(null);

    const [show, setShow] = useState(false);

    const [cookie, setCookie] = useCookies(["user"]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showLogin, setShowLogin] = useState(false);
    const [showFailed, setShowFailed] = useState(false);

    const [input, setInput] = useState({
      email: '',
      password:'',
    }
    );

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    
    const success = async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;
          const url = 'http://api.weatherapi.com/v1/current.json?key=83757158af5945d6bce141105222403&q=' + lat + ',' + long

          const local = await fetch(url);
          const data = await local.json();
            
          location.current.Settings.Temp = data.current.temp_c;
          location.current.Settings.Weather = data.current.precip_mm;
          location.current.Settings.Time = data.location.localtime.split(' ')[1];
          location.current.Status = true;

          await fetch('/api/updateLocation', {
            method:'POST',
            body: JSON.stringify({user_id: user_id.current, user_location: location.current}),
            headers: {
                'Content-Type': 'application/json'
              }
          })
        } catch (err) {
          location.current.Settings.Weather = false;
          location.current.Settings.Temp = false;
          location.current.Settings.Time = false;
          location.current.Status = false;
          console.log(err);

          const loc  = await fetch('/api/updateLocation', {
            method:'POST',
            body: JSON.stringify({user_id: user_id.current, user_location: location.current}),
            headers: {
                'Content-Type': 'application/json'
              }
          })
        }
    }
    
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    const handleSubmit = async () => {
      const creds = {email: input.email, password: input.password};
      const response  = await fetch('/api/login', {
        method:'POST',
        body: JSON.stringify(creds),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      console.log(response);
      const data = await response.json()
      if (response.status === 200){
        setShowFailed(true);
      }
      else if (response.status === 201){
        setShowFailed(false);
        setShowLogin(true);

        const prefs  = await fetch('/api/prefspull', {
          method:'POST',
          body: JSON.stringify(data.message.id),
          headers: {
              'Content-Type': 'application/json'
            }
        })
      try {
        const preferences = await prefs.json()

        if (preferences.message.location.Status === true) {
          location.current = preferences.message.location;
          user_id.current = preferences.message.id
          navigator.geolocation.getCurrentPosition(success, error, options);
        }
        
        // Below cookies code implemented with the aid of: https://dev.to/lizlaffitte/persisting-data-using-cookies-in-react-apps-45pn and https://medium.com/swlh/how-to-use-cookies-to-persist-state-in-nextjs-934bed5e6da5
        setCookie("user", JSON.stringify(response.status), {
          path: '/',
          maxAge: 3600,
          sameSite: true,
        })
        handleClose();
        Router.push('/home/' + data.message.id, '/home/' + data.message.id, {locale: locale})
       } catch (err) {console.log(err)}
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
        {props.login_button} &rarr;
        </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.login_button}</Modal.Title>
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
            <div>
            <Button type="button" variant="outline-dark" onClick={(e) => {handleClick()}}>
              {props.submit}
            </Button>
            </div>
          </Modal.Footer>
          </Form>
            <Alert show={showLogin} variant="success" onClose={() => setShowLogin(false)} dismissible>
                <Alert.Heading>Logging in, please wait...</Alert.Heading>
            </Alert>

            <Alert show={showFailed} variant="danger" onClose={() => setShowFailed(false)} dismissible>
                <Alert.Heading>"Username and/or password does not match account."</Alert.Heading>
            </Alert>
        </Modal>
      </>
    );
  }