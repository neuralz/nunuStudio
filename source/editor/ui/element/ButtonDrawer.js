"use strict";

function ButtonDrawer(parent)
{
	Element.call(this, parent);

	this.element.style.zIndex = "200";
	this.element.style.cursor = "pointer";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	
	this.preventDragEvents();

	//Panel
	this.panel = document.createElement("div");
	this.panel.style.position = "absolute";
	this.panel.style.cursor = "default";
	this.panel.style.backgroundColor = Editor.theme.barColor;
	this.panel.style.zIndex = "250";
	
	//Image
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.pointerEvents = "none";
	this.icon.style.top = "15%";
	this.icon.style.left = "15%";
	this.icon.style.width = "70%";
	this.icon.style.height = "70%";
	this.element.appendChild(this.icon);

	//Image scale
	this.imageScale = new THREE.Vector2(0.7, 0.7);

	//Attributes
	this.panelSize = new THREE.Vector2(0, 0);
	this.panelPosition = new THREE.Vector2(0, 0);

	//Options
	this.options = [];
	this.optionsPerLine = 3;
	this.optionsSize = new THREE.Vector2(50, 50);
	this.optionsScale = new THREE.Vector2(0.7, 0.7);
	this.optionsSpacing = new THREE.Vector2(3, 3);
	this.expanded = false;

	//Self pointer
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.style.cursor = "pointer";
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = Editor.theme.buttonColor;
	};

	this.panel.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
	};

	this.panel.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
	};

	this.updatePanelSize();

	//Add elements to document
	this.parent.appendChild(this.panel);
}

ButtonDrawer.prototype = Object.create(Element.prototype);

//Remove element
ButtonDrawer.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}

	if(this.parent.contains(this.panel))
	{
		this.parent.removeChild(this.panel);
	}
};

//Add new Option to dropdown menu
ButtonDrawer.prototype.addOption = function(image, callback, altText)
{
	var button = new ButtonImage(this.panel);
	button.setImage(image);

	//Alt text
	if(altText !== undefined)
	{
		button.setAltText(altText);
	}

	//Button callback
	var self = this;
	button.setCallback(function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	});

	//Add button
	this.options.push(button);
	this.updatePanelSize();

	//Set button
	button.size.set(this.optionsSize.x, this.optionsSize.y);
	button.position.x = this.optionsSize.x * ((this.options.length - 1) % this.optionsPerLine);
	button.position.y = this.optionsSize.y * Math.floor((this.options.length - 1) / this.optionsPerLine);
	button.updateInterface();
};

//Remove option from dropdown menu
ButtonDrawer.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
		this.updatePanelSize();
		this.updateInterface();
	}
};

//Set image
ButtonDrawer.prototype.setImage = function(image)
{
	this.icon.src = image;
};

//Set image scale
ButtonDrawer.prototype.setImageScale = function(x, y)
{
	this.imageScale.set(x, y);
	
	this.icon.style.top = ((1 - y) / 2 * 100) + "%";
	this.icon.style.left = ((1 - x) / 2 * 100) + "%";
	this.icon.style.width = (x * 100) + "%";
	this.icon.style.height = (y * 100) + "%";
};

//Updates drawer panel size
ButtonDrawer.prototype.updatePanelSize = function()
{
	this.panelSize.x = (this.optionsSize.x * this.optionsPerLine);
	this.panelSize.y = (this.optionsSize.y * (Math.floor((this.options.length - 1) / this.optionsPerLine) + 1));
};

//Update drawer options position and size (should be called after change in options displacement variables)
ButtonDrawer.prototype.updateOptions = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
		this.options[i].position.x = this.optionsSize.x * (i % this.optionsPerLine);
		this.options[i].position.y = this.optionsSize.y * Math.floor(i / this.optionsPerLine);
		this.options[i].updateInterface();
	}
};

//Update Interface
ButtonDrawer.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";

		if(this.expanded)
		{
			this.panel.style.display = "block";

			//Panel position
			this.panelPosition.x = this.position.x + this.size.x;
			this.panelPosition.y = this.position.y;

			//Panel size
			this.panel.style.top = this.panelPosition.y + "px";
			this.panel.style.left = this.panelPosition.x + "px";
			this.panel.style.width = this.panelSize.x + "px";
			this.panel.style.height = this.panelSize.y + "px";
		}
		else
		{
			this.panel.style.display = "none";
		}
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.panel.style.display = "none";
	}

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};