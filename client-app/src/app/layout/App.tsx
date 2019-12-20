import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import {  Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

//Using React Hooks instead component class
const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivy] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState('');

    const handleSelectActivity = (id: string) => {
        setSelectedActivy(activities.filter(a => a.id === id)[0]);
        setEditMode(false);
    }

    const handleOpenCreateForm = () => {
        setSelectedActivy(null);
        setEditMode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity]);//activities array using spread operator to take existing activities and spread them across into a new array, add our new activity onto this array
            setSelectedActivy(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
    }

    const handleEditActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.Activities.update(activity).then(() => {
            setActivities([...activities.filter(a => a.id !== activity.id), activity]);//Update a specific activity spread and filter out the activity being updated. This will contain a new array of all activities that do not match the id of the activity that were passing, after the comma we're passing out the newly updated activity
            setSelectedActivy(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
    }

    const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setSubmitting(true);
        setTarget(event.currentTarget.name);
        agent.Activities.delete(id).then(() => {
            setActivities([...activities.filter(a => a.id !== id)]);
        }).then(() => setSubmitting(false));
    }

    useEffect(() => {
        agent.Activities.list()
            .then((response) => {
                let activities: IActivity[] = [];
                response.forEach((activity) => { activity.date = activity.date.split('.')[0]; activities.push(activity); });
                setActivities(activities);
            })
            .then(() => setLoading(false));
    }, []);//second parameter empty array, ensure that useEffect runs once every time the component renders and the useEffect method is called

    if (loading) { return <LoadingComponent content='Loading activities...' /> }

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
                    submitting={submitting}
                    target={target}
                />
            </Container>
        </Fragment>
    );
}
export default App;
