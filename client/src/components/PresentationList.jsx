import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'

class PresentationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    render() {
        const { error, isLoaded, presentations } = this.state
        if (error) {
            return <div>Error Loading Table Data</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Presenter(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presentations.map((item) => {
                            return(
                                <tr>
                                    <th>{item.title}</th>
                                    <th>{item.presenter}</th>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            )
        }
    }
}

export default PresentationList;