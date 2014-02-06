$(document).ready(function(){
	
	// Social networking tools
	
	// Facebook
	$(".sntools li.facebook a").click(function() {
		
		post = $(this).parents("div.post");
	
		addURL = "http://facebook.com/sharer.php?";
		addURL = addURL + "u=" + encodeURIComponent("http://" + window.location.hostname + $(post).find("h2 a, h4 a").attr("href"));
		addURL = addURL + "&t=" + encodeURIComponent($(post).find("h2 a, h4 a").text());
				
		_gaq.push(["_trackPageview", "/social/facebook/" + $(post).attr("id") + "/"]);
		_gaq.push(["regional._trackPageview", "/social/facebook/" + $(post).attr("id") + "/"]);
	
		window.open(addURL);
		return false;
		
	});
	
	// Facebook like button
	window.fbAsyncInit = function() {
		FB.init({appId: "119503814740869", status: true, cookie: true, xfbml: true});
	};
	(function() {
		var e = document.createElement("script");
		e.async = true;
		e.src = document.location.protocol + "//connect.facebook.net/en_US/all.js";
		if ($("#fb-root").length) document.getElementById("fb-root").appendChild(e);
	}());
	
	$("#fb-root").after("<fb:like href=\"http://" + window.location.hostname + location.pathname + "\" layout=\"button_count\" show_faces=\"false\" width=\"50\" action=\"like\" font=\"verdana\" colorscheme=\"light\"></fb:like>");
	
		
	// Twitter
	$(".sntools li.twitter a").click(function() {
		
		post = $(this).parents("div.post");
	
		$.get("/shorten/?url=" + encodeURI("http://" + window.location.hostname + $(post).find("h2 a, h4 a").attr("href")), function(result) {

			// Random insert
			randomWords = "From the etnies blog:";
	
			addURL = "http://twitter.com/?status=" + randomWords + " ";
			addURL = addURL + encodeURIComponent($(post).find("h2 a, h4 a").text() + " " + result);
				
			_gaq.push(["_trackPageview", "/social/twitter/" + $(post).attr("id") + "/"]);
			_gaq.push(["regional._trackPageview", "/social/twitter/" + $(post).attr("id") + "/"]);
	
			window.open(addURL);
		
		});
		return false;
		
	});

});
