$(document).ready(function() {
	var after_click = 0;
	var x1,y1,x2,y2,leftxy,rightxy,topxy,bottonxy;
	var obj_colections,shape = [];

	function point (x,y,order) {
		this.x = x;
		this.y = y;
		this.order = order;
	}

	function shapePolygon (points) {
		this.point.push(points);
	}

	function is_closedInFirstPoint (point1,point2) {
		if (point1.x>=leftxy && point1.y<=bottonxy && point1.x<=rightxy && point1.y>=topxy){
			alert('here');
			drawLine(shape[0],point2);
			after_click = 0;
			x2=0, y2=0;
			after_click = 0;
		}
		return;
	}
	function getSlope (point) {
		var b2 = point;
		alert(shape.length);
		for (var i = shape.length-2; i >= 0; i++) {
			alert(i);
			var a1 = shape[i-1];
			var b1 = shape[i];
			var a2 = shape[shape.length];
			var ua_t=(b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);
			var ub_t=(a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);
			var u_b=(b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);

			if(u_b!==0){
				var ua=ua_t/u_b;
				var ub=ub_t/u_b;
				if(0<=ua&&ua<=1&&0<=ub&&ub<=1){
					return false;
				}else{
					return true;
				}
			}else{
				if(ua_t===0||ub_t===0){
					alert("Coincident");
				}else{
					alert("Paralelos");
				}
			}
		};
	}

	function moveClickedPoint (argument) {
		// body...
	}

	var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    function drawLine (point1, point2) {
		context.beginPath();
		context.moveTo(point2.x, point2.y);
		context.lineTo(point1.x, point1.y);
		context.stroke();
	}

    $('#myCanvas').bind('click', function (ev) {
        var $img = $(ev.target);

        var offset = $img.offset();
        var x = ev.clientX - offset.left;
        var y = ev.clientY - offset.top;

        if (after_click>0){
        	shape[after_click] = new point(x,y,after_click);

        	getSlope(point(x,y,after_click));

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