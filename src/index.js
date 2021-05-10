import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router ,Route, NavLink,Switch } from "react-router-dom";
import styles from './index.module.css';
import Mosaic from './Mosaic'
import PopUp from './PopUp'

class Main extends React.Component{
  constructor(props) {
    super(props);
    this.state = {popUpInfo: null};
    this.popUp = this.popUp.bind(this);
    this.hide = this.hide.bind(this);
  }
  popUp(popUpInfo){
    if(popUpInfo === null){
      this.hide();
    }else{
      this.setState({
        popUpInfo: popUpInfo
      });
    }  
  }

  hide(){
    this.setState({
      popUpInfo: null
    });
  }

  render(){
    return (  
      <>
        <header>
          <h1>오늘의 사진은...</h1>
        </header>
        <div className={styles.container}>
          
          <main>
            <Mosaic popUp = {this.popUp} hide = {this.hide}/>     
          </main>          
          <PopUp imageInfo={this.state.popUpInfo}  hide={this.hide}></PopUp>
        </div>
         
      </>
    );
  }
}

class App extends React.Component {
  render(){
    return (  
      <>
        <Router>              
          <Switch>
            <Route path='/99-interactions' component={Main} />
            <Route path='*'>
              없음
            </Route> 
          </Switch>      
        </Router>  
        <footer>
            <p>contact : iginganza@gmail.com</p>
        </footer> 
      </>      
    );
  } 
} 

ReactDOM.render(<App/>, document.getElementById('root'));
