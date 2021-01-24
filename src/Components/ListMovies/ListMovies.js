import React, { Component} from 'react';
import { Link } from 'react-router-dom';

class ListMovies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies : '',
    }
  }
  
  render(){
    const renderListMovies = () =>  {
      var daftarMovie = this.props.fileList;
      if (daftarMovie.length > 0 )
      return daftarMovie.map((item) => (
        <li className="list-group-item"><Link to={`/detail/${item.id}`}>{item.name}</Link></li>
      ));
      else return null;
    }

    return (
      <div className="container">
        <h2>Daftar Film</h2>
        <ul className="list-group list-group-flush">
          { renderListMovies() }
        </ul>
      </div>
    );
  }
}

export default ListMovies;