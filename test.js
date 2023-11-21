const fs = require('fs');
const { Readable } = require('stream');
const https = require('node:https');
const { SitemapStream, streamToPromise } = require('sitemap');

fs.writeFile("./test_file.txt", "Hey there2!", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

const links = [
    { url: '/page-1/',  changefreq: 'daily', priority: 0.3  }, 
    { url: '/page-2/',  changefreq: 'daily', priority: 0.3  },
];
const newLinks = [];
const stream = new SitemapStream( { hostname: 'https://test.com' } );
const req = https.request(
  {
    host: '375t95kj4a.execute-api.us-east-1.amazonaws.com',
    path: '/qa-rest-api-3/api/v3/external/global/projects-by-status',
    method: 'POST',
  }, (res) => {
    console.log('asdasd');
    let buffer = '';
    res.on('data', function(d) {
      buffer += d;
    }).on('end', () => {
      if (!res.complete) {
        console.error(
          'The connection was terminated while the message was still being sent');
      }
      else {
        const response = JSON.parse(buffer).data;
        for (const project of response) {
          links.push({
            url: project.tag,
            priority: 0.8,
            changefreq: 'monthly',
          });
        }
        streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
          fs.writeFile("./test_sitemap.xml", data.toString(), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
          })
        );
      }
    });
  }
);
req.write(JSON.stringify({
  projectStatus: [
    "CLOSED",
    "OPEN",
    "PENDING_PAYMENT",
    "POSTPONED",
    "MONEY_RETURNED",
    "MONEY_GIVE",
    "PRE_MONEY_GIVE",
    "PENDING_BOND",
    "ADVERTISING_CAMPAIGN",
    "PENDING_COMMISSION"
  ]
}));
req.end();
