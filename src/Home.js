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
      let onClickHandler = ()=>{
        fetch("http://localhost:4000/images", {
          method: 'POST',
        }).then(res => res.json())
        .then(json => console.log(json));
       }
      return (  
            <div onClick={onClickHandler} className={styles.container} >
                <Card />
            </div>
      );
    }
  }

  export default Home;