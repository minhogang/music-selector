import React, { Component } from 'react';
import './modal.css';
import Backdrop from '../Backdrop/backdrop';
import Aux from '../../hoc/Auxilliary';
import { Dropdown, Input, Button } from 'semantic-ui-react';
import * as actions from '../../store/actions/actions'
import { connect } from 'react-redux';  

class Modal extends Component {
    
    state = {
        APICALLED: false,
        dropdowns: [],
        modalData: {} // {0: {composer: Beethoven (1), amount: 2, error: false}}
    }

    shouldComponentUpdate (nextProps, nextState) {
		if (this.state === nextState && this.props === nextProps) {
			return false
		} else {
            return true
        }
    }
    
    componentDidMount () {
        const getData = () => {
            const url = this.props.grade;
            fetch(`/api/pieces/?grade=${url}`)
                .then(fetchPieces)
                .then(createDropdownOptions)
        }
        const fetchPieces = (response) => {
            return response.json()
        }
        const createDropdownOptions = (response) => {
            const dropdownOptions = []
            Object.keys(response[0]).forEach((key) => {
                if (key.startsWith('_id')) {} else {
                    let newObj = { key: key, value: key + ` (${response[0][key].length})`, text: key + ` (${response[0][key].length})`};
                    dropdownOptions.push(newObj);
                }
            })
            this.setState({dropdowns: dropdownOptions})
            this.setState({APICALLED: true})
        }
        if (!this.state.APICALLED) {getData()}

        const composers = this.props.formData[this.props.grade].composers;
        for (let composer in composers) { //Initialize modal Data with presets from formData
            const newState = {...this.state}
            const currentLength = Object.keys(this.state.modalData).length
            const currentAmount = this.props.formData[this.props.grade].composers[composer]
            newState.modalData[currentLength] = {composer: [composer], amount: [currentAmount], error: false}
            this.setState(newState)
        }
    }

    handleComposerChange = ( { value }, rowId ) => {
        const newState = {...this.state}
        const regex = /(.+)\((\d+)\)/; //Regex for composers such as Beethoven (2)
        const groups = regex.exec(value);
        newState.modalData[rowId].composer = value
        if (parseInt(groups[2]) > parseInt(newState.modalData[rowId].amount)) {
            newState.modalData[rowId].error = false
        } else {
            newState.modalData[rowId].error = true
        }
        this.setState(newState)
    }

    handleInputChange = ( { value }, rowId ) => {
        const newState = {...this.state}
        const regex = /(.+)\((\d+)\)/; //Same Regex
        const groups = regex.exec(newState.modalData[rowId].composer)
        newState.modalData[rowId].amount = value
        if (parseInt(value) > groups[2]) {
            newState.modalData[rowId].error = true
        } else {
            newState.modalData[rowId].error = false
        }
        this.setState(newState)
    }

    combinedClickListeners = () => {
        for (let data in this.state.modalData) {
            if (this.state.modalData[data].error) {return}
        }
        this.props.mergeModalDataToFormData(this.props.grade, this.state.modalData)
        this.props.clicked();
    }

    addRow = () => {
        const newState = {...this.state}
        const currentRowAmount = Object.keys(this.state.modalData).length
        newState.modalData[currentRowAmount] = {composer: '', amount: 0, error: false}
        this.setState(newState)
    }

    resetModal = () => {
        this.setState({modalData: {}})
    }
    
    render () {
        const rows = []
        for (let data in this.state.modalData) { //Create row elements and add event handlers
            const rowId = data
            const rowElement = 
                <Aux key={data}>
                    <Dropdown 
                    className='Dropdown Element'
                    placeholder='Select Composer'
                    defaultSearchQuery={this.state.modalData[data].composer[0]}
                    defaultValue={this.state.modalData[data].composer}
                    search
                    selection
                    options={this.state.dropdowns}
                    onChange={(e, form) => this.handleComposerChange(form, rowId) }/>
                    <Input 
                    defaultValue={this.state.modalData[data].amount}
                    className='Element' 
                    error={this.state.modalData[data].error}
                    type='number' 
                    placeholder='Amount' 
                    step='1' 
                    min ='0'
                    onChange={(e, form) => this.handleInputChange(form, rowId)}/>
                </Aux>
            rows.push(rowElement)
        }
        
        const styles = {
            width: this.props.show ? '60%' : '40%',
            left: this.props.show ? '20%' : '30%',
            top: this.props.show ? '30%' : '60%',   
            opacity: this.props.show ? '1' : '0',
            display: this.props.show ? 'block' : 'none'
        };
        
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={() => this.combinedClickListeners()}/>
                <div className='Modal' style={styles}>
                    <div style={{display: 'inline-block', width: '100%', paddingLeft: '15px'}}>
                        <Button 
                        className='Element'
                        basic
                        color='red'
                        content='Reset'
                        onClick={(e) => this.resetModal()} />
                    </div>
                    <div className='row'>
                        {rows}
                    </div>
                    <Button 
                    className='Element' 
                    id='addButton'
                    basic 
                    color='purple' 
                    content='Add' 
                    onClick={(e) => this.addRow()} />
                </div>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        show: state.modalShowing,
        grade: state.modalTargetId,
        formData: state.formData,
        modalData: state.modalData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        mergeModalDataToFormData: (grade, modalData) => dispatch(actions.mergeData(grade, modalData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);