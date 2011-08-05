/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.grid.enhanced.plugins.DnD"]||(dojo._hasResource["dojox.grid.enhanced.plugins.DnD"]=!0,dojo.provide("dojox.grid.enhanced.plugins.DnD"),dojo.require("dojox.grid.enhanced._Plugin"),dojo.require("dojox.grid.enhanced.plugins.Selector"),dojo.require("dojox.grid.enhanced.plugins.Rearrange"),dojo.require("dojo.dnd.move"),dojo.require("dojo.dnd.Source"),function(){var s=function(a){a.sort(function(a,b){return a-b});for(var c=[[a[0]]],b=1,d=0;b<a.length;++b)a[b]==a[b-1]+1?c[d].push(a[b]):
c[++d]=[a[b]];return c},n=function(a){for(var c=a[0],b=1;b<a.length;++b)c=c.concat(a[b]);return c};dojo.declare("dojox.grid.enhanced.plugins.DnD",dojox.grid.enhanced._Plugin,{name:"dnd",_targetAnchorBorderWidth:2,_copyOnly:!1,_config:{row:{within:!0,"in":!0,out:!0},col:{within:!0,"in":!0,out:!0},cell:{within:!0,"in":!0,out:!0}},constructor:function(a,c){this.grid=a;this._config=dojo.clone(this._config);c=dojo.isObject(c)?c:{};this.setupConfig(c.dndConfig);this._copyOnly=!!c.copyOnly;this._mixinGrid();
this.selector=a.pluginMgr.getPlugin("selector");this.rearranger=a.pluginMgr.getPlugin("rearrange");this.rearranger.setArgs(c);this._clear();this._elem=new dojox.grid.enhanced.plugins.GridDnDElement(this);this._source=new dojox.grid.enhanced.plugins.GridDnDSource(this._elem.node,{grid:a,dndElem:this._elem,dnd:this});this._container=dojo.query(".dojoxGridMasterView",this.grid.domNode)[0];this._initEvents()},destroy:function(){this.inherited(arguments);this._clear();this._source.destroy();this._elem.destroy();
this._config=this.rearranger=this.selector=this.grid=this._container=null},_mixinGrid:function(){this.grid.setupDnDConfig=dojo.hitch(this,"setupConfig");this.grid.dndCopyOnly=dojo.hitch(this,"copyOnly")},setupConfig:function(a){if(a&&dojo.isObject(a)){var c=["row","col","cell"],b=["within","in","out"],d=this._config;dojo.forEach(c,function(c){if(c in a){var e=a[c];e&&dojo.isObject(e)?dojo.forEach(b,function(a){a in e&&(d[c][a]=!!e[a])}):dojo.forEach(b,function(a){d[c][a]=!!e})}});dojo.forEach(b,function(b){if(b in
a){var e=a[b];e&&dojo.isObject(e)?dojo.forEach(c,function(a){a in e&&(d[a][b]=!!e[a])}):dojo.forEach(c,function(a){d[a][b]=!!e})}})}},copyOnly:function(a){if(typeof a!="undefined")this._copyOnly=!!a;return this._copyOnly},_isOutOfGrid:function(a){var c=dojo.position(this.grid.domNode),b=a.clientX,a=a.clientY;return a<c.y||a>c.y+c.h||b<c.x||b>c.x+c.w},_onMouseMove:function(a){if(this._dndRegion&&!this._dnding&&!this._externalDnd)this._dnding=!0,this._startDnd(a);else{if(this._isMouseDown&&!this._dndRegion)delete this._isMouseDown,
this._oldCursor=dojo.style(dojo.body(),"cursor"),dojo.style(dojo.body(),"cursor","not-allowed");var c=this._isOutOfGrid(a);if(!this._alreadyOut&&c)this._alreadyOut=!0,this._dnding&&this._destroyDnDUI(!0,!1),this._moveEvent=a,this._source.onOutEvent();else if(this._alreadyOut&&!c)this._alreadyOut=!1,this._dnding&&this._createDnDUI(a,!0),this._moveEvent=a,this._source.onOverEvent()}},_onMouseUp:function(){if(!this._extDnding&&!this._isSource){var a=this._dnding&&!this._alreadyOut;a&&this._config[this._dndRegion.type].within&&
this._rearrange();this._endDnd(a)}dojo.style(dojo.body(),"cursor",this._oldCursor||"");delete this._isMouseDown},_initEvents:function(){var a=this.grid,c=this.selector;this.connect(dojo.doc,"onmousemove","_onMouseMove");this.connect(dojo.doc,"onmouseup","_onMouseUp");this.connect(a,"onCellMouseOver",function(a){if(!this._dnding&&!c.isSelecting()&&!a.ctrlKey)this._dndReady=c.isSelected("cell",a.rowIndex,a.cell.index),c.selectEnabled(!this._dndReady)});this.connect(a,"onHeaderCellMouseOver",function(){this._dndReady&&
c.selectEnabled(!0)});this.connect(a,"onRowMouseOver",function(a){this._dndReady&&!a.cell&&c.selectEnabled(!0)});this.connect(a,"onCellMouseDown",function(a){if(!a.ctrlKey&&this._dndReady)this._dndRegion=this._getDnDRegion(a.rowIndex,a.cell.index),this._isMouseDown=!0});this.connect(a,"onCellMouseUp",function(a){if(!this._dndReady&&!c.isSelecting()&&a.cell)this._dndReady=c.isSelected("cell",a.rowIndex,a.cell.index),c.selectEnabled(!this._dndReady)});this.connect(a,"onCellClick",function(a){this._dndReady&&
!a.ctrlKey&&!a.shiftKey&&c.select("cell",a.rowIndex,a.cell.index)});this.connect(a,"onEndAutoScroll",function(a,c,f,e,g){this._dnding&&this._markTargetAnchor(g)});this.connect(dojo.doc,"onkeydown",function(a){if(a.keyCode==dojo.keys.ESCAPE)this._endDnd(!1);else if(a.keyCode==dojo.keys.CTRL)c.selectEnabled(!0),this._isCopy=!0});this.connect(dojo.doc,"onkeyup",function(a){if(a.keyCode==dojo.keys.CTRL)c.selectEnabled(!this._dndReady),this._isCopy=!1})},_clear:function(){this._moveEvent=this._target=
this._dndRegion=null;this._targetAnchor={};this._extDnding=this._alreadyOut=this._isSource=this._externalDnd=this._dnding=!1},_getDnDRegion:function(a,c){var b=this.selector,d=b._selected,f=!!d.cell.length|!!d.row.length<<1|!!d.col.length<<2,e;switch(f){case 1:e="cell";if(!this._config[e].within&&!this._config[e].out)break;var g=this.grid.layout.cells,f=function(a){for(var c=0,b=a.min.col;b<=a.max.col;++b)g[b].hidden&&++c;return(a.max.row-a.min.row+1)*(a.max.col-a.min.col+1-c)},h={max:{row:-1,col:-1},
min:{row:Infinity,col:Infinity}};dojo.forEach(d[e],function(a){if(a.row<h.min.row)h.min.row=a.row;if(a.row>h.max.row)h.max.row=a.row;if(a.col<h.min.col)h.min.col=a.col;if(a.col>h.max.col)h.max.col=a.col});if(dojo.some(d[e],function(b){return b.row==a&&b.col==c})&&f(h)==d[e].length&&dojo.every(d[e],function(a){return a.row>=h.min.row&&a.row<=h.max.row&&a.col>=h.min.col&&a.col<=h.max.col}))return{type:e,selected:[h],handle:{row:a,col:c}};break;case 2:case 4:e=f==2?"row":"col";if(!this._config[e].within&&
!this._config[e].out)break;d=b.getSelected(e);if(d.length)return{type:e,selected:s(d),handle:f==2?a:c}}return null},_startDnd:function(a){this._createDnDUI(a)},_endDnd:function(a){this._destroyDnDUI(!1,a);this._clear()},_createDnDUI:function(a,c){var b=dojo.position(this.grid.views.views[0].domNode);dojo.style(this._container,"height",b.h+"px");try{c||this._createSource(a),this._createMoveable(a),this._oldCursor=dojo.style(dojo.body(),"cursor"),dojo.style(dojo.body(),"cursor","default")}catch(d){console.warn("DnD._createDnDUI() error:",
d)}},_destroyDnDUI:function(a,c){try{c&&this._destroySource(),this._unmarkTargetAnchor(),a||this._destroyMoveable(),dojo.style(dojo.body(),"cursor",this._oldCursor)}catch(b){console.warn("DnD._destroyDnDUI() error:",this.grid.id,b)}},_createSource:function(a){this._elem.createDnDNodes(this._dndRegion);var c=dojo.dnd.manager(),b=c.makeAvatar;c._dndPlugin=this;c.makeAvatar=function(){var a=new dojox.grid.enhanced.plugins.GridDnDAvatar(c);delete c._dndPlugin;return a};c.startDrag(this._source,this._elem.getDnDNodes(),
a.ctrlKey);c.makeAvatar=b;c.onMouseMove(a)},_destroySource:function(){dojo.publish("/dnd/cancel");this._elem.destroyDnDNodes()},_createMoveable:function(){if(!this._markTagetAnchorHandler)this._markTagetAnchorHandler=this.connect(dojo.doc,"onmousemove","_markTargetAnchor")},_destroyMoveable:function(){this.disconnect(this._markTagetAnchorHandler);delete this._markTagetAnchorHandler},_calcColTargetAnchorPos:function(a,c){var b,d,f,e;e=a.clientX;var g=this.grid.layout.cells,h=dojo._isBodyLtr(),i=this._getVisibleHeaders();
for(b=0;b<i.length;++b)if(d=dojo.position(i[b].node),h?(b===0||e>=d.x)&&e<d.x+d.w:(b===0||e<d.x+d.w)&&e>=d.x){f=d.x+(h?0:d.w);break}else if(h?b===i.length-1&&e>=d.x+d.w:b===i.length-1&&e<d.x){++b;f=d.x+(h?d.w:0);break}if(b<i.length){if(e=i[b].cell.index,this.selector.isSelected("col",e)&&this.selector.isSelected("col",e-1)){d=this._dndRegion.selected;for(b=0;b<d.length;++b)if(dojo.indexOf(d[b],e)>=0){e=d[b][0];d=dojo.position(g[e].getHeaderNode());f=d.x+(h?0:d.w);break}}}else e=g.length;this._target=
e;return f-c.x},_calcRowTargetAnchorPos:function(a,c){var b=this.grid,d;d=0;for(var f=b.layout.cells;f[d].hidden;)++d;for(var e=b.layout.cells[d],f=b.scroller.firstVisibleRow,g=dojo.position(e.getNode(f));g.y+g.h<a.clientY;){if(++f>=b.rowCount)break;g=dojo.position(e.getNode(f))}if(f<b.rowCount){if(this.selector.isSelected("row",f)&&this.selector.isSelected("row",f-1)){b=this._dndRegion.selected;for(d=0;d<b.length;++d)if(dojo.indexOf(b[d],f)>=0){f=b[d][0];g=dojo.position(e.getNode(f));break}}d=g.y}else d=
g.y+g.h;this._target=f;return d-c.y},_calcCellTargetAnchorPos:function(a,c,b){var d=this._dndRegion.selected[0],f=this._dndRegion.handle,e=this.grid,g=dojo._isBodyLtr(),h=e.layout.cells,i,j,l,o,n,r,m,p,k;j=f.col-d.min.col;l=d.max.col-f.col;var q;b.childNodes.length?(q=dojo.query(".dojoxGridCellBorderLeftTopDIV",b)[0],b=dojo.query(".dojoxGridCellBorderRightBottomDIV",b)[0]):(q=dojo.create("div",{"class":"dojoxGridCellBorderLeftTopDIV"},b),b=dojo.create("div",{"class":"dojoxGridCellBorderRightBottomDIV"},
b));for(k=d.min.col+1;k<f.col;++k)h[k].hidden&&--j;for(k=f.col+1;k<d.max.col;++k)h[k].hidden&&--l;o=this._getVisibleHeaders();for(k=j;k<o.length-l;++k)if(i=dojo.position(o[k].node),a.clientX>=i.x&&a.clientX<i.x+i.w||k==j&&(g?a.clientX<i.x:a.clientX>=i.x+i.w)||k==o.length-l-1&&(g?a.clientX>=i.x+i.w:a<i.x)){m=o[k-j];p=o[k+l];j=dojo.position(m.node);l=dojo.position(p.node);m=m.cell.index;p=p.cell.index;r=g?j.x:l.x;n=g?l.x+l.w-j.x:j.x+j.w-l.x;break}for(k=0;h[k].hidden;)++k;g=h[k];j=e.scroller.firstVisibleRow;
for(l=dojo.position(g.getNode(j));l.y+l.h<a.clientY;)if(++j<e.rowCount)l=dojo.position(g.getNode(j));else break;f=j>=f.row-d.min.row?j-f.row+d.min.row:0;a=f+d.max.row-d.min.row;a>=e.rowCount&&(a=e.rowCount-1,f=a-d.max.row+d.min.row);j=dojo.position(g.getNode(f));l=dojo.position(g.getNode(a));d=j.y;e=l.y+l.h-j.y;this._target={min:{row:f,col:m},max:{row:a,col:p}};g=(dojo.marginBox(q).w-dojo.contentBox(q).w)/2;m=dojo.position(h[m].getNode(f));dojo.style(q,{width:m.w-g+"px",height:m.h-g+"px"});h=dojo.position(h[p].getNode(a));
dojo.style(b,{width:h.w-g+"px",height:h.h-g+"px"});return{h:e,w:n,l:r-c.x,t:d-c.y}},_markTargetAnchor:function(a){try{var c=this._dndRegion.type;if(!this._alreadyOut&&!(this._dnding&&!this._config[c].within||this._extDnding&&!this._config[c]["in"])){var b,d,f,e,g=this._targetAnchor[c],h=dojo.position(this._container);g||(g=this._targetAnchor[c]=dojo.create("div",{"class":c=="cell"?"dojoxGridCellBorderDIV":"dojoxGridBorderDIV"}),dojo.style(g,"display","none"),this._container.appendChild(g));switch(c){case "col":b=
h.h;d=this._targetAnchorBorderWidth;f=this._calcColTargetAnchorPos(a,h);e=0;break;case "row":b=this._targetAnchorBorderWidth;d=h.w;f=0;e=this._calcRowTargetAnchorPos(a,h);break;case "cell":var i=this._calcCellTargetAnchorPos(a,h,g);b=i.h;d=i.w;f=i.l;e=i.t}typeof b=="number"&&typeof d=="number"&&typeof f=="number"&&typeof e=="number"?(dojo.style(g,{height:b+"px",width:d+"px",left:f+"px",top:e+"px"}),dojo.style(g,"display","")):this._target=null}}catch(j){console.warn("DnD._markTargetAnchor() error:",
j)}},_unmarkTargetAnchor:function(){this._dndRegion&&this._targetAnchor[this._dndRegion.type]&&dojo.style(this._targetAnchor[this._dndRegion.type],"display","none")},_getVisibleHeaders:function(){return dojo.map(dojo.filter(this.grid.layout.cells,function(a){return!a.hidden}),function(a){return{node:a.getHeaderNode(),cell:a}})},_rearrange:function(){if(this._target!==null){var a=this._dndRegion.type,c=this._dndRegion.selected;if(a==="cell")this.rearranger[this._isCopy||this._copyOnly?"copyCells":
"moveCells"](c[0],this._target);else this.rearranger[a=="col"?"moveColumns":"moveRows"](n(c),this._target);this._target=null}},onDraggingOver:function(a){if(!this._dnding&&a){this._extDnding=a._isSource=!0;if(!this._externalDnd)this._externalDnd=!0,this._dndRegion=this._mapRegion(a.grid,a._dndRegion);this._createDnDUI(this._moveEvent,!0);this.grid.pluginMgr.getPlugin("autoScroll").readyForAutoScroll=!0}},_mapRegion:function(a,c){if(c.type==="cell"){var b=c.selected[0],d=this.grid.layout.cells,f=a.layout.cells,
e,g=0;for(e=b.min.col;e<=b.max.col;++e)f[e].hidden||++g;for(e=0;g>0;++e)d[e].hidden||--g;var h=dojo.clone(c);h.selected[0].min.col=0;h.selected[0].max.col=e-1;for(e=b.min.col;e<=c.handle.col;++e)f[e].hidden||++g;for(e=0;g>0;++e)d[e].hidden||--g;h.handle.col=e}return c},onDraggingOut:function(a){if(this._externalDnd&&(this._extDnding=!1,this._destroyDnDUI(!0,!1),a))a._isSource=!1},onDragIn:function(a,c){var b=!1;if(this._target!==null){b=a._dndRegion.selected;switch(a._dndRegion.type){case "cell":this.rearranger.changeCells(a.grid,
b[0],this._target);break;case "row":b=n(b),this.rearranger.insertRows(a.grid,b,this._target)}b=!0}this._endDnd(!0);if(a.onDragOut)a.onDragOut(b&&!c)},onDragOut:function(a){if(a&&!this._copyOnly)switch(a=this._dndRegion.selected,this._dndRegion.type){case "cell":this.rearranger.clearCells(a[0]);break;case "row":this.rearranger.removeRows(n(a))}this._endDnd(!0)},_canAccept:function(a){if(!a)return!1;var c=a._dndRegion,b=c.type;if(!this._config[b]["in"]||!a._config[b].out)return!1;var d=this.grid,f=
c.selected,c=dojo.filter(d.layout.cells,function(a){return!a.hidden}).length,e=d.rowCount,g=!0;switch(b){case "cell":f=f[0],g=d.store.getFeatures()["dojo.data.api.Write"]&&f.max.row-f.min.row<=e&&dojo.filter(a.grid.layout.cells,function(a){return a.index>=f.min.col&&a.index<=f.max.col&&!a.hidden}).length<=c;case "row":if(a._allDnDItemsLoaded())return g}return!1},_allDnDItemsLoaded:function(){if(this._dndRegion){var a=this._dndRegion.selected,c=[];switch(this._dndRegion.type){case "cell":for(var b=
a[0].min.row,a=a[0].max.row;b<=a;++b)c.push(b);break;case "row":c=n(a);break;default:return!1}var d=this.grid._by_idx;return dojo.every(c,function(a){return!!d[a]})}return!1}});dojo.declare("dojox.grid.enhanced.plugins.GridDnDElement",null,{constructor:function(a){this.plugin=a;this.node=dojo.create("div");this._items={}},destroy:function(){this.plugin=null;dojo.destroy(this.node);this._items=this.node=null},createDnDNodes:function(a){this.destroyDnDNodes();var c=["grid/"+a.type+"s"],b=this.plugin.grid.id+
"_dndItem";dojo.forEach(a.selected,function(a,f){var e=b+f;this._items[e]={type:c,data:a,dndPlugin:this.plugin};this.node.appendChild(dojo.create("div",{id:e}))},this)},getDnDNodes:function(){return dojo.map(this.node.childNodes,function(a){return a})},destroyDnDNodes:function(){dojo.empty(this.node);this._items={}},getItem:function(a){return this._items[a]}});dojo.declare("dojox.grid.enhanced.plugins.GridDnDSource",dojo.dnd.Source,{accept:["grid/cells","grid/rows","grid/cols"],constructor:function(a,
c){this.grid=c.grid;this.dndElem=c.dndElem;this.dndPlugin=c.dnd;this.sourcePlugin=null},destroy:function(){this.inherited(arguments);this.sourcePlugin=this.dndPlugin=this.dndElem=this.grid=null},getItem:function(a){return this.dndElem.getItem(a)},checkAcceptance:function(a,c){if(this!=a&&c[0]){var b=a.getItem(c[0].id);if(b.dndPlugin)for(var d=b.type,f=0;f<d.length;++f){if(d[f]in this.accept){if(this.dndPlugin._canAccept(b.dndPlugin))this.sourcePlugin=b.dndPlugin;else return!1;break}}else if("grid/rows"in
this.accept){var e=[];dojo.forEach(c,function(b){b=a.getItem(b.id);if(b.data&&dojo.indexOf(b.type,"grid/rows")>=0){var c=b.data;typeof b.data=="string"&&(c=dojo.fromJson(b.data));c&&e.push(c)}});if(e.length)this.sourcePlugin={_dndRegion:{type:"row",selected:[e]}};else return!1}}return this.inherited(arguments)},onDraggingOver:function(){this.dndPlugin.onDraggingOver(this.sourcePlugin)},onDraggingOut:function(){this.dndPlugin.onDraggingOut(this.sourcePlugin)},onDndDrop:function(a,c,b,d){this.onDndCancel();
if(this!=a&&this==d)this.dndPlugin.onDragIn(this.sourcePlugin,b)}});dojo.declare("dojox.grid.enhanced.plugins.GridDnDAvatar",dojo.dnd.Avatar,{construct:function(){this._itemType=this.manager._dndPlugin._dndRegion.type;this._itemCount=this._getItemCount();this.isA11y=dojo.hasClass(dojo.body(),"dijit_a11y");var a=dojo.create("table",{border:"0",cellspacing:"0","class":"dojoxGridDndAvatar",style:{position:"absolute",zIndex:"1999",margin:"0px"}}),c=this.manager.source,b=dojo.create("tbody",null,a),b=
dojo.create("tr",null,b),d=dojo.create("td",{"class":"dojoxGridDnDIcon"},b);this.isA11y&&dojo.create("span",{id:"a11yIcon",innerHTML:this.manager.copy?"+":"<"},d);dojo.create("td",{"class":"dojoxGridDnDItemIcon "+this._getGridDnDIconClass()},b);d=dojo.create("td",null,b);dojo.create("span",{"class":"dojoxGridDnDItemCount",innerHTML:c.generateText?this._generateText():""},d);dojo.style(b,{opacity:0.9});this.node=a},_getItemCount:function(){var a=this.manager._dndPlugin._dndRegion.selected,c=0;switch(this._itemType){case "cell":var a=
a[0],c=this.manager._dndPlugin.grid.layout.cells,b=a.max.col-a.min.col+1,d=a.max.row-a.min.row+1;if(b>1)for(var f=a.min.col;f<=a.max.col;++f)c[f].hidden&&--b;c=b*d;break;case "row":case "col":c=n(a).length}return c},_getGridDnDIconClass:function(){return{row:["dojoxGridDnDIconRowSingle","dojoxGridDnDIconRowMulti"],col:["dojoxGridDnDIconColSingle","dojoxGridDnDIconColMulti"],cell:["dojoxGridDnDIconCellSingle","dojoxGridDnDIconCellMulti"]}[this._itemType][this._itemCount==1?0:1]},_generateText:function(){return"("+
this._itemCount+")"}});dojox.grid.EnhancedGrid.registerPlugin(dojox.grid.enhanced.plugins.DnD,{dependency:["selector","rearrange"]})}());