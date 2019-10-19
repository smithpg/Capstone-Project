import React from "react";
import styled from "styled-components";

import { Route, Link, Switch } from "react-router-dom";

const PageContainer = styled.div``;

function AuthPage(props) {
  return (
    <PageContainer className="pageContainer">
      <Link to="projects">
        <button>Authenticate!!!</button>
      </Link>
    </PageContainer>
  );
}

export default AuthPage;
