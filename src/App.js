import React from 'react';
import './App.css';


var myHeaders = new Headers();
myHeaders.append("accept", "application/vnd.api+json");
myHeaders.append("Authorization", "Bearer "+process.env.REACT_APP_NOT_SECRET_CODE);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

var apiData=[];

function App() {
  return (
    <div>
      <LogoComp/>
      <PlayerSearch/>
    </div>
  );
}

class LogoComp extends React.Component {
    render() {
      return (
        <div>
          <img className="center" src="logo.png" alt="PUBG PC Player Stats"></img>
        </div>
      );
    }

};

class PlayerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      statusCode:'',
      playerData: [],
      isDisplay: false,
      isLoading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      input: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault()
  fetch("https://api.pubg.com/shards/steam/players?filter[playerNames]="+this.state.input, requestOptions)
  .then((response) => {
    this.setState({
        statusCode: response.status,
        isLoading: true
    });
    console.log(response.status);
   return response.json();
  })
  .then((result) => {
    console.log(result);
    apiData = this.state.playerData.concat(this.state.input,result.data[0].id);
         this.setState({
       playerData: apiData,
    //   isDisplay: !this.state.isDisplay
     });
     console.log(this.state.playerData);
    //var playerId=result.data[0].id;
    return fetch('https://api.pubg.com/shards/steam/seasons/lifetime/gameMode/squad/players?filter[playerIds]='+this.state.playerData[1],requestOptions);
  
  }).then((response) => {
    return response.json();
  }).then((data) => {
    apiData = this.state.playerData.concat(data.data[0].attributes.gameModeStats.squad.kills,data.data[0].attributes.gameModeStats.squad.damageDealt,data.data[0].attributes.gameModeStats.squad.headshotKills,data.data[0].attributes.gameModeStats.squad.longestKill,data.data[0].attributes.gameModeStats.squad.vehicleDestroys);
    /*apiData =this.state.playerData.concat(data.data[(data.data.length)-1].id); */
    this.setState({
      playerData: [],
      isLoading: !this.state.isLoading,
      isDisplay: !this.state.isDisplay
    });
    //console.log(this.state.playerData);
  })
  .catch(error => console.log('error', error));}
  
  componentDidMount() {
      
  }

  componentDidUpdate() {

  }

  render(){

    return(
      <div>
        <form onSubmit={this.handleSubmit} className="searchform cf">
  <input type="text" onChange={this.handleChange} value={this.state.input} placeholder="Enter player name to check stats"/>
  <button type="submit">Search</button>
      </form>
      { 
      this.state.isDisplay && this.state.statusCode===200 
      ? <SearchResults stats={apiData}/>
      : this.state.isLoading && this.state.statusCode===200
    ? <LoadingAPI/> 
    :this.state.isDisplay || this.state.statusCode===404
    ? <NotFound/> :<div/>}
      </div>
      
    );
  }
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStats: props.stats
    }
  }
  render() {
    return (
      <div className="content">
  <div className="mainInfo">
    <h1>{this.props.stats[0]}</h1>
    <span>Steam-PC</span>
    <div className="aboutMe">
      <h3>About</h3>
      The following attributes are the LIFETIME stats of the player from the PC-Steam version of PlayerUnknown's Battle Grounds.These stas are being fetched from PUBG's developer API. No data is saved on the server. All rights reserved to PUBG and it's products. More data will be avaialble as I am maintaning it..
    </div>
  </div>
      <div className="clearfix"></div>
  <div className="col">
    <div className="colHead" style={{marginTop: "10px", color: "#FDB45C"}}>Stats</div>
    <ul style={{marginTop: "30px"}} className="playerStats">
      <li><span>Total Kills:</span>{this.props.stats[2]}</li>
      <li><span>Damage Dealt:</span>{this.props.stats[3]}</li>
      <li><span>Headshot Kills:</span>{this.props.stats[4]}</li>
      <li><span>Longest Kill:</span>{this.props.stats[5]}m</li>
      <li><span>Vehicles Destroyed:</span>{this.props.stats[6]}</li>
    </ul>
  </div>
</div>

    );
  }
}

function LoadingAPI(props) {

  return(
  <div style={{ marginTop: "150px"}} className="loaded">
    <div className="LoaderBalls">
      <div className="LoaderBalls__item" />
      <div className="LoaderBalls__item" />
      <div className="LoaderBalls__item" />
    </div>
  </div>  
  );

}

function NotFound(props) {

return(
      //<h5 style={{marginLeft:"600px", marginTop: "250px"}}>Player Not Found</h5>
      <div style={{ marginTop: "150px"}} className="empty-icon-container">
  <div className="animation-container">
    <div className="bounce" />
    <div className="pebble1" />
    <div className="pebble2" />
    <div className="pebble3" />
  </div>
  <div>
    <h2>0 results found</h2>
    <p>Sorry! We couldn't find any players corresponding to that username in PUBG-PC version.</p>
  </div>
</div>
);

}



export default App;
