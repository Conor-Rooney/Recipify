import React from 'react';
import { useState, useEffect} from 'react';
import styles from '../styles/Home.module.css';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

export default function Recipe(props){

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    const [recipe, setRecipe] = useState(null);
    const [showLike, setShowLike] = useState(false);
    const [showTried, setShowTried] = useState(false);
    const [showDislike, setShowDislike] = useState(false);


    const user_id = props.user_id;
    const id = 1;
    
    useEffect(() => {
    const get_Recipe = async () => {
        const response  = await fetch('/api/recipe', {
            method:'POST',
            body: JSON.stringify(props.rec_id),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        console.log(data.message.image);
        if (data.message.image === "") {
          data.message.image = '../altimg.JPG';
        }
        console.log(data.message.image);
        setRecipe(data)
    }
    get_Recipe();
    }
    , [id]);
    const ingredients = [];
    const steps = [];
    if (recipe !== null) {
      for (const [key, value] of Object.entries(recipe.message.ingredients)) {
        ingredients.push(value)
      }
      for (const [key, value] of Object.entries(recipe.message.steps)) {
        steps.push(value)
      }
    
    const handleLike = async (user_id, idnum, title) => {
      const liked = {usr_id: user_id, rec_id: idnum, liked: title};
      const update = {usr_id: user_id, change: "+", notes: recipe.message.tags.Notes}

      const like = await fetch('/api/likes', {
        method:'POST',
        body: JSON.stringify(liked),
        headers: {
            'Content-Type': 'application/json'
        }
      });

      const response  = await fetch('/api/prefspull', {
        method:'POST',
        body: JSON.stringify(user_id),
        headers: {
            'Content-Type': 'application/json'
        }
      });
      const prefs = await response.json()

      if (idnum in prefs.message.dislikes) {
        delete prefs.message.dislikes[idnum];

        const query = await fetch('/api/prefspush', {
          method:'POST',
          body: JSON.stringify(prefs.message),
          headers: {
              'Content-Type': 'application/json'
          }
        })

        update.change = "++";
      }

      const data = await like.json();
      
      if (data === 200) {
        const updateRanking = await fetch('/api/updateRanking', {
          method:'POST',
          body: JSON.stringify(update),
          headers: {
              'Content-Type': 'application/json'
          }
        });
      }
      setShowDislike(false);
      setShowTried(false);
      setShowLike(true);
      const tried = {usr_id: user_id, rec_id: idnum, tried: title};
      const query = await fetch('/api/tried', {
        method:'POST',
        body: JSON.stringify(tried),
        headers: {
            'Content-Type': 'application/json'
        }
      });
    }

    const handleTried = async (user_id, idnum, title) => {
      const tried = {usr_id: user_id, rec_id: idnum, tried: title};
      const query = await fetch('/api/tried', {
        method:'POST',
        body: JSON.stringify(tried),
        headers: {
            'Content-Type': 'application/json'
        }
      });
      setShowLike(false);
      setShowDislike(false);
      setShowTried(true);
    }

    const handleDislike = async (user_id, idnum, title) => {
      const disliked = {usr_id: user_id, rec_id: idnum, disliked: title};
      const update = {usr_id: user_id, change: "-", notes: recipe.message.tags.Notes}

      const dislike = await fetch('/api/dislikes', {
        method:'POST',
        body: JSON.stringify(disliked),
        headers: {
            'Content-Type': 'application/json'
        }
      });

      const data = await dislike.json();

      const response  = await fetch('/api/prefspull', {
        method:'POST',
        body: JSON.stringify(user_id),
        headers: {
            'Content-Type': 'application/json'
        }
      });
      const prefs = await response.json()

      if (idnum in prefs.message.likes) {
        delete prefs.message.likes[idnum];

        const query = await fetch('/api/prefspush', {
          method:'POST',
          body: JSON.stringify(prefs.message),
          headers: {
              'Content-Type': 'application/json'
          }
        })
        
        update.change = "--";
      }
      
      if (data === 200) {
        const updateRanking = await fetch('/api/updateRanking', {
          method:'POST',
          body: JSON.stringify(update),
          headers: {
              'Content-Type': 'application/json'
          }
        });
      }
      setShowLike(false);
      setShowTried(false);
      setShowDislike(true);
      const tried = {usr_id: user_id, rec_id: idnum, tried: title};
      const query = await fetch('/api/tried', {
        method:'POST',
        body: JSON.stringify(tried),
        headers: {
            'Content-Type': 'application/json'
        }
      });
    }
    
    if (recipe === null) {
      return(
        <div class="d-flex justify-content-center">
          <div class="spinner-border text-light" role="status">
          </div>
        </div>
      )
    }
    else {
    return(
    <Card className={styles.recboxes}>
                    <Card.Img variant="top" src={recipe.message.image} alt="Apologies, there is no image for this recipe." className={styles.recimg}/>
                    <Card.Body>
                    
                    <Card.Title>{recipe.message.title}</Card.Title>
                    <>
        <Button styles={styles.customButton}size='lg' variant="outline-dark" onClick={handleShow}>
        Open &rarr;
        </Button>
  
        <Modal
          dialogClassName={styles.recipemodal}
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{recipe.message.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Container>
              <Row>
                <Col>
                <Image src={recipe.message.image} alt="Apologies, there is no image for this recipe."/>
                </Col>
                <Col>Ingredients:
                <ul>
                {ingredients.map((ingredient)=> 
                <li>{ingredient}</li>
                )}
                </ul>
                </Col>
              </Row>
            </Container>
            <hr></hr>
            
            Steps:
            <ol>
            {steps.map((step)=> 
            <li>{step}</li>
            )}
            </ol>
            <hr></hr>
            Tags: {recipe.message.tags.Notes.map((tag) =>
              tag + ', ') }
            <br/>
            Allergies: {recipe.message.tags.Allergies.map((allergy) =>
              allergy + ', ') }
            

            <br/>
            <br/>

            <div className={styles.buttons}>
            <Button size='lg' variant="outline-info" onClick={() => handleLike(user_id, recipe.message.id, recipe.message.title)}>
            Like
            </Button>

            <Button className={styles.recipeFootSpace} size='lg' variant="outline-success" onClick={() => handleTried(user_id, recipe.message.id, recipe.message.title)}>
            Tried
            </Button>

            <Button size='lg' variant="outline-danger" onClick={() => handleDislike(user_id, recipe.message.id, recipe.message.title)}>
            Dislike
            </Button>
            </div>

            <br></br>
            <Alert show={showLike} variant="success" onClose={() => setShowLike(false)} dismissible>
              <Alert.Heading>Recipe liked</Alert.Heading>
            </Alert>

            <Alert show={showTried} variant="info" onClose={() => setShowTried(false)} dismissible>
              <Alert.Heading>Recipe tried</Alert.Heading>
            </Alert>

            <Alert show={showDislike} variant="danger" onClose={() => setShowDislike(false)} dismissible>
                <Alert.Heading>Recipe disliked</Alert.Heading>
            </Alert>
              
           </Modal.Body>
        </Modal>
      </>
                    </Card.Body>
                </Card>
    )
}} else {
  return(
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-light" role="status">
      </div>
    </div>
  )
}
}