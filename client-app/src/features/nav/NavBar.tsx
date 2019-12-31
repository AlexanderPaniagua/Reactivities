import React, { useContext } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import ActivityStore from '../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

const NavBar: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item name='header' >
                    <img alt='Some image' src='/assets/logo.png' />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item name='Button'>
                    <Button onClick={activityStore.openCreateForm} positive content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default observer(NavBar);