import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AV from './AV'

const fetch_post = new AV.Query('Post').equalTo('deleted',false).find();
// query.equalTo('deleted',false);
// query.find().then(function(results){
//   for(var x  of results){
//     let temp = x.attributes;
//     temp.time = x.createdAt;
//     temp.id=x.id;
//     results.push(temp);
//     console.log(temp);
//     console.log(results);
//   }
// },function(error){
//   alert(JSON.stringify(error));
// })

const save_post = ({author,text,pic,from})=>{
  var Post  = AV.Object.extend('Post');
  var post  = new Post();
  return post.save({
    "text": text,
    "author":author,
    "from":from,
    "deleted":false,
    //pictures remain to be done
  })
}
const _save_post = ({author,text,pic,from})=>{
  var Post = AV.Object.extend('Post');
  var post = new Post();
  return
  post.save({
    "text": text,
    "author":author,
    "from":from,
    "deleted":false,
    //pictures remain to be done
  }).then(function(object) {
    // alert(JSON.stringify(object));
    // console.log(object.createdAt);
    alert("post id:"+object.id+"\n was successfully created at "+object.createdAt+"!!!");
    fetch_post();
  },function(error){
    alert(JSON.stringify(error));
  })
}

const MsgTime = ({time})=>{
  let processed_time = time.toString();
  return (
    <p className="msg-time"><em>{processed_time}</em></p>
  );
}
const MsgText  = ({author,text})=>{
  return (
    <div>
      <p className="msg-text">
        {author}:  {text}
      </p>
    </div>
  );
}
const Face = ({face})=>{
  return (
    <div>{face}!!!</div>
  );
}
const Detail = ({author,time,text,from})=>{
  return (
    <div className="App-msg-container bg">
      <MsgText author={author} text={text}/>
      <MsgTime time={time}/>
    </div>
  );
}

const Card = ({id,author,face,time,text,from})=>{
  return (
    <div id={id} onClick={()=>{alert("本条微博id为:"+id)}}>
      {/* <Face className="face" face={face}/> */}
      <Detail author={author} time={time} text={text} from={from} />
    </div>
  );
}

class CardList extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      error:false,
      data:null,
    }
  }
  componentDidMount(){
    this.props.promise.then(
      data=>this.setState({loading:false,data}),
      error=>this.setState({loading:false,error}));
    }
    render(){
      if(this.state.loading){
        return (
          <span>loading....</span>
        )
      }else if (this.state.error){
        return (
          <span>error!!</span>
        )
      }else{
        let list = this.state.data;
        list = list.map( (single_post,index)=>{
          let temp = single_post.attributes;
          temp.time = single_post.createdAt;
          temp.id = single_post.id;
          temp.key = index;
          temp.face = null;
          return (
            <Card id={temp.id} text={temp.text} author={temp.author} key={index} from={temp.from} time={temp.time}/>
          )
        })
        return (
          <div>{list.reverse()}</div>
        );
      }
    }
  }

  class App extends Component {
    constructor(props){
      super(props);
      let random_name = ()=>{
        let name = "";
        for(var i = 0;i<10;i++){
          let num = Math.random()*100;
          name+= String.fromCharCode(num%26+(num>50?'A':'a').charCodeAt(0));
        }
        return name;
      }
      this.state = {
        author:random_name(),
        text:"",
      }
    }
    handleQuery(){
      // CardList.forceUpdate(()=>{})
    }
    handlePost(){
      return ()=>{
        let obj = {
          "author":this.state.author,
          "from":"PC",
          "text":this.state.text,
          "deleted":false,
        }
        console.log(obj);
        let promise = save_post(obj).then((results)=>{
          alert("success!!!");
          this.setState({text:""});
        },(error)=>{
          alert("error!!");
        });
      }
    }
    handleChange(where){
      return (e)=>{
        let obj = {};
        obj[where] = e.target.value;
        this.setState(obj);
      }
    }
    render() {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>React Weibo</h2>
          </div>
        <div className="App-content">
          <div>
            author
            <input type="text" id="author" onChange={this.handleChange("author")} value={this.state.author}></input>
            <br/>
            text
            <textarea value={this.state.text} onChange={this.handleChange("text")}></textarea>
            <br/>
            <button type="button" name="button"  onClick={this.handlePost()}>POST!</button>
            <button type="button" name="button"  onClick={this.handleQuery()}>Query!</button>
          </div>
          <CardList promise={fetch_post}/>
        </div>
      </div>
    );
  }

}

export default App;
