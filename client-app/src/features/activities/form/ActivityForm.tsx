﻿import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {

    const activityStore = useContext(ActivityStore);
    const { createActivity, editActivity, submitting, activity: initialFormState, loadActivity, clearActivity } = activityStore;

    const [activity, setActivity] = useState<IActivity>({ id: '', title: '', category: '', description: '', date: '', city: '', venue: '' });

    useEffect(() => {
        if (match.params.id && match.params.id.length === 0) {
            loadActivity(match.params.id).then(() => { initialFormState && setActivity(initialFormState); });
        }

        return () => {
            clearActivity();
        }
    }, [loadActivity, match.params.id, clearActivity, initialFormState, activity.id.length]);

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,//spread the activity that we have in our states
                id: uuid()//import for a universal unique identifier uuid
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        }
        else {
            editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    //Handle input changes as we type into the fields
    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //console.log(event.target.value);
        //const { name, value } = event.target;
        const { name, value } = event.currentTarget;
        /* FROM VIRTUAL DOM TO HTML DOM. Set activities properties using setActivity, we want to change the activity property 
         * for the input that's being updated, we can set this activity and split the props of 
         * the activity object so we can specify the name of the property that's being updated*/
        //setActivity({ ...activity, title: event.target.value });
        //setActivity({ ...activity, [event.target.name]: event.target.value });
        setActivity({ ...activity, [name]: value });
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title} />
                <Form.TextArea onChange={handleInputChange} name='description' rows={2} placeholder='Description' value={activity.description} />
                <Form.Input onChange={handleInputChange} name='category' placeholder='Category' value={activity.category} />
                <Form.Input onChange={handleInputChange} name='date' type='datetime-local' placeholder='Date' value={activity.date} />
                <Form.Input onChange={handleInputChange} name='city' placeholder='City' value={activity.city} />
                <Form.Input onChange={handleInputChange} name='venue' placeholder='Venue' value={activity.venue} />
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => history.push('/activities')} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    );
}

export default observer(ActivityForm);