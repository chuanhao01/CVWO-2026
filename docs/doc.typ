#set page(paper: "a4", margin: 1cm)
#set text(font: "New Computer Modern", size: 11pt)

#let title = [r/CVWO]


= #title

#title is a Reddit-like web forum.
You can find the project #link("https://github.com/chuanhao01/cvwo-2026")[here].

== Basic Features

The plan is to build a Reddit-like web forum allowing any logged in user to create topics, make posts, and comment on posts.
Users can register and create accounts with their username and email.
The email also needs to be verified before the account can be used.

== Advanced Features

The following features are planned to be implemented if time permits.

- Implement Google and GitHub OAuth account login and creation.
- Implement AWS hosting.
- Dockerize both the frontend and backend.

= Tech Stack

On the Frontend:
- #link("https://nextjs.org/")[NextJS]
  - Frontend React framework
- #link("https://redux.js.org/")[Redux]
  - For global state management
- #link("https://tailwindcss.com/")[TailwindCSS]
  - CSS Styling
- #link("https://ui.shadcn.com/")[Shadcn]
  - For react components

On the Backend:
- #link("https://github.com/gin-gonic/gin")[gin]
  - go REST api framework
- #link("https://github.com/jackc/pgx")[pgx]
  - go postgres driver
- #link("https://github.com/alexedwards/argon2id")[argon2id]
  - go convenience library for hashing and checking passwords
- #link("https://github.com/gin-contrib/cors")[cors]
  - go gin cors middleware

Database - #link("https://supabase.com/")[Supabase]

= User Stories

These user stories describe general "paths" for the basic features of #title.
You can refer to @anonymous_user_story and @logged_in_user_story for the table form of these user stories.

== Anonymous User Stories (and logged in User Stories)

These refer to user stories that an anonymous user (not logged in) or a logged in user can both do.

- Visit Landing Page
  - There should be a landing page explaining what the web app is.
- Visit Home Page
  - The user should be able to visit the home page, showing all topics in chronological post order
- Visit a Topic's Home Page
  - The user should be able to click on a topic or navigate directly to a topic page and see all the posts of that topic in chronological post order
- Viewing a Post
  - The user should be able to click on a post or navigate directly and view the post, its content, and comments on the post.
- Contact Page
  - A contact page for bug reports or user reports.
- Post Filtering (Advanced Feature)
  - The user should be able to search for posts by using different filters (e.g., regex on title and body).

== Logged In User Stories

- Register for a user account
  - While not logged in, a user can navigate to the register page and create an account. If the registration of the account is successful, the user will be brought to a page showing they need to then verify their email account.
- Log in to user account without email verification.
  - When the user navigates to the login page and tries to log in without verifying their email, they will be brought to a page showing that they need to verify their email before using their account.
- Log in to the user account with email verification.
  - After clicking and visiting the link in their email for verification, they should be able to log in to their account.
- Creating a Topic
  - They can navigate to the create topic page from the home page, fill in the information for the topic, and create a new topic. If successful, they will redirect to the newly created topic page.
- Creating a Post
  - They can navigate to creating a post either from the home page or a topic page, creating a post for a specific topic. If successful, they will redirect to the newly created post.
- Creating a Comment on a Post
  - They can navigate to creating a comment for a post from a post page. If successful, they will redirect back to the post.
- Logging Out
  - A logged in user can click on the logout button to log out of their account. If successful, they will redirect back to the landing page.
- Creating a Comment on a Comment of a Post (Advanced Feature)
  - The user should be able to comment on comments of a post for different nested levels of comments. If successful, they will redirect back to the post.

= Database Schema

This section describes the proposed database schema needed to implement the basic features of #title.
You can refer to @basic_db_schema for a representation of the database schema.

== Users

For the `Users` table, this is the representation of a user's account.

== Topics

For the `Topics` table, since any topic must be created by a user and a user can create multiple topics, it has a one-to-many relation with the `Users` table.

== Posts

For the `Posts` table, since any post must be created by a user in some single topic, it has a one-to-many relation with the `Users` and `Topics` tables.

== Comments

For the `Comments` table, since any comment must be created by a user in some single post, it has a one-to-many relation with the `Users` and `Posts` tables.

#figure(
  image("Main Diagram-DB Schema.png", format: "png", width: 80%),
  caption: "Basic Features DB schema",
)<basic_db_schema>


#figure(
  image("Main Diagram-Anonymous User Story.png", format: "png", width: 90%),
  caption: "Anonymous User Stories",
)<anonymous_user_story>

#figure(
  image("Main Diagram-Logged In User Story.png", format: "png", width: 90%),
  caption: "Logged In User Stories",
)<logged_in_user_story>


#pagebreak()

MAYBE
- Get github actions to build and deploy
  - Build has to be custom commands, running on specific dir and setting up the `.env` files

TODO
- Register with username, email and password
  - Link oauth afterwards
- Register with oauth first
  - Need to add username to continue
  - Some flag, register with oauth, need additional setup

DONE


= Planning

- Landing Page

Users
- Oauth Accounts
- Password
  - Argon2 create own small lib
- Username and Password
  - username check with db
- Telegram account for verifying and reset password
- TOTP 2FA for account

Tech Stack
- Docker

FE
- Typescript
- Nextjs
- Redux
- Shadcn
- eslint
- Jest

Testing?

BE
- golang
- gin

= Main References

- #link(
    "https://www.dash0.com/guides/logging-in-go-with-slog#contextual-logging-patterns-with-slog",
  )[For learning go logging]
