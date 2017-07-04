import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const Msg = ({text,time})=>{
      return (
        <div className="App-msg-container bg">
          <MsgText text={text}/>
          <MsgTime time={time}/>
        </div>
      );
    }
    const MsgTime = ({time})=>{
      return (
        <p className="msg-time"><em>{time}</em></p>
      );
    }
    const MsgText  = ({text})=>{
      return (
        <div>
          <p className="msg-text">
            {text}
          </p>
        </div>
      );
    }
    const MsgList = ({test_text})=>{
      let con = [];
      for(var i in test_text){
        con.push((<Msg text={test_text[i]} key={i} time={Date()}/>));
      }
      return (
        <div>{con}</div>
      )
    }
    const Face = ({face})=>{
      return (
        <div>{face}!!!</div>
      );
    }
    const Detail = ({name,time,text,from})=>{
      return (
        <Msg text={text} time={time} />
      );
    }
    const Card = ({name,face,time,text,from})=>{
      return (
        <div>
          {/* <Face className="face" face={face}/> */}
          <Detail name={name} time={time} text={text} from={from} />
        </div>
      );
    }
    const CardList = ()=>{
      let con = [];
      for(var i = 0;i<10;i++)
      con.push(
        (
          <Card name="suicca" text="wowowjwjs" time={Date()} from="pc" face={null} key={i} />
        )
      )
      return (
        <div>{con}</div>
      );
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Weibo</h2>
        </div>
        {/* <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p> */}
      <div className="App-content">
        {/* <p>Here put the msgs</p> */}
        <CardList />
        {/* <MsgList test_text="这是一段测试的话"/> */}

      </div>
    </div>
  );
}

}

export default App;
