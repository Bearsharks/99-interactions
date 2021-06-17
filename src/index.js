import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink, Link, Switch } from "react-router-dom";
import styles from './index.module.css';
import Mosaic from './Mosaic'
import PopUp from './PopUp'

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = { popUpInfo: null, todaySong: "" };
		this.popUp = this.popUp.bind(this);
		this.hide = this.hide.bind(this);
		this.setTodaySong = this.setTodaySong.bind(this);
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

	setTodaySong(msg) {
		this.setState({
			todaySong: msg
		});
	}

	render() {
		return (
			<>
				<header>

				</header>
				<div className={styles.container}>
					<main>
						<div className={styles.photoinfo}>
							<h1>오늘의 노래{' - ' + this.state.todaySong}</h1>
							<span className={styles.noti + " material-icons-outlined"}>
								<div>
									<a href="https://www.melon.com/chart/day/index.htm" target='_blank' rel="noreferrer">
										멜론 일간 차트
									</a>
									, 1위
								</div>
							</span>
						</div>
						<div className={styles.photomosaic}>
							<Mosaic popUp={this.popUp} hide={this.hide} setTodaySong={this.setTodaySong} />
						</div>
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
			</>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
