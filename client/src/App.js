import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/home';
import Cal from './components/calendar';
import Search from './components/search';
import Appointments from './components/appointments';
import NewApt from './components/newapt';
import Navigation from './components/navigation';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        <Navigation />
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/calendar" component={Cal}/>
          <Route path="/search" component={Search}/>
          <Route path="/appointments/:id?" component={Appointments} />
          <Route path="/appointment/new" component={NewApt} />
          <Route component={Error}/>
        </Switch>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
