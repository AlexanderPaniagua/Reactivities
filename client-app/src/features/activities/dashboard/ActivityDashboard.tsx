import React from 'react';
import { IActivity } from '../../../app/models/activity';
import { Grid } from 'semantic-ui-react';
import ActivityDetails from '../details/ActivityDetails';
import ActivityList from './ActivityList';
import ActivityForm from '../form/ActivityForm';

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;//signature of the function that we are pasing down. Function returning void
    selectedActivity: IActivity | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivy: (activity: IActivity | null) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (id: string) => void;
}

const ActivityDashboard: React.FC<IProps> = ({ activities, selectActivity, selectedActivity, editMode, setEditMode, setSelectedActivy, createActivity, editActivity, deleteActivity }) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity} />
            </Grid.Column>
            <Grid.Column width={6}>
                {
                    selectedActivity &&
                    !editMode &&
                    <ActivityDetails selectedActivity={selectedActivity!}
                        setEditMode={setEditMode}
                        setSelectedActivy={setSelectedActivy}
                    /> /*! is overriding type safety*/
                }
                {
                    /* on create activity, the activity and props are setted to null but the component is not being updated because it has 
                     * not unmounted and simply changing the prop is not causing the re-render of this component to give the uptaded state. To
                     * solve this, we give our activity form a key and when it changes the component will reinitialize and will update the states with the new ones.
                     */
                    editMode && <ActivityForm key={selectedActivity && selectedActivity?.id || 0} setEditMode={setEditMode} selectedActivity={selectedActivity!} createActivity={createActivity} editActivity={editActivity} />
                }
            </Grid.Column>
        </Grid>
    );
}

export default ActivityDashboard;