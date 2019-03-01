import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import YesNoRadio from './YesNoRadio'
import RatingInput from './RatingInput'
import ExpandingTextInput from './ExpandingTextInput'

class SurveyForm extends Component {
    render(){
        let formData = this.props.data || {};
        return(
            <Form>
                <YesNoRadio data={formData.interesting} label="Was the talk interesting?" name="interesting" onChange={this.props.onChange}/>
                <YesNoRadio data={formData.seating} label="Was there enough seating for the talk?" name="seating" onChange={this.props.onChange}/>
                <ExpandingTextInput data={formData.links} label="Links provided during talk:" onChange={this.props.onChange}/>
                <Form.Group>
                    <Form.Label>What specific topics in the talk were interesting?</Form.Label>
                    <Form.Control value={formData.interesting_topics} name="interesting_topics" onChange={this.props.onChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>What specific topics in the talk were uninteresting?</Form.Label>
                    <Form.Control value={formData.uninteresting_topics} name="uninteresting_topics" onChange={this.props.onChange}/>
                </Form.Group>
                <RatingInput data={formData.rating} label="From 1-10, how would you rate the talk?" onChange={this.props.onChange}/>
                <Form.Group>
                    <Form.Label>Other feedback?</Form.Label>
                    <Form.Control value={formData.other_feedback} name="other_feedback" onChange={this.props.onChange}/>
                </Form.Group>
            </Form>
        );
    }
}

export default SurveyForm;