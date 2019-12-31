import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];//array of activities
    @observable selectedActivity: IActivity | undefined = undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        //return this.activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('Loading activities', () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    //this.activities.push(activity);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
        }
        catch (ex) {
            runInAction('Load activities error', () => {
                this.loadingInitial = false;
            });
            console.log(ex);
        }
    };

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('Creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            });
        }
        catch (ex) {
            runInAction('Create activity error', () => {
                this.submitting = false;
            });
            console.log(ex);
        }
    };

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('Editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            });
        }
        catch (exception) {
            runInAction('Edit activity error', () => {
                this.submitting = false;
            });
            console.log(exception);
        }
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('Delete activity', () => {
                this.activityRegistry.delete(id);
                this.submitting = true;
                this.target = '';
            });
        }
        catch (exception) {
            console.log('Exception at deleteActivity. ' + exception);
            runInAction('Delete activity error', () => {
                this.submitting = false;
                this.target = '';
            });
        }
    }

}

export default createContext(new ActivityStore());



