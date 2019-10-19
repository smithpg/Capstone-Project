import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  background: red;
  margin: 1rem;
  padding: 1rem 2rem;

  .project-title {
    font-weight: bold;
  }
`;

function Project({ id }) {
  return (
    <Link to={`projects/${id}`}>
      <Container>
        <div className="project-id">{id}</div>

        <div> Last Viewed : {Date.now()}</div>
      </Container>
    </Link>
  );
}

export default Project;
