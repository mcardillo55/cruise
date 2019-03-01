import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import YesNoRadio from './YesNoRadio'
import RatingInput from './RatingInput'
import ExpandingTextInput from './ExpandingTextInput'

class SurveyForm extends Component {
    render(){
        return(
            <Form>
                <YesNoRadio label="Was the talk interesting?" name="interesting" onChange={this.props.onChange}/>
                <YesNoRadio label="Was there enough seating for the talk?" name="seating" onChange={this.props.onChange}/>
                <ExpandingTextInput label="Links provided during talk:" onChange={this.props.onChange}/>
                <Form.Group>
                    <Form.Label>What specific topics in the talk were interesting?</Form.Label>
                    <Form.Control name="interesting-topics" onChange={this.props.onChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>What specific topics in the talk were uninteresting?</Form.Label>
                    <Form.Control name="uninteresting-topics" onChange={this.props.onChange}/>
                </Form.Group>
                <RatingInput label="From 1-10, how would you rate the talk?" onChange={this.props.onChange}/>
                <Form.Group>
                    <Form.Label>Other feedback?</Form.Label>
                    <Form.Control name="other-feedback" onChange={this.props.onChange}/>
                </Form.Group>
            </Form>
        );
    }
}

export default SurveyForm;