import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
    const timeString = time.getHours() + ':' + time.getMinutes() + ':00';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateString = `${year}-${month}-${day}`;
    return new Date(dateString + ' ' + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
    //activity.date = activity.date.split('.')[0];
    activity.date = new Date(activity.date);
    //this.activities.push(activity);
    activity.isGoing = activity.attendees.some(a => a.username === user.userName);
    activity.isHost = activity.attendees.some(a => a.username === user.userName && a.isHost);
    activity.attendees.map(attendee => (console.log(attendee.username + ' ' + attendee.isHost + ' | ' + user.userName + ' ')));
    console.log('***********');
    //console.log(user.username);
    return activity;
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.userName,
        image: user.image!
    }
} 