import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';

const validate = combineValidators({
    title: isRequired({ message: 'The event is required.' }),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 characters' })
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {

    const activityStore = useContext(ActivityStore);
    const { createActivity, editActivity, submitting, /*activity: initialFormState,*/ loadActivity/*, clearActivity*/ } = activityStore;

    //const [activity, setActivity] = useState<IActivityFormValues>({ id: undefined, title: '', category: '', description: '', date: undefined, time: undefined, city: '', venue: '' });
    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //if (match.params.id && match.params.id.length === 0) {
        if (match.params.id /*&& !match.params.id*/) {
            setLoading(true);
            loadActivity(match.params.id).then(
                //(activity) => { initialFormState && setActivity(initialFormState); }
                //(activity) => { setActivity(activity); }
                (activity) => { setActivity(new ActivityFormValues(activity)); }
            ).finally(() => setLoading(false));
        }

        /*return () => {
            clearActivity();
        }*/
    }, [loadActivity, match.params.id/*, clearActivity,*/ /*initialFormState,*/ /*activity.id*/]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        //console.log(values);
        //console.log(activity);
        if (!activity.id) {//check if exists or not undefined
            let newActivity = {
                ...activity,//spread the activity that we have in our states
                id: uuid()//import for a universal unique identifier uuid
            };
            createActivity(newActivity)/*.then(() => history.push(`/activities/${newActivity.id}`))*/;
        }
        else {
            editActivity(activity)/*.then(() => history.push(`/activities/${activity.id}`))*/;
        }
    };

    return (
        <Grid>
            <Segment clearing>
                <FinalForm
                    validate={validate}
                    initialValues={activity}
                    onSubmit={handleFinalFormSubmit}
                    render={({ handleSubmit, invalid, pristine }) => (
                        <Form onSubmit={handleSubmit} loading={loading}>
                            <Field name='title' placeholder='Title' value={activity.title} component={TextInput} />
                            <Field name='description' rows={3} placeholder='Description' value={activity.description} component={TextAreaInput} />
                            <Field name='category' placeholder='Category' value={activity.category} component={SelectInput} options={category} />
                            <Form.Group widths='equal'>
                                <Field name='date' placeholder='Date' value={activity.date} component={DateInput} date={true} />
                                <Field name='time' placeholder='Time' value={activity.time} component={DateInput} time={true} />
                            </Form.Group>
                            <Field name='city' placeholder='City' value={activity.city} component={TextInput} />
                            <Field name='venue' placeholder='Venue' value={activity.venue} component={TextInput} />
                            <Button loading={submitting} floated='right' positive type='submit' content='Submit' disabled={loading || invalid || pristine} />
                            <Button
                                onClick={
                                    //() => history.push('/activities')
                                    activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push('/activities')
                                }
                                floated='right' type='button' content='Cancel' disabled={loading} />
                        </Form>
                    )}
                />
            </Segment>
        </Grid>
    );
}

export default observer(ActivityForm);