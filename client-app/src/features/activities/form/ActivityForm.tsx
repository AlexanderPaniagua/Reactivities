﻿import React, { useState, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface IProps {
    setEditMode: (editMode: boolean) => void;
    selectedActivity: IActivity;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    submitting: boolean;
}

const ActivityForm: React.FC<IProps> = ({ setEditMode, selectedActivity, createActivity, editActivity, submitting }) => {

    const initializeForm = () => {
        if (selectedActivity) {
            return selectedActivity;
        }
        else {
            return { id: '', title: '', category: '', description: '', date: '', city: '', venue: '' };
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,//spread the activity that we have in our states
                id: uuid()//import for a universal unique identifier uuid
            };
            createActivity(newActivity);
        }
        else {
            editActivity(activity);
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
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    );
}

export default ActivityForm;