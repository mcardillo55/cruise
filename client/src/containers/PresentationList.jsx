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
                let formData;
                if(localStorage.getItem('formData')) {
                    formData = JSON.parse(localStorage.getItem('formData'))
                } else {
                    formData = Array(result.length)
                }

                this.setState({
                    isLoaded: true,
                    presentations: result,
                    formData: formData
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
        let {name, value} = event.target;
        let prevState = [...this.state.formData];
        if(name === 'rating') {
            value = parseInt(value) 
        }
        if(!prevState[this.state.modalKey]) {
            prevState[this.state.modalKey] = {"presentationID": this.state.presentations[this.state.modalKey].id}
        }

        if(name.startsWith('links')) {
            let i = parseInt(name.split('-')[1]);
            if(!prevState[this.state.modalKey]['links']){
                prevState[this.state.modalKey]['links'] = [value, ""]
            } else {
                prevState[this.state.modalKey]['links'][i] = value;
            }
            if(prevState[this.state.modalKey]['links'].length - 1 === i) {
                prevState[this.state.modalKey]['links'].push("")
            }
        } else {
            prevState[this.state.modalKey] = {...prevState[this.state.modalKey], [name]: value}
        }
        this.setState({
            formData: prevState
        })
        localStorage.setItem('formData', JSON.stringify(prevState));
    }
    handleShow(i) {
        fetch("/api/survey?id=" + this.state.presentations[i].id)
        .then(res => res.json())
        .then(
            (result) => {
                let prevState = [...this.state.formData];
                if(result && result.length) {
                    prevState[i] = result[0]
                    if(prevState[i].links) {
                        prevState[i].links = prevState[i].links.split(' ')
                    }
                }
                this.setState({
                    formData: prevState
                })
            }
        )
        .finally(() => {
            this.setState({
                    showModal: true,
                    modalKey: i,
                });
        })

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
                        <SurveyForm data={this.state.formData[this.state.modalKey]} onChange={this.handleChange} onHide={this.handleClose}/>
                    </Modal.Body>
                </Modal>
                </>
            )
        }
    }
}

export default PresentationList;