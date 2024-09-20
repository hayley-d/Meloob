import React from 'react'
import { NavLink } from 'react-router-dom';
import dataManager from "../utils/dataManager";

 export class NavBar extends React.Component{
     constructor(props) {
         super(props);
         this.state = {
             user: null,
             isLoading: true,
         };
         this.getUser = this.getUser.bind(this);
     }

     async getUser() {
         try {
             const userEmail = JSON.parse(sessionStorage.getItem("user"));
             console.log("Email",userEmail);
             if (userEmail) {
                 const user = await dataManager.getUserByEmail(userEmail);
                 this.setState({ user, isLoading: false });
             } else {
                 this.setState({ isLoading: false });
             }
         } catch (error) {
             console.error("Error fetching user:", error);
             this.setState({ isLoading: false });
         }
     }

     async componentDidMount() {
         if(this.props.location !== 'splash'){
             await this.getUser();
             const userEmail = JSON.parse(sessionStorage.getItem("user"));
             //console.log("Email",userEmail);
             //console.log("Home page");
         } else{
             //console.log("Splash page");
         }

     }

     render(){
         const { location } = this.props;
         const { user, isLoading } = this.state
         //console.log("User",this.state.user);
      return(
          <nav className="navigation navbar container-fluid ">
              <div className="container-fluid navdiv">
                  <div id="logo"></div>
                  {location === 'splash' ? (
                      <NavLink className="navlink" to='/login'>Login</NavLink> // Show login link on home page
                  ) : (
                      <>
                          <NavLink className="navlink" to='/home'>Home</NavLink>
                          <NavLink className="navlink" to='/browse'>Browse</NavLink>
                          {user ? (
                              <NavLink className="navlink" to={`/profile/${user.id}`}>
                                  <div id="profileImg"  style={{ backgroundImage: `url(${this.state.user.profile_picture})` }}></div>
                              </NavLink>
                          ) : null}

                      </>
                  )}
              </div>
          </nav>
      );
  }
}



