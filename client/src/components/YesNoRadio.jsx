import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'

class YesNoRadio extends Component {
    render() {
        return (
            <Form.Group>
                <Form.Row>
                    <Form.Label>{this.props.label}</Form.Label>
                </Form.Row>
                <Form.Row>
                    <Form.Check inline type="radio" label="Yes" name={this.props.name} />
                    <Form.Check inline type="radio" label="No" name={this.props.name} />
                </Form.Row>
            </Form.Group>
        );
    }
}

export default YesNoRadio;