import React, { Component } from 'react';
import { Jumbotron, Container } from 'reactstrap'; 
import Nav from '../Nav';
import './Home.css';

export default class Home extends Component {
  render() {
    return (
        <div id="Home" className="page-div">
            <Nav />
            <Jumbotron>
                <Container>
                    <h1 className="display-4">Dashboard</h1>
                    <p className="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
                </Container>
            </Jumbotron>
        </div>
    )
  }
}
