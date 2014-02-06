/*!
 * JSGif Sequence generator for jQuery
 * http://codedealers.com/labs/jsgif/
 *
 * Copyright (c) 2011 Ivo Janssen <ivo@codedealers.com>
 * MIT licensed.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @version 1.21
 */
 
// Animation unique ID counter
var animationIDCount = 0;
// Animation interval timer
var animationLoop = false;
 
var JSGif = {
	// Create animation to be used with JSGIF
	createFrom: function(fromImg, timing) {
		
		// Default timing
		if (timing == undefined) timing = 150;
		
		// File name syntax regex
		fileRegex = /^(.+_)([0-9]+)(\.(jpg|png|gif))$/ig;
		
		// Make sure image format is correct
		imgBase = $(fromImg).attr("src");
		fileRegex.lastIndex = 0;
		matches = fileRegex.exec(imgBase);
		if (!matches) alert("Incorrect file name for animation! '" + imgBase + "' must end in '_xxx.jpg'!");	
		
		// Get ID for animation
		if ($(fromImg).attr("id")) animationID = $(fromImg).attr("id");
		else animationID = "animation" + animationIDCount++;
		
		// Set basic variables
		animationFrames = [];
		animationFrameCount = parseInt(matches[2], 10);
		animationWidth = $(fromImg).attr("width");
		animationHeight = $(fromImg).attr("height");
		animationClass = $(fromImg).attr("class");
		animationTiming = timing;
		
		// Add every frame
		for(i = 1; i <= animationFrameCount; i++) {
			frameNum = i.toString();
			while (frameNum.length < 3) frameNum = "0" + frameNum;
			animationFrames.push(matches[1] + frameNum + matches[3]);
		}
		
		// Write html/css to contain animation
		animationContainer = $("<div id=\"" + animationID + "\" class=\"" + animationClass + "\"></div>").css({
			"position": "relative",
			"height": animationHeight + "px",
			"width": animationWidth + "px"
		}).data("frameCount", animationFrameCount).data("timing", animationTiming);
		if (JSGif.isMobile()) {
			animationContainer.bind("click", JSGif.start);
			startMessage = $("<p class=\"message\">Click to start!</p>");
			startMessage.css({
				"position": "absolute",
				"z-index": animationFrameCount + 2,
				"left": 0,
				"top": Math.round(animationHeight / 2) + "px",
				"width": "100%",
				"text-align": "center"
			});
			animationContainer.append(startMessage);
		}
		else animationContainer.bind("mouseenter", JSGif.start).bind("mouseleave", JSGif.stop);

		// Create frame counter
		frameCounter = $("<ul class=\"framecounter\"></ul>").bind("mouseleave", JSGif.unPause);
		$.each(animationFrames, function(index, frame) {
			
			// Insert frame
			frameContainer = $("<img src=\"" + frame + "\" width=\"" + animationWidth + "\" height=\"" + animationHeight + "\" alt=\"Frame " + (index + 1) + "\" />");
			frameContainer.css({
				"z-index": animationFrameCount - index,
				"position": "absolute",
				"left": "0",
				"top": "0"
			}).data("initialZ", animationFrameCount - index);
			animationContainer.append(frameContainer);
			
			// Insert way to skip to frame
			frameSkip = $("<li><span>" + (index + 1) + "</span></li>");
			frameSkip.css({
				"z-index": animationFrameCount + 3,
				"position": "absolute",
				"display": "block",
				"left": Math.floor(index * (animationWidth / animationFrameCount)) + "px",
				"width": Math.floor(animationWidth / animationFrameCount) + "px",
				"bottom": "0"
			}).bind("mouseenter", JSGif.frame);
			frameCounter.append(frameSkip);
		});
		
		if (!JSGif.isMobile()) {
			frameCounter.css({
				"z-index": animationFrameCount + 2,
				"position": "absolute",
				"left": "0",
				"bottom": "0",
				"width": animationWidth + "px",
				"display": "none"
			});
			animationContainer.append(frameCounter);
		}
		
		return animationContainer;
		
	},
	// Load specific frame
	frame: function() {
		frameNum = $(this).text() - 1;
		animation = $(this).parent().parent();
		animation.data("paused", true);
		
		$(animation).find("img").each(function(index, frameImage) {
			$(frameImage).css("z-index", frameNum);
			frameNum--;
			if (frameNum == 0) frameNum = $(animation).data("frameCount");
		});
		
		$(this).addClass("active").siblings().removeClass("active");
	},
	// Check for supported browser
	isMobile: function() {
		userAgent = navigator.userAgent.toLowerCase();
		if (userAgent.search(/iphone|ipod|android/) > -1) return true;
		return false;
	},
	// Load next frame
	next: function(animation) {		
		if ($(animation).data("paused")) return true;
		animFrames = $(animation).find("img");
		$(animFrames).each(function(index, e) {
			zIndex = $(this).css("z-index");
			if (zIndex >= animFrames.length) zIndex = 1;
			else zIndex++;
			$(this).css("z-index", zIndex);
			if (zIndex == animFrames.length) currentFrame = index;
		});
		$(animation).find("ul li").removeClass("active");
		$(animation).find("ul li").eq(currentFrame).addClass("active");
	},
	// Reset animation
	reset: function(animation) {
		frames = $(animation).find("img");
		$(frames).each(function() {
			$(this).css("z-index", $(this).data("initialZ"));
		});	
		$(animation).find("ul li").removeClass("active");
		$(animation).find("ul li").eq(0).addClass("active");
	},
	// Start animation
	start: function() {
		animation = this;
		$(animation).find(".message").hide();
		if (!animationLoop) animationLoop = setInterval(function() { JSGif.next(animation) }, $(animation).data("timing"));
		else JSGif.stop();
	},
	// Stop animation
	stop: function() {
		animation = this;
		clearInterval(animationLoop);
		animationLoop = false;
		if ($(animation).hasClass("reset")) JSGif.reset(animation);
	},
	// Unpause animation
	unPause: function() {
		$(this).parent().data("paused", false);
	}
}