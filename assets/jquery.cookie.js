/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */(function(r){typeof define=="function"&&define.amd?define(["jquery"],r):typeof exports=="object"?module.exports=r(require("jquery")):r(jQuery)})(function(r){var m=/\+/g;function d(e){return t.raw?e:encodeURIComponent(e)}function g(e){return t.raw?e:decodeURIComponent(e)}function x(e){return d(t.json?JSON.stringify(e):String(e))}function j(e){e.indexOf('"')===0&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(m," ")),t.json?JSON.parse(e):e}catch(i){}}function f(e,i){var n=t.raw?e:j(e);return r.isFunction(i)?i(n):n}var t=r.cookie=function(e,i,n){if(arguments.length>1&&!r.isFunction(i)){if(n=r.extend({},t.defaults,n),typeof n.expires=="number"){var h=n.expires,a=n.expires=new Date;a.setMilliseconds(a.getMilliseconds()+h*864e5)}return document.cookie=[d(e),"=",x(i),n.expires?"; expires="+n.expires.toUTCString():"",n.path?"; path="+n.path:"",n.domain?"; domain="+n.domain:"",n.secure?"; secure":""].join("")}for(var o=e?void 0:{},l=document.cookie?document.cookie.split("; "):[],c=0,C=l.length;c<C;c++){var s=l[c].split("="),p=g(s.shift()),u=s.join("=");if(e===p){o=f(u,i);break}!e&&(u=f(u))!==void 0&&(o[p]=u)}return o};t.defaults={},r.removeCookie=function(e,i){return r.cookie(e,"",r.extend({},i,{expires:-1})),!r.cookie(e)}});
//# sourceMappingURL=/s/files/1/0693/3459/7926/t/6/assets/jquery.cookie.js.map?v=1676150755
