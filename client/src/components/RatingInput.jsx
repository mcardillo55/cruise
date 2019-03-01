import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'

class RatingInput extends Component {
    constructor(props) {
        super(props);
    }
    generateRadioButtons(start=1, end=10) {
        let radios = []
        for(let i=start; i<=end; i++) {    
            radios.push(<Form.Check inline checked={this.props.data == i} type="radio" label={i} value={i} name="rating" onChange={this.props.onChange}/>);
        }
        return radios
    }
    render() {
        return (
            <Form.Group>
                <Form.Row>
                    <Form.Label>{this.props.label}</Form.Label>
                </Form.Row>
                <Form.Row>
                    { this.generateRadioButtons() }
                </Form.Row>
            </Form.Group>
        )
    }
}

export default RatingInput;