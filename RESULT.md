# Result of the task

The task was completed according to the requirements.
Project uses the default template and add a few dependencies to it.

## Backend

The app now persists data on the server in json files. The `.data`directory gets created once first data are being written. It have two 'collections', one for lists and one for todos. The data are controlled by Mongo-like models in `models` directory. There was not a focus on database optimization, so once data are updated, the whole file gets overwritten.

There is a test coverage for database models. Tests can be ran with `npm test`.
Some changes were made in `eslint` config in order to access eg async/await features.

## Frontend

There is checkbox for every todo so the user is able to mark completion of the tasks.
When all todos in the list are completed, the list gets a check mark in the frontend to indicate list completion.
There is a optional date/time input for each todo, which indicates date of expected completion. When a task is overdue, Notification bar is shown on the first load of the page.

Autosave feature uses debounce with 1 second timeout.

There is a notification service using `ReactContext`. The notification messages show up in top right corner.

Todo list is using MU Grid, which provides responsiveness for narrow screens.

For communication with REST API on the backend the `axios` package is used. There is global error handling in `api.js`, which makes the calls independent on `axios`.

Due to version conflicts it was not easy to add frontend tests to the project, so it is just manually tested.
