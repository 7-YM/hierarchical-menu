# Hierarchical Menu
Hierarchical Menu for alloy titanium appcelerator. Menu works for both iOS and Android.
![alt tag](https://raw.githubusercontent.com/7-YM/hierarchical-menu/master/assets/images/sample_menu.png)

## Description
This widget of [Titanium Alloy](https://github.com/appcelerator/alloy) allows you to create hierarchical menu for iOS and Android using specific JSON. You can customise the menu based on your own JSON API. This widget is intended to be used in a Titanium Alloy based application.

## Compatibility
I have tested this widget on following versions: (Feel free to test and provide us the feedback)
* Alloy Version: 1.3.1
* Titanium Version: 3.2.1

## Installation
Drop the widget's content in the folder `app/widgets/com.sevenym.widget.hierarchical-menu` of your project, and declare the dependency in the `app/config.json` file:

```js
"dependencies": {
    "com.sevenym.widget.hierarchical-menu": "1.0"
}
```

## Getting Started
The first step is to add the menu in the view or to create menu programmatically.
* To add menu in xml view:
    ```js
    <Widget id="menu" src="com.sevenym.widget.hierarchical-menu"></Widget>
    ```
You can then use the menu using `$.menu` in your `controller.js`.

* You can use following snippet to create the menu programmatically:
    ```js
    var menu = Alloy.createWidget("com.sevenym.widget.hierarchical-menu");
    ```
    Because `var menu` is a variable. You are not required to refer it as `$.menu`.
    
For the rest of the tutorial. We will be referring menu with `$.menu`.

### Configuration
The second step is to configure the menu using `$.menu.configure()` function that takes JSON object as argument. Following is the example code of one such configuration:
```js
$.menu.configure({
	top: 88,
	left: 110,
	width: 400,
	height: 600,
	enableItemValue: false
});
```
* `enableItemValue:` If you would like to show cost of the item then you can use this attribute. Making it `false` will hide the cost box in the menu. Check sample menu (Right) on top in our computer store example.

### Rendering
Last step is to render the menu using following snippet:
```js
// Render Menu
$.menu.render(data.structure, function(currentPath, itemData) {
	
	// Callback Function
});
```
`$.menu.render` has two arguments i.e. `JSON Structure` and `callback` function. Following is further elaboration of each argument.

#### JSON
We are using following JSON structure:
```js
{
    "structure": [{
        "name": "COMPUTER",
        "itemValue": 152,
        "group": [{
            "name": "MAIN UNIT",
            "itemValue": 62,
            "group": [{
                "name": "HOUSING",
                "itemValue": 10
            }, {
                "name": "MOTHERBOARD",
                "itemValue": 18,
                "group": [{
	                "name": "CPU",
	                "itemValue": 9
	            }]
            }, {
                "name": "CASES",
                "itemValue": 200
            }]
        }, {
            "name": "MOUSE",
            "itemValue": 40,
            "group": [{
                "name": "BODY",
                "itemValue": 200
            }, {
                "name": "ELECTRONICS",
                "itemValue": 200
            }]
        }, {
            "name": "KEYBOARD",
            "itemValue": 15
        }]
    }]
}
```
* `structure:` Items in it are passed as an array of `JSON objects`. You can rename or use different attribute but make sure that menu structure is passed as an array of `JSON objects`.
* `itemValue:` This is the generic attribute for the cost of the item. In our computer store example, itemValue is referring to the number of hardwares for that category.
* `group:` This attribute tells if further levels are required. If you have a different attribute then you will need to customise `widget.js`

#### Callback Function
Callback function is invoked whenever an item is clicked or when `$.menu.back()` and `$.menu.setCurrentPath()` functions are raised. Following two values are returned:
* `currentPath` is an array of strings that shows the current path of the hierarchy. This is important if you would like to show breadcrumbs in your application. In our computer store example our callback function would return following `currentPath` when item **MOTHERBOARD** is tapped
    ```js
    ["COMPUTER", "MAIN UNIT", "MOTHERBOARD"]
    ```
    Using `currentPath` you can also get the last item that is clicked using following snippet:
    ```js
    var selectedItem = currentPath[currentPath.length - 1];
    ```
* `itemData` allows you to bind custom data with the item. For example if you want to bind `category_id` (in our computer store example) with `itemData` then you can do this using following steps:
    * Go to the widget folder and open `widget.js` controller:
    * Go to **line number: 216** and set `data: item.customAttribute` for following node:
        ```js
        var node = Titanium.UI.createView({
        	...
        	data: null, // Set Your Custom Attribute Here
        	...
        });
        ```

### External Functions
You can apply couple of operations to enhance the user experience. Following are some of the functions that can be used:
* `$.menu.getPath()` allows you to get current path of the menu. This is same as the `currentPath` variable the we receive from our callback function.
* `$.menu.clear()` allows you to clear the menu. **Note: render function clears the menu automatically so you don't have to call this function explicitly.**
* `$.menu.render(structure, callback)` allows you to refresh your menu. This function automatically clears the menu before re-creating.
* `$.menu.setCurrentPath(depth)` allows you to close hierarchy by depth of the tree. This is vital if you want to create breadcrumbs with hyperlinks that allows user to jump back certain steps. In our computer store example If we want to jump directly to root then we can use it as follow:
    ```js
    $.menu.setCurrentPath(0)    // Will Close All The Levels Except Root
    $.menu.setCurrentPath(-1)   // Will Close Root.
    ```
* `$.menu.back()` allows you to go back one step. Both `back()` and `setCurrentPath()` will invoke the callback function.

# License and Credits
This widget is made available by [7-YM Positive Solutions](http://www.7-ym.com.au) under the MIT license.
