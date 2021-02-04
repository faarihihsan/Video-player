import PlyrComponent from './PlyrComponent';

function ViewMovies({match}) {
  const movieLink = `https://www.googleapis.com/drive/v3/files/${match.params.movieId}?alt=media&key=${process.env.REACT_APP_API_KEY}&v=.mp4`;
  const subLink = `https://www.googleapis.com/drive/v3/files/${match.params.vttId}?alt=media&key=${process.env.REACT_APP_API_KEY}&v=.vtt`;
  const viewFromSource = `https://drive.google.com/file/d/${match.params.movieId}/view`
  
  const zzz = {
    type: 'video',
    sources: [
      {
        src: `https://www.googleapis.com/drive/v3/files/${match.params.movieId}?alt=media&key=${process.env.REACT_APP_API_KEY}&v=.mp4`,
        type: 'video/mp4',
        size: 720,
      }
    ],
  }

  return (
    <div>
      <PlyrComponent sources={zzz} />
      <br />
      <a href={viewFromSource} target="_blank">Watch from source</a>
    </div>
    
  );
}

export default ViewMovies;

