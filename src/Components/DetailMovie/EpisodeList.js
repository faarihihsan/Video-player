import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const fetchFiles = async ({queryKey}) => {
  const [_key, id] = queryKey;
  
  const result = await window.gapi.client.drive.files.list({
      "q": `parents = '${id}'` 
  }).then(res => {
      return res;
  });

  return result;
}

const EpisodeList = (props) => {
    const {data:episodeData, status} = useQuery(['episodeData', props.id], fetchFiles);

    var movieId = null;
    var vttId = null;

    if (status === "success"){
        episodeData.result.files.forEach(item => {
            if(item.mimeType === "video/mp4" || item.mimeType === "video/x-matroska") movieId = item.id;
        else if (item.mimeType === "text/vtt") vttId = item.id;
        });
    
        return(
            <li className="list-group-item"><Link to={`/view/${movieId}/${vttId}`}>{props.name}</Link></li>
        );
    }else if (status === "error") {
        return (<p>Ada masalah</p>)
    }else {
        return(
            <p>Loading...</p>
        );
    }
}
 
export default EpisodeList;