import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AuthenticatedContainer from './containers/authenticated';
import SignUp from './containers/sign-up';
import SignIn from './containers/sign-in';
import Home from './containers/home';
import Profile from './containers/profile'

export default (
  <div>
    <Route path="/signup" component={SignUp} />
    <Route path="/signin" component={SignIn} />

    <Route path="/" component={AuthenticatedContainer}>
      <IndexRoute component={Home} />
      <Route path="/profile" component={Profile}/>
    </Route>
  </div>
);
