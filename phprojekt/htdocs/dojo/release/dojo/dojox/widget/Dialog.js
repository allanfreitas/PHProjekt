/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.widget.Dialog"]||(dojo._hasResource["dojox.widget.Dialog"]=!0,dojo.provide("dojox.widget.Dialog"),dojo.experimental("dojox.widget.Dialog"),dojo.require("dojo.window"),dojo.require("dojox.fx"),dojo.require("dojox.widget.DialogSimple"),dojo.declare("dojox.widget.Dialog",dojox.widget.DialogSimple,{templateString:dojo.cache("dojox.widget","Dialog/Dialog.html",'<div class="dojoxDialog" tabindex="-1" role="dialog" aria-labelledby="${id}_title">\n\t<div dojoAttachPoint="titleBar" class="dojoxDialogTitleBar">\n\t\t<span dojoAttachPoint="titleNode" class="dojoxDialogTitle" id="${id}_title">${title}</span>\n\t</div>\n\t<div dojoAttachPoint="dojoxDialogWrapper">\n\t\t<div dojoAttachPoint="containerNode" class="dojoxDialogPaneContent"></div>\n\t</div>\n\t<div dojoAttachPoint="closeButtonNode" class="dojoxDialogCloseIcon" dojoAttachEvent="onclick: onCancel">\n\t\t\t<span dojoAttachPoint="closeText" class="closeText">x</span>\n\t</div>\n</div>\n'),
sizeToViewport:!1,viewportPadding:35,dimensions:null,easing:null,sizeDuration:dijit._defaultDuration,sizeMethod:"chain",showTitle:!1,draggable:!1,modal:!1,constructor:function(a){this.easing=a.easing||dojo._defaultEasing;this.dimensions=a.dimensions||[300,300]},_setup:function(){this.inherited(arguments);if(!this._alreadyInitialized)this._navIn=dojo.fadeIn({node:this.closeButtonNode}),this._navOut=dojo.fadeOut({node:this.closeButtonNode}),this.showTitle||dojo.addClass(this.domNode,"dojoxDialogNoTitle")},
layout:function(a){this._setSize();this.inherited(arguments)},_setSize:function(){this._vp=dojo.window.getBox();var a=this.containerNode,b=this.sizeToViewport;return this._displaysize={w:b?a.scrollWidth:this.dimensions[0],h:b?a.scrollHeight:this.dimensions[1]}},show:function(){this.open||(this._setSize(),dojo.style(this.closeButtonNode,"opacity",0),dojo.style(this.domNode,{overflow:"hidden",opacity:0,width:"1px",height:"1px"}),dojo.style(this.containerNode,{opacity:0,overflow:"hidden"}),this.inherited(arguments),
this.modal?this._modalconnects.push(dojo.connect(dojo.body(),"onkeypress",function(a){a.charOrCode==dojo.keys.ESCAPE&&dojo.stopEvent(a)})):this._modalconnects.push(dojo.connect(dijit._underlay.domNode,"onclick",this,"onCancel")),this._modalconnects.push(dojo.connect(this.domNode,"onmouseenter",this,"_handleNav")),this._modalconnects.push(dojo.connect(this.domNode,"onmouseleave",this,"_handleNav")))},_handleNav:function(a){var b=a.type=="mouseout"?"_navOut":"_navIn";this[a.type=="mouseout"?"_navIn":
"_navOut"].stop();this[b].play()},_position:function(){if(this._started){this._sizing&&(this._sizing.stop(),this.disconnect(this._sizingConnect),delete this._sizing);this.inherited(arguments);this.open||dojo.style(this.containerNode,"opacity",0);var a=this.viewportPadding*2,b={node:this.domNode,duration:this.sizeDuration||dijit._defaultDuration,easing:this.easing,method:this.sizeMethod},c=this._displaysize||this._setSize();b.width=c.w=c.w+a>=this._vp.w||this.sizeToViewport?this._vp.w-a:c.w;b.height=
c.h=c.h+a>=this._vp.h||this.sizeToViewport?this._vp.h-a:c.h;this._sizing=dojox.fx.sizeTo(b);this._sizingConnect=this.connect(this._sizing,"onEnd","_showContent");this._sizing.play()}},_showContent:function(){var a=this.containerNode;dojo.style(this.domNode,{overflow:"visible",opacity:1});dojo.style(this.closeButtonNode,"opacity",1);dojo.style(a,{height:this._displaysize.h-this.titleNode.offsetHeight+"px",width:this._displaysize.w+"px",overflow:"auto"});dojo.anim(a,{opacity:1})}}));