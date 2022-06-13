 import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import React from 'react';
import { useState, useEffect} from 'react';
import styles from '../styles/Home.module.css';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useTranslation } from 'next-i18next';
import DeleteModal from './DeleteModal';

export default function PreferenceForm(props){
    const id = props.id;
    const { t } = useTranslation('preference');

    const allergies = t('Allergies');
    const preferences = t('Preferences');
    const diets = t('Diets');
    const liked = t('Liked');
    const tried = t('Tried');
    const disliked = t('Disliked');
    const location = t('Location');
    const delete_button = t('Delete');
    const save= t('Save');
    const saved = t('Saved');


    const [prefs, setPrefs] = useState(null);
    const [removedLikes, setLikes] = useState([]);
    const [removedDislikes, setDislikes] = useState([]);
    const [count, setCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);



    function handleAllergy (name) {
        prefs.message.allergies[name] = !prefs.message.allergies[name];
    }

    function handleDiet (name) {
        prefs.message.diet[name] = !prefs.message.diet[name];
    }

    function handleName (name) {
        return (t(name));
    }

    useEffect(() => {
        const get_prefs = async () => { 
            
            const response  = await fetch('/api/prefspull', {
                method:'POST',
                body: JSON.stringify(id),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            try {
            const data = await response.json()
            if (response.status === 200){setPrefs(data)}
            } catch (error) {
                console.error(error);
            }
        }
        get_prefs();
        }
        , [id]);
    if (prefs === null) {
        return(
            <div class="d-flex justify-content-center">
              <div class="spinner-border text-light" role="status">
              </div>
            </div>
          )
    } else if (prefs !== null) {
        const new_likes = prefs.message.likes;
        const new_tried = prefs.message.tried;
        const new_dislikes = prefs.message.dislikes;
        const new_location = prefs.message.location;

        function handleLikes (rec_id, name) {
            if (rec_id in new_likes) {
                delete new_likes[rec_id];
                removedLikes.push(rec_id);
            } else {
                new_likes[rec_id] = name;
                const index = removedLikes.indexOf(rec_id);
                removedLikes.splice(index, 1);
            }
        }

        function handleTried (rec_id, name) {
            if (rec_id in new_tried) {
                delete new_tried[rec_id];
            } else {
                new_tried[rec_id] = name;
            }
        }
    
        function handleDislikes (rec_id, name) {
            if (rec_id in new_dislikes) {
                delete new_dislikes[rec_id];
                removedDislikes.push(rec_id);
            } else {
                new_dislikes[rec_id] = name;
                const index = removedDislikes.indexOf(rec_id);
                removedDislikes.splice(index, 1);
            }
        }

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

                const response = await fetch(url);
                const data = await response.json();
                
                new_location.Settings.Temp = data.current.temp_c;
                new_location.Settings.Weather = data.current.precip_mm;
                new_location.Settings.Time = data.location.localtime.split(' ')[1];
                new_location.Status = true;
            } catch (err) {
                new_location.Settings.Weather = false;
                new_location.Settings.Temp = false;
                new_location.Settings.Time = false;
                new_location.Status = false;
                console.log(err);
            }
        }
          
        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        function handleLocation() {
            if (new_location.Status === false) {
                navigator.geolocation.getCurrentPosition(success, error, options);
            } else if (new_location.Status === true) {
                new_location.Settings.Weather = false;
                new_location.Settings.Temp = false;
                new_location.Settings.Time = false;
                new_location.Status = false;
            }
        }

        const savePreferences= async () => {
            prefs.message.likes = new_likes;
            prefs.message.tried = new_tried;
            prefs.message.dislikes = new_dislikes;
            prefs.message.location = new_location;

            for (const removedLike in removedLikes) {
                const response = await fetch('/api/recipe', {
                    method:'POST',
                    body: JSON.stringify(parseInt(removedLikes[removedLike])),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const recipe = await response.json()

                await fetch('/api/updateRanking', {
                    method:'POST',
                    body: JSON.stringify({usr_id: id, change: "-", notes: recipe.message.tags.Notes}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            for (const removedDislike in removedDislikes) {
                const response = await fetch('/api/recipe', {
                    method:'POST',
                    body: JSON.stringify(parseInt(removedDislikes[removedDislike])),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const recipe = await response.json()

                const updateRanking = await fetch('/api/updateRanking', {
                    method:'POST',
                    body: JSON.stringify({usr_id: id, change: "+", notes: recipe.message.tags.Notes}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            const query = await fetch('/api/prefspush', {
                method:'POST',
                body: JSON.stringify(prefs.message),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setShowAlert(true);
        }

        const deleteAccount = async () => {
            
        }

    return(
        <Container className={styles.prefboxes}>
        <br></br>
            <h1 className={styles.prefTitle}>{preferences}:</h1>
            <Row>
            <Col>
            <Accordion fluid>
            <br></br>
            <Accordion.Item eventKey="0">
            <Accordion.Header>{allergies}</Accordion.Header>
            <Accordion.Body>
            <Form>
            <Container>
            <Row>
            {Object.entries(prefs.message.allergies).sort().map(([name, status]) => (
                <Col sm={3}>
                <Form.Check
                inline
                defaultChecked={status}
                onChange={() => handleAllergy(name)}
                type="switch"
                id={name}
                label={handleName(name)}
                />
                </Col>
                
                
            ))}
            </Row>
            </Container>
            </Form>
            </Accordion.Body>
            </Accordion.Item>
            <br></br>

            <Accordion.Item eventKey="1">
            <Accordion.Header>{diets}</Accordion.Header>
            <Accordion.Body>
            <Form>
            <Container>
            <Row>
            {Object.entries(prefs.message.diet).sort().map(([name, status]) => (
                <Col sm={3}>
                <Form.Check
                inline
                defaultChecked={status}
                onChange={() => handleDiet(name)}
                type="switch"
                id={name}
                label={handleName(name)}
                />
                </Col>
                
                
            ))}
            </Row>
            </Container>
            </Form>
            </Accordion.Body>
            </Accordion.Item>
            <br></br>

            <Accordion.Item eventKey="2">
            <Accordion.Header>{liked}</Accordion.Header>
            <Accordion.Body>
            <Form>
            <Container>
            <Row>
            {Object.entries(prefs.message.likes).sort().map(([rec_id, name]) => (
                <Col sm={4}>
                <Form.Check
                inline
                onChange={() => handleLikes(rec_id, name)}
                type="switch"
                id={name}
                label={name}
                />
                </Col>
                
                
            ))}
            </Row>
            </Container>
            </Form>
            </Accordion.Body>
            </Accordion.Item>
            <br></br>

            <Accordion.Item eventKey="3">
            <Accordion.Header>{tried}</Accordion.Header>
            <Accordion.Body>
            <Form>
            <Container>
            <Row>
            {Object.entries(prefs.message.tried).sort().map(([rec_id, name]) => (
                <Col sm={4}>
                <Form.Check
                inline
                onChange={() => handleTried(rec_id, name)}
                type="switch"
                id={name}
                label={name}
                />
                </Col>
                
                
            ))}
            </Row>
            </Container>
            </Form>
            </Accordion.Body>
            </Accordion.Item>
            <br></br>

            <Accordion.Item eventKey="4">
            <Accordion.Header>{disliked}</Accordion.Header>
            <Accordion.Body>
            <Form>
            <Container>
            <Row>
            {Object.entries(prefs.message.dislikes).sort().map(([rec_id, name]) => (
                <Col sm={4}>
                <Form.Check
                inline
                onChange={() => handleDislikes(rec_id, name)}
                type="switch"
                id={name}
                label={name}
                />
                </Col>
                
                
            ))}
            </Row>
            </Container>
            </Form>
            </Accordion.Body>
            </Accordion.Item>
            <br></br>

            </Accordion>
            </Col>
            </Row>

            <div className={styles.locationStyle}>
            <Form.Check
                inline
                defaultChecked={new_location.Status}
                onChange={() => handleLocation()}
                type="switch"
                id="Enable Location Services"
                label={location}
                />
            </div>
            <br></br>

            <div className={styles.buttons}>
            <DeleteModal id = { id }></DeleteModal>
            <div className={styles.preferencesSubmit}></div>
            
            
            <Button
                onClick={() => savePreferences()}
                variant="light" 
                block>
                {save}
             </Button>
             </div>
             <br></br>
             <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>{saved}</Alert.Heading>
                </Alert>
        </Container>
    )} else {return(null)}
}