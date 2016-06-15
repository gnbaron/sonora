import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AuthenticatedContainer from './containers/authenticated';
import SignUp from './containers/sign-up';
import SignIn from './containers/sign-in';
import Home from './containers/home';
import Explore from './containers/explore';
import Songs from './containers/songs';
import Artists from './containers/artists';
import Profile from './containers/profile';
import Genres from './containers/genres/index';
import EditGenre from './containers/genres/edit';

export default (
  <div>
    <Route path="/signup" component={SignUp} />
    <Route path="/signin" component={SignIn} />

    <Route path="/" component={AuthenticatedContainer}>
      <IndexRoute component={Home} />
      <Route path="/explore" component={Explore}/>
      <Route path="/songs" component={Songs}/>
      <Route path="/artists" component={Artists}/>
      <Route path="/genres" component={Genres}>
        <Route path="/genres/new" component={EditGenre} />
        <Route path="/genres/:id" component={EditGenre} />
      </Route>
      <Route path="/profile" component={Profile}/>
    </Route>
  </div>
);
