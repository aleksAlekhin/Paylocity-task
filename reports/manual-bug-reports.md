Manual Bug Reports

## On real project, my bug report includes the following fields:
- Bug ID
- Title
- Description
- Steps to Reproduce
- Expected Result
- Actual Result
- Environment
- Severity/Priority
- Attachments
- Risks/Impact

## but since I don’t have full context about the application, the bug report is written in a shortened format.

API-01 – Invalid employee id returns 500 HTML with dev hint
- Endpoint: `GET /api/employees/{id}` with `abc`
- Steps: `curl -H "Authorization: Basic …" https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees/abc`
- Expected: 400 (bad id) or 404 with JSON error, no environment hints.
- Actual: 500 HTML error page with dev-mode hint.
- Risk: incorrect status, information disclosure, inconsistent error format across endpoints.

API-02 – Required `username` ignored on create
- Endpoint: `POST /api/employees`
- Steps: `curl -H "Authorization: Basic …" -H "Content-Type: application/json" -d '{"firstName":"NoUser","lastName":"Provided"}' https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees`
- Expected: 400 (schema: username required).
- Actual: 200 created, backend auto-fills username from token.
- Risk: contract violation, hidden data population.

API-03 – Extra fields accepted despite `additionalProperties:false`
- Endpoint: `POST /api/employees`
- Steps: `curl -H "Authorization: Basic …" -H "Content-Type: application/json" -d '{"firstName":"Extra","lastName":"Field","dependants":1,"foo":"bar"}' https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees`
- Expected: 400 (reject unknown fields).
- Actual: 200 created, extra field ignored silently.
- Risk: schema mismatch, uncontrolled inputs.

API-04 – Invalid `expiration` format returns 405
- Endpoint: `POST /api/employees`
- Steps: `curl -H "Authorization: Basic …" -H "Content-Type: application/json" -d '{"firstName":"Bad","lastName":"Date","dependants":0,"salary":52000,"expiration":"not-a-date"}' https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees`
- Expected: 400 (invalid date-time).
- Actual: 405.
- Risk: incorrect status, error handling routed incorrectly.

API-05 – Negative salary accepted
- Endpoint: `POST /api/employees`
- Steps: `curl -H "Authorization: Basic …" -H "Content-Type: application/json" -d '{"firstName":"Neg","lastName":"Salary","dependants":0,"salary":-100}' https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees`
- Expected: 400 (salary must be non-negative).
- Actual: 200 created.
- Risk: invalid financial data persisted.

API-06 – DELETE does not remove resource
- Endpoint: `DELETE /api/employees/{id}` then `GET /api/employees/{id}`
- Steps: create employee → delete by id → get by same id.
- Expected: GET after delete returns 404 (or 400 for bad id).
- Actual: GET still 200 with record.
- Risk: deletion ineffective, stale data exposed.

API-07 – GET non-existent UUID returns 200
- Endpoint: `GET /api/employees/{uuid}`
- Steps: use random valid UUID not present in DB.
- Expected: 404.
- Actual: 200.
- Risk: cannot signal missing resources, downstream confusion.

API-08 – DELETE non-existent UUID returns 200
- Endpoint: `DELETE /api/employees/{uuid}`
- Steps: use random valid UUID not present in DB.
- Expected: 404 (or 400).
- Actual: 200.
- Risk: false success responses, hard to detect missing records.

API-09 – DELETE non-existent UUID returns 200
- Endpoint: `DELETE /api/employees/{uuid}`
- Steps: use random valid UUID not present in DB.
- Expected: 404 (or 400).
- Actual: 200.
- Risk: false success responses, hard to detect missing records.

UI-01 – Dependents field lacks client validation and no server error display
- Area: Add Employee modal (Benefits Dashboard).
- Steps: set Dependents to -1 or 33, click Add.
- Expected: client-side validation blocks invalid values, if server rejects, show error message.
- Actual: request sent, server 400, modal stays with no error shown.
- Risk: users cannot understand failure, repeated invalid submissions.

UI-02 – Username not captured in UI
- Area: Add Employee modal.
- Steps: create employee, no username input available.
- Expected: ability to supply or at least display username, alignment with backend contract.
- Actual: username absent, backend auto-fills from auth.
- Risk: mismatch with data model, users cannot control username.

UI-03 – Add modal stays open after successful create
- Area: Add Employee modal.
- Steps: submit valid employee, server returns success.
- Expected: modal closes and list refreshes once creation succeeds.
- Actual: modal remains open, repeated submits create duplicates.
- Risk: accidental duplicate records poor UX.

UI-04 – Action icons render as unreadable glyphs
- Area: Employee list action buttons.
- Steps: open dashboard, observe edit/delete icons showing as boxes (``, ``).
- Expected: proper icons rendered.
- Actual: font/glyph missing, icons appear as placeholder characters.
- Risk: unclear affordances, usability issue.

UI-05 – First/Last Name column headers swapped
- Area: Employee list table header.
- Steps: open dashboard and inspect header vs data row.
- Expected: `First Name` column above first-name values, `Last Name` above last-name values.
- Actual: header labels for firstName/lastName are visually swapped compared to the row below.
- Risk: confusion when reading or exporting data, users may misinterpret which name is which.

UI-06 – Invalid login shows raw HTTP 405 page
- Area: Login page.
- Steps: enter invalid username/password and submit.
- Expected: stay on login form with clear validation/error message (“Invalid credentials”), no raw HTTP error page.
- Actual: browser displays `HTTP ERROR 405` page.
- Risk: poor UX, potential information disclosure about server configuration, login failures not handled gracefully.

UI-07 – No validation for empty fields when adding employee
- Area: Add Employee modal.
- Steps: open Add Employee, leave required fields (First/Last Name) empty and click Add.
- Expected: client-side validation preventing submission, required fields highlighted, message shown.
- Actual: form allows submission with empty fields, validation fully delegated to backend (or missing).
- Risk: invalid/partial records, inconsistent behavior vs other validation rules.

UI-08 – Console 403 error for favicon
- Area: Browser console / static assets.
- Steps: open DevTools console.
- Expected: favicon loads successfully (200/304) or is deliberately disabled without errors.
- Actual: `GET /favicon.ico` fails with HTTP 403.
- Risk: minor but noisy console error, indicates misconfigured static asset or permissions.

