import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import YesNoRadio from './YesNoRadio'
import RatingInput from './RatingInput'
import ExpandingTextInput from './ExpandingTextInput'

class SurveyForm extends Component {
    render(){
        return(
            <Form>
                <YesNoRadio label="Was the talk interesting?" name="interesting" />
                <YesNoRadio label="Was there enough seating for the talk?" name="seating" />
                <ExpandingTextInput label="Links provided during talk:" />
                <Form.Group>
                    <Form.Label>What specific topics in the talk were interesting?</Form.Label>
                    <Form.Control />
                </Form.Group>
                <Form.Group>
                    <Form.Label>What specific topics in the talk were uninteresting?</Form.Label>
                    <Form.Control />
                </Form.Group>
                <RatingInput label="From 1-10, how would you rate the talk?" />
                <Form.Group>
                    <Form.Label>Other feedback?</Form.Label>
                    <Form.Control />
                </Form.Group>
            </Form>
        );
    }
}

export default SurveyForm;