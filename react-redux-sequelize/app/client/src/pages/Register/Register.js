import React, { Component } from 'react';
import { Jumbotron, Container } from 'reactstrap';
import RegisterForm from '../../components/RegisterForm';
import Nav from '../../components/Nav';
import './Register.css';


export default class Register extends Component {
  render() {
    return (
      <div className="pageDiv">
          <Nav/>
            <Jumbotron>
                <Container>
                    <h2>Register</h2>
                    <hr className="black"/>
                    <RegisterForm />                
                </Container>
            </Jumbotron>
      </div>
    )
  }
}
