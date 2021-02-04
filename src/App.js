import './App.css';
import React, {Component} from 'react';
import Navbar from './Components/Navbar/Navbar';
import ListMovies from './Components/ListMovies/ListMovies';
import ViewMovie from './Components/ViewMovie/ViewMovie';
import DetailMovie from './Components/DetailMovie/DetailMovie';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      googleAuth: '',
      isSignedIn: false
    }
  }
  componentDidMount(){
    var script = document.createElement('script');
    script.onload=this.handleClientLoad;
    script.src="https://apis.google.com/js/api.js";
    document.body.appendChild(script);
  }

  handleClientLoad = ()=>{
    window.gapi.load('client:auth2', this.initClient);
  }

  initClient = () => {
    try{
      window.gapi.client.init({
        'apiKey': process.env.REACT_APP_API_KEY,
        'clientId': process.env.REACT_APP_CLIENT_ID,
        'scope': 'https://www.googleapis.com/auth/drive',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
      }).then(() => {
        this.setState({
          googleAuth: window.gapi.auth2.getAuthInstance()
        })
        this.updateSigninStatus();
      });
    }catch(e){
      console.log(e);
    }
  }

  updateSigninStatus = ()=> {
    this.setSigninStatus();
  }

  setSigninStatus= async ()=>{
    var user = this.state.googleAuth.currentUser.get();
    if (!user.isSignedIn()){
      this.setState({
        name: '',
        isSignedIn : false
      });
    }
    else{
      var isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/drive');
      if(isAuthorized){
        this.setState({
          name: user.getBasicProfile().getName(),
          isSignedIn: true
        });
      }
    }
  }

  signInFunction =()=>{
    this.state.googleAuth.signIn();
    this.updateSigninStatus();
  }

  signOutFunction =()=>{
    this.state.googleAuth.signOut();
  }

  componentDidUpdate() {
    this.state.googleAuth.isSignedIn.listen(this.updateSigninStatus);
  }

  
  render() {
    const isSignedIn = this.state.isSignedIn;
    return(
      <div className="App">
        <Router>
          <Navbar 
            isSignedIn={isSignedIn} 
            signInFunction={this.signInFunction} 
            signOutFunction={this.signOutFunction}
          />
          { isSignedIn && (
            <Switch>
              <Route path='/' exact><ListMovies/></Route>
              <Route path='/detail/:id' exact render={(props) => <DetailMovie {...props} gapi={this.state.gapi} />}  />
              <Route path='/view/:movieId/:vttId' exact component={ViewMovie} />
            </Switch>
          ) }
        </Router>
      </div>
    );
  }
}

export default App;
