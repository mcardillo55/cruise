import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import PresentationList from './components/PresentationList'
import './App.css';

class App extends Component {
  render() {
    return (
      <Container>
        <h1>Shmoocon Survey</h1>
        <PresentationList />
      </Container>
    );
  }
}

export default App;
