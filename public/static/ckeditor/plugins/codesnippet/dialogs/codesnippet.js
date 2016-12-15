/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.dialog.add( 'codeSnippet', function( editor ) {
        var tab_sizes = ["1", "2", "4", "8"];

        var aceEditor, aceSession, whitespace;
        
		var snippetLangs = editor._.codesnippet.langs,
			lang = editor.lang.codesnippet,
			clientHeight = document.documentElement.clientHeight,
			langSelectItems = [],
			snippetLangId;

		langSelectItems.push( [ editor.lang.common.notSet, '' ] );

		for ( snippetLangId in snippetLangs )
			langSelectItems.push( [ snippetLangs[ snippetLangId ], snippetLangId ] );
        
		var size = CKEDITOR.document.getWindow().getViewPaneSize(),
			width = Math.min( size.width - 70, 800 ),
			height = size.height / 1.5;
        
		if ( clientHeight < 650 ) {
			height = clientHeight - 220;
		}

		return {
			title: lang.title,
			minHeight: 200,
			resizable: CKEDITOR.DIALOG_RESIZE_NONE,
			contents: [
				{
					id: 'info',
					elements: [
						{
							type     : 'hbox',
                			children : [
								{
									id: 'lang',
									type: 'select',
									label: lang.language,
									items: langSelectItems,
									setup: function( widget ){
										if ( widget.ready && widget.data.lang )
											this.setValue( widget.data.lang );

										// if ( CKEDITOR.env.gecko && ( !widget.data.lang || !widget.ready ) )
										// 	this.getInputElement().$.selectedIndex = -1;
									},
									commit: function( widget ) {
										widget.setData( 'lang', this.getValue() );
										widget.parts.code.$.setAttribute("data-lang", this.getValue());
									},
									onChange: function(){
										aceSession.setMode("ace/mode/" + this.getValue());
									}
								},
								{
									id: 'tab_size',
									type: 'select',
									label: lang.tab_size,
									items: tab_sizes,
									default: tab_sizes[2],
									setup: function( widget ) {
										if ( widget.ready && widget.data.tab_size )
											this.setValue( widget.data.tab_size );
									},
									commit: function (widget) {
										widget.setData( 'tab_size', this.getValue() );
										widget.parts.code.$.setAttribute("data-tab-size", this.getValue());
									},
									onChange: function (widget) {
										if (widget) {
											whitespace.convertIndentation(aceSession, " ", this.getValue());
											aceSession.setTabSize(this.getValue());
										}
									}
								}
							]
						},
                        {
                            type: 'html',
                            html: '<div></div>',
                            id: 'code',
                            className : 'cke_ace',
                            style: 'height: 400px; border: 1px solid #444; font-size: 14px',
                            required: true,
                            validate: CKEDITOR.dialog.validate.notEmpty( lang.emptySnippetError ),
                            setup: function (widget) {
                                var code = "";

                                if ( widget.ready && widget.data.code ){
                                    code = widget.data.code;
                                    code = code.replace(new RegExp('<br/>', 'g'), '\n')
                                        .replace(new RegExp('<br>', 'g'), '\n')
                                        .replace(new RegExp('&lt;', 'g'), '<')
                                        .replace(new RegExp('&gt;', 'g'), '>')
                                        .replace(new RegExp('&amp;', 'g'), '&')
                                        .replace(new RegExp('&nbsp;', 'g'), ' ');
                                }
                                aceEditor.setValue(code);
                            },
                            commit: function (widget) {
                                widget.setData( 'code', aceEditor.getValue());
}
                        }
					]
				}
			],
            
            onLoad: function () {
                var dialog = this;

                aceEditor = ace.edit(dialog.getContentElement('info', 'code').getElement().getId());

                editor.aceEditor = aceEditor;

                aceEditor.setTheme("ace/theme/" + editor.settings.pb_theme);
                aceEditor.setHighlightActiveLine(true);

                aceSession = aceEditor.getSession();
                // aceSession.setMode("ace/mode/javascript");
                aceSession.setTabSize(4);
                aceSession.setUseSoftTabs(true);

                whitespace = ace.require('ace/ext/whitespace');
            }
		};
	} );
}() );
