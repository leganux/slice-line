# SliceLine

<hr>
<br>
<p align="center">
  <img src="./logo.jpg?raw=true" width="550" title="trescomas logo">
</p>


<p align="justify">
API File Manager Ready

Creating a rest API with for manage files never was easy.

Thanks to tres-comas you can create a REST API to manage files using AWS-S3 or Local folder



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
          api_base_uri: false, // default "/file/"
          activeLogRequest: true, // to check what endpoint is calling 
          active_cors: true, // allows all cors
          collection_name: "files", // the name of mongodb collection
          public_folder: "archive", //the name of route for public folder 
          path_folder: "files", // where files will be stored in local
          allow_public: true,// if you want to allow public folder for local
          limits: {
            fileSize: Infinity, //maX filezise
            filesArray: 10 // Max number of files for array upload
          },
          structure_folder: "date",// the structure will be created to store data ::  date, root, extension,custom, alphabetic
          custom_folder_name: false,// if custom folder selected
          engine: "local", //"local", aws-s3 :: If will be stored in aws or local folders
          connect: { // data of s3 connection
            bucket: 'trescomas',
            acl: "public-read",
            contentDisposition: "inline",// 'attachment',
            serverSideEncryption: false, //'AES256',
            contentEncoding: false,
            region: "us-east-2",
            aws_access_key_id: "1234567890",
            aws_secret_access_key: "1234567890",

          },
          secure: { // if use basic auth  to consume endpoints
            user: "tres-comas",
            password: "Russ-Hanneman"
          }
        }

let files = new tresComas(mongoDBURI, port,options)

```

**Initialize and run the app**

```javascript
files.initialize()
files.start()
```


**Full example code**

```javascript
let tresComas = require('./index')


let files = new tresComas('mongodb://localhost/files', 3007,
        {
          api_base_uri: false,
          activeLogRequest: true,
          active_cors: true,
          collection_name: "files",
          public_folder: "archive",
          path_folder: "files",
          allow_public: true,
          limits: {
            fileSize: Infinity,
            filesArray: 10
          },
          structure_folder: "date",//date, root, extension,custom, alphabetic
          custom_folder_name: false,
          engine: "local", //"local", //aws-s3
          connect: {
            bucket: 'trescomas',
            acl: "public-read",
            contentDisposition: "inline",// 'attachment',
            serverSideEncryption: false, //'AES256',
            contentEncoding: false,
            region: "us-east-2",
            aws_access_key_id: "1234567890",
            aws_secret_access_key: "1234567890",

          },
          secure: {
            user: "tres-comas",
            password: "Russ-Hanneman"
          }
        })
files.initialize()
files.start()

```

<hr>

## endpoints

### *POST:upload


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

fetch("http://localhost:3007/file/upload/", requestOptions)
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
      "url": "http://localhost:3007/archive/P/8d83a5d8-5099-49e9-bd81-71cc266f0c30pexels-tyler-lastovich-633198.jpg",
      "name": "pexels-tyler-lastovich-633198.jpg",
      "filename": "8d83a5d8-5099-49e9-bd81-71cc266f0c30pexels-tyler-lastovich-633198.jpg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/8d83a5d8-5099-49e9-bd81-71cc266f0c30pexels-tyler-lastovich-633198.jpg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "2b6f3d8f-888c-41f3-9f2d-adf0c4a9ec0d",
      "_id": "642b70a2fb1dac5b8e3d846f",
      "createdAt": "2023-04-04T00:34:42.333Z",
      "updatedAt": "2023-04-04T00:34:42.339Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b70a2fb1dac5b8e3d846f?token=2b6f3d8f-888c-41f3-9f2d-adf0c4a9ec0d"
    },
    {
      "url": "http://localhost:3007/archive/P/d6bedea1-17cf-40a5-aca4-b51f847eb502pexels-pixabay-326058.jpg",
      "name": "pexels-pixabay-326058.jpg",
      "filename": "d6bedea1-17cf-40a5-aca4-b51f847eb502pexels-pixabay-326058.jpg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/d6bedea1-17cf-40a5-aca4-b51f847eb502pexels-pixabay-326058.jpg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "88bd0735-56e5-4ce6-b5f1-ba1fd62e6341",
      "_id": "642b70a2fb1dac5b8e3d8472",
      "createdAt": "2023-04-04T00:34:42.342Z",
      "updatedAt": "2023-04-04T00:34:42.343Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b70a2fb1dac5b8e3d8472?token=88bd0735-56e5-4ce6-b5f1-ba1fd62e6341"
    },
    {
      "url": "http://localhost:3007/archive/P/12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "name": "pexels-may-barros-1260841.jpg",
      "filename": "12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "5a376256-465f-42ae-b4c1-7bf8266ea9d6",
      "_id": "642b70a2fb1dac5b8e3d8475",
      "createdAt": "2023-04-04T00:34:42.345Z",
      "updatedAt": "2023-04-04T00:34:42.346Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b70a2fb1dac5b8e3d8475?token=5a376256-465f-42ae-b4c1-7bf8266ea9d6"
    }
  ]
}
```



### *POST:upload/array


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

fetch("http://localhost:3007/file/upload/array", requestOptions)
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
      "url": "http://localhost:3007/archive/P/8d83a5d8-5099-49e9-bd81-71cc266f0c30pexels-tyler-lastovich-633198.jpg",
      "name": "pexels-tyler-lastovich-633198.jpg",
      "filename": "8d83a5d8-5099-49e9-bd81-71cc266f0c30pexels-tyler-lastovich-633198.jpg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/8d83a5d8-5099-49e9-bd81-71cc266f0c30pexels-tyler-lastovich-633198.jpg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "2b6f3d8f-888c-41f3-9f2d-adf0c4a9ec0d",
      "_id": "642b70a2fb1dac5b8e3d846f",
      "createdAt": "2023-04-04T00:34:42.333Z",
      "updatedAt": "2023-04-04T00:34:42.339Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b70a2fb1dac5b8e3d846f?token=2b6f3d8f-888c-41f3-9f2d-adf0c4a9ec0d"
    },
    {
      "url": "http://localhost:3007/archive/P/d6bedea1-17cf-40a5-aca4-b51f847eb502pexels-pixabay-326058.jpg",
      "name": "pexels-pixabay-326058.jpg",
      "filename": "d6bedea1-17cf-40a5-aca4-b51f847eb502pexels-pixabay-326058.jpg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/d6bedea1-17cf-40a5-aca4-b51f847eb502pexels-pixabay-326058.jpg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "88bd0735-56e5-4ce6-b5f1-ba1fd62e6341",
      "_id": "642b70a2fb1dac5b8e3d8472",
      "createdAt": "2023-04-04T00:34:42.342Z",
      "updatedAt": "2023-04-04T00:34:42.343Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b70a2fb1dac5b8e3d8472?token=88bd0735-56e5-4ce6-b5f1-ba1fd62e6341"
    },
    {
      "url": "http://localhost:3007/archive/P/12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "name": "pexels-may-barros-1260841.jpg",
      "filename": "12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "5a376256-465f-42ae-b4c1-7bf8266ea9d6",
      "_id": "642b70a2fb1dac5b8e3d8475",
      "createdAt": "2023-04-04T00:34:42.345Z",
      "updatedAt": "2023-04-04T00:34:42.346Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b70a2fb1dac5b8e3d8475?token=5a376256-465f-42ae-b4c1-7bf8266ea9d6"
    }
  ]
}
```

### *POST:upload/single


**Fetch request example**

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic dHJlcy1jb21hczpSdXNzLUhhbm5lbWFu");

var formdata = new FormData();
formdata.append("file", fileInput.files[0], "popeye.jpeg");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch("http://localhost:3007/file/upload/single", requestOptions)
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
      "url": "http://localhost:3007/archive/P/c770b7fe-4408-47e9-85f1-75b6572c0a16popeye.jpeg",
      "name": "popeye.jpeg",
      "filename": "c770b7fe-4408-47e9-85f1-75b6572c0a16popeye.jpeg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/c770b7fe-4408-47e9-85f1-75b6572c0a16popeye.jpeg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "ae797949-69e2-4117-bd29-ef2f85d663a7",
      "_id": "642b786d246f669ae5bc5cf8",
      "createdAt": "2023-04-04T01:07:57.497Z",
      "updatedAt": "2023-04-04T01:07:57.501Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b786d246f669ae5bc5cf8?token=ae797949-69e2-4117-bd29-ef2f85d663a7"
    }
  ]
}
```



### *GET:view/id

**Request Parameters**
* prams(url):Must contain this element
  *id(string):the file id to view
* query(url): Could contain the next elements
    * token(String): String of token file
    * authorization(String):String to allow see in case of secure

**Fetch request example from explorer**

```text
http://localhost:3007/file/view/642b70a2fb1dac5b8e3d8475?token=5a376256-465f-42ae-b4c1-7bf8266ea9d6&authorization=dHJlcy1jb21hczpSdXNzLUhhbm5lbWFu
```



### *GET:list


**Request Parameters**

* query(url): Could contain the next elements
    * sort(Object):Object that defines the fields will be used for order results 'DESC' for descending or 'ASC'
      ascending
    * paginate(Object):Object with 2 properties 'page' and limit, defines the number of results to return and page
    * where(Object):Object filter to exactly match in find query for values
    * like(Object):Object filter to regex match in find query for values %LIKE% equivalent

**Fetch request example**

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic dHJlcy1jb21hczpSdXNzLUhhbm5lbWFu");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://localhost:3007/file/list?paginate[page]=1&paginate[limit]=3&sort[createdAt]=-1", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

```

**Example fetch response**

```json
{
  "success": true,
  "code": 200,
  "data": [
    {
      "_id": "642b7342d50730847810705c",
      "url": "http://localhost:3007/archive/P/be8e813d-e020-416e-bca5-1ecf8fd55276popeye.jpeg",
      "name": "popeye.jpeg",
      "filename": "be8e813d-e020-416e-bca5-1ecf8fd55276popeye.jpeg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/be8e813d-e020-416e-bca5-1ecf8fd55276popeye.jpeg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "3f1093fd-94ed-4db9-9368-cc5c2fd66f03",
      "createdAt": "2023-04-04T00:45:54.567Z",
      "updatedAt": "2023-04-04T00:45:54.571Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b7342d50730847810705c?token=3f1093fd-94ed-4db9-9368-cc5c2fd66f03"
    },
    {
      "_id": "642b72a9a84cf5a029233acb",
      "url": "http://localhost:3007/archive/P/d5bd2588-fdb4-4535-9e01-41f8937f4ae5popeye.jpeg",
      "name": "popeye.jpeg",
      "filename": "d5bd2588-fdb4-4535-9e01-41f8937f4ae5popeye.jpeg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/d5bd2588-fdb4-4535-9e01-41f8937f4ae5popeye.jpeg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "ba0ec2d1-9fb6-4364-b1b4-544c5c132d86",
      "createdAt": "2023-04-04T00:43:21.063Z",
      "updatedAt": "2023-04-04T00:43:21.068Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b72a9a84cf5a029233acb?token=ba0ec2d1-9fb6-4364-b1b4-544c5c132d86"
    },
    {
      "_id": "642b70a2fb1dac5b8e3d8475",
      "url": "http://localhost:3007/archive/P/12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "name": "pexels-may-barros-1260841.jpg",
      "filename": "12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "path": "/Users/leganux/Documents/GitHub/tres-comas/files/P/12976b62-ea64-4c1c-8476-5a4bdbd25df6pexels-may-barros-1260841.jpg",
      "dest": "/Users/leganux/Documents/GitHub/tres-comas/files/P",
      "engine": "local",
      "allow_public": true,
      "token": "5a376256-465f-42ae-b4c1-7bf8266ea9d6",
      "createdAt": "2023-04-04T00:34:42.345Z",
      "updatedAt": "2023-04-04T00:34:42.346Z",
      "__v": 0,
      "link": "http://localhost:3007/file/view/642b70a2fb1dac5b8e3d8475?token=5a376256-465f-42ae-b4c1-7bf8266ea9d6"
    }
  ],
  "message": "OK",
  "container_id": false
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
  tres-comas is another project of  <a href="https://leganux.net">leganux.net</a> &copy; 2023 all rights reserved
    <br>
   This project is distributed under the MIT license. 
    <br>

<br>
<br>
The logo and the name of tres-comas is inspired by the name of tres-comas, the fictional tequila  of Russ Hanneman, a character from the HBO series, Silicon Valley. This inspiration was taken for fun purposes only. The original name and logo reserve their rights to their original creators. 
</p>

