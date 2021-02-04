import { Link } from 'react-router-dom';
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

const ListMovies = () => {
  const {data:parentData, status} = useQuery(['parentData', '1ZELrsj2Xa5IkCzs4J8RvU06AhfiwiZhi'], fetchFiles);

  if(status === "success"){
    parentData.result.files.sort(function(a,b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
        });
  }

  return ( 
    <div>
      { status === 'error' && (
            <div>Error fetching data</div>
        )}

        { status === 'loading' && (
            <div>Loading data...</div>
        )}

        { status === 'success' && (
            <div>
                { parentData.result.files.map(item => <li className="list-group-item"><Link to={`/detail/${item.id}`}>{item.name}</Link></li>) }
            </div>
        )}
    </div>
   );
}
 
export default ListMovies;