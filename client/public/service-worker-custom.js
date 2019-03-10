// A lot of this code is based off the Request Deferrer Recipe in Mozilla's ServiceWorker
// Cookbook: https://serviceworke.rs/request-deferrer_service-worker_doc.html

importScripts('/js/ServiceWorkerWare.js')
importScripts('/js/localforage.min.js')

var root = (function() {
    var tokens = (self.location + '').split('/');
    tokens[tokens.length - 1] = '';
    return tokens.join('/');
  })();

var worker = new ServiceWorkerWare();

function tryOrFallback(fakeResponse) {
      return function(req, res) {
        if (!navigator.onLine) {
            console.log('No network availability, enqueuing');
            enqueue(req);
            return fakeResponse.clone();
        }

        console.log('Network available! Flushing queue.');
        return flushQueue()
        .then(function () {
          return fetch(req);
        });
      };
    }

function tryOrCache() {
  return function (req, res) {
    return caches.open('mycache').then(function(cache) {
      return fetch(req)
      .then(function(res) {
        orig_res = res.clone()
        if(res.ok) {
          // From fetch
          cache.put(req.clone(), res.clone())
          return res
        } else {
          // From Cache
          return cache.match(req.clone())
          .then(function(res) {
            if(res) {
              // Cache hit
              return res
            }
              // Cache miss
              return orig_res
          })
        }
      })
    })
  }
}


worker.get(root + 'api/presentations', tryOrCache())    

worker.post(root + 'api/survey', tryOrFallback(new Response(null, {
    status: 202
  })));

worker.use(new self.StaticCacher(['https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css']));

worker.init();

function enqueue(request) {
  return serialize(request)
  .then(function(serialized) {
    localforage.getItem('queue')
    .then(function(queue) {
      queue = queue || [];
      queue.push(serialized);
      return localforage.setItem('queue', queue)
      .then(function() {
        console.log(serialized.method, serialized.url, 'enqueued!');
      })
    })
  })
}

function flushQueue() {
  return localforage.getItem('queue')
  .then(function(queue) {
    queue = queue || [];

    if (!queue.length) {
      return Promise.resolve();
    }

    console.log('Sending ', queue.length, ' requests...');
    return sendInOrder(queue)
    .then(function() {
      return localforage.setItem('queue', []);
    });
  });
}


function sendInOrder(requests) {
  var sending = requests.reduce(function(prevPromise, serialized) {
    console.log('Sending', serialized.method, serialized.url);
    return prevPromise.then(function() {
      return deserialize(serialized).then(function(request) {
        return fetch(request);
      });
    });
  }, Promise.resolve());
  return sending;
}
  
  

function serialize(request) {
  var headers = {};
  for (var entry of request.headers.entries()) {
    headers[entry[0]] = entry[1];
  }
  var serialized = {
    url: request.url,
    headers: headers,
    method: request.method,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return request.clone().text().then(function(body) {
      serialized.body = body;
      return Promise.resolve(serialized);
    });
  }
  return Promise.resolve(serialized);
}

function deserialize(data) {
  return Promise.resolve(new Request(data.url, data));
}