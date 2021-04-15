import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router ,Route, NavLink,Switch } from "react-router-dom";
import styles from './index.module.css';
import Paper from './PaperDribble';
import Game from './tictactoe'
import Home from './Home'


class Main extends React.Component{
  render(){
    return (  
      <div className={styles.container}>
        <h1>
          <NavLink to={`/99-interactions/home` } activeClassName={styles.linkActive}>Home</NavLink>     
          <NavLink to={`/99-interactions/Tags` } activeClassName={styles.linkActive}>Tags</NavLink>     
          <NavLink to={`/99-interactions/PaperDribble` } activeClassName={styles.linkActive}>About</NavLink>     
          <NavLink to={`/99-interactions/contact` } activeClassName={styles.linkActive}>Contact</NavLink>     
          <span>user</span>
        </h1>
        <Switch>
          <Route path={`/99-interactions/home`}>
              <Home/>
          </Route>
          <Route path={`/99-interactions/about`}>
            <Game/>
          </Route>
          <Route path={`/99-interactions/PaperDribble`}>
            <Paper coeff_friction={0.1}/>
          </Route>
        </Switch>        
        <div>
          this will be footer
        </div>  
      </div>
    );
  }
}

class App extends React.Component {
  render(){
    return (  
      <Router>              
        <Switch>
          <Route path='/99-interactions' component={Main} />
          <Route path='*'>
            없음
          </Route> 
        </Switch>      
      </Router>  
    );
  } 
} 

ReactDOM.render(<App/>, document.getElementById('root'));
