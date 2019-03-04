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
                    <Form.Check inline checked={this.props.data === "yes"} type="radio" label="Yes" value="yes" name={this.props.name} onChange={this.props.onChange}/>
                    <Form.Check inline checked={this.props.data === "no"} type="radio" label="No" value="no" name={this.props.name} onChange={this.props.onChange}/>
                </Form.Row>
            </Form.Group>
        );
    }
}

export default YesNoRadio;