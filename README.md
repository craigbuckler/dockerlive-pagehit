# An Introduction to Docker LIVE: PageHit (MySQL database)

A page hit counter service which saves data to a MySQL database.

This is an example project for the purposes of demonstration only. It is not recommended for production use!


## 1. Complete the image `Dockerfile`

Starting from an appropriate Node.js base (Alpine is fine), create a production-level image following the steps outlined in the file to install and run `index.js` using the Node runtime.

Add the `LICENSE` and `README.md` files to `.dockerignore`.


## 2. Complete `docker-compose.yml`

Use the following configuration to run three containers which attach to a `pagehitnet` Docker network:

1. Add a MySQL 8 container with new database named `pagehit` which can be accessed by the MySQL user `hituser` with a password `hitpass`. (Remember to set the root user password).
1. Mount a `pagehitdata` Docker volume for a persistent database.
1. Expose the MySQL port.

Add an Adminer container:

Add a `pagehit` container for the Node.js application:

1. Define `build` values for the `Dockerfile`
1. Define `NODE_ENV` and the database credentials for MySQL.
1. Bind mount the host project directory into `/home/node/app`
1. Mount a `pagehitfiles` volume for `node_modules`, `.config`, `.npm`.
1. Expose the application and debugging ports.
1. Launch with the application debug command.


## 3. Test

Run all systems:

1. Launch the Node.js application
1. Launch the PHP test site

Test page hit service in a browser: <http://localhost:8101/>

Bonus steps:

1. Examine the database with Adminer.
1. Debug using Chrome (chrome://inspect)
1. Debug using VS Code
1. Try the VS Code Docker extension.

---

## How to use the PageHit service

There are four ways to call the PageHit service from any web page to show the number of times it has been viewed.

### 1. Add an image

Add a counter image (SVG) to any page:

```html
<img src="http://localhost:8104/hit.svg" alt="hits" />
```


### 2. Insert a script

Add a script to any page:

```html
<script src="http://localhost:8104/hit.js"></script>
```

The following HTML is inserted into the page at the `<script>` location:

```html
<span class="pagehitjs">1</span>
```

This method uses `document.write()` which may affect page loading performance.


### 3. Insert a deferred script

Add a deferred script to any page:

```html
<script src="http://localhost:8104/hit-defer.js" async defer></script>
```

The following HTML is inserted into the page at the `<script>` location:

```html
<span class="pagehitdefer">1</span>
```

This updates the page after the content has loaded so performance should not be affected.


### 4. Make an Ajax request

Fetch the current number of page hits using an Ajax request to <http://localhost:8104/hit.json>. This returns a single JSON-encoded object with a `hit` property, e.g. `{ hit: 1 }`. The value can be examined and presented in any way.

```html
<p>This page has been viewed <span class="hits"></span> times.</p>

<script type="module">
(async () => {

  try {

    const
      response = await fetch('http://localhost:8104/hit.json'),
      json = await response.json(),
      pc = document.querySelectorAll('.hits');

    for (let i = 0; i < pc.length; i++) {
      pc[i].textContent = json.hit;
    }

  }
  catch(err) {
    console.log('fetch error', err);
  }

})();
</script>
```
