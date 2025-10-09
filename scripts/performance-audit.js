const lighthouse = require('lighthouse');
lighthouse('http://localhost:5000').then(results => console.log(results.lhr));
