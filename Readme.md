# GetOkr-WEB

GetOkr-WEB is the Front-end part of GetOkr, an OKR software used by LinkApi, FCamara and HashTrack.

* Language - JavaScript
* Framework - AngularJS
* Module Bundler - Webpack

## Requirements
* GetOkr-API https://github.com/linkapi/getokr-api.git

## Installation
```bash
npm install
npm run dev
```

## Structure
```
├── src               # Source code
│   ├── app           # Application
│   │   ├── modules   # Application modules
│   ├── config        # Application configuration settings
│   └── release       # Production bundle
```

## Usage
* `npm run dev`  Start server on dev mode with webpack
* `npm run build` Generate Production bundle

## License
MIT