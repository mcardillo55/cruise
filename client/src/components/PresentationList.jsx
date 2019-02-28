import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'

class PresentationList extends Component {
    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            showModal: false,
            modalKey: 0,
            error: null,
            isLoaded: false,
            presentations: []
        };
    }
    componentDidMount() {
        fetch("/api/presentations")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    presentations: result
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

                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.presentations[this.state.modalKey].title}</Modal.Body>
                </Modal>
                </>
            )
        }
    }
}

export default PresentationList;