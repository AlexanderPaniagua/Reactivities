import React from 'react';
import { Item, Button, SegmentGroup, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';

/*interface IProps {
    activity: IActivity;
}*/

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {

    return (
        <SegmentGroup>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted by Alex
                        </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button floated='right' content='View' color='blue'
                    as={Link} to={`/activities/${activity.id}`} />
            </Segment>
        </SegmentGroup>
        
    );
};

export default ActivityListItem;