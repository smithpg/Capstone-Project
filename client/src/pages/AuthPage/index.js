import React from "react";
import styled from "styled-components";

import { Route, Link, Switch } from "react-router-dom";

const PageContainer = styled.div`
  width: 50%
  margin: 0 auto
`;

const SignInContainer = styled.div`
  margin: 16px
  border: solid 1px
  border-radius: 8px
  border-color: LightGray
  text-align: center
  width: 100%
`;

const GoogleButtonContainer = styled.div`
  margin: 0 auto
  height: 36px
  width: 120px
  margin-bottom: 16px
`;

function AuthPage(props) {
  return (
    <PageContainer>
      <SignInContainer className="pageContainer">
        <h1>Welcome to Perro Project</h1>
        <a href="/auth/google">
          <button>Authenticate</button>
        </a>
      </SignInContainer>
    </PageContainer>
    
  );
}

function onSignIn(googleUser) {

  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

}

export default AuthPage;
