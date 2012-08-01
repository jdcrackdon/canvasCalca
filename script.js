$(document).ready(function() {
	var after_click = 0;
	var x1,y1,x2,y2,leftxy,rightxy,topxy,bottonxy;
	var obj_colections,shape=[];

	function Shape (points) {
		this.points = points;
	}

	Shape.prototype.contains = function (mx,my) {
		for (var i = 0; i < this.points.length; i++) {
			return  (this.points[i].x <= mx) && (this.points[i].x + this.points[i].w >= mx) &&
					(this.points[i].y <= my) && (this.points[i].y + this.points[i].h >= my);
		}
	};

	Shape.prototype.area = function () {
		var area = 0;
		var j = this.points.length -1;

		for (var i = 0; i < this.points.length; i++) {
			area = area + (this.points[j].x + this.points[i].x) * (this.points[j].y - this.points[i].y);
			
		}


	};

	function point (x,y,order) {
		this.x = x;
		this.y = y;
		this.order = order;
	}

	function drawShapeImg () {
		
		var ctx = document.getElementById('myCanvas').getContext("2d");

		for (var i=0; i<shape.length; i++) {
			var x = parseInt(shape[i].x);
			var y = parseInt(shape[i].y);

			if (i === 0) {
				ctx.moveTo(x,y);
			} else {
				ctx.lineTo(x,y);
			}
		}

		var imageObj = new Image();
		imageObj.src = "test.jpg";
		imageObj.onload = function(){

			var pattern = ctx.createPattern(imageObj, "repeat");

			ctx.fillStyle = pattern;
			ctx.fill();
			alert('here');
			
		};
	}

	function shapePolygon (points) {
		this.point.push(points);
	}

	function is_closedInFirstPoint (point1,point2) {
		if (point1.x>=leftxy && point1.y<=bottonxy && point1.x<=rightxy && point1.y>=topxy){
			cropImageShape(shape);
			drawShapeImg();
			drawLine(shape[0],point2);
			after_click = 0;
			x2=0, y2=0;
			after_click = 0;
			shape = [];
		}
		return;
	}
	function getSlope (b2) {
		//alert(shape.length);
		if (shape.length>=3){
			for (var i = 1; i <= shape.length; i++) {
				var a1 = shape[i];
				var b1 = shape[i+1];
				var a2 = shape[shape.length];
				//alert(shape[shape.length].x);
				var ua_t=(b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);
				var ub_t=(a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);
				var u_b=(b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);

				if(u_b!==0){
					var ua=ua_t/u_b;
					var ub=ub_t/u_b;
					if(0<=ua&&ua<=1&&0<=ub&&ub<=1){
						return(false);
					}else{
						return(true);
					}
				}else{
					if(ua_t===0||ub_t===0){
						alert("Coincident");
					}else{
						alert("Paralelos");
					}
				}
			}
		}
	}

	function moveClickedPoint (argument) {
		// body...

	}

	function cropImageShape (shape) {
		var img_points = '';
		for (var i = 1; i <= shape.length-1; i++) {
			img_points += shape[i].x + ',' + shape[i].y + ',';
		}
		//$('#trace').prepend('<img id="theImg" src="test.jpg" polyclip="'+img_points+'" />');
		//polyClip.init;
	}

	var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    function drawLine (point1, point2) {
		//context.beginPath();
		context.moveTo(point2.x, point2.y);
		context.lineTo(point1.x, point1.y);
		context.stroke();
	}

	function CanvasState (canvas) {
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.ctx = canvas.getContext('2d');

		var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

		canvas.addEventListener('mousedown', function(e) {
			var mouse = myState.getMouse(e);
			var mx = mouse.x;
			var my = mouse.y;
			var shapes = myState.shapes;
			var l = shapes.length;
			for (var i = l-1; i >= 0; i--) {
				if (shapes[i].contains(mx, my)) {
					var mySel = shapes[i];
					// Keep track of where in the object we clicked
					// so we can move it smoothly (see mousemove)
					myState.dragoffx = mx - mySel.x;
					myState.dragoffy = my - mySel.y;
					myState.dragging = true;
					myState.selection = mySel;
					myState.valid = false;
					return;
				}
			}
			// havent returned means we have failed to select anything.
			// If there was an object selected, we deselect it
			if (myState.selection) {
				myState.selection = null;
				myState.valid = false; // Need to clear the old selection border
			}
		}, true);
		
		canvas.addEventListener('mousemove', function(e) {
			if (myState.dragging){
				var mouse = myState.getMouse(e);
				// We don't want to drag the object by its top-left corner, we want to drag it
				// from where we clicked. Thats why we saved the offset and use it here
				myState.selection.x = mouse.x - myState.dragoffx;
				myState.selection.y = mouse.y - myState.dragoffy;
				myState.valid = false; // Something's dragging so we must redraw
			}
		}, true);
		
		canvas.addEventListener('mouseup', function(e) {
			myState.dragging = false;
		}, true);
			// double click for making new shapes
		
		canvas.addEventListener('dblclick', function(e) {
			var mouse = myState.getMouse(e);
			myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
		}, true);

		// **** Options! ****

		this.selectionColor = '#CC0000';
		this.selectionWidth = 2;
		this.interval = 30;
		setInterval(function() { myState.draw(); }, myState.interval);
	}

	CanvasState.prototype.getMouse = function(e) {
		var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

		// Compute the total offset
		if (element.offsetParent !== undefined) {
			do {
				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
			} while ((element = element.offsetParent));
		}

		// Add padding and border style widths to offset
		// Also add the <html> offsets in case there's a position:fixed bar
		offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
		offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

		mx = e.pageX - offsetX;
		my = e.pageY - offsetY;

		// We return a simple javascript object (a hash) with x and y defined
		return {x: mx, y: my};
	};


    $('#myCanvas').bind('click', function (ev) {
        var $img = $(ev.target);

        var offset = $img.offset();
        var x = ev.clientX - offset.left;
        var y = ev.clientY - offset.top;

        if (after_click>0){

			var actual_p =new point(x,y,after_click);

			/*if(getSlope(actual_p)){
				alert('could be awesome');
			}*/

			shape[after_click] = new point(x,y,after_click);
            is_closedInFirstPoint(shape[after_click],shape[after_click-1]);
            drawLine(shape[after_click-1],shape[after_click]);
            
            after_click++;
        }else{
			shape[after_click] = new point(x,y,after_click);
            context.fillStyle="#FF0000";
            context.fillRect(x-2,y-2,4,4);
            
            leftxy= x-10, rightxy= x+10, topxy= y-10, bottonxy= y+10;
            after_click++;
        }
    });
});