import React, { Component } from 'react';
import './main.css';
import { Input, Button, Label, Grid, Container, Icon } from 'semantic-ui-react';
import Aux from '../../hoc/Auxilliary';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import Modal from '../Modal/modal';
import { Link } from 'react-router-dom';

class Main extends Component {

	state = {
		isErrorPresent: false
	}

	handleChange = ({ value }, i) => {
		this.props.addPiece(value, i);
		if (this.props.formData[i].error) {
			this.setState({ isErrorPresent: true })
		} else {
			this.setState({ isErrorPresent: false })
		}
	}

	handleGenerate = () => {
		this.props.onGenerate();
	}

	handleKeyPress = (e) => { /* Only allow users to enter numbers */
		if (e.which === 8) { return } 
		if (e.which < 48 || e.which > 57) {
			e.preventDefault();
		}
	}

	render() {
		const arrayOfRows = [];
		for (let i of Object.keys(this.props.formData)) {
			const errorLabel = (this.props.formData[i].error ?
				<Label basic
					pointing='below'
					className='error-label'>
					There are only {this.props.formData[i].limit} pieces of this grade.
				</Label>
				: null
			)
			let temp_form = (
				<Grid columns='equal' key={i}>
					<div className='pseudo-relative'>
						{errorLabel}
					</div>
					<Grid.Row>
						<Grid.Column>
							<Label size='big'>
								Grade
							<Label.Detail>{i}</Label.Detail>
							</Label>
						</Grid.Column>
						<Grid.Column>
							<Input id=''
								defaultValue={this.props.formData[i].amount}
								onKeyDown={(e) => this.handleKeyPress(e)}
								type='number'
								min='0'
								className='dropdown_input'
								placeholder='Amount'
								step='1'
								onChange={(e, form) => this.handleChange(form, i)} />
						</Grid.Column>
						<Grid.Column>
							<Button className='configure-button' onClick={(e) => this.props.handleConfigure(e, i)} animated='vertical'>
								<Button.Content hidden>Configure</Button.Content>
								<Button.Content visible>
									<Icon size='large' name='plus square outline' />
								</Button.Content>
							</Button>
						</Grid.Column>
					</Grid.Row>
				</Grid>)
			arrayOfRows.push(temp_form);
		}
		return (
			<Aux>
				<Container>
					{/* Add key prop to Modal component to trigger componentDidMount on Modal */}
					<Modal key={this.props.modalTargetId} clicked={() => this.props.backdropClicked()} />
					<div className='container'>
						{arrayOfRows}
					</div>
					<div className='flexbox'>
					<Link to='/generate'>
						<Button disabled={this.state.isErrorPresent}>
							Generate
						</Button>
					</Link>
					<Label pointing='left' style={{opacity: Number(this.state.isErrorPresent)}}>One or more entries are invalid</Label>
					</div>
				</Container>
			</Aux>
		);
	}
}

const mapStateToProps = state => {
	return {
		formData: state.formData,
		modalTargetId: state.modalTargetId,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addPiece: (value, grade) => dispatch(actions.addPiece(value, grade)),
		handleConfigure: (e, i) => dispatch(actions.handleConfigure(e, i)),
		backdropClicked: () => dispatch(actions.backdropClicked())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
