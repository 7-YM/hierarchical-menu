// Include
var Util = require("Util");

// Views Having Childrens
var groupNodes = null;
var leafNodes = null;
var hasMoreThanOneExpandableChildren = null;
var currentLeafNode = null;
var currentDepth = null;
var enableItemValue = false;
var __callbackFunction = null;

// Configure Widget
exports.configure = function(conf) {
	
	// Position
	if(conf.top) $.menu.top = conf.top;
	if(conf.left) $.menu.left = conf.left;
	if(conf.width) $.menu.width = conf.width;
	if(conf.height) $.menu.height = conf.height;

	// Enable Value Box
	if(conf.enableItemValue) enableItemValue = conf.enableItemValue;
}

// Get Breadcrumb
exports.getPath = function() {

	// Return Path
	return getCurrentPath();
}

// Clear Menu
exports.clear = function() {

	// Clear Menu
	clearMenu();
	$.lblItemValue.visible = false;
}

// Initialise Component and Render
exports.render = function(data, __callback) {

	// Initialise Variables
	groupNodes = [];
	leafNodes = [];
	hasMoreThanOneExpandableChildren = false;
	currentLeafNode = null;
	currentDepth = 0;

	// Check Enable Item Value
	$.lblItemValue.visible = enableItemValue;

	// Clear Menu
	clearMenu();
	
	// Make Menu
	__callbackFunction = __callback;
	createRecursiveMenu($.wrapper, 0, data, 0);

	// Close All Menu
	if(groupNodes != null) groupNodes.forEach(function(section) {
		if(section.height == Ti.UI.SIZE && section.depth >= 0) {
			section.height = 30;
		}
	})
}

// Set Depth Level
exports.setCurrentPath = function(nextDepth) {

	// Close Last Depth
	if(currentDepth >= 0 && nextDepth < currentDepth) {

		// Close Sections With NextDepth+
		currentDepth = nextDepth + 1;

		// Check Leaf Node
		if(currentLeafNode != null) {

			// Close Leaf Node
			currentLeafNode.name.backgroundColor = '#BFE5E6';
			if(enableItemValue) currentLeafNode.itemValue.backgroundColor = '#BFE5E6';
			currentLeafNode.icon.image = '/images/icon_expand.png';
			currentLeafNode.height = 30;
			currentLeafNode = null;

		}

		// Close Based On Depth
		if(groupNodes != null) groupNodes.forEach(function(section) {

			// Close IFF Open
			if(section.height == Ti.UI.SIZE && section.depth >= currentDepth && section.depth >= 0) {
				
				// De-Select and Close Menu
				section.name.backgroundColor = '#BFE5E6';
				if(enableItemValue) section.itemValue.backgroundColor = '#BFE5E6';
				section.icon.image = '/images/icon_expand.png';
				section.height = 30;
			}
		})

		// For Active Depth
		currentDepth = nextDepth;

		// Callback For Active Node
		if(groupNodes != null) groupNodes.forEach(function(section) {

			// Close IFF Open
			if(section.height == Ti.UI.SIZE && section.depth >= currentDepth) {
				
				// Callback Function
				__callbackFunction(getCurrentPath(), section.data);
			}
		})
	}
}

// For Back Button
exports.back = function() {

	// Close Last Depth
	if(currentDepth >= 0) {

		// Check For Leaf Node
		if(currentLeafNode != null) {

			// Close Leaf Node
			currentLeafNode.name.backgroundColor = '#BFE5E6';
			if(enableItemValue) currentLeafNode.itemValue.backgroundColor = '#BFE5E6';
			currentLeafNode.icon.image = '/images/icon_expand.png';
			currentLeafNode.height = 30;
			currentLeafNode = null;

			// Depth Up
			--currentDepth;

		} else {

			// Close Based On Depth
			if(groupNodes != null) groupNodes.forEach(function(section) {

				// Close IFF Open
				if(section.height == Ti.UI.SIZE && section.depth >= currentDepth && section.depth >= 0) {
					
					// De-Select and Close Menu
					section.name.backgroundColor = '#BFE5E6';
					if(enableItemValue) section.itemValue.backgroundColor = '#BFE5E6';
					section.icon.image = '/images/icon_expand.png';
					section.height = 30;
				}
			})

			// Depth Up
			--currentDepth;
		}

		// Callback For Active Node
		if(groupNodes != null) groupNodes.forEach(function(section) {

			// Close IFF Open
			if(section.height == Ti.UI.SIZE && section.depth >= currentDepth) {
				
				// Callback Function
				__callbackFunction(getCurrentPath(), section.wipBreakdown, section.contributors);
			}
		})
	}
}

// Remove All Items
function clearMenu() {

	// Close All Menu
	if(groupNodes != null) groupNodes.forEach(function(section) { removeChildren(section); })
	if(leafNodes != null) leafNodes.forEach(function(section) { removeChildren(section); })
    removeChildren($.wrapper);
}

// Get Path
function getCurrentPath() {

	// Iterate And Save Path
	var breadcrumb = [];
	if(groupNodes != null) groupNodes.forEach(function(section) {
		if(section.height == Ti.UI.SIZE) {
			breadcrumb.push(section.name.text.trim())
		}
	})

	// Push Leaf Node IFF Any
	if(currentLeafNode) breadcrumb.push(currentLeafNode.name.text.trim());

	// Return Path
	return breadcrumb;
}

// Create Menu
function createRecursiveMenu(nodeWrapper, offset, items, depth) {

	// Create Siblings
	if(items != null) items.forEach(function(item) {

		// Create Row
		var rowInfo = Alloy.createWidget("com.sevenym.widget.hierarchical-menu", "sectionRow");

		// Check Value Box
		if(!enableItemValue) {
			rowInfo.itemValue.visible = false;
			rowInfo.name.right = 0;
		}

		// Create Node
		hasMoreThanOneExpandableChildren = (item.group && item.group.length > 1);
		var node = Titanium.UI.createView({
			top: (items.length > 1 ? 5 : offset),
			left: (depth > 0 ? 15 : 0),
			height: Ti.UI.SIZE,
			depth: depth,
			name: rowInfo.name,
			itemValue: rowInfo.itemValue,
			data: null,
			icon: rowInfo.icon,
			isLeafNode: !item.group,
			layout: (hasMoreThanOneExpandableChildren ? 'horizontal' : 'none')
		});

		// Params
		rowInfo.name.text = '  ' + item.name;
		if(enableItemValue) rowInfo.itemValue.text = item.itemValue;
		rowInfo.icon.visible = !node.isLeafNode;

		// Get View and Fix Top
		rowInfo = rowInfo.getView();

		// Event Listener
		rowInfo.addEventListener('click', function() {

			// Close Previous
			if(groupNodes != null) groupNodes.forEach(function(section) {

				// Close IFF Open
				if(section.height == Ti.UI.SIZE && section.depth >= depth && section != node && section.depth >= 0) {
					
					// De-Select and Close Menu
					section.name.backgroundColor = '#BFE5E6';
					if(enableItemValue) section.itemValue.backgroundColor = '#BFE5E6';
					section.icon.image = '/images/icon_expand.png';
					section.height = 30;
				}
			})

			// Open Menu
			if(node.height == 30 || node.isLeafNode) {

				// Switch Leaf Node Selection
				if(node.isLeafNode) {

					// Check Previously Selected Leaf Node
					if(currentLeafNode != null) {

						// De-Select Previous Leaf Node
						currentLeafNode.name.backgroundColor = '#BFE5E6';
						if(enableItemValue) currentLeafNode.itemValue.backgroundColor = '#BFE5E6';
						currentLeafNode.icon.image = '/images/icon_expand.png';
						currentLeafNode.height = 30;
					}

					// Save Current Leaf Node
					currentLeafNode = node;

				}

				// Select and Open Menu
				node.name.backgroundColor = '#FFF56C';
				if(enableItemValue) node.itemValue.backgroundColor = '#FFF56C';
				node.icon.image = '/images/icon_collapse.png';
				node.height = Ti.UI.SIZE;

			// Close Leaf Node
			} else if(currentLeafNode != null) {

				// De-Select Previous Leaf Node
				currentLeafNode.name.backgroundColor = '#BFE5E6';
				if(enableItemValue) currentLeafNode.itemValue.backgroundColor = '#BFE5E6';
				currentLeafNode.icon.image = '/images/icon_expand.png';
				currentLeafNode.height = 30;
				currentLeafNode = null;
			}

			// Change Current Depth
			currentDepth = node.depth

			// Callback Function
			__callbackFunction(getCurrentPath(), node.data);
		})

		// Add Row
		node.add(rowInfo)
		nodeWrapper.add(node);
		
		// Node Setup
		if(item.group) {

			// Push Group Node
			groupNodes.push(node);
			offset += createRecursiveMenu(node, 35, item.group, depth + 1) - 35

		} else {

			// Leaf Node
			leafNodes.push(node);
		}

		// Increment Offset
		offset += 35;
	})

	// Return Offset
	return offset;
}

// Remove Children
function removeChildren(view) {
    if (view.children) {
        for (var c = view.children.length - 1; c >= 0; c--) {
            view.remove(view.children[c]);
        }
    }
}