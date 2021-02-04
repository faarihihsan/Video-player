import { Redirect } from 'react-router-dom';
import SeasonList from './SeasonList';
import { useQuery } from 'react-query';

const fetchFiles = async ({queryKey}) => {
  const [_key, id] = queryKey;
  
  const result = await window.gapi.client.drive.files.list({
      "q": `parents = '${id}'` 
  }).then(res => {
      return res;
  });

  return result;
}

const DetailMovie = ({match}) => {
    const {data:parentMovieData, status} = useQuery(['parentMovieData', match.params.id], fetchFiles);
    
    if (status === "success"){
        const movieDetailFolder = parentMovieData.result.files;
        if(movieDetailFolder[0].mimeType === "application/vnd.google-apps.folder"){
            movieDetailFolder.sort(function(a,b) {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                return 0;
            });
            return (
                    <ul className="list-group list-group-flush">
                        {movieDetailFolder.map( (value, i) =>
                            <SeasonList key={value.id} id={value.id} name={value.name}/>
                        )}
                    </ul>
            );
        }else {
            var movieId = null;
            var vttId = null;
    
            movieDetailFolder.forEach(item => {
                if(item.mimeType === "video/mp4" || item.mimeType === "video/x-matroska") movieId = item.id;
            else if (item.mimeType === "text/vtt") vttId = item.id;
            });
    
            const url = `/view/${movieId}/${vttId}`
            return <Redirect to={url} />
        }
    }else if (status === "error") {
        return (<p>Ada masalah</p>)
    }else {
        return(
            <p>Loading...</p>
        );
    }
}
 
export default DetailMovie;