import React from 'react'
import styles from '../styles/Home.module.css'
import { useRef, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Recipe from '/components/Recipe';
import { allergyFilter } from '../filters/allergies.js'
import { dietFilter } from '../filters/diets.js'
import { triedFilter } from '../filters/tried.js'
import { rankingFilter } from '../filters/ranking.js'
import { locationFilter } from '../filters/location.js'

export default function RecipeGrid(props){
    const prefs = useRef(null);
    const allRecipes = useRef(null);
    //const newRecipes = useRef(null);
    const size = useRef(null);
    const [newRecipes, setNewRecipes] = useState(null);
    const user_id = props.user_id;

    //api call for preferences here
    useEffect(() => {get_recs();}, [user_id]);

        const get_recs = async () => { 
            const recipes = await fetch('/api/getRecipes', {method:'POST'});
            const recs = await recipes.json();
            allRecipes.current = recs.message;
            get_prefs();
        }

        const get_prefs = async () => { 
            const response  = await fetch('/api/prefspull', {
                method:'POST',
                body: JSON.stringify(user_id),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            try {
            const data = await response.json()
            if (response.status === 200) {
                prefs.current = data.message;

                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                const ranks = Object.keys(prefs.current.ranking).sort().reverse();
                ranks.sort(function(a, b) {
                    return a - b;
                });

                let filtered = allergyFilter(allRecipes.current, prefs.current.allergies);

                filtered = dietFilter(filtered, prefs.current.diet);

                filtered = triedFilter(filtered, prefs.current.tried);

                if (prefs.current.location.Status === true) {
                    filtered = locationFilter(filtered, prefs.current.location.Settings);
    
                }

                filtered = rankingFilter(filtered, prefs.current.ranking, ranks.reverse());

                setNewRecipes(filtered);
            }
            } catch (error) {
                console.error(error);
            }
        }
    if (newRecipes === null) {
        return (
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-light" role="status">
                </div>
            </div>
        )
    }
    else {
        if (newRecipes.length !== 0 && newRecipes.length !== 1 && newRecipes.length !== 2) {
            return (
                <Container className={styles.navspacing}>
                    <Row xs={1} md={3}>
                        {newRecipes.map((rec_id, index) => (
                            <Col>
                                <Recipe user_id = { user_id }  rec_id = {newRecipes[index]}></Recipe>
                            </Col>
                        ))}
                    </Row>
                </Container>
            )
        } else if (newRecipes.length === 2) {
            return (
                <Container className={styles.navspacing}>
                    <Row xs={1} md={2}>
                        {newRecipes.map((rec_id, index) => (
                            <Col>
                                <Recipe user_id = { user_id } rec_id = {newRecipes[index]}></Recipe>
                            </Col>
                        ))}
                    </Row>
                </Container>
            )
        } else if (newRecipes.length === 1) {
            return (
                <Container className={styles.navspacing}>
                    <Row xs={1} md={1}>
                        {newRecipes.map((rec_id, index) => (
                            <Col>
                                <Recipe user_id = { user_id }  rec_id = {newRecipes[index]}></Recipe>
                            </Col>
                        ))}
                    </Row>
                </Container>
            )
        } else {
            return (null)
        }
    }
}
        