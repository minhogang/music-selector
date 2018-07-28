import React, { Component } from 'react';
import './generate.css';
import { Table, Button, Icon, Container, Checkbox, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Auxilliary';
import { withRouter } from 'react-router-dom';
var _ = require('lodash');
const REGEX = /(.+)\((\d+)\)/;

class Generate extends Component {

    state = {
        pieces: [], //{1: {composer: Beethoven, piece: Minuet}}
        piecesToOpen: [],
        previouslyOpenedPieces: []
    }

    componentDidMount() {
        if (localStorage) {
            Object.keys(localStorage).map(obj => this.setState((prevState) => {
                return { previouslyOpenedPieces: prevState.previouslyOpenedPieces.concat(obj) }
            }))
        }
        for (let grade in this.props.formData) {
            if (Object.keys(this.props.formData[grade].composers).length !== 0) {
                for (let composer in this.props.formData[grade].composers) { //{Agay: 2. Alt: 1}
                    if (composer === '') { continue }
                    fetch(`/api/pieces/?grade=${grade}`)
                        .then((response) => { return response.json() })
                        .then((response) => {
                            const groups = REGEX.exec(composer)
                            const composerArray = response[0][groups[1].trim()];
                            const randomSelections = _.sampleSize(composerArray, this.props.formData[grade].composers[composer])
                            randomSelections.forEach(piece => {
                                const newState = { ...this.state }
                                const newObj = { grade: [grade], composer: [groups[1].trim()], piece: [piece] }
                                newState.pieces.push(newObj)
                                this.setState(newState)
                            })
                        })
                }
            } else if (this.props.formData[grade].amount !== 0) {
                fetch(`/api/pieces/?grade=${grade}`)
                    .then((response) => { return response.json() })
                    .then((response) => {
                        const allPieces = [];
                        Object.keys(response[0]).forEach(composer => {
                            if (composer.startsWith('_id')) { return }
                            response[0][composer].forEach(piece => {
                                allPieces.push({ grade: [grade], composer: [composer], piece: [piece] })
                            })
                        })
                        const selectedPieces = _.sampleSize(allPieces, this.props.formData[grade].amount)
                        const newState = { ...this.state }
                        selectedPieces.forEach(obj => { newState.pieces.push(obj) })
                        this.setState(newState)
                    })
            }
        }
    }

    sliderChanged = ({ checked }, obj) => {
        const newState = { ...this.state }
        if (checked) {
            newState.piecesToOpen.push(obj)
        } else {
            const idx = newState.piecesToOpen.indexOf(obj)
            newState.piecesToOpen.splice(idx, 1)
        }
        this.setState(newState);
    }

    openSelected = () => {
        this.state.piecesToOpen.forEach(obj => {
            localStorage.setItem(obj.piece, null)
            window.open(`https://www.google.com/search?q=${obj.composer} ${obj.piece} imslp`)
        })
    }

    openAll = () => {
        this.state.pieces.forEach(obj => {
            localStorage.setItem(obj.piece, null)
            window.open(`https://www.google.com/search?q=${obj.composer} ${obj.piece} imslp`)
        })
    }

    resetLocalStorage = () => {
        localStorage.clear()
    }
    render() {
        const rows = [];
        this.state.pieces.forEach(obj => {
            rows.push((
                <Table.Row key={obj.piece} warning={this.state.previouslyOpenedPieces.includes(obj.piece[0])}>
                    <Table.Cell collapsing>
                        <Checkbox slider onChange={(e, form) => this.sliderChanged(form, obj)} />
                    </Table.Cell>
                    <Table.Cell>{obj.grade}</Table.Cell>
                    <Table.Cell>{obj.composer}</Table.Cell>
                    <Table.Cell>{obj.piece}</Table.Cell>
                </Table.Row>
            ))
        })
        const table = (
            <Container>
                <Message warning>
                    <p>Pieces you have previously opened are highlighted in brown.</p>
                </Message>
                <Table compact celled definition>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>Grade</Table.HeaderCell>
                            <Table.HeaderCell>Composer</Table.HeaderCell>
                            <Table.HeaderCell>Piece</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>

                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan='4'>
                                <Button onClick={(e) => this.openAll()} floated='right' icon labelPosition='left' primary size='small'>
                                    <Icon name='plus' /> Open All in Browser
                                </Button>
                                <Button onClick={(e) => this.resetLocalStorage()} size='small'>Reset Previously Opened Pieces</Button>
                                <Button onClick={(e) => this.openSelected()} size='small'>Open Selected in Browser</Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Container>
        )
        return (
            <Aux>
                <Button className='go-back-button'
                    circular
                    content='Go Back'
                    icon='left chevron'
                    onClick={(e) => this.props.history.goBack()} />
                <div>
                    {table}
                </div>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        formData: state.formData
    }
}

export default withRouter(connect(mapStateToProps, null)(Generate));