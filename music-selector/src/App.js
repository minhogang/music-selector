import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Main from './components/Main/main';
import Generate from './components/GeneratePage/generate';

class App extends Component {
    componentDidMount () {
        document.title = "Random Piano Piece Generator"
    }
    
    render() {
        let routes = (
            <Switch>
                <Route path='/generate' component={Generate} />
                <Route path='/' exact component={Main} />
            </Switch>
        )
        return (
            <div>
                {routes}
            </div>
        )
    }
}

export default withRouter(App);
