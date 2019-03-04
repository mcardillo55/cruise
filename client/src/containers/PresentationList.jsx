import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import SurveyForm from '../components/SurveyForm'

class PresentationList extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            showModal: false,
            modalKey: 0,
            error: null,
            isLoaded: false,
            presentations: [],
            formData: []
        };
    }
    componentDidMount() {
        fetch("/api/presentations")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    presentations: result,
                    formData: Array(result.length)
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )
    }
    handleChange(event) {
        let {type, name, checked, value} = event.target;
        let prevState = [...this.state.formData];
        if(!prevState[this.state.modalKey]) {
            prevState[this.state.modalKey] = {"presentationID": this.state.presentations[this.state.modalKey].id}
        }

        if(name.startsWith('links')) {
            let i = name.split('-')[1];
            if(!prevState[this.state.modalKey]['links']){
                prevState[this.state.modalKey]['links'] = [value, ""]
            } else {
                prevState[this.state.modalKey]['links'][i] = value;
            }
            if(prevState[this.state.modalKey]['links'].length - 1 == i) {
                prevState[this.state.modalKey]['links'].push("")
            }
        } else {
            prevState[this.state.modalKey] = {...prevState[this.state.modalKey], [name]: value}
        }
        this.setState({
            formData: prevState
        })
    }
    handleShow(i) {
        this.setState({
            showModal: true,
            modalKey: i
        });
    }
    handleClose() {
        this.setState({ showModal: false });
    }
    render() {
        const { error, isLoaded, presentations } = this.state
        if (error) {
            return <div>Error Loading Table Data</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <>
                <ListGroup>
                    {presentations.map((item, i) => {
                        return(
                            <ListGroup.Item action key={i} onClick={() => this.handleShow(i)}>{item.title} - {item.presenter}</ListGroup.Item>
                        )
                    })}
                </ListGroup>

                <Modal size="lg" show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.presentations[this.state.modalKey].title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SurveyForm data={this.state.formData[this.state.modalKey]} onChange={this.handleChange}/>
                    </Modal.Body>
                </Modal>
                </>
            )
        }
    }
}

export default PresentationList;