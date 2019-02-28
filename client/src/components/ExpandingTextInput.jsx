import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'

class ExpandingTextInput extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.generateControls = this.generateControls.bind(this)

        this.state = {
            numControls: 1,
            controlData: [""]
        }
    }
    handleChange(event) {
        if(event.target.name == this.state.numControls - 1) {
            this.setState({numControls: this.state.numControls + 1})
        }
    }
    generateControls() {
        let controls = []
        for(let i=0; i<this.state.numControls; i++) {
            controls.push(
                <Form.Group>
                    <Form.Control name={i} onChange={this.handleChange} />
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