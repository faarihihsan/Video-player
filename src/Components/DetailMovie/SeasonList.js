import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import EpisodeList from './EpisodeList';

const fetchFiles = async ({queryKey}) => {
  const [_key, id] = queryKey;
  
  const result = await window.gapi.client.drive.files.list({
      "q": `parents = '${id}'` 
  }).then(res => {
      return res;
  });

  return result;
}

const SeasonList = (props) => {
    const {data:childMovieData, status} = useQuery(['childMovieData', props.id], fetchFiles);
    
    if (status === "success" && childMovieData.result.files.length > 0){
        const seasonFileList = childMovieData.result.files;
        if(seasonFileList[0].mimeType === "application/vnd.google-apps.folder"){
            seasonFileList.sort(function(a,b) {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                return 0;
            });
            return (
                <div>
                    <h3 className="text-center">{props.name}</h3>
                    <ul className="list-group list-group-flush">
                        {seasonFileList.map( (value, i) =>
                            <EpisodeList id={value.id} key={value.id} name={value.name} />
                        )}
                    </ul>
                </div>
            );
        }else {
            var movieId = null;
            var vttId = null;
    
            seasonFileList.forEach(item => {
                if(item.mimeType === "video/mp4" || item.mimeType === "video/x-matroska") movieId = item.id;
            else if (item.mimeType === "text/vtt") vttId = item.id;
            });

            return(
                <li className="list-group-item"><Link to={`/view/${movieId}/${vttId}`}>{props.name}</Link></li>
            );
        }
    }else if (status === "error") {
        return (<p>Ada masalah</p>)
    }else {
        return(
            <div>
                <p>Loading...</p>
            </div>
        );
    }
}
 
export default SeasonList;