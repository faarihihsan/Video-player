import React, { Component} from 'react';
import { Link } from 'react-router-dom';

class DetailMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSingleMovie : true,
      isFetchDataDone : false
    }
  }

  componentDidMount(){
      this.getDetailMovie();
  }

  getDetailMovie = async () => {
    var hasilDetailMovie = [];
    await window.gapi.client.drive.files.list({
        "orderBy": "name",
        "q": `parents = "${this.props.match.params.id}"`
    }).then(function(response) {
        hasilDetailMovie = response;
    });

    var movieDetailFolder = hasilDetailMovie.result.files;

    if (movieDetailFolder[0].mimeType === "application/vnd.google-apps.folder") this.getMultipleMovie(movieDetailFolder);
    else this.getSingleMovie(movieDetailFolder);
  }

  async getMultipleMovie(fileList){
    var daftarMovie = [];
    for (var i in fileList) {
        var iter = fileList[i];
        var hasilDetailMovie = [];
        await window.gapi.client.drive.files.list({
            "orderBy": "name",
            "q": `parents = '${iter.id}'`
        }).then(function(response) {
            hasilDetailMovie = response;
        });

        var movieDetailFolder = hasilDetailMovie.result.files;
        var movie = '';
        var title = '';
        
        if (movieDetailFolder[0].mimeType === "application/vnd.google-apps.folder"){
            var episodeList = [];
            for (var j in movieDetailFolder){
                var respon = '';
                await window.gapi.client.drive.files.list({
                    "orderBy": "name",
                    "q": `parents = '${movieDetailFolder[j].id}'`
                }).then(function(response) {
                    respon = response.result.files;
                });
                for (var k in respon){
                    var vtt = null;
                    title = respon[k].name;
                    if(respon[k].mimeType === "video/mp4" || respon[k].mimeType === "video/x-matroska") movie = respon[k].id;
                    else if (respon[k].mimeType === "text/vtt") vtt = respon[k].id;
                }
                episodeList.push({
                    'movie':movie,
                    'title':title,
                    'vtt': vtt
                });
            }
            daftarMovie.push({
                'season': iter.name,
                'movie': episodeList
            });
            this.setState({
                isSingleMovie: false,
                isAnySeason: true,
                movieList : daftarMovie,
                isFetchDataDone: true
            });
        }else{
            for (var j in movieDetailFolder){
                var vtt = null;
                if(movieDetailFolder[j].mimeType === "video/mp4" || movieDetailFolder[j].mimeType === "video/x-matroska") movie = movieDetailFolder[j].id;
                else if (movieDetailFolder[j].mimeType === "text/vtt") vtt = movieDetailFolder[j].id;
                daftarMovie.push({
                    'movie':movie,
                    'title':iter.name,
                    'vtt': vtt
                });
            }
            this.setState({
                isSingleMovie: false,
                isAnySeason: false,
                movieList : daftarMovie,
                isFetchDataDone: true
            });
        }        
    }
  }

  getSingleMovie(movieDetailFolder) {
      console.log(movieDetailFolder);
    for (var j in movieDetailFolder){
        if(movieDetailFolder[j].mimeType === "video/mp4" || movieDetailFolder[j].mimeType === "video/x-matroska") 
            this.setState({
                movie : movieDetailFolder[j].name,
                movieLink : movieDetailFolder[j].id
            });
        else if (movieDetailFolder[j].mimeType === "application/octet-stream") 
            this.setState({
                vtt : movieDetailFolder[j].id
            });
    }
    this.setState({
        isSingleMovie: true,
        isFetchDataDone: true
    });
  }

  getListMovie(listMovies){
    return(
        <ul className="list-group list-group-flush">
            {listMovies.map((value) => {
                return <li className="list-group-item"><Link to={`/view/${value.movie}/${value.vtt}`}>{value.title}</Link></li>
            })}
        </ul>
    );
  }

  render(){
    const renderDetailListMovie = () => {
        if (this.state.isSingleMovie && this.state.isFetchDataDone){
            console.log(this.state.vtt);
            return(
                <div>
                    <h3>{this.state.movie}</h3>
                    <h5><Link to={`/view/${this.state.movieLink}/${this.state.vtt}`}>Watch</Link></h5>
                </div>
            );
        }else if (!this.state.isSingleMovie && this.state.isFetchDataDone && this.state.isAnySeason){
            var list = this.state.movieList;
            return(
                <div>
                    {list.map((value) => {
                        return(
                            <span>
                                <h3 className="mt-5">{value.season}</h3>
                                {this.getListMovie(value.movie)}
                            </span>
                        );
                    })}
                </div>
            );
        } else if (!this.state.isSingleMovie && this.state.isFetchDataDone && !this.state.isAnySeason){
            return(this.getListMovie(this.state.movieList));
        }
        else return("Loading");
      } 

    return (
      <div className="container">
        {renderDetailListMovie()}
      </div>
    );
  }
}

export default DetailMovie;