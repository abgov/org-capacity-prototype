export interface ErrorInfo {
  status: number
  errors: string | string[]
}

export class GraphqlRequestError extends Error {
  constructor(public details: ErrorInfo) {
    super(`Error(s) returned by graphql request: ${details.errors}`);

    Object.setPrototypeOf(this, GraphqlRequestError.prototype);
  }
}

export class RequestError extends Error {
  constructor(public details: ErrorInfo) {
    super(`Error encounterd during request with status ${details.status} and error(s): ${details.errors}`);

    Object.setPrototypeOf(this, RequestError.prototype);
  }
}
