/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.grid._Grid"]||(dojo._hasResource["dojox.grid._Grid"]=!0,dojo.provide("dojox.grid._Grid"),dojo.require("dijit.dijit"),dojo.require("dijit.Menu"),dojo.require("dojox.html.metrics"),dojo.require("dojox.grid.util"),dojo.require("dojox.grid._Scroller"),dojo.require("dojox.grid._Layout"),dojo.require("dojox.grid._View"),dojo.require("dojox.grid._ViewManager"),dojo.require("dojox.grid._RowManager"),dojo.require("dojox.grid._FocusManager"),dojo.require("dojox.grid._EditManager"),
dojo.require("dojox.grid.Selection"),dojo.require("dojox.grid._RowSelector"),dojo.require("dojox.grid._Events"),dojo.requireLocalization("dijit","loading",null,"ROOT,ar,ca,cs,da,de,el,es,fi,fr,he,hu,it,ja,kk,ko,nb,nl,pl,pt,pt-pt,ro,ru,sk,sl,sv,th,tr,zh,zh-tw"),function(){if(!dojo.isCopyKey)dojo.isCopyKey=dojo.dnd.getCopyKeyState;dojo.declare("dojox.grid._Grid",[dijit._Widget,dijit._Templated,dojox.grid._Events],{templateString:'<div hidefocus="hidefocus" role="grid" dojoAttachEvent="onmouseout:_mouseOut">\n\t<div class="dojoxGridMasterHeader" dojoAttachPoint="viewsHeaderNode" role="presentation"></div>\n\t<div class="dojoxGridMasterView" dojoAttachPoint="viewsNode" role="presentation"></div>\n\t<div class="dojoxGridMasterMessages" style="display: none;" dojoAttachPoint="messagesNode"></div>\n\t<span dojoAttachPoint="lastFocusNode" tabindex="0"></span>\n</div>\n',
classTag:"dojoxGrid",rowCount:5,keepRows:75,rowsPerPage:25,autoWidth:!1,initialWidth:"",autoHeight:"",rowHeight:0,autoRender:!0,defaultHeight:"15em",height:"",structure:null,elasticView:-1,singleClickEdit:!1,selectionMode:"extended",rowSelector:"",columnReordering:!1,headerMenu:null,placeholderLabel:"GridColumns",selectable:!1,_click:null,loadingMessage:"<span class='dojoxGridLoading'>${loadingState}</span>",errorMessage:"<span class='dojoxGridError'>${errorState}</span>",noDataMessage:"",escapeHTMLInData:!0,
formatterScope:null,editable:!1,sortInfo:0,themeable:!0,_placeholders:null,_layoutClass:dojox.grid._Layout,buildRendering:function(){this.inherited(arguments);if(!this.domNode.getAttribute("tabIndex"))this.domNode.tabIndex="0";this.createScroller();this.createLayout();this.createViews();this.createManagers();this.createSelection();this.connect(this.selection,"onSelected","onSelected");this.connect(this.selection,"onDeselected","onDeselected");this.connect(this.selection,"onChanged","onSelectionChanged");
dojox.html.metrics.initOnFontResize();this.connect(dojox.html.metrics,"onFontResize","textSizeChanged");dojox.grid.util.funnelEvents(this.domNode,this,"doKeyEvent",dojox.grid.util.keyEvents);this.selectionMode!="none"&&dojo.attr(this.domNode,"aria-multiselectable",this.selectionMode=="single"?"false":"true");dojo.addClass(this.domNode,this.classTag);this.isLeftToRight()||dojo.addClass(this.domNode,this.classTag+"Rtl")},postMixInProperties:function(){this.inherited(arguments);var a=dojo.i18n.getLocalization("dijit",
"loading",this.lang);this.loadingMessage=dojo.string.substitute(this.loadingMessage,a);this.errorMessage=dojo.string.substitute(this.errorMessage,a);if(this.srcNodeRef&&this.srcNodeRef.style.height)this.height=this.srcNodeRef.style.height;this._setAutoHeightAttr(this.autoHeight,!0);this.lastScrollTop=this.scrollTop=0},postCreate:function(){this._placeholders=[];this._setHeaderMenuAttr(this.headerMenu);this._setStructureAttr(this.structure);this._click=[];this.inherited(arguments);if(this.domNode&&
this.autoWidth&&this.initialWidth)this.domNode.style.width=this.initialWidth;this.domNode&&!this.editable&&dojo.attr(this.domNode,"aria-readonly","true")},destroy:function(){this.domNode.onReveal=null;this.domNode.onSizeChange=null;delete this._click;this.edit.destroy();delete this.edit;this.views.destroyViews();this.scroller&&(this.scroller.destroy(),delete this.scroller);this.focus&&(this.focus.destroy(),delete this.focus);this.headerMenu&&this._placeholders.length&&(dojo.forEach(this._placeholders,
function(a){a.unReplace(!0)}),this.headerMenu.unBindDomNode(this.viewsHeaderNode));this.inherited(arguments)},_setAutoHeightAttr:function(a,b){typeof a=="string"&&(a=!a||a=="false"?!1:a=="true"?!0:window.parseInt(a,10));typeof a=="number"&&(isNaN(a)&&(a=!1),a<0?a=!0:a===0&&(a=!1));this.autoHeight=a;this._autoHeight=typeof a=="boolean"?a:typeof a=="number"?a>=this.get("rowCount"):!1;this._started&&!b&&this.render()},_getRowCountAttr:function(){return this.updating&&this.invalidated&&this.invalidated.rowCount!=
void 0?this.invalidated.rowCount:this.rowCount},textSizeChanged:function(){this.render()},sizeChange:function(){this.update()},createManagers:function(){this.rows=new dojox.grid._RowManager(this);this.focus=new dojox.grid._FocusManager(this);this.edit=new dojox.grid._EditManager(this)},createSelection:function(){this.selection=new dojox.grid.Selection(this)},createScroller:function(){this.scroller=new dojox.grid._Scroller;this.scroller.grid=this;this.scroller.renderRow=dojo.hitch(this,"renderRow");
this.scroller.removeRow=dojo.hitch(this,"rowRemoved")},createLayout:function(){this.layout=new this._layoutClass(this);this.connect(this.layout,"moveColumn","onMoveColumn")},onMoveColumn:function(){this.render()},onResizeColumn:function(){},createViews:function(){this.views=new dojox.grid._ViewManager(this);this.views.createView=dojo.hitch(this,"createView")},createView:function(a,b){var c=new (dojo.getObject(a))({grid:this,index:b});this.viewsNode.appendChild(c.domNode);this.viewsHeaderNode.appendChild(c.headerNode);
this.views.addView(c);dojo.attr(this.domNode,"align",dojo._isBodyLtr()?"left":"right");return c},buildViews:function(){for(var a=0,b;b=this.layout.structure[a];a++)this.createView(b.type||dojox._scopeName+".grid._View",a).setStructure(b);this.scroller.setContentNodes(this.views.getContentNodes())},_setStructureAttr:function(a){a&&dojo.isString(a)&&(dojo.deprecated("dojox.grid._Grid.set('structure', 'objVar')","use dojox.grid._Grid.set('structure', objVar) instead","2.0"),a=dojo.getObject(a));this.structure=
a;if(!a)if(this.layout.structure)a=this.layout.structure;else return;this.views.destroyViews();this.focus.focusView=null;a!==this.layout.structure&&this.layout.setStructure(a);this._structureChanged()},setStructure:function(a){dojo.deprecated("dojox.grid._Grid.setStructure(obj)","use dojox.grid._Grid.set('structure', obj) instead.","2.0");this._setStructureAttr(a)},getColumnTogglingItems:function(){return dojo.map(this.layout.cells,function(a){if(!a.menuItems)a.menuItems=[];var b=this,c=new dijit.CheckedMenuItem({label:a.name,
checked:!a.hidden,_gridCell:a,onChange:function(a){if(b.layout.setColumnVisibility(this._gridCell.index,a)){var c=this._gridCell.menuItems;c.length>1&&dojo.forEach(c,function(b){b!==this&&b.setAttribute("checked",a)},this);a=dojo.filter(b.layout.cells,function(a){a.menuItems.length>1?dojo.forEach(a.menuItems,"item.set('disabled', false);"):a.menuItems[0].set("disabled",!1);return!a.hidden});a.length==1&&dojo.forEach(a[0].menuItems,"item.set('disabled', true);")}},destroy:function(){this._gridCell.menuItems.splice(dojo.indexOf(this._gridCell.menuItems,
this),1);delete this._gridCell;dijit.CheckedMenuItem.prototype.destroy.apply(this,arguments)}});a.menuItems.push(c);return c},this)},_setHeaderMenuAttr:function(a){if(this._placeholders&&this._placeholders.length)dojo.forEach(this._placeholders,function(a){a.unReplace(!0)}),this._placeholders=[];this.headerMenu&&this.headerMenu.unBindDomNode(this.viewsHeaderNode);if(this.headerMenu=a)if(this.headerMenu.bindDomNode(this.viewsHeaderNode),this.headerMenu.getPlaceholders)this._placeholders=this.headerMenu.getPlaceholders(this.placeholderLabel)},
setHeaderMenu:function(a){dojo.deprecated("dojox.grid._Grid.setHeaderMenu(obj)","use dojox.grid._Grid.set('headerMenu', obj) instead.","2.0");this._setHeaderMenuAttr(a)},setupHeaderMenu:function(){this._placeholders&&this._placeholders.length&&dojo.forEach(this._placeholders,function(a){a._replaced&&a.unReplace(!0);a.replace(this.getColumnTogglingItems())},this)},_fetch:function(){this.setScrollTop(0)},getItem:function(){return null},showMessage:function(a){a?(this.messagesNode.innerHTML=a,this.messagesNode.style.display=
""):(this.messagesNode.innerHTML="",this.messagesNode.style.display="none")},_structureChanged:function(){this.buildViews();this.autoRender&&this._started&&this.render()},hasLayout:function(){return this.layout.cells.length},resize:function(a,b){this._pendingChangeSize=a;this._pendingResultSize=b;this.sizeChange()},_getPadBorder:function(){return this._padBorder=this._padBorder||dojo._getPadBorderExtents(this.domNode)},_getHeaderHeight:function(){var a=this.viewsHeaderNode.style,b=a.display=="none"?
0:this.views.measureHeader();a.height=b+"px";this.views.normalizeHeaderNodeHeight();return b},_resize:function(a,b){a=a||this._pendingChangeSize;b=b||this._pendingResultSize;delete this._pendingChangeSize;delete this._pendingResultSize;if(this.domNode){var c=this.domNode.parentNode;if(c&&!(c.nodeType!=1||!this.hasLayout()||c.style.visibility=="hidden"||c.style.display=="none")){var h=this._getPadBorder(),d=void 0,f;if(this._autoHeight)this.domNode.style.height="auto";else if(typeof this.autoHeight==
"number")f=d=this._getHeaderHeight(),f+=this.scroller.averageRowHeight*this.autoHeight,this.domNode.style.height=f+"px";else if(this.domNode.clientHeight<=h.h)c==document.body?this.domNode.style.height=this.defaultHeight:this.height?this.domNode.style.height=this.height:this.fitTo="parent";b&&(a=b);if(a)dojo.marginBox(this.domNode,a),this.height=this.domNode.style.height,delete this.fitTo;else if(this.fitTo=="parent")f=this._parentContentBoxHeight=this._parentContentBoxHeight||dojo._getContentBox(c).h,
this.domNode.style.height=Math.max(0,f)+"px";c=dojo.some(this.views.views,function(a){return a.flexCells});!this._autoHeight&&(f||dojo._getContentBox(this.domNode).h)===0?this.viewsHeaderNode.style.display="none":(this.viewsHeaderNode.style.display="block",!c&&d===void 0&&(d=this._getHeaderHeight()));c&&(d=void 0);this.adaptWidth();this.adaptHeight(d);this.postresize()}}},adaptWidth:function(){var a=!this.initialWidth&&this.autoWidth,b=this.views.arrange(1,a?0:this.domNode.clientWidth||this.domNode.offsetWidth-
this._getPadBorder().w);this.views.onEach("adaptWidth");if(a)this.domNode.style.width=b+"px"},adaptHeight:function(a){var a=a===void 0?this._getHeaderHeight():a,b=this._autoHeight?-1:Math.max(this.domNode.clientHeight-a,0)||0;this.views.onEach("setSize",[0,b]);this.views.onEach("adaptHeight");if(!this._autoHeight){var c=0,h=0,d=dojo.filter(this.views.views,function(a){(a=a.hasHScrollbar())?c++:h++;return!a});c>0&&h>0&&dojo.forEach(d,function(a){a.adaptHeight(!0)})}this.scroller.windowHeight=this.autoHeight===
!0||b!=-1||typeof this.autoHeight=="number"&&this.autoHeight>=this.get("rowCount")?b:Math.max(this.domNode.clientHeight-a,0)},startup:function(){this._started||(this.inherited(arguments),this.autoRender&&this.render())},render:function(){if(this.domNode&&this._started)this.hasLayout()?(this.update=this.defaultUpdate,this._render()):this.scroller.init(0,this.keepRows,this.rowsPerPage)},_render:function(){this.scroller.init(this.get("rowCount"),this.keepRows,this.rowsPerPage);this.prerender();this.setScrollTop(0);
this.postrender()},prerender:function(){this.keepRows=this._autoHeight?0:this.keepRows;this.scroller.setKeepInfo(this.keepRows);this.views.render();this._resize()},postrender:function(){this.postresize();this.focus.initFocusView();dojo.setSelectable(this.domNode,this.selectable)},postresize:function(){if(this._autoHeight)this.viewsNode.style.height=Math.max(this.views.measureContent())+"px"},renderRow:function(a,b){this.views.renderRow(a,b,this._skipRowRenormalize)},rowRemoved:function(a){this.views.rowRemoved(a)},
invalidated:null,updating:!1,beginUpdate:function(){this.invalidated=[];this.updating=!0},endUpdate:function(){this.updating=!1;var a=this.invalidated,b;if(a.all)this.update();else if(a.rowCount!=void 0)this.updateRowCount(a.rowCount);else for(b in a)this.updateRow(Number(b));this.invalidated=[]},defaultUpdate:function(){if(this.domNode)this.updating?this.invalidated.all=!0:(this.lastScrollTop=this.scrollTop,this.prerender(),this.scroller.invalidateNodes(),this.setScrollTop(this.lastScrollTop),this.postrender())},
update:function(){this.render()},updateRow:function(a){a=Number(a);this.updating?this.invalidated[a]=!0:(this.views.updateRow(a),this.scroller.rowHeightChanged(a))},updateRows:function(a,b){var a=Number(a),b=Number(b),c;if(this.updating)for(c=0;c<b;c++)this.invalidated[c+a]=!0;else{for(c=0;c<b;c++)this.views.updateRow(c+a,this._skipRowRenormalize);this.scroller.rowHeightChanged(a)}},updateRowCount:function(a){this.updating?this.invalidated.rowCount=a:(this.rowCount=a,this._setAutoHeightAttr(this.autoHeight,
!0),this.layout.cells.length&&this.scroller.updateRowCount(a),this._resize(),this.layout.cells.length&&this.setScrollTop(this.scrollTop))},updateRowStyles:function(a){this.views.updateRowStyles(a)},getRowNode:function(a){if(this.focus.focusView&&!(this.focus.focusView instanceof dojox.grid._RowSelector))return this.focus.focusView.rowNodes[a];else for(var b=0,c;c=this.views.views[b];b++)if(!(c instanceof dojox.grid._RowSelector))return c.rowNodes[a];return null},rowHeightChanged:function(a){this.views.renormalizeRow(a);
this.scroller.rowHeightChanged(a)},fastScroll:!0,delayScroll:!1,scrollRedrawThreshold:dojo.isIE?100:50,scrollTo:function(a){if(this.fastScroll){var b=Math.abs(this.lastScrollTop-a);this.lastScrollTop=a;if(b>this.scrollRedrawThreshold||this.delayScroll){this.delayScroll=!0;this.scrollTop=a;this.views.setScrollTop(a);this._pendingScroll&&window.clearTimeout(this._pendingScroll);var c=this;this._pendingScroll=window.setTimeout(function(){delete c._pendingScroll;c.finishScrollJob()},200)}else this.setScrollTop(a)}else this.setScrollTop(a)},
finishScrollJob:function(){this.delayScroll=!1;this.setScrollTop(this.scrollTop)},setScrollTop:function(a){this.scroller.scroll(this.views.setScrollTop(a))},scrollToRow:function(a){this.setScrollTop(this.scroller.findScrollTop(a)+1)},styleRowNode:function(a,b){b&&this.rows.styleRowNode(a,b)},_mouseOut:function(){this.rows.setOverRow(-2)},getCell:function(a){return this.layout.cells[a]},setCellWidth:function(a,b){this.getCell(a).unitWidth=b},getCellName:function(a){return"Cell "+a.index},canSort:function(){},
sort:function(){},getSortAsc:function(a){a=a==void 0?this.sortInfo:a;return Boolean(a>0)},getSortIndex:function(a){a=a==void 0?this.sortInfo:a;return Math.abs(a)-1},setSortIndex:function(a,b){var c=a+1;b!=void 0?c*=b?1:-1:this.getSortIndex()==a&&(c=-this.sortInfo);this.setSortInfo(c)},setSortInfo:function(a){if(this.canSort(a))this.sortInfo=a,this.sort(),this.update()},doKeyEvent:function(a){a.dispatch="do"+a.type;this.onKeyEvent(a)},_dispatch:function(a,b){return a in this?this[a](b):!1},dispatchKeyEvent:function(a){this._dispatch(a.dispatch,
a)},dispatchContentEvent:function(a){this.edit.dispatchEvent(a)||a.sourceView.dispatchContentEvent(a)||this._dispatch(a.dispatch,a)},dispatchHeaderEvent:function(a){a.sourceView.dispatchHeaderEvent(a)||this._dispatch("doheader"+a.type,a)},dokeydown:function(a){this.onKeyDown(a)},doclick:function(a){if(a.cellNode)this.onCellClick(a);else this.onRowClick(a)},dodblclick:function(a){if(a.cellNode)this.onCellDblClick(a);else this.onRowDblClick(a)},docontextmenu:function(a){if(a.cellNode)this.onCellContextMenu(a);
else this.onRowContextMenu(a)},doheaderclick:function(a){if(a.cellNode)this.onHeaderCellClick(a);else this.onHeaderClick(a)},doheaderdblclick:function(a){if(a.cellNode)this.onHeaderCellDblClick(a);else this.onHeaderDblClick(a)},doheadercontextmenu:function(a){if(a.cellNode)this.onHeaderCellContextMenu(a);else this.onHeaderContextMenu(a)},doStartEdit:function(a,b){this.onStartEdit(a,b)},doApplyCellEdit:function(a,b,c){this.onApplyCellEdit(a,b,c)},doCancelEdit:function(a){this.onCancelEdit(a)},doApplyEdit:function(a){this.onApplyEdit(a)},
addRow:function(){this.updateRowCount(this.get("rowCount")+1)},removeSelectedRows:function(){this.allItemsSelected?this.updateRowCount(0):this.updateRowCount(Math.max(0,this.get("rowCount")-this.selection.getSelected().length));this.selection.clear()}});dojox.grid._Grid.markupFactory=function(a,b,c,h){var d=dojo,f=function(a){a=d.attr(a,"width")||"auto";a!="auto"&&a.slice(-2)!="em"&&a.slice(-1)!="%"&&(a=parseInt(a,10)+"px");return a};if(!a.structure&&b.nodeName.toLowerCase()=="table")a.structure=
d.query("> colgroup",b).map(function(a){var b=d.attr(a,"span"),b={noscroll:d.attr(a,"noscroll")=="true"?!0:!1,__span:b?parseInt(b,10):1,cells:[]};if(d.hasAttr(a,"width"))b.width=f(a);return b}),a.structure.length||a.structure.push({__span:Infinity,cells:[]}),d.query("thead > tr",b).forEach(function(b,c){var j=0,k=0,i,g=null;d.query("> th",b).map(function(b){g?j>=i+g.__span&&(k++,i+=g.__span,g=a.structure[k]):(i=0,g=a.structure[0]);var e={name:d.trim(d.attr(b,"name")||b.innerHTML),colSpan:parseInt(d.attr(b,
"colspan")||1,10),type:d.trim(d.attr(b,"cellType")||""),id:d.trim(d.attr(b,"id")||"")};j+=e.colSpan;var l=d.attr(b,"rowspan");if(l)e.rowSpan=l;if(d.hasAttr(b,"width"))e.width=f(b);if(d.hasAttr(b,"relWidth"))e.relWidth=window.parseInt(dojo.attr(b,"relWidth"),10);if(d.hasAttr(b,"hidden"))e.hidden=d.attr(b,"hidden")=="true"||d.attr(b,"hidden")===!0;h&&h(b,e);e.type=e.type?dojo.getObject(e.type):dojox.grid.cells.Cell;e.type&&e.type.markupFactory&&e.type.markupFactory(b,e);g.cells[c]||(g.cells[c]=[]);
g.cells[c].push(e)})});return new c(a,b)}}());