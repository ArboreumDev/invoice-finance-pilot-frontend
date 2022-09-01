# Invoice Financing Pilot Frontend

Next.js, Typescript & React Frontend

- Dashboard for Suppliers to manage the Creditline-terms & their customer whitelist
- v0 Dashboard for Loan Admin to initiate new loans against invoices & mark their status
- Overview-Dashboard for Main-Creditor to see status of all Creditlines, total owed, total repaid...

![dashboard](/docs/dashboard.png)
![whitelist](/docs/dashboard_whitelist.png)
![terms](/docs/dashboard_terms.png)
![admin](/docs/dashboard_admin.png)

## Local Development

Create a .env file and fill in the the following variables

BACKEND_URL="localhost:8000"

FIX: go to fetcher.js & put in the url of the backend manually! (not needed if you run everythin locally)

Install all requirements:

```
yarn
```

fire it up:

```
yarn dev
```

go to http://localhost:3000/ to see it in action

## Production

use .env.local.prod

```
yarn next build
yarn next export
docker-compose build frontend
```

test by using the image:
envfile:
NEXT_PUBLIC_BACKEND="http://localhost:8000/"
docker-compose up frontend
