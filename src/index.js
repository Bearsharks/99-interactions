import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink, Link, Switch } from "react-router-dom";
import styles from './index.module.css';
import Mosaic from './Mosaic'
import PopUp from './PopUp'

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = { popUpInfo: null, todayPersonMessage: "" };
		this.popUp = this.popUp.bind(this);
		this.hide = this.hide.bind(this);
		this.setTodayPersonMsg = this.setTodayPersonMsg.bind(this);
	}
	popUp(popUpInfo) {
		if (popUpInfo === null) {
			this.hide();
		} else {
			this.setState({
				popUpInfo: popUpInfo
			});
		}
	}

	hide() {
		this.setState({
			popUpInfo: null
		});
	}

	setTodayPersonMsg(msg) {
		this.setState({
			todayPersonMessage: msg
		});
	}

	render() {
		return (
			<>
				<header>
					<h1>오늘의 인물은... {this.state.todayPersonMessage}</h1>
					<span className={styles.noti + " material-icons-outlined"}>
						<div><a href="https://www.bigkinds.or.kr/" target='_blank' rel="noreferrer">빅카인즈(Big kinds)</a> 오늘의 키워드의 인물 중 오늘자 뉴스에서 가장 많이 언급된 인물입니다.</div>
					</span>
				</header>
				<div className={styles.container}>

					<main>
						<Mosaic popUp={this.popUp} hide={this.hide} setTodayPersonMsg={this.setTodayPersonMsg} />
					</main>
					<PopUp imageInfo={this.state.popUpInfo} hide={this.hide}></PopUp>
				</div>

			</>
		);
	}
}

class App extends React.Component {
	render() {
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
					<p>
						contact : <a href="mailto: iginganza@gmail.com" title="iginganza@gmail.com">iginganza@gmail.com</a>
					</p>
				</footer>
			</>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
