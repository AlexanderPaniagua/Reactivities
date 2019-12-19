import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    selectedActivity: IActivity;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivy: (activity: IActivity | null) => void;
}

const ActivityDetails: React.FC<IProps> = ({ selectedActivity, setEditMode, setSelectedActivy }) => {
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{selectedActivity.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedActivity.date}</span>
                </Card.Meta>
                <Card.Description>{selectedActivity.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button onClick={() => setEditMode(true)} basic color='blue' content='Edit' />
                    <Button onClick={() => setSelectedActivy(null)} basic color='blue' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    );
}

export default ActivityDetails;