/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.charting.plot2d.Default"]||(dojo._hasResource["dojox.charting.plot2d.Default"]=!0,dojo.provide("dojox.charting.plot2d.Default"),dojo.require("dojox.charting.plot2d.common"),dojo.require("dojox.charting.plot2d.Base"),dojo.require("dojox.lang.utils"),dojo.require("dojox.lang.functional"),dojo.require("dojox.lang.functional.reversed"),dojo.require("dojox.gfx.fx"),function(){var w=dojox.lang.functional,p=dojox.lang.utils,q=dojox.charting.plot2d.common,z=w.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Default",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",lines:!0,areas:!1,markers:!1,tension:"",animate:!1},optionalParams:{stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:"",markerStroke:{},markerOutline:{},markerShadow:{},markerFill:{},markerFont:"",markerFontColor:""},constructor:function(i,b){this.opt=dojo.clone(this.defaultParams);p.updateWithObject(this.opt,b);p.updateWithPattern(this.opt,b,this.optionalParams);this.series=[];this.hAxis=
this.opt.hAxis;this.vAxis=this.opt.vAxis;this.animate=this.opt.animate},render:function(i,b){if(this.zoom&&!this.isDataDirty())return this.performZoom(i,b);this.resetEvents();if(this.dirty=this.isDirty()){dojo.forEach(this.series,z);this._eventSeries={};this.cleanGroup();this.group.setTransform(null);var e=this.group;w.forEachRev(this.series,function(a){a.cleanGroup(e)})}for(var r=this.chart.theme,n,g,p=this.events(),s=this.series.length-1;s>=0;--s){var a=this.series[s];if(!this.dirty&&!a.dirty)r.skip(),
this._reconnectEvents(a.name);else if(a.cleanGroup(),a.data.length){for(var c=r.next(this.opt.areas?"area":"line",[this.opt,a],!0),e=a.group,j=[],o=[],k=null,d,x=this._hScaler.scaler.getTransformerFromModel(this._hScaler),y=this._vScaler.scaler.getTransformerFromModel(this._vScaler),A=this._eventSeries[a.name]=Array(a.data.length),h=0;h<a.data.length;h++)a.data[h]!=null?(k||(k=[],o.push(h),j.push(k)),k.push(a.data[h])):k=null;for(var f=0;f<j.length;f++){d=typeof j[f][0]=="number"?dojo.map(j[f],function(a,
c){return{x:x(c+o[f]+1)+b.l,y:i.height-b.b-y(a)}},this):dojo.map(j[f],function(a){return{x:x(a.x)+b.l,y:i.height-b.b-y(a.y)}},this);k=this.opt.tension?q.curve(d,this.opt.tension):"";if(this.opt.areas&&d.length>1){var h=c.series.fill,l=dojo.clone(d);this.opt.tension?a.dyn.fill=e.createPath(k+" "+("L"+l[l.length-1].x+","+(i.height-b.b)+" L"+l[0].x+","+(i.height-b.b)+" L"+l[0].x+","+l[0].y)).setFill(h).getFill():(l.push({x:d[d.length-1].x,y:i.height-b.b}),l.push({x:d[0].x,y:i.height-b.b}),l.push(d[0]),
a.dyn.fill=e.createPolyline(l).setFill(h).getFill())}if(this.opt.lines||this.opt.markers)if(n=c.series.stroke,c.series.outline)g=a.dyn.outline=q.makeStroke(c.series.outline),g.width=2*g.width+n.width;if(this.opt.markers)a.dyn.marker=c.symbol;var t=null,u=null,v=null;if(n&&c.series.shadow&&d.length>1){var m=c.series.shadow,h=dojo.map(d,function(a){return{x:a.x+m.dx,y:a.y+m.dy}});if(this.opt.lines)a.dyn.shadow=this.opt.tension?e.createPath(q.curve(h,this.opt.tension)).setStroke(m).getStroke():e.createPolyline(h).setStroke(m).getStroke();
if(this.opt.markers&&c.marker.shadow)m=c.marker.shadow,v=dojo.map(h,function(a){return e.createPath("M"+a.x+" "+a.y+" "+c.symbol).setStroke(m).setFill(m.color)},this)}if(this.opt.lines&&d.length>1){if(g)a.dyn.outline=this.opt.tension?e.createPath(k).setStroke(g).getStroke():e.createPolyline(d).setStroke(g).getStroke();a.dyn.stroke=this.opt.tension?e.createPath(k).setStroke(n).getStroke():e.createPolyline(d).setStroke(n).getStroke()}if(this.opt.markers){t=Array(d.length);u=Array(d.length);g=null;if(c.marker.outline)g=
q.makeStroke(c.marker.outline),g.width=2*g.width+(c.marker.stroke?c.marker.stroke.width:0);dojo.forEach(d,function(a,d){var b="M"+a.x+" "+a.y+" "+c.symbol;g&&(u[d]=e.createPath(b).setStroke(g));t[d]=e.createPath(b).setStroke(c.marker.stroke).setFill(c.marker.fill)},this);a.dyn.markerFill=c.marker.fill;a.dyn.markerStroke=c.marker.stroke;p?dojo.forEach(t,function(c,b){var e={element:"marker",index:b+o[f],run:a,shape:c,outline:u[b]||null,shadow:v&&v[b]||null,cx:d[b].x,cy:d[b].y};typeof j[f][0]=="number"?
(e.x=b+o[f]+1,e.y=j[f][b]):(e.x=j[f][b].x,e.y=j[f][b].y);this._connectEvents(e);A[b+o[f]]=e},this):delete this._eventSeries[a.name]}}a.dirty=!1}else a.dirty=!1,r.skip()}this.animate&&dojox.gfx.fx.animateTransform(dojo.delegate({shape:this.group,duration:1200,transform:[{name:"translate",start:[0,i.height-b.b],end:[0,0]},{name:"scale",start:[1,0],end:[1,1]},{name:"original"}]},this.animate)).play();this.dirty=!1;return this}})}());