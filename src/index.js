import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter,Route, Link,Switch } from "react-router-dom";
import './index.css';
import Game from './tictactoe'


// ========================================
class Clock extends React.Component{
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }
  render(){
    return (  
      <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
    );
  } 
}
class Home extends React.Component{
  render(){
    return (  
      <Fragment>
        <h1 className="greeting">
          <Clock date={new Date()} />
          Hello, world!
        </h1>
          <Game />
        <h1>
          this will be footer
        </h1>
      </Fragment>
    );
  }
}

class Test extends React.Component{
  render(){
    return (  
      
        <div>
          testsetsetse
        </div>
    );
  }
}
class App extends React.Component {
  render(){
    return (  
      <BrowserRouter>  
        <Link to="/99-interactions">홈</Link><br/>
        <Link to="/99-interactions/test">테스트</Link><br/>
        <Switch>               
          <Route exact path="/99-interactions" component={Home}/>   
          <Route path="/99-interactions/test" component={Test}/>
        </Switch>        
    </BrowserRouter>  
    );
  } 
} 

ReactDOM.render(<App/>, document.getElementById('root'));
