import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import SurveyForm from '../components/SurveyForm'
import localforage from 'localforage'

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
    sendNotification(msg) {
        // Based off of https://developer.mozilla.org/en-US/docs/Web/API/notification
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
          return
        }
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          var notification = new Notification(msg);
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              var notification = new Notification(msg);
            }
          });
        }
        // At last, if the user has denied notifications, and you 
        // want to be respectful there is no need to bother them any more.
      }
      checkNotifications() {
        localforage.getItem('queue', (err, value) => {
            if(value && value.length > 0) {
                this.sendNotification(value.length + " submission" + ((value.length > 1) ? "s are":" is") + " waiting in offline queue!")
            }
        })
        localforage.getItem('unfinished', (err, value) => {
            let length = value ? Object.keys(value).length : 0
            if(length) {
                this.sendNotification(length + " submission" + ((length > 1) ? "s are":" is") + " unfinished!")
            }
        })
      }
    componentDidMount() {
        this.checkNotifications()
        fetch("/api/presentations")
        .then(res => res.json())
        .then(
            (result) => {
                let formData;
                // Check for previously entered form data in localforage,
                // or else initialize Array the size of # of presentations
                localforage.getItem('formData')
                .then((value) => {
                    formData = value ? JSON.parse(value) : Array(result.length)
                    this.setState({
                        isLoaded: true,
                        presentations: result,
                        formData: formData
                    })
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
            // First, get index of link element we are dealing with
            let i = parseInt(name.split('-')[1]);
            if(!prevState[this.state.modalKey]['links']){
                prevState[this.state.modalKey]['links'] = [value, ""]
            } else {
                prevState[this.state.modalKey]['links'][i] = value;
            }
            // If we change the last field in interesting links, add a new (empty) field
            if(prevState[this.state.modalKey]['links'].length - 1 === i) {
                prevState[this.state.modalKey]['links'].push("")
            }
        } else {
            prevState[this.state.modalKey] = {...prevState[this.state.modalKey], [name]: value}
        }
        this.setState({
            formData: prevState
        })
        // Any change event will place the survey in an 'unfinished' state.
        // Once the survey is submitted, the submitForm function will remove it.
        localforage.getItem('unfinished', (err, value) => {
            value = value ? value : {}
            value[prevState[this.state.modalKey].presentationID] = true
            localforage.setItem('unfinished', value)
        })
        // Update all changes into localforage
        localforage.setItem('formData', JSON.stringify(prevState));
    }
    handleShow(i) {
        // Check if a form submission already exists in DB
        fetch("/api/survey?id=" + this.state.presentations[i].id)
        .then(res => {
            if(res.ok) 
                return res.json()
        })
        .then(
            (result) => {
                let prevState = [...this.state.formData];
                if(result && result.length) {
                    prevState[i] = result[0]
                    // Deserialize links from space-separated DB representation
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