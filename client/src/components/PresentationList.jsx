import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import SurveyForm from './SurveyForm'

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
            prevState[this.state.modalKey] = {}
        }

        if(name.startsWith('links')) {
            let i = name.split('-')[1];
            if(!prevState[this.state.modalKey]['links']){
                prevState[this.state.modalKey]['links'] = [value]
            } else {
                if(prevState[this.state.modalKey]['links'].length <= i) {
                    prevState[this.state.modalKey]['links'].push(value) 
                } else {
                    prevState[this.state.modalKey]['links'][i] = value
                }
            }
        } else {
            prevState[this.state.modalKey] = {...this.state.formData[this.state.modalKey], [name]: value}
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Presenter(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presentations.map((item, i) => {
                            return(
                                <tr key={i} onClick={() => this.handleShow(i)}>
                                    <th>{item.title}</th>
                                    <th>{item.presenter}</th>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

                <Modal size="lg" show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.presentations[this.state.modalKey].title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SurveyForm onChange={this.handleChange}/>
                    </Modal.Body>
                </Modal>
                </>
            )
        }
    }
}

export default PresentationList;