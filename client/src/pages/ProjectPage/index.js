import React, { useState } from "react";
import styled from "styled-components";
import { Route, Link, Switch } from "react-router-dom";

const PageContainer = styled.div`
  display: flex;
`;

function ProjectPage({ projectId }) {
  return (
    <PageContainer className="pageContainer">
      <div>
        This is where the tree view for project {projectId} would be displayed
      </div>
      <div>And this is where the tabbed data inspector thing would be</div>
    </PageContainer>
  );
}

export default ProjectPage;
