(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{14:function(e,t,a){e.exports={noti:"src_noti__1YoO6",photoinfo:"src_photoinfo__vd3CI",photomosaic:"src_photomosaic__BBxxp",container:"src_container__2CCsS",linkActive:"src_linkActive__1RTXz"}},15:function(e,t,a){e.exports={width100:"Mosaic_width100__S9aJL",widthS:"Mosaic_widthS__1Cwbq",dispNone:"Mosaic_dispNone__1AiSt"}},16:function(e,t,a){e.exports={block:"PopUp_block__1nSDr",dispNone:"PopUp_dispNone__1cfJR",popUpContainer:"PopUp_popUpContainer__3ffK3",thumbnailImg:"PopUp_thumbnailImg__1WL9N"}},17:function(e,t,a){e.exports={spinnerWrapper:"Spinner_spinnerWrapper__3cTx6","spinnerWrapper--darkmode":"Spinner_spinnerWrapper--darkmode__1o2x3",spinner:"Spinner_spinner__16M6Q",rotate:"Spinner_rotate__3-6Yj"}},29:function(e,t){var a=function(){onmessage=function(e){for(var t=e.data.imagedata,a=new Uint8ClampedArray(t.data),n=0,r=0,o=0;o<a.length;o+=4){var i=parseInt(3*a[o]+4*a[o+1]+a[o+2]>>>3);a[o]=i,a[o+1]=i,a[o+2]=i,n+=i,r++}t.data.set(a),postMessage({lightness:Math.round(n/r),imgidx:e.data.imgidx,imageData:t})}}.toString();a=a.substring(a.indexOf("{")+1,a.lastIndexOf("}"));var n=new Blob([a],{type:"application/javascript"}),r=URL.createObjectURL(n);e.exports=r},42:function(e,t,a){"use strict";a.r(t);var n=a(7),r=a(12),o=a(8),i=a(25),s=a(22),c=a(0),l=a.n(c),h=a(27),u=a.n(h),v=a(30),d=a(2),p=a(14),m=a.n(p),f=a(28),g=a(23),x=a(24),b=function(){function e(t){Object(n.a)(this,e);var a={vars:null,consts:null,simulate:function(){},render:function(){},init:function(){},delete:function(){}};for(var r in a)"undefined"==typeof t[r]&&(t[r]=a[r]);this.vars=t.vars,this.consts=t.consts,this.simulate=t.simulate,this.render=t.render,this.init=t.init,this._delete=t.delete,this.simulResult=null,this._prevSResult=null,this.lastReq=null,this.canAnimRun=!0,this.canRender=!0}return Object(r.a)(e,[{key:"animStart",value:function(e){this._init(e),this.renderFrame()}},{key:"_init",value:function(e){this.canvas=e,this.context=e.getContext("2d"),this.init()}},{key:"renderFrame",value:function(e){this.lastReq=requestAnimationFrame(this.renderFrame.bind(this)),this.canAnimRun&&(this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this._simulate(e),this.canRender&&this.render(e))}},{key:"renderPicture",value:function(e){this._init(e),this.canRender&&(this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.render())}},{key:"_simulate",value:function(e){this.simulate(e)}},{key:"delete",value:function(){cancelAnimationFrame(this.lastReq),this._delete()}},{key:"drawPolygon",value:function(e){var t=this;console.assert(e&&e.length>2,"\ub2e4\uac01\ud615\uc744 \uad6c\uc131\ud558\ub294 \uc810\uc774 \ub108\ubb34 \uc791\uc2b5\ub2c8\ub2e4."),this.context.beginPath(),this.context.moveTo(e[0][0],e[0][1]),e.forEach((function(e){t.context.lineTo(e[0],e[1])})),this.context.closePath()}},{key:"fill",value:function(e){this.context.fillStyle=e,this.context.fill()}}],[{key:"rgb2hsv",value:function(e){var t=Math.max(e[0],e[1],e[2]),a=t-Math.min(e[0],e[1],e[2]),n=a&&(t===e[0]?(e[1]-e[2])/a:t===e[1]?2+(e[2]-e[0])/a:4+(e[0]-e[1])/a);return[Math.round(60*(n<0?n+6:n)),t&&a/t,t]}},{key:"hsv2rgb",value:function(e){var t=function(t){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:(t+e[0]/60)%6;return e[2]-e[2]*e[1]*Math.max(Math.min(a,4-a,1),0)};return[t(5),t(3),t(1)]}},{key:"getGreyScale",value:function(e){var t=e;return t.data&&(t=t.data),parseInt(3*t[0]+4*t[1]+t[2]>>>3)}},{key:"lightnessMul",value:function(e,t){for(var a=new ImageData(e.width,e.height),n=new Uint8ClampedArray(e.data),r=0;r<n.length;r+=4)n[r]*=t,n[r+1]*=t,n[r+2]*=t;return a.data.set(n),a}},{key:"lightnessAdd",value:function(e,t){for(var a=new ImageData(e.width,e.height),n=new Uint8ClampedArray(e.data),r=0;r<n.length;r+=4)n[r]+=t,n[r+1]+=t,n[r+2]+=t;return a.data.set(n),a}},{key:"img2greyScale",value:function(e){for(var t=e.data,a=0;a<t.length;a+=4){var n=parseInt(3*t[a]+4*t[a+1]+t[a+2]>>>3);t[a]=n,t[a+1]=n,t[a+2]=n}return e}},{key:"getSafeRect",value:function(e,t,a,n,r,o,i,s,c){var l=e.width,h=e.height;n<0&&(t+=n,n=Math.abs(n)),r<0&&(a+=r,r=Math.abs(r)),s<0&&(o+=s,s=Math.abs(s)),c<0&&(i+=c,c=Math.abs(c));var u=Math.max(t,0),v=Math.min(t+n,l),d=Math.max(a,0),p=Math.min(a+r,h),m=s/n,f=c/r;return[e,u,d,v-u,p-d,t<0?o-t*m:o,a<0?i-a*f:i,(v-u)*m,(p-d)*f]}}]),e}(),S=a(29),j=a.n(S),O=a(15),I=a.n(O),w=a(1),z=50,_=170,M=800,y=function e(){Object(n.a)(this,e),this.bannedList=new Set,this.imageIdx=null},P=function(e){for(var t,a=e.length;0!==a;){t=Math.floor(Math.random()*a),a--;var n=[e[t],e[a]];e[a]=n[0],e[t]=n[1]}return e},U=l.a.memo((function(e){var t=Object(c.useRef)(null),a=Object(c.useRef)(null),n=Object(c.useRef)(null),r=Object(c.useRef)(null),o={},i=[];fetch("https://99-interactions-functions.azurewebsites.net/api/HttpTrigger1?code=gyPykVBnZ5lSl3vwOm3BvEojwZolAbHSuujci28YxApqalzrA2rHfw==",{method:"GET"}).then((function(e){return e.json()})).then((function(t){i=t.imgInfos.value,r.current.crossOrigin="Anonymous",r.current.src=i[0].thumbnailUrl+"&c=7&p=0",e.setTodaySong(t.todaySong)}));var s=function(e){return e.preventDefault()},l=new b({consts:{setPos:function(e,t){l.vars.pos[0]+=e,l.vars.pos[1]+=t,l.vars.pos[2]+=e,l.vars.pos[3]+=t},zoom:function(e,t,a){var n=e/M,r=t/M;a*=l.vars.zoomScale;var o=l.vars.originSize/l.vars.zoomScale;l.vars.zoomScale=Math.min(l.vars.maxZoomScale,Math.max(1,l.vars.zoomScale+a));var i=l.vars.originSize/l.vars.zoomScale,s=o*n,c=o*r,h=i*n,u=i*r,v=l.consts.getClampVal(h-s,u-c),d=Object(x.a)(v,2),p=d[0],m=d[1];l.consts.setPos(p,m)},posToIdx:function(e,a){var n=e/t.current.clientWidth,r=a/t.current.clientWidth,o=l.vars.originSize/l.vars.zoomScale,i=o*n,s=o*r;return[Math.floor((-l.vars.pos[0]+i)/z),Math.floor((-l.vars.pos[1]+s)/z)]},click:function(a,n){var r=l.vars.curHoveredPos[0],o=l.vars.curHoveredPos[1];if(0<=r&&r<h.vars.numOfColPixel&&0<=o&&o<h.vars.numOfRowPixel&&null!==h.vars.mosaicInfo[o][r].imageIdx){var s=l.vars.originSize/l.vars.zoomScale,c=t.current.clientWidth/s,u=r*z*c,v=o*z*c,d=a-(u+=l.vars.pos[0]*c),p=n-(v+=l.vars.pos[1]*c),m=z*c,f=Math.floor(t.current.clientWidth/2-m),g=[0,0];a>t.current.clientWidth/2?g[0]=a+(m-d)-f:g[0]=a-d,n>t.current.clientWidth/2?g[1]=n+(m-p)-f:g[1]=n-p,g[0]=Math.min(t.current.clientWidth-f,Math.max(0,g[0]))+t.current.offsetLeft,g[1]=Math.min(t.current.clientWidth-f,Math.max(0,g[1]))+t.current.offsetTop;var x=h.vars.mosaicInfo[o][r].imageIdx,b=i[Math.floor(x)];e.popUp({popUpSize:f,popUpPos:g,imageId:b.imageId,name:b.name,thumbnail:b.thumbnail,thumbnailUrl:b.thumbnailUrl,webSearchUrl:b.webSearchUrl})}else e.popUp(null)},emp:function(e,t){var a=l.consts.posToIdx(e,t);0<=a[0]&&a[0]<h.vars.numOfColPixel&&0<=a[1]&&a[1]<h.vars.numOfRowPixel?l.vars.curHoveredPos=a:l.vars.curHoveredPos=[-100,-100]},move:function(e,t){if(l.vars.isInit&&l.vars.canMove){e=10*e/l.vars.zoomScale,t=10*t/l.vars.zoomScale;var a=l.consts.getClampVal(e,t),n=Object(x.a)(a,2);e=n[0],t=n[1],l.consts.setPos(e,t)}},getClampVal:function(e,t){var a=l.vars.originSize/l.vars.zoomScale;return a>=l.vars.originSize*l.vars.ratioW?(e=Math.max(-l.vars.pos[0],e),e=Math.min(a-l.vars.pos[2],e)):(e=Math.max(a-l.vars.pos[2],e),e=Math.min(-l.vars.pos[0],e)),a>=l.vars.originSize*l.vars.ratioH?(t=Math.max(-l.vars.pos[1],t),t=Math.min(a-l.vars.pos[3],t)):(t=Math.max(a-l.vars.pos[3],t),t=Math.min(-l.vars.pos[1],t)),[e,t]}},vars:{zoomScale:1,pos:[0,0,0,0],curHoveredPos:[-10,-10],isInit:!1,maxZoomScale:1,originSize:1e3,canMove:!1,ratioW:1,ratioH:1,radioOfPic:1},init:function(){l.vars.originSize=h.canvas.width>h.canvas.height?h.canvas.width:h.canvas.height,l.vars.ratioW=h.canvas.width/l.vars.originSize,l.vars.ratioH=h.canvas.height/l.vars.originSize,l.vars.pos[0]=l.vars.originSize*(1-l.vars.ratioW)/2,l.vars.pos[1]=l.vars.originSize*(1-l.vars.ratioH)/2,l.vars.pos[2]=l.vars.pos[0]+l.vars.originSize*l.vars.ratioW,l.vars.pos[3]=l.vars.pos[1]+l.vars.originSize*l.vars.ratioH,l.vars.maxZoomScale=2*l.vars.originSize/M,l.vars.radioOfPic=o.renderedPixel/l.vars.originSize;var e=l.vars.pos[0]+l.vars.pos[1];e>100&&l.consts.zoom(400,400,l.vars.originSize/(l.vars.originSize-1.7*e)-1),l.vars.isInit=!0},simulate:function(){var e=l.vars.originSize/l.vars.zoomScale,t=[-o.zeroX+l.vars.pos[0]*l.vars.radioOfPic,-o.zeroY+l.vars.pos[1]*l.vars.radioOfPic],a=o.renderedPixel/l.vars.zoomScale,n=4e4/e,r=l.vars.curHoveredPos.slice();r[0]=r[0]*z+l.vars.pos[0],r[1]=r[1]*z+l.vars.pos[1],r[0]*=M/e,r[1]*=M/e,l.simulResult={viewportSize:e,pos:l.vars.pos,picPos:t,viewportSizeForPic:a,hoveredPos:r,hoverLineSize:n}},render:function(){var e,t,a=l.simulResult;(e=l.context).drawImage.apply(e,Object(g.a)(b.getSafeRect(h.canvas,-a.pos[0],-a.pos[1],a.viewportSize,a.viewportSize,0,0,M,M))),l.context.beginPath(),l.context.lineTo(a.hoveredPos[0],a.hoveredPos[1]),l.context.lineTo(a.hoveredPos[0]+a.hoverLineSize,a.hoveredPos[1]),l.context.lineTo(a.hoveredPos[0]+a.hoverLineSize,a.hoveredPos[1]+a.hoverLineSize),l.context.lineTo(a.hoveredPos[0],a.hoveredPos[1]+a.hoverLineSize),l.context.closePath(),l.context.stroke(),l.context.globalAlpha=.25,(t=l.context).drawImage.apply(t,Object(g.a)(b.getSafeRect(r.current,-a.picPos[0],-a.picPos[1],a.viewportSizeForPic,a.viewportSizeForPic,0,0,M,M))),l.context.globalAlpha=1}}),h=new b({consts:{selectUsableImg:function(e,t){var a=[];for(var n in t){var r=t[n][1];e.bannedList.has(r)||a.push(n)}return 0===a.length?null:t[a[Math.floor(Math.random()*a.length)]]},drawRemain:function(){for(var e=5;e<245;e++){var t,a=h.vars.pos_lightness[e],n=h.vars.imgs_lightness,r=[],o=Object(f.a)(a);try{for(o.s();!(t=o.n()).done;){for(var i=t.value,s=h.vars.mosaicInfo,c=s[i[1]][i[0]],l=1,u=h.consts.selectUsableImg(c,r);!u;){var v=null;e+l<255&&(v=h.consts.selectUsableImg(c,n[e+l])),!v&&e-l>0&&(v=h.consts.selectUsableImg(c,n[e-l])),v&&((u=[0,v[1]])[0]=l>0?b.lightnessMul(v[0],e/(e+l)):b.lightnessAdd(v[0],-l),r.push(u)),l++}c.imageIdx=u[1],h.context.putImageData(u[0],i[0]*z,i[1]*z);for(var d=-2;d<=2;d++)for(var p=-2;p<=2;p++){var m=i[0]+d,g=i[1]+p;s[g]&&s[g][m]&&s[g][m].bannedList.add(c.imageIdx)}}}catch(x){o.e(x)}finally{o.f()}}},usingImageSize:100},vars:{pos_lightness:new Array(256).fill(null).map((function(){return[]})),imgs_lightness:new Array(256).fill(null).map((function(){return[]})),base:0,numOfColPixel:0,numOfRowPixel:0,mosaicInfo:null,imgLoadCounter:0},init:function(){h.context.strokeStyle="rgba(0, 0, 0, 0)";var e,t,a,i=r.current.width,s=r.current.height;i>=s?(e=i/_,s=(t=parseInt(s/e))*e,a=_):(e=s/_,i=(a=parseInt(i/e))*e,t=_),h.vars.mosaicInfo=new Array(t);for(var c=0;c<t;c++)h.vars.mosaicInfo[c]=new Array(a).fill(null).map((function(){return new y}));o.renderedW=i,o.renderedH=s,o.zeroX=(r.current.width-o.renderedW)/2,o.zeroY=(r.current.height-o.renderedH)/2,o.renderedPixel=i>s?i:s,n.current.width=a,n.current.height=t,n.current.getContext("2d").drawImage(r.current,o.zeroX,o.zeroY,o.renderedW,o.renderedH,0,0,a,t),h.vars.base=e,h.vars.numOfColPixel=a,h.vars.numOfRowPixel=t,h.canvas.width=a*z,h.canvas.height=t*z},render:function(){for(var e=h.vars,t=n.current.getContext("2d"),a=t.getImageData(0,0,e.numOfColPixel,e.numOfRowPixel).data,r=0;r<e.numOfRowPixel;r++)for(var o=0;o<e.numOfColPixel;o++){var s=r*z,c=o*z,u=4*(r*e.numOfColPixel+o),v=parseInt(3*a[u]+4*a[u+1]+a[u+2]>>>3);h.context.fillStyle="rgb("+v+","+v+","+v+")",h.context.fillRect(c,s,z,z),e.pos_lightness[v].push([o,r])}l.canAnimRun=!0,l.canRender=!0,n.current.width=100,n.current.height=100;for(var d=0;d<255;d++)e.pos_lightness[d]=P(e.pos_lightness[d]);for(var p=function(e){t.drawImage(e.target,0,0,100,100);for(var a=[],n=e.target.idx,r=0;r<4;r++){var o=r%2*z,i=Math.floor(r/2)*z;a.push(t.getImageData(o,i,z,z))}var s=new Worker(j.a);s.onmessage=function(e){var t=e.data.lightness,a=e.data.imgidx,n=e.data.imageData;h.vars.imgs_lightness[t].push([n,a]);for(var r=h.vars.pos_lightness[t],o=0,i=r.length-1;o<=i;){var s=r[o],c=h.vars.mosaicInfo,l=c[s[1]][s[0]];if(l.bannedList.has(a))o++;else{l.imageIdx=a;for(var u=-2;u<=2;u++)for(var v=-2;v<=2;v++){var d=s[0]+u,p=s[1]+v;c[p]&&c[p][d]&&c[p][d].bannedList.add(l.imageIdx)}h.context.putImageData(n,s[0]*z,s[1]*z),r[o]=r[i],o++,i--,r.pop()}}++h.vars.imgLoadCounter,h.vars.imgLoadCounter>=4*h.consts.usingImageSize&&h.consts.drawRemain()};for(var c=0;c<4;c++)s.postMessage({imagedata:a[c],imgidx:n+c/10})},m=function(){h.vars.imgLoadCounter+=4,h.vars.imgLoadCounter>=4*h.consts.usingImageSize&&h.consts.drawRemain()},f=0;f<i.length&&f<h.consts.usingImageSize;f++){var g=new Image;g.crossOrigin="Anonymous",g.idx=f,g.onload=p,g.onerror=m,g.src=i[f].thumbnailUrl+"&w=100&h=100&c=7",i[f].tmpimg=g}}});Object(c.useEffect)((function(){return t.current.addEventListener("wheel",s),t.current.addEventListener("touchmove",s),function(){h.delete(),l.delete()}}),[]);var u=!1,v=[],d=[],p=function(a){var n,r;if(a.touches){if(e.hide(),v.length>=2){for(var o=v[0].pageX-v[1].pageX,i=v[0].pageY-v[1].pageY,s=(v[0].pageX+v[1].pageX)/2-t.current.offsetLeft,c=(v[0].pageY+v[1].pageY)/2-t.current.offsetTop,h=Math.sqrt(o*o+i*i),u=0;u<a.changedTouches.length;u++)v[0].identifier===a.changedTouches[u].identifier?v[0]=a.changedTouches[u]:v[1]=a.changedTouches[u];o=v[0].pageX-v[1].pageX,i=v[0].pageY-v[1].pageY;var d=Math.sqrt(o*o+i*i)-h;return void(h&&l.consts.zoom(s,c,d/t.current.clientWidth))}n=a.touches[0].pageX,r=a.touches[0].pageY,a.movementX=n-v[0].pageX,a.movementY=r-v[0].pageY,v[0]=a.touches[0]}else n=a.pageX-t.current.offsetLeft,r=a.pageY-t.current.offsetTop;l.consts.emp(n,r),l.consts.move(a.movementX,a.movementY)},m=function(e){if(e.touches){if(v.length>2)return;v.push(e.touches[0])}else d=[e.clientX,e.clientY];l.vars.canMove=!0},S=function(e){if(e.touches)v=[];else{var t=e.clientX-d[0];t+=e.clientY-d[1],u=!!t}l.vars.canMove=!1};return Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)("img",{className:I.a.dispNone,ref:r,onLoad:function(n){e.setImageLoaded(!0),l.canRender=!1,l.canAnimRun=!1,h.renderPicture(a.current),l.animStart(t.current)},alt:""}),Object(w.jsx)("canvas",{className:I.a.width100,ref:t,width:M,height:M,onClick:function(e){if(!u){var a=e.pageX-t.current.offsetLeft,n=e.pageY-t.current.offsetTop;l.consts.click(a,n)}},onWheel:function(e){var a=e.pageX-t.current.offsetLeft,n=e.pageY-t.current.offsetTop;e.deltaY>0?l.consts.zoom(a,n,-.1):e.deltaY<0&&l.consts.zoom(a,n,.1)},onMouseMove:p,onMouseDown:m,onMouseUp:S,onMouseLeave:function(e){l.vars.canMove=!1},onTouchStart:m,onTouchMove:p,onTouchEnd:S,children:"\uc774 \ube0c\ub77c\uc6b0\uc800\ub294 \uce94\ubc84\uc2a4\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."}),Object(w.jsx)("canvas",{className:I.a.dispNone,ref:n,width:"100",height:"100"}),Object(w.jsx)("canvas",{className:I.a.dispNone,ref:a,width:"100",height:"100"})]})})),k=a(16),R=a.n(k);var L=function(e){var t;return null!==e.imageInfo&&(t={position:"absolute",left:"".concat(e.imageInfo.popUpPos[0],"px"),top:"".concat(e.imageInfo.popUpPos[1],"px"),width:"".concat(e.imageInfo.popUpSize,"px"),height:"".concat(e.imageInfo.popUpSize,"px")}),Object(w.jsx)(w.Fragment,{children:e.imageInfo&&Object(w.jsx)("div",{className:R.a.popUpContainer,style:t,onMouseLeave:e.hide,children:Object(w.jsxs)("a",{href:e.imageInfo.webSearchUrl,target:"_blank",rel:"noreferrer",title:e.imageInfo.name,children:[Object(w.jsx)("div",{className:R.a.popUpContainer,children:e.imageInfo.name}),Object(w.jsx)("img",{className:R.a.thumbnailImg,src:e.imageInfo.thumbnailUrl+"&w=".concat(e.imageInfo.popUpSize,"&h=").concat(e.imageInfo.popUpSize-50,"&c=7&p=0"),alt:e.imageInfo.name})]})})})},C=a(17),T=a.n(C);function W(e){return Object(w.jsxs)("div",{className:T.a.spinnerWrapper+(e.isDarkMode?" ".concat(T.a["spinnerWrapper--darkmode"]):""),children:[Object(w.jsx)("div",{className:T.a.spinner}),Object(w.jsx)("div",{children:"\ubd88\ub7ec\uc624\ub294 \uc911..."})]})}W.defaultProps={isDarkMode:!1};var A=W,Y=function(e){Object(i.a)(a,e);var t=Object(s.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).state={popUpInfo:null,todaySong:"",imageLoaded:!1},r.popUp=r.popUp.bind(Object(o.a)(r)),r.hide=r.hide.bind(Object(o.a)(r)),r.setTodaySong=r.setTodaySong.bind(Object(o.a)(r)),r.setImageLoaded=r.setImageLoaded.bind(Object(o.a)(r)),r}return Object(r.a)(a,[{key:"popUp",value:function(e){null===e?this.hide():this.setState({popUpInfo:e})}},{key:"hide",value:function(){this.setState({popUpInfo:null})}},{key:"setTodaySong",value:function(e){this.setState({todaySong:e})}},{key:"setImageLoaded",value:function(e){this.setState({imageLoaded:e})}},{key:"render",value:function(){return Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)("header",{}),Object(w.jsxs)("div",{className:m.a.container,children:[Object(w.jsxs)("main",{children:[Object(w.jsxs)("div",{className:m.a.photoinfo,children:[Object(w.jsx)("span",{className:m.a.noti+" material-icons-outlined",children:Object(w.jsxs)("div",{children:[Object(w.jsx)("a",{href:"https://www.melon.com/chart/day/index.htm",target:"_blank",rel:"noreferrer",children:"\uba5c\ub860 \uc77c\uac04 \ucc28\ud2b8"}),", 1\uc704"]})}),Object(w.jsx)("h1",{children:this.state.todaySong})]}),Object(w.jsxs)("div",{className:m.a.photomosaic,children:[!this.state.imageLoaded&&Object(w.jsx)(A,{}),Object(w.jsx)(U,{popUp:this.popUp,hide:this.hide,setTodaySong:this.setTodaySong,setImageLoaded:this.setImageLoaded})]})]}),Object(w.jsx)(L,{imageInfo:this.state.popUpInfo,hide:this.hide})]})]})}}]),a}(l.a.Component),N=function(e){Object(i.a)(a,e);var t=Object(s.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return Object(w.jsx)(w.Fragment,{children:Object(w.jsx)(v.a,{children:Object(w.jsxs)(d.c,{children:[Object(w.jsx)(d.a,{path:"/99-interactions",component:Y}),Object(w.jsx)(d.a,{path:"*",children:"\uc5c6\uc74c"})]})})})}}]),a}(l.a.Component);u.a.render(Object(w.jsx)(N,{}),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.e9ac5b7b.chunk.js.map