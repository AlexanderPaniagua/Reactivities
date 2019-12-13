import React, { Component } from 'react';
import logo from './logo.svg';
import { Header, Icon, List } from 'semantic-ui-react';
import './App.css';
import axios from 'axios';

//const App: React.FC = () => {
class App extends Component {
    state = {
        values: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/values/')
            .then((response) => {
                //console.log(response);
                this.setState({ values: response.data })
            });
    }

    render() {
        return (
            /*<div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </header>
            </div>*/
            <div>
                <Header as='h2'>
                    <Icon name='users' />
                    <Header.Content>Reactivities</Header.Content>
                </Header>
                <List>
                    {this.state.values.map((value: any) => (<List.Item key={value.id}>{value.name}</List.Item>))}
                </List>
            </div>
        );
    }
}

export default App;
