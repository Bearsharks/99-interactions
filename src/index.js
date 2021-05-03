import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router ,Route, NavLink,Switch } from "react-router-dom";
import styles from './index.module.css';
import Paper from './PaperDribble';
import Game from './tictactoe'
import Home from './Home'
import Mosaic from './Mosaic'


class Main extends React.Component{
  render(){
    return (  
      <div className={styles.container}>
        <h1>
          <NavLink to={`/99-interactions/home` } activeClassName={styles.linkActive}>Home</NavLink>     
          <NavLink to={`/99-interactions/Tags` } activeClassName={styles.linkActive}>Tags</NavLink>     
          <NavLink to={`/99-interactions/paperDribble` } activeClassName={styles.linkActive}>About</NavLink>     
          <NavLink to={`/99-interactions/contact` } activeClassName={styles.linkActive}>Contact</NavLink>  
          <NavLink to={`/99-interactions/test` } activeClassName={styles.linkActive}>test</NavLink>   
          <span>user</span>
        </h1>
        <Switch>
          <Route path={`/99-interactions/home`}>
              <Home/>
          </Route>
          <Route path={`/99-interactions/about`}>
            <Game/>
          </Route>
          <Route path={`/99-interactions/paperDribble`}>
            <Paper coeff_friction={0.6} size={50}/>
          </Route>
          <Route path={`/99-interactions/test`}>
            <Mosaic src={`/99-interactions/images/dessert.jpg`}/>
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
