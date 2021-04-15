import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Home.module.css';

class Card extends React.Component{
    render(){
      return (  
        <div className={styles.card}>
        </div>
      );
    }
  }

class Home extends React.Component{
    render(){
      return (  
            <div className={styles.container} >
                <Card/>
                <Card/>
                <Card/>
                <Card/>
            </div>
      );
    }
  }

  export default Home;