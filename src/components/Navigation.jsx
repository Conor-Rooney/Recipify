import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import styles from '../styles/Navigation.module.css';
import { useRouter } from 'next/router';
import Router from 'next/router';

export default function Navigation (props){
  const router = useRouter()
  const { id } = router.query
  const locale = props.locale

  function home(){
    Router.push('/home/' + id, '/home/' + id, {locale: locale})
  } 

  function account(){
    Router.push('/account/' + id, '/account/' + id, {locale: locale})
  } 

  function help(){
    Router.push('/help/' + id, '/help/' + id, {locale: locale})
  } 

  return(
  <>
    <Container fluid className={styles.navigation}>
    <Navbar expand="sm" bg="none" variant="dark" className={styles.navigation}>
      <Navbar.Brand onClick={() => home()}>
              <img 
                  src="../NavBarLogo.png"
                  className={styles.navimg}
                  alt="Recipify Logo"
              />
      </Navbar.Brand>
      <Nav className='ms-auto'>
        <Nav.Link onClick={() => home()} className={styles.link}>{props.recommendations}</Nav.Link>
        <Nav.Link onClick={() => account()} className={styles.link}>{props.account}</Nav.Link>
        <Nav.Link onClick={() => help()} className={styles.link}>{props.help}</Nav.Link>
      </Nav>
    </Navbar>
    </Container>
    </>
  )
}