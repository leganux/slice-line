# SliceLine

<hr>
<br>
<p align="center">
  <img src="./logo.jpg?raw=true" width="550" title="SlideLine logo">
</p>


<p align="justify">
API File Mail Ready

Creating a rest API with for manage and send Mail  never was easy.

Thanks to tres-comas you can create a REST API to manage Mail



## How to use

<hr>

**Import tres comas basic project**

```javascript
const sliceLine = require("slice-line");
```

**Set up the library**

```javascript


let mongoDBURI = 'mongodb://localhost/files'  // the mongo db uri where file data and properties will be  saved
let port = 3010 // port to run your app 
let options = {
  api_base_uri: '/mail/',
  activeLogRequest: true,
  active_cors: true,
  collection_name: "mail",
  collection_template_name: "mail_template",
  mailTransporter: { // is based in nodemailer check at https://nodemailer.com/about/
    host:'smtp.hostinger.com',
    port:465,
    secure:true,
    auth:{
        user:"admin@mygeek.zone",
        pass:"XXXXXXXXXXXXXXXX"
        }
     
},
    secure: { // if use basic auth  to consume endpoints
            user: "slide-line",
            password: "piedpipper"
          }
}
let mail = new sliceLine(mongoDBURI, port,options)

```

**Initialize and run the app**

```javascript
mail.initialize()
mail.start()
```


**Full example code**

```javascript
let sliceLine = require('./index')


let options = {
  api_base_uri: '/mail/',
  activeLogRequest: true,
  active_cors: true,
  collection_name: "mail",
  collection_template_name: "mail_template",
  mailTransporter: {
    host:'smtp.hostinger.com',
    port:465,
    secure:true,
    auth:{
      user:"admin@mygeek.zone",
      pass:"XXXXXXXXXXXXXXXX"
    }
  }
}

let mail = new sliceLine('mongodb://localhost/mail', 3010, options)
mail.initialize()
mail.start()


```

<hr>

## endpoints

### *POST:send

This endpoint allows you to send mail based in a template or sending data

**Fetch request example**

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "fromName": "ErickZon",
  "from": "admin@mygeek.zone",
  "to": "erick@leganux.com",
  "subject": "prueba de mail",
  "html": "aaaaaaaaaaa",
  "text": "bbbbbbbbbbbbb",
  "attachments": [
    {
      "filename": "pexels-tyler-lastovich-633198.jpg",
      "path_filename": "f64218d0-4e4e-4054-a705-c8ffc821ddd0pexels-tyler-lastovich-633198.jpg",
      "path": "/Users/leganux/Documents/GitHub/slice-line/attachments/f64218d0-4e4e-4054-a705-c8ffc821ddd0pexels-tyler-lastovich-633198.jpg"
    },
    {
      "filename": "pexels-pixabay-326058.jpg",
      "path_filename": "c48390f8-dabf-4bb6-a29d-870110bb5b41pexels-pixabay-326058.jpg",
      "path": "/Users/leganux/Documents/GitHub/slice-line/attachments/c48390f8-dabf-4bb6-a29d-870110bb5b41pexels-pixabay-326058.jpg"
    },
    {
      "filename": "pexels-may-barros-1260841.jpg",
      "path_filename": "615092f7-2331-4118-8236-af967345c369pexels-may-barros-1260841.jpg",
      "path": "/Users/leganux/Documents/GitHub/slice-line/attachments/615092f7-2331-4118-8236-af967345c369pexels-may-barros-1260841.jpg"
    }
  ]
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3010/mail/send", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

```

**Example fetch response**

```json
{
  "success": true,
  "code": 200,
  "error": false,
  "message": "Upload OK",
  "container_id": false,
  "data": {
    "host": "smtp.hostinger.com",
    "port": 465,
    "secure": true,
    "from": "ErickZon <admin@mygeek.zone>",
    "fromName": "ErickZon",
    "to": "erick@leganux.com",
    "subject": "prueba de mail",
    "text": "bbbbbbbbbbbbb",
    "html": "aaaaaaaaaaa",
    "attachments": [
      {
        "filename": "pexels-tyler-lastovich-633198.jpg",
        "_id": "642cbed8e73a897f95bc2b41"
      },
      {
        "filename": "pexels-pixabay-326058.jpg",
        "_id": "642cbed8e73a897f95bc2b42"
      },
      {
        "filename": "pexels-may-barros-1260841.jpg",
        "_id": "642cbed8e73a897f95bc2b43"
      }
    ],
    "response": {
      "accepted": [
        "erick@leganux.com"
      ],
      "rejected": [],
      "ehlo": [
        "PIPELINING",
        "SIZE 48811212",
        "ETRN",
        "AUTH PLAIN LOGIN",
        "ENHANCEDSTATUSCODES",
        "8BITMIME",
        "DSN",
        "CHUNKING"
      ],
      "envelopeTime": 723,
      "messageTime": 1085,
      "messageSize": 4090234,
      "response": "250 2.0.0 Ok: queued as 4Prldy3QgnzN7hCK",
      "envelope": {
        "from": "admin@mygeek.zone",
        "to": [
          "erick@leganux.com"
        ]
      },
      "messageId": "<705f9561-b935-4b66-3bac-c5eb45df504f@mygeek.zone>"
    },
    "_id": "642cbed8e73a897f95bc2b40",
    "createdAt": "2023-04-05T00:20:40.942Z",
    "updatedAt": "2023-04-05T00:20:40.942Z",
    "__v": 0
  }
}
```



### *POST:attachments/upload/

This endpoint  allows you to upload attachments to a  temp folder before send
  * Important: You must to depure and remove files from attachment folder every certain time

**Fetch request example**

```javascript
var formdata = new FormData();
formdata.append("files", fileInput.files[0], "pexels-tyler-lastovich-633198.jpg");
formdata.append("files", fileInput.files[0], "pexels-pixabay-326058.jpg");
formdata.append("files", fileInput.files[0], "pexels-may-barros-1260841.jpg");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("http://localhost:3010/mail/attachments/upload/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

```

**Example fetch response**

```json
{
  "success": true,
  "code": 200,
  "error": false,
  "message": "Upload OK",
  "container_id": false,
  "data": [
    {
      "filename": "pexels-tyler-lastovich-633198.jpg",
      "path_filename": "f64218d0-4e4e-4054-a705-c8ffc821ddd0pexels-tyler-lastovich-633198.jpg",
      "content": "/Users/leganux/Documents/GitHub/slice-line/attachments/f64218d0-4e4e-4054-a705-c8ffc821ddd0pexels-tyler-lastovich-633198.jpg",
      "path": "/Users/leganux/Documents/GitHub/slice-line/attachments"
    },
    {
      "filename": "pexels-pixabay-326058.jpg",
      "path_filename": "c48390f8-dabf-4bb6-a29d-870110bb5b41pexels-pixabay-326058.jpg",
      "content": "/Users/leganux/Documents/GitHub/slice-line/attachments/c48390f8-dabf-4bb6-a29d-870110bb5b41pexels-pixabay-326058.jpg",
      "path": "/Users/leganux/Documents/GitHub/slice-line/attachments"
    },
    {
      "filename": "pexels-may-barros-1260841.jpg",
      "path_filename": "615092f7-2331-4118-8236-af967345c369pexels-may-barros-1260841.jpg",
      "content": "/Users/leganux/Documents/GitHub/slice-line/attachments/615092f7-2331-4118-8236-af967345c369pexels-may-barros-1260841.jpg",
      "path": "/Users/leganux/Documents/GitHub/slice-line/attachments"
    }
  ]
}
```

now you will use data array to send as attachment in template or send 

### *GET:template

Allows you to list all templates registered

* query(url): Could contain the next elements
  * sort(Object):Object that defines the fields will be used for order results 'DESC' for descending or 'ASC'
    ascending
  * paginate(Object):Object with 2 properties 'page' and limit, defines the number of results to return and page
  * where(Object):Object filter to exactly match in find query for values
  * like(Object):Object filter to regex match in find query for values %LIKE% equivalent



**Fetch request example**

```javascript
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("http://localhost:3010/mail/template", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

```

**Example fetch response**

```json
{
  "success": true,
  "code": 200,
  "error": false,
  "message": "OK",
  "container_id": false,
  "data": [
    {
      "_id": "642cb672e524fc0d6d18fe66",
      "subject": "Welcome",
      "name": "default",
      "html": "<h1>Hello</h1> {{friend}} to Slice Line, this is the default <b>template</b> ",
      "attachments": [
        {
          "filename": "Logo",
          "path": "logo.jpg",
          "_id": "642cb672e524fc0d6d18fe67"
        }
      ],
      "createdAt": "2023-04-04T23:44:50.919Z",
      "updatedAt": "2023-04-04T23:44:50.919Z",
      "__v": 0
    },
    {
      "_id": "642cd1be1ba3e946847ae7ca",
      "subject": "prueba de mail {{variable_subject}}",
      "name": "template1",
      "text": "{{variable 2}}",
      "html": "<h1>{{variable}}</h1>",
      "attachments": [],
      "createdAt": "2023-04-05T01:41:18.519Z",
      "updatedAt": "2023-04-05T01:41:18.519Z",
      "__v": 0
    }
  ]
}
```

### *POST:template

Allows you to create a new template


**Fetch request example**

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "subject": "prueba de mail {{variable_subject}}",
  "name": "template1",
  "html": "<h1>{{variable}}</h1>",
  "text": "{{variable 2}}"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3010/mail/template", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

```

**Example fetch response**

```json
{
  "success": true,
  "code": 200,
  "error": false,
  "message": "Upload OK",
  "container_id": false,
  "data": {
    "subject": "prueba de mail {{variable_subject}}",
    "name": "template1",
    "text": "{{variable 2}}",
    "html": "<h1>{{variable}}</h1>",
    "attachments": [],
    "_id": "642cd1be1ba3e946847ae7ca",
    "createdAt": "2023-04-05T01:41:18.519Z",
    "updatedAt": "2023-04-05T01:41:18.519Z",
    "__v": 0
  }
}
```



### *GET:list

Allows you get the list of mails sent 

**Request Parameters**

* query(url): Could contain the next elements
    * sort(Object):Object that defines the fields will be used for order results 'DESC' for descending or 'ASC'
      ascending
    * paginate(Object):Object with 2 properties 'page' and limit, defines the number of results to return and page
    * where(Object):Object filter to exactly match in find query for values
    * like(Object):Object filter to regex match in find query for values %LIKE% equivalent

**Fetch request example**

```javascript
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("http://localhost:3010/mail/list", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
```

**Example fetch response**

```json
{
  "success": true,
  "code": 200,
  "error": false,
  "message": " OK",
  "container_id": false,
  "data": [
    {
      "_id": "642cbc3646002d80bb9c01e5",
      "host": "smtp.hostinger.com",
      "port": 465,
      "secure": true,
      "from": "ErickZon <admin@mygeek.zone>",
      "fromName": "ErickZon",
      "to": "erick@leganux.com",
      "subject": "prueba de mail",
      "text": "bbbbbbbbbbbbb",
      "html": "aaaaaaaaaaa",
      "response": {
        "accepted": [
          "erick@leganux.com"
        ],
        "rejected": [],
        "ehlo": [
          "PIPELINING",
          "SIZE 48811212",
          "ETRN",
          "AUTH PLAIN LOGIN",
          "ENHANCEDSTATUSCODES",
          "8BITMIME",
          "DSN",
          "CHUNKING"
        ],
        "envelopeTime": 680,
        "messageTime": 205,
        "messageSize": 576,
        "response": "250 2.0.0 Ok: queued as 4PrlP16tSWzGwKQQ",
        "envelope": {
          "from": "admin@mygeek.zone",
          "to": [
            "erick@leganux.com"
          ]
        },
        "messageId": "<d2912c1e-ea7d-7b57-aa22-5d39ef2a5371@mygeek.zone>"
      },
      "attachments": [],
      "createdAt": "2023-04-05T00:09:26.466Z",
      "updatedAt": "2023-04-05T00:09:26.466Z",
      "__v": 0
    },
    {
      "_id": "642cbed8e73a897f95bc2b40",
      "host": "smtp.hostinger.com",
      "port": 465,
      "secure": true,
      "from": "ErickZon <admin@mygeek.zone>",
      "fromName": "ErickZon",
      "to": "erick@leganux.com",
      "subject": "prueba de mail",
      "text": "bbbbbbbbbbbbb",
      "html": "aaaaaaaaaaa",
      "attachments": [
        {
          "filename": "pexels-tyler-lastovich-633198.jpg",
          "_id": "642cbed8e73a897f95bc2b41"
        },
        {
          "filename": "pexels-pixabay-326058.jpg",
          "_id": "642cbed8e73a897f95bc2b42"
        },
        {
          "filename": "pexels-may-barros-1260841.jpg",
          "_id": "642cbed8e73a897f95bc2b43"
        }
      ],
      "response": {
        "accepted": [
          "erick@leganux.com"
        ],
        "rejected": [],
        "ehlo": [
          "PIPELINING",
          "SIZE 48811212",
          "ETRN",
          "AUTH PLAIN LOGIN",
          "ENHANCEDSTATUSCODES",
          "8BITMIME",
          "DSN",
          "CHUNKING"
        ],
        "envelopeTime": 723,
        "messageTime": 1085,
        "messageSize": 4090234,
        "response": "250 2.0.0 Ok: queued as 4Prldy3QgnzN7hCK",
        "envelope": {
          "from": "admin@mygeek.zone",
          "to": [
            "erick@leganux.com"
          ]
        },
        "messageId": "<705f9561-b935-4b66-3bac-c5eb45df504f@mygeek.zone>"
      },
      "createdAt": "2023-04-05T00:20:40.942Z",
      "updatedAt": "2023-04-05T00:20:40.942Z",
      "__v": 0
    }
  ]
}

```




## Object request query URL example

**where**

```text
?where[name]=erick&where[age]=30
```

equal to

```javascript
let where = {
    name: 'erick',
    age: 30
}
```



**like**

```text
?like[name]=eri
```

equal to

```javascript
let like = {
    name: {$regex: 'eri', $options: 'i'},
}
```

**paginate**

```text
?paginate[page]=1&paginate[limit]=10
```

equal to

```javascript
let paginate = {
    page: 1,
    limit: 10
}
```

**sort**

```text
?sort[name]=DESC&sort[age]=ASC
```

equal to

```javascript
let sort = {
    name: "DESC",
    age: "ASC"
}
```





<hr>


<p align="center">
    <img src="https://leganux.net/web/wp-content/uploads/2020/01/circullogo.png" width="100" title="hover text">
    <br>
  SliceLine is another project of  <a href="https://leganux.net">leganux.net</a> &copy; 2023 all rights reserved
    <br>
   This project is distributed under the MIT license. 
    <br>

<br>
<br>
The logo and the name of SliceLine is inspired by the name of SliceLine, the fictional company  from the HBO series, Silicon Valley. This inspiration was taken for fun purposes only. The original name and logo reserve their rights to their original creators. 
</p>

