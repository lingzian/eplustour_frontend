
window.fbAsyncInit = function () {
    FB.init({
        appId: "1753521041361303",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v3.0"
    });
};
(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.async = true;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
    js.status = 'loading';
    js.onload = function(){
        js.status = 'success';
        js.afterLoad&&js.afterLoad();
    }
    js.onerror = function(){
        js.status = 'error';
        js.afterError&&js.afterError();
    }
})(document, "script", "facebook-jssdk");

module.exports.FBLoad = opt => {
	if (window.FB != undefined) {
		opt.success && opt.success();
	} else {
		let js = document.getElementById('facebook-jssdk');
		let status = js.status;
		if(status === 'loading' && !js.afterLoad && !js.afterError){
			js.afterLoad = function(){
				opt.success&&opt.success();
			}
			js.afterError = function(){
				opt.error&&opt.error();
			}
		}else if(status === 'success'){
			opt.success&&opt.success();
		}else if(status === 'error'){
			opt.error&&opt.error();
		}
	}
}