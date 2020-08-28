import { observable, action, computed, runInAction } from 'mobx';
import {  SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/util/util';

export default class ActivityStore {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;

    @computed get activitiesByDate() {
        //return this.activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        //return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        //return sortedActivities;
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        //const user = this.rootStore.userStore.user!;
        try {
            const activities = await agent.Activities.list();
            runInAction('Loading activities', () => {
                activities.forEach(activity => {
                    console.log('loadActivities');
                    ////activity.date = activity.date.split('.')[0];
                    //activity.date = new Date(activity.date);
                    ////this.activities.push(activity);
                    //activity.isGoing = activity.attendees.some(a => a.username === user.username);
                    //activity.isHost = activity.attendees.some(a => a.username === user.username && a.isHost);
                    setActivityProps(activity, this.rootStore.userStore.user!);
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
            //throw ex;
        }
    };

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) { this.activity = activity; return activity; }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('Get activity', () => {
                    console.log('loadActivity');
                    //activity.date = new Date(activity.date);
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                });
                return activity;
            }
            catch (exception) {
                console.log(exception);
                runInAction('Get activity error', () => {
                    this.loadingInitial = false;
                });
                //throw exception;
            }
        }
    };

    @action clearActivity = () => {
        this.activity = null;
    };

    getActivity = (id: string) => { return this.activityRegistry.get(id); };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);

            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;

            activity.isHost = true;

            runInAction('Creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        }
        catch (ex) {
            runInAction('Create activity error', () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(ex);
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('Editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        }
        catch (exception) {
            runInAction('Edit activity error', () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(exception.response);
        }
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

    @action attendActivity = async() => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            });
        }
        catch (exception) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem singin up to activity');
        }
    }

    @action cancelAttendance = async () => {
        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(
                        a => a.username !== this.rootStore.userStore.user!.userName
                    );
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            });
        }
        catch (exception) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem cancelling up to activity');
        }
    }

}