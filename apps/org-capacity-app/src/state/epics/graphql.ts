import { ASTNode, print } from 'graphql';
import { throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { RequestError, GraphqlRequestError } from '../../types';

export const graphql = (
  apiUrl: string, 
  query: ASTNode, 
  variables: { [x: string]: unknown }, 
  dataKey: string, 
  token?: string
) => {
  const request = {
    query: print(query),
    variables
  }
  
  return ajax.post(
    apiUrl, 
    request, 
    {
      'Content-Type': 'application/json', 
      'Authorization': token ? `Bearer ${token}` : null
    }
  ).pipe(
    map(({response}) => {
      if (!response.errors) {
        return response.data[dataKey];
      } else {
        throw new GraphqlRequestError({status: 200, errors: response.errors});
      }
    }),
    catchError((err) => err.status ?
      throwError(new RequestError({status: err.status, errors: err.responseText})) : 
      throwError(err)
    )
  )
}
