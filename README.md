# Org Capacity (prototype)

This project is a prototype full stack application consisting of a React frontend app and an Apollo Server (graphql API) backend service. It collects role and people status within organizational units and aggregates that information into visual representations of capacity up
the organization structure.

![Update View](./doc/update-view.png?raw=true "Update View")

![Report View](./doc/report-view.png?raw=true "Report View")

This project was generated using [Nx](https://nx.dev).

## Prerequisites

- This app uses [Keycloak](https://www.keycloak.org/) for authentication and access tokens, but should be able to work with other OIDC providers with small changes.
- It uses MongoDB for data persistence.

## Developer Quick Start
1. Update environment.ts under app/org-capacity-app/src/environments/ and app/org-capacity-service/src/environments/ for your Keycloak and MongoDB instances.
2. Run `npm install` to install dependencies.
3. Run `npm start org-capacity-service` to start the dev server for the backend service. API endpoint available at: http://localhost:3337/capacity/v1/graphql
4. Run `npm start org-capacity-app` to start the dev server for the frontend app. App available at: http://localhost:4200

## Data Loading
Note that a bearer token in the Authorization header with required role is needed to load data via the API.

Use the `upsertAvailabilityStatusTypes` mutation for loading/updating of status configuration.

In the `types` parameter, pass in an array of status types.

```json
[
  {
    "name": "Available",
    "capacity": 100
  },
  {
    "name": "Working from home",
    "capacity": 100
  },
  {
    "name": "Self isolating",
    "capacity": 0
  }
]
```

Use the `importOrganization` mutation for loading organization structure. This mutation accepts a nested organization object with inline roles and persons. 

For example, the `org` input parameter can include org structure, roles, and people. The `defaultStatusTypeId` input parameter is also required; all persons created will default to a status based on the specified type.

```json
{
  "type": "min",
  "name": "Test Co",
  "children": [
    {
      "type": "div",
      "name": "Bugs Division",
      "children": [],
      "roles": [
        {
          "name": "VP of Bugs",
          "assigned": {
            "firstName": "Testy",
            "lastName": "McTester",
            "middleName": "",
            "phone": "123 432-1000",
            "fax": "123 432-1001"
          }
        },
        {
          "name": "VP Assistant",
          "assigned": null
        }
      ],
      "location": {
        "fullAddress": "123 Fake St. Springfield"
      }
    },
    {
      "type": "div",
      "name": "Delivery Division",
      "children": [
        {
          "type": "branch",
          "name": "Communications",
          "children": [],
          "roles": [],
          "location": {
            "fullAddress": "213 Fake Ave. Springfield"
          }
        }
      ],
      "roles": [
        {
          "name": "VP of Delivery",
          "assigned": {
            "firstName": "Def",
            "lastName": "Shipper",
            "middleName": "N.",
            "phone": "123 452-1000",
            "fax": "123 452-1001"
          }
        }
      ],
      "location": {
        "fullAddress": "213 Fake Ave. Springfield"
      }
    }
  ]
}
```

## User Access
Note that user access is not fully implemented in the prototype. Two Keycloak realm access roles are recognized: *service-admin* and *org-admin*. 

- *service-admin* is required for updating the set of possible statuses.
- *service-admin* or *org-admin* is required to update the status of a person or update a unit role.

*org-admin* role applies across the organization; it's not possible to scope the role assignment to a sub-hierarchy of the organization.

The app also looks for an `organizationId` property in the jwt access token and will show the associated organization unit in the *My Area* view of the frontend app. 

## Deployment
Example for deployment is included under /.openshift

Note that Keycloak and MongoDB are not included.