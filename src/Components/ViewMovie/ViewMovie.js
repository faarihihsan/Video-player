import React from 'react';
import Plyr from 'plyr';

function ViewMovies({match}) {
  const player = new Plyr("#player", {
    controls: [
        'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
    ],
    speed: {
        selected: 1,
        options: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]
    },
    keyboard: {
        focused: true,
        global: true
    },
    seekTime: 10,
    tooltips: {
        controls: true,
        seek: true
    },
    loop: { active: false }
  });

  // Expose player so it can be used from the console
  window.player = player;

  var MovieLink = `https://www.googleapis.com/drive/v3/files/${match.params.movieId}?alt=media&key=AIzaSyBdpvTT0JwPoa_6ZBU6MBYKyA2Hfja76bQ&v=.mp4`;
  var subLink = `https://www.googleapis.com/drive/v3/files/${match.params.vttId}?alt=media&key=AIzaSyBdpvTT0JwPoa_6ZBU6MBYKyA2Hfja76bQ&v=.vtt`;
  
  return (
    <div>
      <link rel="icon" href="https://cdn.plyr.io/3.6.2/plyr.svg"/>
      <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css" />
      <video ref={player} id="player" playsinline controls={player}>
          <source src={MovieLink} type='video/mp4'/>
        
          <track kind="captions" label="English captions" src={`${subLink}.vtt`} srclang="en" default />
      </video>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.js" integrity="sha256-DrT5NfxfbHvMHux31Lkhxg42LY6of8TaYyK50jnxRnM=" crossorigin="anonymous"></script>
      <script src="https://cdn.plyr.io/3.6.2/plyr.js"></script>
    </div>
    
  );
}

export default ViewMovies;
