# request-es6
Simple class wrapper around XmlHttpRequest witten in es6 and transpiling to es5.

<pre>
var request = new HttpRequest([url], [eagerness], [useCredentials], [username], [password]);

request.then(function(response) {
  console.log(response);
}).catch(function(response) {
  console.error(response);
});;
</pre>
