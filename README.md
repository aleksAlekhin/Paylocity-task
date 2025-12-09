# Benefits Dashboard Tests Automation

## Quick start

### Installation
```bash
npm install
npx playwright install

### Config
Copy .env.example to .env and fill with your credentials

#### Run all tests
npm run test:all

#### Run only API tests
npm run test:api

#### Run only UI tests
npm run test:ui

#### View HTML report
npm run report

----------------------------------------------------------------------------
##### Manual Bug-reports
reports/manual-bug-reports.md

##### Project Structure
tests/api/ - API test suites (authentication, CRUD, benefits calculation)
tests/ui/ - UI test suites (login, dashboard verification)
pages/ - Page Object Models
utils/ - Helper functions
reports/ - Test execution reports

###### Technology Stack
Playwright 1.48.2
Node.js
JavaScript/ES6
HTML Reporter
