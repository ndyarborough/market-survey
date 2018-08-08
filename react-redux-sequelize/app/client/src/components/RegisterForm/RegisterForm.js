import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap'; 
import './RegisterForm.css';
import { registerAttempt } from '../../actions/userActions';

class RegisterForm extends Component {

  handleFormSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value.trim(),
      password2: document.getElementById('password2').value.trim()
    };

    this.props.dispatch(registerAttempt(newUser));
  }

  render() {
    return (
        <div className="page-div">
       
          <Form onSubmit={this.handleFormSubmit} className='register-form'>
            <FormGroup>
              <Row>
                <Col md="6">
                  <Label for="firstName">First Name</Label>
                  <Input type="text" className="form-control" id="firstName" placeholder="First name" />
                </Col>
                <Col md="6">
                  <Label for="lastName">Last Name</Label>
                  <Input type="text" className="form-control" id="lastName" placeholder="Last name" />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="email">Email Address</Label>
              <Input type="email" className="form-control" id="email" placeholder="Email address" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" className="form-control" id="password" placeholder="Password" />
            </FormGroup>
            <FormGroup>
              <Label for="confirm-password">Confirm Password</Label>
              <Input type="password" className="form-control" id="password2" placeholder="Confirm Password" />
            </FormGroup>
            <Button type="submit" color="btn btn-primary">Register</Button>
          </Form>
        </div>
    )
  }
}

// Returns new this.props object using state
const mapStateToProps = (state, ownProps) => {
  // console.log(state.user.user)
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps)(RegisterForm)
