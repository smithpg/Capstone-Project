import { API_URL } from "../constants";

/**
 *  Below defined functions wrap a calls to fetch,
 *  providing some useful abstractions:
 *
 *
 *   -- The base api url is imported from /constants, so that only
 *      the path for the specific endpoint must be passed at call site
 *
 *   -- Caller can pass token string without worrying about packaging it
 *      into the appropriate Authorization header
 *
 *   -- On response from the server, response object is
 *      first parsed and then returned to caller
 *
 *   -- The function (submitForm) expects body to be passed as a plain js object
 *      which will be converted internally using JSON.stringify
 */

export async function submitForm({
  endpoint,
  token,
  body = null,
  headers = {}
}) {
  // If token has been passed, create appropriate
  // authorization header
  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: headers,
    body: body && JSON.stringify(body)
  });

  if (response.status >= 400) {
    let { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
}

export async function getResource({ endpoint, token, headers = {} }) {
  // If token has been passed, create appropriate
  // authorization header
  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "GET",
    headers: headers
  }).then(res => res.json());

  if (response.status >= 400) {
    let { message } = await response.json();
    throw new Error(message);
  }

  return response;
}
