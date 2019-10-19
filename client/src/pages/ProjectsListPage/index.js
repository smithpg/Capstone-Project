import React, { useState } from "react";
import styled from "styled-components";
import { Route, Link, Switch } from "react-router-dom";

import Project from "./Project";

const PageContainer = styled.div`
  .project-list {
    max-width: 800px;
    margin: 5rem auto;

    display: flex;
    flex-wrap: wrap;
  }
`;

function ProjectsListPage(props) {
  return (
    <PageContainer className="pageContainer">
      <div className="project-list">
        {[1, 2, 3].map((project, i) => (
          <Project id={project} key={i} />
        ))}
      </div>
    </PageContainer>
  );
}

export default ProjectsListPage;
