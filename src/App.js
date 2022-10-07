import logo from './logo.svg';
import './App.css';
import { loginRequest, graphConfig } from "./authConfig";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useMsalAuthentication, useIsAuthenticated } from "@azure/msal-react";
import { InteractionType, InteractionRequiredAuthError } from '@azure/msal-browser';
import React, { useState, useEffect } from "react"
import Axios from 'axios';


const App = (props) => {


  const { login, error } = useMsalAuthentication(InteractionType.Silent, loginRequest);
  const { accounts, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated()
  const [token, setToken] = useState(null);
  const [graphData, setGraphData] = useState(null);


  //Login Data
  useEffect(() => {

    //If the session is expired, redirect to login page
    if (error instanceof InteractionRequiredAuthError) {

      login(InteractionType.Redirect, loginRequest)

    } else {

      //If the session is alive, getAccesToken
      console.log('User is Authenticated')
      getAccessToken()

    }
  }, [error]);


  function getAccessToken() {

    //Get Access token, do this when you want to get a token
    const tokenRequest = {
      account: accounts[0], // This is an example - Select account based on your app's requirements
      scopes: ["User.Read"]
    }
    // Acquire an access token
    instance.acquireTokenSilent(tokenRequest).then((response) => {
      // Call your API with the access token and return the data you need to save in state
      setToken(response.accessToken)

      console.log('got token')

      //Get User Details
      callMsGraph(response.accessToken)

    }).catch(async (e) => {
      // Catch interaction_required errors and call interactive method to resolve
      if (e instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(tokenRequest);
      }
      throw e;
    });
  }

  //Get user Details
  function callMsGraph(accessToken) {

    const headers = {};

    const bearer = `Bearer ${accessToken}`;

    headers.Authorization = bearer;

    const options = {
      url: graphConfig.graphMeEndpoint,
      method: "GET",
      headers: headers
    };

    const result = Axios(options).then(
      (response) => {
        setGraphData(response.data)
      }
    ).catch(
      (err) => { console.log('err', err) }
    )

  }


  return (
    <>
      <AuthenticatedTemplate>
        {isAuthenticated
          ?
          <div>
            <h1>Hi {accounts[0].name}</h1>
            <h1>Your Token</h1>
            <div>{token}</div>
            {graphData ?
              <div id="profile-div">
                <p><strong>First Name: </strong> {graphData.givenName}</p>
                <p><strong>Last Name: </strong> {graphData.surname}</p>
                <p><strong>Email: </strong> {graphData.userPrincipalName}</p>
                <p><strong>Id: </strong> {graphData.id}</p>
                <p><strong>Wwid: </strong> {graphData.jobTitle}</p>
              </div>
              :
              <div>Getting graphData</div>
            }
          </div>
          :
          <div>Authenticating</div>
        }
      </AuthenticatedTemplate>
    </>
  )
}

export default App;
