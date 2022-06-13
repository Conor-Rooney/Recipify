import React from 'react';
import { useState, useEffect} from 'react';
import styles from '../styles/Home.module.css';
import Form from 'react-bootstrap/Form';

export default function PreferenceSwitch (props) {

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const item = props.item;
    const user_id = props.id;
    const switchChange = () => {
        setIsSwitchOn(!isSwitchOn);
        get_allergy(item);
    };

    const get_allergy = async (item) => {
        const response  = await fetch('/api/allergies/'+{user_id}, {
            method:'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        //console.log('frontend')
        const data = await response.json()
    }

    return(
        <Form>
            <Form.Check
                switched = {isSwitchOn}
                onChange={switchChange} 
                type="switch"
                id={item}
                label={item}
            />
        </Form>
    )
}