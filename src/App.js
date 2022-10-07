import logo from './logo.svg';
import './App.css';
import { loginRequest } from "./authConfig";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useMsalAuthentication, useIsAuthenticated } from "@azure/msal-react";
import { InteractionType, InteractionRequiredAuthError } from '@azure/msal-browser';
import React, { useState, useEffect } from "react"



const App = (props) => {


  const { login, error } = useMsalAuthentication(InteractionType.Silent, loginRequest);
  let token = null

  //Login Data
  useEffect(() => {
    if (error instanceof InteractionRequiredAuthError) {

      login(InteractionType.Redirect, loginRequest)
    }
  }, [error]);

  const isAuthenticated = useIsAuthenticated()
  const { accounts, instance } = useMsal();


  //this should be in the axios instance
  if (isAuthenticated) {

    //Get Access token, do this when you want to get a token
    const tokenRequest = {
      account: accounts[0], // This is an example - Select account based on your app's requirements
      scopes: ["User.Read"]
    }

    // Acquire an access token
    instance.acquireTokenSilent(tokenRequest).then((response) => {
      // Call your API with the access token and return the data you need to save in state
      console.log('accessToken', response.accessToken)
      // callApi(response.accessToken).then((data) => {
      //   setApiData(data);
      //   setLoading(false);
      // });

    }).catch(async (e) => {
      // Catch interaction_required errors and call interactive method to resolve
      if (e instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(tokenRequest);
      }
      throw e;
    });

  }


  console.log('accounts', accounts)

  console.log('instance', instance)


  return (
    <>
      <AuthenticatedTemplate>
        {isAuthenticated
          ?
          <div>
            <h1>Hi {accounts[0].name}</h1>
          </div>
          :
          <div>Authenticating</div>
        }
        {/* <div>Hi {accounts[0].name}</div> */}
      </AuthenticatedTemplate>
    </>
  )
}

export default App;
