(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{14:function(e,t,a){e.exports={width100:"Mosaic_width100__2jt-x",widthS:"Mosaic_widthS__3p1_J",dispNone:"Mosaic_dispNone__3qLUa"}},17:function(e,t,a){e.exports={block:"PopUp_block__3mkAn",dispNone:"PopUp_dispNone__1foPo",line:"PopUp_line__1o5o_",width100:"PopUp_width100__3vPiY"}},26:function(e,t,a){e.exports={container:"src_container__Xu5Sk",linkActive:"src_linkActive__2Jb0z"}},28:function(e,t){var a=function(){onmessage=function(e){for(var t=e.data[0],a=e.data[1],n=t.data,r=0,i=0;i<n.length;i+=4)r+=parseInt(3*n[i]+4*n[i+1]+n[i+2]>>>3);var s=t.data.length/4;r=parseInt(r/s),postMessage([r,t,a])}}.toString();a=a.substring(a.indexOf("{")+1,a.lastIndexOf("}"));var n=new Blob([a],{type:"application/javascript"}),r=URL.createObjectURL(n);e.exports=r},29:function(e,t){var a=function(){onmessage=function(e){for(var t=e.data.isFull,a=e.data.lightness,n=e.data.imgData,r=e.data.imgidx,i=e.data.nOfSameLightnessImgs,s=new Uint8ClampedArray(n.data),o=0;o<s.length;o+=4){var c=parseInt(3*s[o]+4*s[o+1]+s[o+2]>>>3);s[o]=c,s[o+1]=c,s[o+2]=c}for(var l=[],h=-20;h<=10;h++)if(a+h>=5&&a+h<=245&&t[a+h]<=i){var v=new ImageData(n.width,n.height),u=new Uint8ClampedArray(s);if(h<0)for(var d=(a+h)/a,f=0;f<u.length;f+=4)u[f]*=d,u[f+1]*=d,u[f+2]*=d;else if(h>0)for(var m=0;m<u.length;m+=4)u[m]+=h,u[m+1]+=h,u[m+2]+=h;v.data.set(u),l.push([a+h,v,r])}postMessage(l)}}.toString();a=a.substring(a.indexOf("{")+1,a.lastIndexOf("}"));var n=new Blob([a],{type:"application/javascript"}),r=URL.createObjectURL(n);e.exports=r},42:function(e,t,a){"use strict";a.r(t);var n=a(7),r=a(11),i=a(12),s=a(23),o=a(20),c=a(0),l=a.n(c),h=a(25),v=a.n(h),u=a(30),d=a(2),f=a(26),m=a.n(f),p=a(27),g=a(21),x=a(22),b=function(){function e(t){Object(n.a)(this,e);var a={vars:null,consts:null,simulate:function(){},render:function(){},init:function(){},delete:function(){}};for(var r in a)"undefined"==typeof t[r]&&(t[r]=a[r]);this.vars=t.vars,this.consts=t.consts,this.simulate=t.simulate,this.render=t.render,this.init=t.init,this._delete=t.delete,this.simulResult=null,this._prevSResult=null,this.lastReq=null,this.canAnimRun=!0,this.canRender=!0}return Object(r.a)(e,[{key:"animStart",value:function(e){this._init(e),this.renderFrame()}},{key:"_init",value:function(e){this.canvas=e,this.context=e.getContext("2d"),this.init()}},{key:"renderFrame",value:function(e){this.lastReq=requestAnimationFrame(this.renderFrame.bind(this)),this.canAnimRun&&(this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this._simulate(e),this.canRender&&this.render(e))}},{key:"renderPicture",value:function(e){this._init(e),this.canRender&&(this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.render())}},{key:"_simulate",value:function(e){this.simulate(e)}},{key:"delete",value:function(){cancelAnimationFrame(this.lastReq),this._delete()}},{key:"drawPolygon",value:function(e){var t=this;console.assert(e&&e.length>2,"\ub2e4\uac01\ud615\uc744 \uad6c\uc131\ud558\ub294 \uc810\uc774 \ub108\ubb34 \uc791\uc2b5\ub2c8\ub2e4."),this.context.beginPath(),this.context.moveTo(e[0][0],e[0][1]),e.forEach((function(e){t.context.lineTo(e[0],e[1])})),this.context.closePath()}},{key:"fill",value:function(e){this.context.fillStyle=e,this.context.fill()}}],[{key:"rgb2hsv",value:function(e){var t=Math.max(e[0],e[1],e[2]),a=t-Math.min(e[0],e[1],e[2]),n=a&&(t===e[0]?(e[1]-e[2])/a:t===e[1]?2+(e[2]-e[0])/a:4+(e[0]-e[1])/a);return[Math.round(60*(n<0?n+6:n)),t&&a/t,t]}},{key:"hsv2rgb",value:function(e){var t=function(t){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:(t+e[0]/60)%6;return e[2]-e[2]*e[1]*Math.max(Math.min(a,4-a,1),0)};return[t(5),t(3),t(1)]}},{key:"getGreyScale",value:function(e){var t=e;return t.data&&(t=t.data),parseInt(3*t[0]+4*t[1]+t[2]>>>3)}},{key:"lightnessMul",value:function(e,t){for(var a=new ImageData(e.width,e.height),n=new Uint8ClampedArray(e.data),r=0;r<n.length;r+=4)n[r]*=t,n[r+1]*=t,n[r+2]*=t;return a.data.set(n),a}},{key:"lightnessAdd",value:function(e,t){for(var a=new ImageData(e.width,e.height),n=new Uint8ClampedArray(e.data),r=0;r<n.length;r+=4)n[r]+=t,n[r+1]+=t,n[r+2]+=t;return a.data.set(n),a}},{key:"img2greyScale",value:function(e){for(var t=e.data,a=0;a<t.length;a+=4){var n=parseInt(3*t[a]+4*t[a+1]+t[a+2]>>>3);t[a]=n,t[a+1]=n,t[a+2]=n}return e}},{key:"getSafeRect",value:function(e,t,a,n,r,i,s,o,c){var l=e.width,h=e.height;n<0&&(t+=n,n=Math.abs(n)),r<0&&(a+=r,r=Math.abs(r)),o<0&&(i+=o,o=Math.abs(o)),c<0&&(s+=c,c=Math.abs(c));var v=Math.max(t,0),u=Math.min(t+n,l),d=Math.max(a,0),f=Math.min(a+r,h),m=o/n,p=c/r;return[e,v,d,u-v,f-d,t<0?i-t*m:i,a<0?s-a*p:s,(u-v)*m,(f-d)*p]}}]),e}(),S=a(28),w=a.n(S),O=a(29),j=a.n(O),I=a(14),z=a.n(I),P=a(1),M=30,y=800,_=function e(){Object(n.a)(this,e),this.bannedList=new Set,this.imageIdx=null},U=l.a.memo((function(e){var t=Object(c.useRef)(null),a=Object(c.useRef)(null),n=Object(c.useRef)(null),r=Object(c.useRef)(null),i={},s=[];fetch("/99-interactions/data.json",{method:"GET"}).then((function(e){return e.json()})).then((function(e){s=e.value,r.current.crossOrigin="Anonymous",r.current.src=s[0].thumbnailUrl}));var o=function(e){return e.preventDefault()},l=new b({consts:{setPos:function(e,t){l.vars.pos[0]+=e,l.vars.pos[1]+=t,l.vars.pos[2]+=e,l.vars.pos[3]+=t},zoom:function(e,t,a){var n=e/y,r=t/y;a*=l.vars.zoomScale;var i=l.vars.originSize/l.vars.zoomScale;l.vars.zoomScale=Math.min(l.vars.maxZoomScale,Math.max(1,l.vars.zoomScale+a));var s=l.vars.originSize/l.vars.zoomScale,o=i*n,c=i*r,h=s*n,v=s*r,u=l.consts.getClampVal(h-o,v-c),d=Object(x.a)(u,2),f=d[0],m=d[1];l.consts.setPos(f,m)},posToIdx:function(e,a){var n=e/t.current.clientWidth,r=a/t.current.clientWidth,i=l.vars.originSize/l.vars.zoomScale,s=i*n,o=i*r;return[Math.floor((-l.vars.pos[0]+s)/M),Math.floor((-l.vars.pos[1]+o)/M)]},click:function(a,n){var r=l.vars.curHoveredPos[0],i=l.vars.curHoveredPos[1];if(0<=r&&r<h.vars.numOfColPixel&&0<=i&&i<h.vars.numOfRowPixel&&null!==h.vars.mosaicInfo[i][r].imageIdx){var o=l.vars.originSize/l.vars.zoomScale,c=t.current.clientWidth/o,v=r*M*c,u=i*M*c,d=a-(v+=l.vars.pos[0]*c),f=n-(u+=l.vars.pos[1]*c),m=M*c,p=Math.floor(t.current.clientWidth/2-m),g=[0,0];a>t.current.clientWidth/2?g[0]=a+(m-d)-p:g[0]=a-d,n>t.current.clientWidth/2?g[1]=n+(m-f)-p:g[1]=n-f,g[0]=Math.min(t.current.clientWidth-p,Math.max(0,g[0]))+t.current.offsetLeft,g[1]=Math.min(t.current.clientWidth-p,Math.max(0,g[1]))+t.current.offsetTop;var x=h.vars.mosaicInfo[i][r].imageIdx,b=s[Math.floor(x)];e.popUp({popUpSize:p,popUpPos:g,imageId:b.imageId,name:b.name,thumbnail:b.thumbnail,thumbnailUrl:b.thumbnailUrl,webSearchUrl:b.webSearchUrl})}else e.popUp(null)},emp:function(e,t){var a=l.consts.posToIdx(e,t);0<=a[0]&&a[0]<h.vars.numOfColPixel&&0<=a[1]&&a[1]<h.vars.numOfRowPixel?l.vars.curHoveredPos=a:l.vars.curHoveredPos=[-100,-100]},move:function(e,t){if(l.vars.isInit&&l.vars.canMove){e=10*e/l.vars.zoomScale,t=10*t/l.vars.zoomScale;var a=l.consts.getClampVal(e,t),n=Object(x.a)(a,2);e=n[0],t=n[1],l.consts.setPos(e,t)}},getClampVal:function(e,t){var a=l.vars.originSize/l.vars.zoomScale;return a>=l.vars.originSize*l.vars.ratioW?(e=Math.max(-l.vars.pos[0],e),e=Math.min(a-l.vars.pos[2],e)):(e=Math.max(a-l.vars.pos[2],e),e=Math.min(-l.vars.pos[0],e)),a>=l.vars.originSize*l.vars.ratioH?(t=Math.max(-l.vars.pos[1],t),t=Math.min(a-l.vars.pos[3],t)):(t=Math.max(a-l.vars.pos[3],t),t=Math.min(-l.vars.pos[1],t)),[e,t]}},vars:{zoomScale:1,pos:[0,0,0,0],curHoveredPos:[-10,-10],isInit:!1,maxZoomScale:1,originSize:1e3,canMove:!1,ratioW:1,ratioH:1,radioOfPic:1},init:function(){l.vars.originSize=h.canvas.width>h.canvas.height?h.canvas.width:h.canvas.height,l.vars.ratioW=h.canvas.width/l.vars.originSize,l.vars.ratioH=h.canvas.height/l.vars.originSize,l.vars.pos[0]=l.vars.originSize*(1-l.vars.ratioW)/2,l.vars.pos[1]=l.vars.originSize*(1-l.vars.ratioH)/2,l.vars.pos[2]=l.vars.pos[0]+l.vars.originSize*l.vars.ratioW,l.vars.pos[3]=l.vars.pos[1]+l.vars.originSize*l.vars.ratioH,l.vars.maxZoomScale=l.vars.originSize*(100/M)/y,l.vars.radioOfPic=i.renderedPixel/l.vars.originSize;var e=l.vars.pos[0]+l.vars.pos[1];e>100&&l.consts.zoom(400,400,l.vars.originSize/(l.vars.originSize-1.7*e)-1),l.vars.isInit=!0},simulate:function(){var e=l.vars.originSize/l.vars.zoomScale,t=[-i.zeroX+l.vars.pos[0]*l.vars.radioOfPic,-i.zeroY+l.vars.pos[1]*l.vars.radioOfPic],a=i.renderedPixel/l.vars.zoomScale,n=24e3/e,r=l.vars.curHoveredPos.slice();r[0]=r[0]*M+l.vars.pos[0],r[1]=r[1]*M+l.vars.pos[1],r[0]*=y/e,r[1]*=y/e,l.simulResult={viewportSize:e,pos:l.vars.pos,picPos:t,viewportSizeForPic:a,hoveredPos:r,hoverLineSize:n}},render:function(){var e,t,a=l.simulResult;(e=l.context).drawImage.apply(e,Object(g.a)(b.getSafeRect(h.canvas,-a.pos[0],-a.pos[1],a.viewportSize,a.viewportSize,0,0,y,y))),l.context.beginPath(),l.context.lineTo(a.hoveredPos[0],a.hoveredPos[1]),l.context.lineTo(a.hoveredPos[0]+a.hoverLineSize,a.hoveredPos[1]),l.context.lineTo(a.hoveredPos[0]+a.hoverLineSize,a.hoveredPos[1]+a.hoverLineSize),l.context.lineTo(a.hoveredPos[0],a.hoveredPos[1]+a.hoverLineSize),l.context.closePath(),l.context.stroke(),l.context.globalAlpha=.2,(t=l.context).drawImage.apply(t,Object(g.a)(b.getSafeRect(r.current,-a.picPos[0],-a.picPos[1],a.viewportSizeForPic,a.viewportSizeForPic,0,0,y,y))),l.context.globalAlpha=1}}),h=new b({consts:{renderLightness:function(e){var t,a=Object(p.a)(h.vars.pos_lightness[e]);try{for(a.s();!(t=a.n()).done;){var n,r=t.value,i=h.vars.mosaicInfo,s=i[r[1]][r[0]],o=h.vars.imgs_lightness,c=new Array;for(var l in o[e]){var v=o[e][l].imgidx;s.bannedList.has(v)||c.push([l,v])}var u=Math.floor(Math.random()*c.length);c[u],s.imageIdx=c[u][1],n=o[e][c[u][0]];for(var d=-1;d<=1;d++)for(var f=-1;f<=1;f++){var m=r[0]+d,g=r[1]+f;i[g]&&i[g][m]&&i[g][m].bannedList.add(s.imageIdx)}h.context.putImageData(n,r[0]*M,r[1]*M)}}catch(x){a.e(x)}finally{a.f()}h.vars.imgs_lightness[e]=null,h.vars.pos_lightness[e]=null},nOfSameLightnessImgs:9},vars:{pos_lightness:new Array(256).fill(null).map((function(){return new Array})),imgs_lightness:new Array(256).fill(null).map((function(){return new Array})),imgInfo:[],isFull:new Array(256).fill(!1),base:0,numOfColPixel:0,numOfRowPixel:0,mosaicInfo:null,renderLightnessCnt:0},init:function(){h.context.strokeStyle="rgba(0, 0, 0, 0)";var e,t,a,s=r.current.width,o=r.current.height;s>=o?(e=s/80,o=(t=parseInt(o/e))*e,a=80):(e=o/80,s=(a=parseInt(s/e))*e,t=80),h.vars.mosaicInfo=new Array(t);for(var c=0;c<t;c++)h.vars.mosaicInfo[c]=new Array(a).fill(null).map((function(){return new _}));i.renderedW=s,i.renderedH=o,i.zeroX=(r.current.width-i.renderedW)/2,i.zeroY=(r.current.height-i.renderedH)/2,i.renderedPixel=s>o?s:o,n.current.width=a,n.current.height=t,n.current.getContext("2d").drawImage(r.current,i.zeroX,i.zeroY,i.renderedW,i.renderedH,0,0,a,t),h.vars.base=e,h.vars.numOfColPixel=a,h.vars.numOfRowPixel=t,h.canvas.width=a*M,h.canvas.height=t*M},render:function(){for(var e=h.vars,t=n.current.getContext("2d"),a=t.getImageData(0,0,e.numOfColPixel,e.numOfRowPixel).data,r=0;r<e.numOfRowPixel;r++)for(var i=0;i<e.numOfColPixel;i++){var o=r*M,c=i*M,v=4*(r*e.numOfColPixel+i),u=parseInt(3*a[v]+4*a[v+1]+a[v+2]>>>3);u=Math.max(0,u-10),h.context.fillStyle="rgb("+u+","+u+","+u+")",h.context.fillRect(c,o,M,M),e.pos_lightness[u].push([i,r])}l.canAnimRun=!0,l.canRender=!0,n.current.width=60,n.current.height=60;for(var d=function(e){t.drawImage(e.target,0,0,60,60);for(var a=[],n=e.target.idx,r=0;r<4;r++){var i=r%2*M,o=Math.floor(r/2)*M;a.push(t.getImageData(i,o,M,M))}if(window.Worker){var c=new Worker(w.a),l=new Worker(j.a);c.onmessage=function(e){for(var t=e.data[0],a=!0,n=-20;n<=10;n++)t+n>=5&&t+n<=245&&(h.vars.isFull[t+n]++,h.vars.isFull[t+n]<=h.consts.nOfSameLightnessImgs&&(a=!1));a||l.postMessage({isFull:h.vars.isFull,lightness:t,nOfSameLightnessImgs:h.consts.nOfSameLightnessImgs,imgData:e.data[1],imgidx:e.data[2]})},l.onmessage=function(e){for(var t=0;t<e.data.length;t++){var a=e.data[t][0];e.data[t][1].imgidx=e.data[t][2],h.vars.imgs_lightness[a].push(e.data[t][1]),h.vars.imgs_lightness[a].length>=h.consts.nOfSameLightnessImgs&&h.consts.renderLightness(a)}};for(var v=0;v<4;v++)c.postMessage([a[v],n+v/10])}else for(var u=0;u<4;u++){for(var d=b.img2greyScale(a[u]),f=0,m=d.data.length/4,p=0;p<d.data.length;p+=4)f+=d.data[p];f=parseInt(f/m);for(var g=-20;g<=10;g++)if(f+g>=10&&f+g<=235&&!h.vars.isFull[f+g]){if(g<0){var x=b.lightnessMul(d,(f+g)/f);x.imgidx=n+u/10,h.vars.imgs_lightness[f+g].push(x)}else if(g>0){var S=b.lightnessAdd(d,g);S.imgidx=n+u/10,h.vars.imgs_lightness[f+g].push(S)}else d.imgidx=n+u/10,h.vars.imgs_lightness[f+g].push(d);h.vars.imgs_lightness[f+g].length>=h.consts.nOfSameLightnessImgs&&(h.vars.isFull[f+g]=!0,h.consts.renderLightness(f+g))}}s[e.target.idx].tmpimg.onload=null,s[e.target.idx].tmpimg=null},f=0;f<s.length/2;f++){var m=new Image;m.crossOrigin="Anonymous",m.idx=f,m.addEventListener("load",d,{once:!0}),m.src=s[f].thumbnailUrl+"&w=100&h=100&c=7",s[f].tmpimg=m}}});Object(c.useEffect)((function(){return t.current.addEventListener("wheel",o),function(){h.delete(),l.delete()}}),[]);var v=!1,u=[],d=function(e){var a,n;e.touches?(a=e.touches[0].pageX-t.current.offsetLeft,n=e.touches[0].pageY-t.current.offsetTop,e.movementX=a-u[0],e.movementY=n-u[1]):(a=e.pageX-t.current.offsetLeft,n=e.pageY-t.current.offsetTop),l.consts.emp(a,n),l.consts.move(e.movementX,e.movementY)},f=function(e){u=e.touches?[e.touches[0].pageX-t.current.offsetLeft,e.touches[0].pageY-t.current.offsetTop]:[e.clientX,e.clientY],l.vars.canMove=!0},m=function(e){if(e.touches)u=null;else{var t=Math.abs(e.clientX-u[0]);t+=Math.abs(e.clientY-u[1]),v=!!t}l.vars.canMove=!1};return Object(P.jsxs)(P.Fragment,{children:[Object(P.jsx)("img",{className:z.a.dispNone,ref:r,onLoad:function(e){l.canRender=!1,l.canAnimRun=!1,h.renderPicture(a.current),l.animStart(t.current)}}),Object(P.jsx)("canvas",{className:z.a.width100,ref:t,width:y,height:y,onClick:function(e){if(!v){var a=e.pageX-t.current.offsetLeft,n=e.pageY-t.current.offsetTop;l.consts.click(a,n)}},onWheel:function(e){var a=e.pageX-t.current.offsetLeft,n=e.pageY-t.current.offsetTop;e.deltaY>0?l.consts.zoom(a,n,-.1):e.deltaY<0&&l.consts.zoom(a,n,.1)},onMouseMove:d,onMouseDown:f,onMouseUp:m,onMouseLeave:function(e){l.vars.canMove=!1},onTouchStart:f,onTouchMove:d,onTouchEnd:m,children:"\uc774 \ube0c\ub77c\uc6b0\uc800\ub294 \uce94\ubc84\uc2a4\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."}),Object(P.jsx)("canvas",{className:z.a.dispNone,ref:n,width:"100",height:"100"}),Object(P.jsx)("canvas",{className:z.a.dispNone,ref:a,width:"100",height:"100"})]})})),R=a(17),k=a.n(R);var L=function(e){var t;return null!==e.imageInfo&&(t={position:"absolute",left:"".concat(e.imageInfo.popUpPos[0],"px"),top:"".concat(e.imageInfo.popUpPos[1],"px"),width:"".concat(e.imageInfo.popUpSize,"px"),height:"".concat(e.imageInfo.popUpSize,"px")}),Object(P.jsx)(P.Fragment,{children:e.imageInfo&&Object(P.jsx)("div",{className:k.a.line,style:t,onMouseLeave:e.hide,children:Object(P.jsx)("img",{className:k.a.width100,src:e.imageInfo.thumbnailUrl+"&w=".concat(e.imageInfo.popUpSize,"&h=").concat(e.imageInfo.popUpSize,"&c=7")})})})},A=function(e){Object(s.a)(a,e);var t=Object(o.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).state={popUpInfo:null},r.popUp=r.popUp.bind(Object(i.a)(r)),r.hide=r.hide.bind(Object(i.a)(r)),r}return Object(r.a)(a,[{key:"popUp",value:function(e){null===e?this.hide():this.setState({popUpInfo:e})}},{key:"hide",value:function(){this.setState({popUpInfo:null})}},{key:"render",value:function(){return Object(P.jsx)(P.Fragment,{children:Object(P.jsxs)("div",{className:m.a.container,children:[Object(P.jsx)("main",{children:Object(P.jsx)(U,{popUp:this.popUp})}),Object(P.jsx)(L,{imageInfo:this.state.popUpInfo,hide:this.hide})]})})}}]),a}(l.a.Component),C=function(e){Object(s.a)(a,e);var t=Object(o.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return Object(P.jsxs)(P.Fragment,{children:[Object(P.jsx)(u.a,{children:Object(P.jsxs)(d.c,{children:[Object(P.jsx)(d.a,{path:"/99-interactions",component:A}),Object(P.jsx)(d.a,{path:"*",children:"\uc5c6\uc74c"})]})}),Object(P.jsx)("footer",{children:Object(P.jsx)("p",{children:"contact : iginganza@gmail.com"})})]})}}]),a}(l.a.Component);v.a.render(Object(P.jsx)(C,{}),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.159f33ed.chunk.js.map