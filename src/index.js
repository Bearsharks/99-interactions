import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router ,Route, NavLink,Switch } from "react-router-dom";
import styles from './index.module.css';
import Paper from './PaperDribble';
import Game from './tictactoe'
import Home from './Home'


class Main extends React.Component{
  constructor(props) {
    super(props); // React.Component의 생성자 메소드를 먼저 실행
    this.state = { // 이 컴포넌트의 state 설정
      test: 0 // number의 초기 값 설정
    };
  };
  componentDidMount() {
    fetch("https:/google.com")
      .then((result) => {
        debugger;
        result.text().then((text)=>{
            this.setState({
              test: text
            });
          });
        },
        // 주의: 컴포넌트의 실제 버그에서 발생하는 예외사항들을 넘기지 않도록 
        // 에러를 catch() 블록(block)에서 처리하기보다는 
        // 이 부분에서 처리하는 것이 중요합니다.
        (error) => {
          debugger;
          this.setState({
            test: false
          });
        }
      )
  }
  render(){
    return (  
      <div className={styles.container}>
        <h1>
          <span>=</span>
          <NavLink to={`${this.props.match.url}/home` } activeClassName={styles.linkActive}>Home</NavLink>     
          <NavLink to={`${this.props.match.url}/Tags` } activeClassName={styles.linkActive}>Tags</NavLink>     
          <NavLink to={`${this.props.match.url}/PaperDribble` } activeClassName={styles.linkActive}>About</NavLink>     
          <NavLink to={`${this.props.match.url}/contact` } activeClassName={styles.linkActive}>Contact</NavLink>     
          <span>search bar 돋보기</span>
          <span>user</span>
        </h1>
        <div>
          {this.state.test}
        </div>
        <Switch>
          <Route path={`${this.props.match.url}/home`}>
              <Home/>
          </Route>
          <Route path={`${this.props.match.url}/about`}>
            <Game/>
          </Route>
          <Route path={`${this.props.match.url}/PaperDribble`}>
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
