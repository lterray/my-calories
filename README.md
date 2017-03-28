# my-calories
List of calorie entries to track your consumption
  - create new entry about your meal
  - delete or edit entry
  - set the daily limit you-1d like to keep
  - summarizes your daily consumption

### Demo
1. Install [nodeJs](https://nodejs.org/en/download/) if you don't have it yet
2. Download the files from the repo
3. Go into the folder and install the necessary nodeJs modules:
  - npm install --save express
  - npm install --save body-parser
4. Install [CORS chrome extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) to enable localhost js code to reach your files (switch it off after because it can confuse other pages in your browser)
5. Run the server application:
  - node server.js
6. Enjoy the demo:
<p><image src="screenshot.png" /></p>

### Demo page explanation
Possible actions:
  - you can change the daily limit changing the value of the input on the top of the page. The days are colored (to red when exceeds limit, to green otherwise) according to this value
  - you can create a new entry clicking the 'New entry' button, inserting the values into the popup and click the 'Save changes' button
  - you can refresh the list with the 'Refresh' button
  - Next to the entries you can find the red 'Delete' button and the blue 'Edit' button. Clicking the Edit one will show a popup where you can change the data of the entry and save it afterwards

### Dependencies
Some files uses others from the repository (like client.js expects to have the client_api.js in use).
Additionally jQuery, Bootstrap and JsRender files are used also. They are listed in the Head section of the Html code.

### Structural explanation
The code is separated into four layers:

1. [server.js](server.js)
This is the REST API through which you can change the user options and the calorie entries which are stored in the [options.json](options.json) and the [calorie_entries.json](calorie_entries.json) files.
Use these three files only if you would like to write your own client.
Sample URLs:
  - to get all entries or put a new one in the demo: http://localhost:8081/calorie-entries
  - to delete, post an existing entry in the demo: http://localhost:8081/calorie-entries/:id-of-entry

2. [client_api.js](client_api.js)
This is the layer which is used on client side to reach the server.

3. [client.js](client.js)
MyCalorieClient function implements all necessary function to have a working page which interacts with the server through the client_api.
Its first parameter is the server URL which can be changed if you would like.
It gets the dom elements and selectors as the other parameters so you can change the Html representation without changing this layer.

4. [index.html](index.html)
This page is a working example of an interface where you can create and delete existing entries, you can create new entry and change the daily limit which you don't want to exceed.
If you create a different interface then you should change the ready function at the bottom of the [client.js](client.js) file with it. If you change the Html code you should keep the dependencies which are used in the Head section.
