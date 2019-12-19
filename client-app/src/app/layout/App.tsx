import React, { useState, useEffect, Fragment } from 'react';
import {  Container } from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

//Using React Hooks instead component class
const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivy] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);

    const handleSelectActivity = (id: string) => {
        setSelectedActivy(activities.filter(a => a.id === id)[0]);
        setEditMode(false);
    }

    const handleOpenCreateForm = () => {
        setSelectedActivy(null);
        setEditMode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
        setActivities([...activities, activity]);//activities array using spread operator to take existing activities and spread them across into a new array, add our new activity onto this array
        setSelectedActivy(activity);
        setEditMode(false);
    }

    const handleEditActivity = (activity: IActivity) => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);//Update a specific activity spread and filter out the activity being updated. This will contain a new array of all activities that do not match the id of the activity that were passing, after the comma we're passing out the newly updated activity
        setSelectedActivy(activity);
        setEditMode(false);
    }

    const handleDeleteActivity = (id: string) => {
        setActivities([...activities.filter(a => a.id !== id)]);
    }

    useEffect(() => {
        axios.get<IActivity[]>('http://localhost:5000/api/activities/')
            .then((response) => {
                let activities: IActivity[] = [];
                response.data.forEach(activity => { activity.date = activity.date.split('.')[0]; activities.push(activity); });
                //setActivities(response.data)
                setActivities(activities);
            });
    }, []);//second parameter empty array, ensure that useEffect runs once every time the component renders and the useEffect method is called

    return (
        <Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard
                    activities={activities}
                    selectActivity={handleSelectActivity}
                    selectedActivity={selectedActivity!}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setSelectedActivy={setSelectedActivy}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDeleteActivity}
                />
            </Container>
        </Fragment>
    );
}
export default App;
