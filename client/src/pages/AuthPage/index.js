import React from "react";
import styled from "styled-components";

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

const Button = styled.button`
  border: solid 1px
  border-color: black
  border-radius: 4px
  color: black
  background-color: LightGray
  margin: 8px
`;

function AuthPage(props) {
  return (
    <PageContainer>
      <SignInContainer className="pageContainer">
        <h1>Welcome to Perro Project</h1>
        <a
          href={'http://localhost:80/auth/google'}
        >
          <Button
          >Sign in with Google</Button>
        </a>
      </SignInContainer>
    </PageContainer>
    
  );
}

export default AuthPage;
