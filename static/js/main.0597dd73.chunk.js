(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{11:function(t,e,n){t.exports={boardrow:"tictactoe_boardrow__14O7L",status:"tictactoe_status__1SrtX",square:"tictactoe_square__1UnxA","kbd-navigation":"tictactoe_kbd-navigation__2CL-S",game:"tictactoe_game__20N3M",gameinfo:"tictactoe_gameinfo__ZYz2q"}},13:function(t,e,n){t.exports={container:"src_container__Xu5Sk",linkActive:"src_linkActive__2Jb0z",test:"src_test__g6-Wc"}},19:function(t,e,n){t.exports={card:"Home_card__1Aten",container:"Home_container__2zZpm"}},35:function(t,e,n){"use strict";n.r(e);var i=n(4),s=n(5),a=n(10),r=n(9),c=n(0),o=n.n(c),u=n(18),l=n.n(u),h=n(14),f=n(2),d=n(13),v=n.n(d),p=function(){function t(e){Object(i.a)(this,t);var n={vars:null,consts:null,simulate:function(){},render:function(){},init:function(){},delete:function(){}};for(var s in n)"undefined"==typeof e[s]&&(e[s]=n[s]);this.vars=e.vars,this.consts=e.consts,this.simulate=e.simulate,this.render=e.render,this.init=e.init,this._delete=e.delete,this.simulResult=null,this._prevSResult=null,this.lastReq=null,this.canAnimRun=!1,this.canRender=!1}return Object(s.a)(t,[{key:"animStart",value:function(t){this._init(t),this.renderFrame()}},{key:"_init",value:function(t){this.canvas=t,this.context=t.getContext("2d"),this.init()}},{key:"renderFrame",value:function(t){this.lastReq=requestAnimationFrame(this.renderFrame.bind(this)),this.canAnimRun&&(this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this._simulate(t),this.canRender&&this.render(t))}},{key:"renderPicture",value:function(t){this._init(t),this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.render()}},{key:"_simulate",value:function(t){this.simulate(t)}},{key:"delete",value:function(){cancelAnimationFrame(this.lastReq),this._delete()}},{key:"drawPolygon",value:function(t){var e=this;console.assert(t&&t.length>2,"\ub2e4\uac01\ud615\uc744 \uad6c\uc131\ud558\ub294 \uc810\uc774 \ub108\ubb34 \uc791\uc2b5\ub2c8\ub2e4."),this.context.beginPath(),this.context.moveTo(t[0][0],t[0][1]),t.forEach((function(t){e.context.lineTo(t[0],t[1])})),this.context.closePath()}},{key:"fill",value:function(t){this.context.fillStyle=t,this.context.fill()}}]),t}(),j=function(){function t(e,n){Object(i.a)(this,t),"object"===typeof e&&"object"===typeof n?(this.x=n[0]-e[0],this.y=n[1]-e[1]):"number"===typeof e&&"number"===typeof n?(this.x=e,this.y=n):void 0!==e.x&&void 0!==e.y?(this.x=e.x,this.y=e.y):(this.x=0,this.y=0)}return Object(s.a)(t,[{key:"dotProduct",value:function(t){return this.x*t.x+this.y*t.y}},{key:"nomalize",value:function(){var e=Math.sqrt(this.x*this.x+this.y*this.y);return new t(this.x/e,this.y/e)}},{key:"multiply",value:function(t){return this.x*=t,this.y*=t,this}},{key:"add",value:function(t){return this.x+=t.x,this.y+=t.y,this}},{key:"subtract",value:function(t){return this.x-=t.x,this.y-=t.y,this}},{key:"projection",value:function(e){var n=new t(e);return n.multiply(this.dotProduct(n)/n.dotProduct(n))}},{key:"getRadian",value:function(){var t=Math.acos(this.nomalize().x);return this.y<0&&(t=2*Math.PI-t),t}}],[{key:"interpolation",value:function(e,n,i){if(!e.length&&!n.length)return(1-i)*e+i*n;if(e.length===n.length){for(var s=[],a=0;a<e.length;a++)s[a]=t.interpolation(e[a],n[a],i);return s}}}]),t}(),m=n(1);var b=function(t){var e=Object(c.useRef)(null),n=[-100,-100],i=new p({consts:{totalFlipTime:50,initialV:new j(t.size,0),size:t.size,initialPos:[-100,-100],flipState:{done:0,fliping:1,unfliping:2},unflipedSquare:[[-.4*t.size,-t.size/2-t.size/10],[t.size,-t.size/2],[t.size,t.size/2],[-.4*t.size,t.size/2+t.size/10]],flipedSquare:[[-t.size/2,-t.size/2],[t.size,-t.size/2],[t.size,t.size/2],[-t.size/2,t.size/2]],doflip:function(){i.vars.flipState===i.consts.flipState.done&&(i.vars.flipState=i.consts.flipState.fliping,i.simulResult&&i.simulResult.progress&&(i.simulResult.progress=0),i.vars.isUnflipPended=!1)},unflip:function(){i.vars.flipState===i.consts.flipState.done&&(i.vars.flipState=i.consts.flipState.unfliping,i.simulResult.progress=0,i.vars.isUnflipPended=!1)},calCurV:function(e){var n=new j(i.simulResult.pos,e),s=n.projection(i.simulResult.v),a=new j(n).subtract(s),r=s.add(a.multiply(t.coeff_friction)),c=i.simulResult.v.nomalize().multiply(i.consts.size);c.x+=i.simulResult.pos[0],c.y+=i.simulResult.pos[1],c.add(r);var o=[c.x,c.y];return new j(e,o)}},vars:{flipState:0,isClicked:!1,gra:null,isUnflipPended:!1},init:function(){i.vars.gra=i.context.createLinearGradient(-i.consts.size/2,0,i.consts.size/2,0),i.vars.gra.addColorStop(0,"#57D0CB"),i.vars.gra.addColorStop(1,"#66F6F0"),i.vars.flipState=i.consts.flipState.done},simulate:function(t){var e=i.simulResult,s=i.consts.totalFlipTime;if(e?(e.v=i.consts.calCurV(n),e.pos=n.slice()):(e={v:i.consts.initialV,pos:n.slice(),poligon:i.consts.unflipedSquare,gra:i.vars.gra},i.simulResult=e),i.vars.flipState!==i.consts.flipState.done){e.time||(e.time=t-1,e.progress=0),e.progress=Math.min(1e3,e.progress+1e3/s*(t-e.time)),e.time=t;var a=i.consts.unflipedSquare,r=i.consts.flipedSquare;if(i.vars.flipState===i.consts.flipState.unfliping){var c=[r,a];a=c[0],r=c[1]}e.poligon=j.interpolation(a,r,e.progress/1e3);var o=[87,208,203],u=[102,246,240];if(i.vars.flipState===i.consts.flipState.unfliping){var l=[u,o];o=l[0],u=l[1]}var h=j.interpolation(o,u,e.progress/1e3);h=h.map((function(t){return Math.round(t).toString(16).toUpperCase().padStart(2,"0")})),i.vars.gra.addColorStop(0,"#"+h.join("")),e.gra=i.vars.gra,e.progress>999&&(e.progress=void 0,e.time=void 0,i.vars.flipState=i.consts.flipState.done)}i.vars.isUnflipPended&&i.consts.unflip()},render:function(){var t=i.simulResult;i.context.save(),i.context.translate(t.pos[0],t.pos[1]),i.context.rotate(t.v.getRadian()),i.drawPolygon(t.poligon),i.fill(t.gra),i.context.restore()}});return Object(c.useEffect)((function(){return i.animStart(e.current),function(){i.delete()}}),[]),Object(m.jsx)("canvas",{onMouseMove:function(t){n[0]=t.clientX-e.current.offsetLeft,n[1]=t.clientY-e.current.offsetTop},onMouseDown:function(t){i.consts.doflip()},onMouseUp:function(t){i.vars.isUnflipPended=!0},onMouseEnter:function(t){n[0]=t.clientX-e.current.offsetLeft,n[1]=t.clientY-e.current.offsetTop,i.canAnimRun=!0,i.canRender=!0},onMouseLeave:function(t){i.canAnimRun=!1,i.canRender=!1},ref:e,width:"1000",height:"800",children:"\uc774 \ube0c\ub77c\uc6b0\uc800\ub294 \uce94\ubc84\uc2a4\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."})},x=n(24),g=n(11),O=n.n(g);function y(t){return Object(m.jsx)("button",{className:O.a.square,onClick:t.onClick,children:t.value})}var S=function(t){Object(a.a)(n,t);var e=Object(r.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(s.a)(n,[{key:"renderSquare",value:function(t){var e=this;return Object(m.jsx)(y,{value:this.props.squares[t],onClick:function(){return e.props.onClick(t)}})}},{key:"render",value:function(){return Object(m.jsxs)("div",{children:[Object(m.jsxs)("div",{className:O.a.boardrow,children:[this.renderSquare(0),this.renderSquare(1),this.renderSquare(2)]}),Object(m.jsxs)("div",{className:O.a.boardrow,children:[this.renderSquare(3),this.renderSquare(4),this.renderSquare(5)]}),Object(m.jsxs)("div",{className:O.a.boardrow,children:[this.renderSquare(6),this.renderSquare(7),this.renderSquare(8)]})]})}}]),n}(o.a.Component);function k(t){for(var e=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],n=0;n<e.length;n++){var i=Object(x.a)(e[n],3),s=i[0],a=i[1],r=i[2];if(t[s]&&t[s]===t[a]&&t[s]===t[r])return t[s]}return null}var _=function(t){Object(a.a)(n,t);var e=Object(r.a)(n);function n(t){var s;return Object(i.a)(this,n),(s=e.call(this,t)).state={history:[{squares:Array(9).fill(null)}],stepNumber:0,xIsNext:!0},s}return Object(s.a)(n,[{key:"handleClick",value:function(t){var e=this.state.history.slice(0,this.state.stepNumber+1),n=e[e.length-1].squares.slice();k(n)||n[t]||(n[t]=this.state.xIsNext?"X":"O",this.setState({history:e.concat([{squares:n}]),stepNumber:e.length,xIsNext:!this.state.xIsNext}))}},{key:"jumpTo",value:function(t){this.setState({stepNumber:t,xIsNext:t%2===0})}},{key:"render",value:function(){var t,e=this,n=this.state.history,i=n[this.state.stepNumber],s=k(i.squares),a=n.map((function(t,n){var i=n?"Go to move #"+n:"Go to game start";return Object(m.jsx)("li",{children:Object(m.jsx)("button",{onClick:function(){return e.jumpTo(n)},children:i})},n)}));return t=s?"Winner: "+s:9===this.state.stepNumber?"Draw":"Next player: "+(this.state.xIsNext?"X":"O"),Object(m.jsxs)("div",{className:O.a.game,children:[Object(m.jsx)("div",{className:O.a.gameboard,children:Object(m.jsx)(S,{squares:i.squares,onClick:function(t){return e.handleClick(t)}})}),Object(m.jsxs)("div",{className:O.a.gameinfo,children:[Object(m.jsx)("div",{children:t}),Object(m.jsx)("ol",{children:a})]})]})}}]),n}(o.a.Component),q=n(19),z=n.n(q),C=function(t){Object(a.a)(n,t);var e=Object(r.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){return Object(m.jsx)("div",{className:z.a.card})}}]),n}(o.a.Component),R=function(t){Object(a.a)(n,t);var e=Object(r.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:z.a.container,children:[Object(m.jsx)(C,{}),Object(m.jsx)(C,{}),Object(m.jsx)(C,{}),Object(m.jsx)(C,{})]})}}]),n}(o.a.Component);var w=function(t){var e=Object(c.useRef)(null),n=new p({consts:{myimage:new Image},vars:{isLoaded:!1},init:function(){n.canvas.width=n.consts.myimage.width,n.canvas.height=n.consts.myimage.height,n.context.strokeStyle="rgba(0, 0, 0, 0)"},simulate:function(t){},render:function(){n.context.drawImage(n.consts.myimage,0,0)}});n.consts.myimage.onload=function(){n.vars.isLoaded=!0,e.current&&n.renderPicture(e.current)},n.consts.myimage.src="/99-interactions/macarons.jpg",Object(c.useEffect)((function(){return n.vars.isLoaded&&n.renderPicture(e.current),function(){n.delete()}}),[]);var i=function(t,e,i){for(var s=[0,0,0,0],a=3,r=1;r<a;r++)for(var c=1;c<a;c++)for(var o=i*r/a,u=i*c/a,l=n.context.getImageData(t+o,e+u,1,1).data,h=0;h<4;h++)s[h]+=l[h];a=(a-1)*(a-1);for(var f=0;f<4;f++)s[f]=Math.round(s[f]/a);n.context.beginPath(),n.context.arc(t+i/2,e+i/2,i/2,0,2*Math.PI),n.context.stroke(),n.fill("rgba("+s.join(", ")+")")};return Object(m.jsx)(m.Fragment,{children:Object(m.jsx)("canvas",{onClick:function(t){for(var e=Math.ceil(n.consts.myimage.width/20),s=Math.ceil(n.consts.myimage.height/20),a=0;a<s;a++)for(var r=0;r<e;r++){i(20*r,20*a,20)}},ref:e,width:"800",height:"800",children:"\uc774 \ube0c\ub77c\uc6b0\uc800\ub294 \uce94\ubc84\uc2a4\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."})})},N=function(t){Object(a.a)(n,t);var e=Object(r.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:v.a.container,children:[Object(m.jsxs)("h1",{children:[Object(m.jsx)(h.b,{to:"/99-interactions/home",activeClassName:v.a.linkActive,children:"Home"}),Object(m.jsx)(h.b,{to:"/99-interactions/Tags",activeClassName:v.a.linkActive,children:"Tags"}),Object(m.jsx)(h.b,{to:"/99-interactions/paperDribble",activeClassName:v.a.linkActive,children:"About"}),Object(m.jsx)(h.b,{to:"/99-interactions/contact",activeClassName:v.a.linkActive,children:"Contact"}),Object(m.jsx)(h.b,{to:"/99-interactions/test",activeClassName:v.a.linkActive,children:"test"}),Object(m.jsx)("span",{children:"user"})]}),Object(m.jsxs)(f.c,{children:[Object(m.jsx)(f.a,{path:"/99-interactions/home",children:Object(m.jsx)(R,{})}),Object(m.jsx)(f.a,{path:"/99-interactions/about",children:Object(m.jsx)(_,{})}),Object(m.jsx)(f.a,{path:"/99-interactions/paperDribble",children:Object(m.jsx)(b,{coeff_friction:.6,size:50})}),Object(m.jsx)(f.a,{path:"/99-interactions/test",children:Object(m.jsx)(w,{})})]}),Object(m.jsx)("div",{children:"this will be footer"})]})}}]),n}(o.a.Component),P=function(t){Object(a.a)(n,t);var e=Object(r.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){return Object(m.jsx)(h.a,{children:Object(m.jsxs)(f.c,{children:[Object(m.jsx)(f.a,{path:"/99-interactions",component:N}),Object(m.jsx)(f.a,{path:"*",children:"\uc5c6\uc74c"})]})})}}]),n}(o.a.Component);l.a.render(Object(m.jsx)(P,{}),document.getElementById("root"))}},[[35,1,2]]]);
//# sourceMappingURL=main.0597dd73.chunk.js.map