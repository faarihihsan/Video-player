import React from 'react';
import { Link } from 'react-router-dom';
function Navbar({isSignedIn, signInFunction, signOutFunction}) {
  // console.log(isSignedIn);
  if (isSignedIn){
    return (
      <div>
          <nav className="navbar navbar-light bg-light px-3">
            <Link className="navbar-brand" to={'/'}>
              Video
            </Link>
            <button className="btn btn-primary mr-3" onClick={signOutFunction}>Sign Out</button>
          </nav>
      </div>
    );
  } else {
    return(
      <div>
          <nav className="navbar navbar-light bg-light px-3">
            <Link className="navbar-brand" to={'/'}>
              Video
            </Link>
            <button className="btn btn-primary mr-3" onClick={signInFunction}>Sign In</button>
          </nav>
      </div>
    )
  }
}

export default Navbar;
