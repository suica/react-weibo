import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AV from './AV'

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
    }
    render(){
        return (
            <div>
                {this.props.list}
            </div>
        )
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
            post_list:[],

            loading:true,
        }
    }
    componentDidMount(){
        // this.handleQuery()();
        this.testfetch();
    }
    handleQuery(){
        return () => {
            this.setState({
                loading: true,
            });
            let fetch_post = new AV.Query('Post').equalTo('deleted',false).find().then((response) => {
                //console.log(response)
                let list = response;
                list = list.map( (single_post,index)=>{
                    let temp = single_post.attributes;
                    temp.time = single_post.createdAt;
                    temp.id = single_post.id;
                    temp.key = index;
                    temp.face = null;
                    return (
                        <Card {...temp} />
                    )
                })
                this.setState({
                    loading:false,
                    post_list: list.reverse(),
                });
            },
            (error) => {
                alert(JSON.stringify(error));
            })
        }
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
                this.setState({text:""});
                this.handleQuery()();
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

    testfetch(){
        let serialize = object=>{
            return Object.keys(object).map(item=>{
                return item+"="+object[item];
            }).join('&');
        }

        var formData = new FormData(); // 当前为空
        formData.append('id','8');
        let sampleobject = {
            id:8
        }
        // var option = {
        //     method:"GET"
        // }
        let url = 'http://www.swjtukc.cn/api/v1/article/view?';

        fetch(url+serialize(sampleobject))
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
        })
        .catch(e => {
            console.log("Error")
        })
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
                        <span hidden={!this.state.loading}>loading!!!</span>
                    </div>
                    <CardList  list={this.state.post_list} />
                </div>
            </div>
        );
    }

}

export default App;
