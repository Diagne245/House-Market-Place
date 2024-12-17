# `House Marketplace`

Demo Link: &ensp; **https://sunny-meerkat-6ca53b.netlify.app/**

Find and list houses for sale or for rent. This is a **`React`** / **`Firebase v9`** project from the _[React Front To Back 2022](https://www.udemy.com/course/react-front-to-back-2022/?kw=react+front+to&src=sac&couponCode=ST21MT121624)_ Traversy Media Udemy course.
From the original project, we rebuilt the UI using **`Bootstrap v5`** and **`React-Bootstrap Library`**.

To handle images uploads use the **`Firebase Cloud Storage`** service.

![App Screenshot](/src/assets/screenshot.jpg)

## `Usage`

To rebuild the project, follow this gist:

### Firebase Setup For House Marketplace

1. Create Firebase Project
2. Create "web" app within firebase to get config values"
3. Add authentication for email/password and Google OAuth
4. Create [auth rules](https://gist.github.com/bradtraversy/6d7de7e877d169a6aa4e61140d25767f)
5. Create a user from Firebase
6. Enable Firestore
7. Create 3 composite indexes for advanced querying:

   - Collection: Listing

   - Query Scope: Collection

   1. type (ascending) , timestamp (descending)
   2. userRef (ascending) , timestamp (descending)
   3. offer (ascending) , timestamp (descending)

8. Create dummy listing with sample data

| Field           | Value                                                                                                                                                                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name            | Beautiful Stratford Condo                                                                                                                                                                                                                                                                                                         |
| type            | rent                                                                                                                                                                                                                                                                                                                              |
| bedrooms        | 2                                                                                                                                                                                                                                                                                                                                 |
| userRef         | ID OF A USER                                                                                                                                                                                                                                                                                                                      |
| bathrooms       | 2                                                                                                                                                                                                                                                                                                                                 |
| parking         | true                                                                                                                                                                                                                                                                                                                              |
| furnished       | false                                                                                                                                                                                                                                                                                                                             |
| offer           | true                                                                                                                                                                                                                                                                                                                              |
| regularPrice    | 2500                                                                                                                                                                                                                                                                                                                              |
| discountedPrice | 2000                                                                                                                                                                                                                                                                                                                              |
| location        | 8601 West Peachtree St Stratford, CT 06614                                                                                                                                                                                                                                                                                        |
| geolocation     | **lat**: 41.205590 **lng**: -73.150530                                                                                                                                                                                                                                                                                            |
| imageUrls       | ['https://images.unsplash.com/photo-1586105251261-72a756497a11?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1258&q=80', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'] |

### `Run`

Rename `.env.local.example` to `.env.local` and **`add your config values`**

To start the **`Development Server`** (localhost:3000), inside the project folder, run

```bash
npm install
```

Then

```bash
npm start
```

To build the **`production files`** run:

```bash
npm run build
```
