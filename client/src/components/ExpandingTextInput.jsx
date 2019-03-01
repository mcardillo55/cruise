import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'

class ExpandingTextInput extends Component {
    constructor(props) {
        super(props)

        this.generateControls = this.generateControls.bind(this)
    }
    generateControls() {
        let formData = this.props.data || [""]
        let numControls = formData.length

        let controls = []
        for(let i=0; i<numControls; i++) {
            controls.push(
                <Form.Group>
                    <Form.Control value={formData[i]} key={i} name={'links-' + i} onChange={this.props.onChange} />
                </Form.Group>
            )
        }
        return controls
    }
    render() {
        return(
            <Form.Group>
                <Form.Label>{this.props.label}</Form.Label>
                {this.generateControls()}
            </Form.Group>
        )
    }
}

export default ExpandingTextInput;