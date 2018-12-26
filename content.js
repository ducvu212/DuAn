(function(){

	var nude = (function(){
		// private var definition
		var canvas = null,
		ctx = null,
		resultFn = null,
		// private functions
		initCanvas = function(){
			canvas = document.createElement("canvas");
			// the canvas should not be visible
			canvas.style.display = "none";
			var b = document.getElementsByTagName("body")[0];
			b.appendChild(canvas);
			ctx = canvas.getContext("2d");
		},
		loadImageById = function(id){
			// get the image
			var img = document.getElementById(id);
			// apply the width and height to the canvas element
			canvas.width = img.width;
			canvas.height = img.height;
			// reset the result function
			resultFn = null;
			// draw the image into the canvas element
			ctx.drawImage(img, 0, 0);

		},
		scanImage = function(){
			// get the image data
			var image = ctx.getImageData(0, 0, canvas.width, canvas.height),
			imageData = image.data;

			var myWorker = new Worker('worker.nude.js'),
			message = [imageData, canvas.width, canvas.height];
			myWorker.postMessage(message);
			myWorker.onmessage = function(event){
				resultHandler(event.data);
			}
		},
		// the result handler will be executed when the analysing process is done
		// the result contains true (it is nude) or false (it is not nude)
		// if the user passed an result function to the scan function, the result function will be executed
		resultHandler = function(result){
			
			if(resultFn){
				resultFn(result);
			}else{
				if(result)
					console.log("the picture contains nudity");
			}
			
		}
		// public interface
		return {
			init: function(){
				initCanvas();
				// if web worker are not supported, append the noworker script
				if(!!!window.Worker){
					document.write(unescape("%3Cscript src='noworker.nude.js' type='text/javascript'%3E%3C/script%3E"));
				}
					
			},
			load: function(param){
				loadImageById(param);
			},
			scan: function(fn){
				if(arguments.length>0 && typeof(arguments[0]) == "function"){
					resultFn = fn;
				}
				scanImage();
			}
		};
	})();
	// register nude at window object
	if(!window.nude)
		window.nude = nude;
	// and initialize it
	nude.init();
})();

function setImage(){
  var imgs = document.getElementsByTagName("img")[0].id;
  for(var i=0, l=imgs.length;i<l;i++){
	var image = imgs[i];
	  console.log(image);
    nude.load(image);
		nude.scan(function(result){
			if(result == image.expected){
				matches.push(image);
			}
			if(i != images.length-1){
					testImage(i+1);
			}else{
					var endTime = new Date().getTime();
					console.log("Test complete:");
					console.log("Test duration: "+(endTime-startTime)+"ms");
					console.log("Checked "+images.length + " images for nudity.");
					console.log(matches.length + " / "+ images.length + " images returned the expected result");
					if(matches.length != images.length){
						console.log("Detection algorithm checked successfully for nudity at the following images: ");
						console.log(matches);
					}
			}
		});

 };
}
 setInterval(setImage, 10);