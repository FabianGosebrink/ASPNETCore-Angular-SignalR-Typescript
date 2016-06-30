# Angular 2 // ASP.NET Core // SignalR 3

## With this repository we can create a X-Platform / Cross Platform Application running with bower, npm, ASP.NET Core, SignalR 3 and Angular 2 with Typescript.

#### Warning: I am working with Angular 2 in RC state, ASP.NET Core which is also an release candidate and SignalR 3 which is also not released yet...but it works. Enjoy :-)

Just clone this repo and run <pre>npm install</pre> and <pre>bower install</pre> (for signalR)

If you want to run this solutions out of Visual Studio make sure you ran the gulp task 

```javascript
gulp build:web:dev 
```

before. It will build the application and inject all files into index.html in wwwroot.

Make sure the "AspNetCoreAngular2"-Project in Visual Studio is you Startup-Project by right-clicking it and "Set as Startup Project".

If you want to get production builds you can type

```javascript
gulp build:web:prod 
```

to build the production-ready build or type 

```javascript
gulp build:all
```

to get the .dist-folder filled with all the cross-platform builds.

After this you can type <pre>dnx web</pre> to start the ASP.NET Server or just press the Play-Button in Visual Studio.

This is the output after starting the dnx web server
![alt text](_gitAssets/commandLineWebServer.jpg "dnx web server")

After this you can browse to the site
![alt text](_gitAssets/screenshot1.jpg "dnx web server")

With <pre>gulp</pre> you can list all tasks
![alt text](_gitAssets/gulp-tasks.jpg "dnx web server")

![alt text](_gitAssets/dist-folder.jpg "dnx web server")

Mobile
![alt text](_gitAssets/xplatform1.jpg "dnx web server")

Win 8.1
![alt text](_gitAssets/xplatform2_win81.jpg "dnx web server")

Desktop
![alt text](_gitAssets/xplatform3.jpg "dnx web server")