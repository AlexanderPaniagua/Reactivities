import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';

interface IProps {
    openCreateForm: () => void;
}

const NavBar: React.FC<IProps> = ({ openCreateForm }) => {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item name='header' >
                    <img alt='Some image' src='/assets/logo.png' />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item name='Button'>
                    <Button onClick={openCreateForm} positive content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default NavBar;