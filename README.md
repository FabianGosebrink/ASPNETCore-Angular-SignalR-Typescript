# Angular // ASP.NET Core // SignalR

## With this repository we can create a X-Platform / Cross Platform Application running with npm, ASP.NET Core, SignalR and Angular with Typescript.

## Social

### <a href="https://twitter.com/FabianGosebrink" target="_blank">Follow @FabianGosebrink</a>

### [offering.solutions](http://offering.solutions "blogLink")
### [fabian-gosebrink.com](http://fabian-gosebrink.com "homepage")


## Code

Just clone this repo and run 

```javascript 
npm start
```

Browse to
```javascript 
http://localhost:8080
```  
(No SignalR but live-reloading)

Or
```javascript 
http://localhost:5000
```
(SignalR but no live-reload)

To see the page then. SignalR is not working there because of CORS-Issues with signalR. Just load the application in Visual Studio and press the Play Button.

![building and using process](.github/build.gif "npm start and build")

If you want to get production builds you can type

```javascript
gulp build:web:prod 
```

to build the production-ready build or type 

```javascript
gulp build:all
```

to get the .dist-folder filled with all the cross-platform builds.

After this you can type 

```csharp
dotnet run
```

to start the ASP.NET Server or just press the Play-Button in Visual Studio.

This is the output after starting the dnx web server
![alt text](.github/commandLineWebServer.png "dnx web server")

After this you can browse to the site
![alt text](.github/screenshot1.jpg "dnx web server")

With 

```javascript
gulp
```
you can list all tasks
![alt text](.github/gulp-tasks.png "dnx web server")

![alt text](.github/dist-folder.png "dnx web server")

Mobile
![alt text](.github/xplatform1.jpg "dnx web server")

Win 8.1
![alt text](.github/xplatform2_win81.jpg "dnx web server")

Desktop
![alt text](.github/xplatform3.jpg "dnx web server")
