/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 *    FileMenuPanels.js
 *
 *    Contains views for menu 'File'
 *
 *    Created by Maxim Kadushkin on 20 February 2014
 *    Copyright (c) 2018 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'common/main/lib/view/DocumentAccessDialog',
    'common/main/lib/view/AutoCorrectDialog'
], function () {
    'use strict';

    !DE.Views.FileMenuPanels && (DE.Views.FileMenuPanels = {});

    DE.Views.FileMenuPanels.ViewSaveAs = Common.UI.BaseView.extend({
        el: '#panel-saveas',
        menu: undefined,

        formats: [[
            {name: 'DOCX',  imgCls: 'docx',  type: Asc.c_oAscFileType.DOCX},
            {name: 'PDF',   imgCls: 'pdf',   type: Asc.c_oAscFileType.PDF},
            {name: 'ODT',   imgCls: 'odt',   type: Asc.c_oAscFileType.ODT},
            {name: 'TXT',   imgCls: 'txt',   type: Asc.c_oAscFileType.TXT}
        ],[
            {name: 'DOTX',  imgCls: 'dotx',  type: Asc.c_oAscFileType.DOTX},
            {name: 'PDFA',  imgCls: 'pdfa',  type: Asc.c_oAscFileType.PDFA},
            {name: 'OTT',   imgCls: 'ott',   type: Asc.c_oAscFileType.OTT},
            {name: 'RTF',   imgCls: 'rtf',   type: Asc.c_oAscFileType.RTF}
        ],[
            {name: 'DOCM',  imgCls: 'docm',  type: Asc.c_oAscFileType.DOCM},
            {name: 'DOCXF',  imgCls: 'docxf',  type: Asc.c_oAscFileType.DOCXF},
            {name: 'OFORM',  imgCls: 'oform',  type: Asc.c_oAscFileType.OFORM}
        ],[
            {name: 'HTML (Zipped)',  imgCls: 'html',  type: Asc.c_oAscFileType.HTML},
            {name: 'FB2',   imgCls: 'fb2',  type: Asc.c_oAscFileType.FB2},
            {name: 'EPUB',  imgCls: 'epub',  type: Asc.c_oAscFileType.EPUB}
        ]],


        template: _.template([
            '<table><tbody>',
                '<% _.each(rows, function(row) { %>',
                    '<tr>',
                        '<% _.each(row, function(item) { %>',
                            '<% if (item.type!==Asc.c_oAscFileType.DOCM || fileType=="docm") { %>',
                            '<td><div><div class="btn-doc-format" format="<%= item.type %>" data-hint="2" data-hint-direction="left-top" data-hint-offset="4, 4">',
                                '<div class ="svg-format-<%= item.imgCls %>"></div>',
                            '</div></div></td>',
                            '<% } %>',
                        '<% }) %>',
                    '</tr>',
                '<% }) %>',
            '</tbody></table>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;
            this.fileType = options.fileType;
            this.mode = options.mode;
        },

        render: function() {
            if (/^pdf$/.test(this.fileType)) {
                this.formats[0].splice(1, 1); // remove pdf
                this.formats[1].splice(1, 1); // remove pdfa
                this.formats[3].push({name: 'PDF',  imgCls: 'pdf', type: ''}); // original pdf
            } else if (/^xps|oxps$/.test(this.fileType)) {
                this.formats[3].push({name: this.fileType.toUpperCase(),  imgCls: this.fileType, type: ''}); // original xps/oxps
            } else if (/^djvu$/.test(this.fileType)) {
                this.formats = [[
                    {name: 'DJVU',  imgCls: 'djvu',  type: ''}, // original djvu
                    {name: 'PDF',   imgCls: 'pdf',   type: Asc.c_oAscFileType.PDF}
                ]];
            }

            if (this.mode && !this.mode.canFeatureForms && this.formats.length>2) {
                this.formats[2].splice(1, 2);
                this.formats[2] = this.formats[2].concat(this.formats[3]);
                this.formats[3] = undefined;
            }

            this.$el.html(this.template({rows:this.formats, fileType: (this.fileType || 'docx').toLowerCase()}));
            $('.btn-doc-format',this.el).on('click', _.bind(this.onFormatClick,this));

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.$el,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.scroller && this.scroller.update();
        },

        onFormatClick: function(e) {
            var type = e.currentTarget.attributes['format'];
            if (!_.isUndefined(type) && this.menu) {
                this.menu.fireEvent('saveas:format', [this.menu, type.value ? parseInt(type.value) : undefined]);
            }
        }
    });

    DE.Views.FileMenuPanels.ViewSaveCopy = Common.UI.BaseView.extend({
        el: '#panel-savecopy',
        menu: undefined,

        formats: [[
            {name: 'DOCX',  imgCls: 'docx',  type: Asc.c_oAscFileType.DOCX, ext: '.docx'},
            {name: 'PDF',   imgCls: 'pdf',   type: Asc.c_oAscFileType.PDF, ext: '.pdf'},
            {name: 'ODT',   imgCls: 'odt',   type: Asc.c_oAscFileType.ODT, ext: '.odt'},
            {name: 'TXT',   imgCls: 'txt',   type: Asc.c_oAscFileType.TXT, ext: '.txt'}
        ],[
            {name: 'DOTX',  imgCls: 'dotx',  type: Asc.c_oAscFileType.DOTX, ext: '.dotx'},
            {name: 'PDFA',  imgCls: 'pdfa',  type: Asc.c_oAscFileType.PDFA, ext: '.pdf'},
            {name: 'OTT',   imgCls: 'ott',   type: Asc.c_oAscFileType.OTT, ext: '.ott'},
            {name: 'RTF',   imgCls: 'rtf',   type: Asc.c_oAscFileType.RTF, ext: '.rtf'}
        ],[
            {name: 'DOCM',  imgCls: 'docm',  type: Asc.c_oAscFileType.DOCM, ext: '.docm'},
            {name: 'DOCXF',  imgCls: 'docxf',  type: Asc.c_oAscFileType.DOCXF, ext: '.docxf'},
            {name: 'OFORM',  imgCls: 'oform',  type: Asc.c_oAscFileType.OFORM, ext: '.oform'}
        ],[
            {name: 'HTML (Zipped)',  imgCls: 'html',  type: Asc.c_oAscFileType.HTML, ext: '.html'},
            {name: 'FB2',   imgCls: 'fb2',  type: Asc.c_oAscFileType.FB2, ext: '.fb2'},
            {name: 'EPUB',  imgCls: 'epub',  type: Asc.c_oAscFileType.EPUB, ext: '.epub'}
        ]],


        template: _.template([
            '<table><tbody>',
                '<% _.each(rows, function(row) { %>',
                    '<tr>',
                        '<% _.each(row, function(item) { %>',
                            '<% if (item.type!==Asc.c_oAscFileType.DOCM || fileType=="docm") { %>',
                            '<td><div><div class="btn-doc-format" format="<%= item.type %>", format-ext="<%= item.ext %>" data-hint="2" data-hint-direction="left-top" data-hint-offset="4, 4">',
                            '<div class ="svg-format-<%= item.imgCls %>"></div>',
                            '</div></div></td>',
                            '<% } %>',
                        '<% }) %>',
                    '</tr>',
                '<% }) %>',
            '</tbody></table>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;
            this.fileType = options.fileType;
            this.mode = options.mode;
        },

        render: function() {
            if (/^pdf$/.test(this.fileType)) {
                this.formats[0].splice(1, 1); // remove pdf
                this.formats[1].splice(1, 1); // remove pdfa
                this.formats[3].push({name: 'PDF',  imgCls: 'pdf', type: '', ext: true}); // original pdf
            } else if (/^xps|oxps$/.test(this.fileType)) {
                this.formats[3].push({name: this.fileType.toUpperCase(),  imgCls: this.fileType, type: '', ext: true}); // original xps/oxps
            } else if (/^djvu$/.test(this.fileType)) {
                this.formats = [[
                    {name: 'DJVU',  imgCls: 'djvu',  type: '', ext: true}, // original djvu
                    {name: 'PDF',   imgCls: 'pdf',   type: Asc.c_oAscFileType.PDF, ext: '.pdf'}
                ]];
            }

            if (this.mode && !this.mode.canFeatureForms && this.formats.length>2) {
                this.formats[2].splice(1, 2);
                this.formats[2] = this.formats[2].concat(this.formats[3]);
                this.formats[3] = undefined;
            }

            this.$el.html(this.template({rows:this.formats, fileType: (this.fileType || 'docx').toLowerCase()}));
            $('.btn-doc-format',this.el).on('click', _.bind(this.onFormatClick,this));

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.$el,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.scroller && this.scroller.update();
        },

        onFormatClick: function(e) {
            var type = e.currentTarget.attributes['format'],
                ext = e.currentTarget.attributes['format-ext'];
            if (!_.isUndefined(type) && !_.isUndefined(ext) && this.menu) {
                this.menu.fireEvent('saveas:format', [this.menu, type.value ? parseInt(type.value) : undefined, ext.value]);
            }
        }
    });

    DE.Views.FileMenuPanels.Settings = Common.UI.BaseView.extend(_.extend({
        el: '#panel-settings',
        menu: undefined,

        template: _.template([
        '<div class="flex-settings">',
            '<table style="margin: 10px 14px 0;"><tbody>',
                '<tr class="editsave">',
                    '<td colspan="2" class="group-name top"><label><%= scope.txtEditingSaving %></label></td>',
                '</tr>',
                '<tr class="autosave">',
                    '<td colspan="2"><span id="fms-chb-autosave"></span></td>',
                '</tr>',
                '<tr class="forcesave">',
                    '<td colspan="2"><span id="fms-chb-forcesave"></span></td>',
                '</tr>',
                '<tr class="edit">',
                    '<td colspan="2"><div id="fms-chb-paste-settings"></div></td>',
                '</tr>',
                '<tr class="edit">',
                    '<td colspan="2"><span id="fms-chb-compatible"></span></td>',
                '</tr>',
                '<tr class ="editsave divider-group"></tr>',
                '<tr class="collaboration">',
                    '<td colspan="2" class="group-name"><label><%= scope.txtCollaboration %></label></td>',
                '</tr>',
                '<tr class="coauth changes-mode">',
                    '<td colspan="2" class="subgroup-name"><label><%= scope.strCoAuthMode %></label></td>',
                '</tr>',
                '<tr class="coauth changes-mode">',
                    '<td colspan="2"><div style="display: flex;"><div id="fms-rb-coauth-mode-fast"></div>',
                    '<span style ="display: flex; flex-direction: column;"><label><%= scope.strFast %></label>',
                    '<label class="comment-text"><%= scope.txtFastTip %></label></span></div>',
                    '</td>',
                '</tr>',
                '<tr class="coauth changes-mode">',
                    '<td colspan="2"><div style="display: flex;"><div id="fms-rb-coauth-mode-strict"></div>',
                    '<span style ="display: flex; flex-direction: column;"><label><%= scope.strStrict %></label>',
                    '<label class="comment-text"><%= scope.txtStrictTip %></label></span>',
                    '</div></td>',
                '</tr>',
                '<tr class ="divider-subgroup coauth changes-mode"></tr>',
                '<tr class="view-review">',
                    '<td colspan="2" class="subgroup-name"><label><%= scope.txtShowTrackChanges %></label></td>',
                '</tr>',
                '<tr class="view-review">',
                    '<td colspan="2"><div id="fms-rb-show-track-ballons"></div></td>',
                '</tr>',
                '<tr class="view-review">',
                    '<td colspan="2"><div id="fms-rb-show-track-tooltips"></div></td>',
                '</tr>',
                '<tr class ="divider-subgroup  view-review"></tr>',
                '<tr class="coauth changes-show">',
                    '<td colspan="2" class="subgroup-name"><label><%= scope.strShowChanges %></label></td>',
                '</tr>',
                '<tr class="coauth changes-show">',
                    '<td colspan="2"><div id="fms-rb-show-changes-none"></div></td>',
                '</tr>',
                '<tr class="coauth changes-show">',
                    '<td colspan="2"><div id="fms-rb-show-changes-all"></div></td>',
                '</tr>',
                '<tr class="coauth changes-show">',
                    '<td colspan="2"><div id="fms-rb-show-changes-last"></div></td>',
                '</tr>','<tr class="divider coauth changes-show"></tr>',
                '<tr class="live-viewer">',
                    '<td colspan="2"><div id="fms-chb-live-viewer"></div></td>',
                '</tr>',
                '<tr class="divider live-viewer"></tr>',
                '<tr class="comments">',
                    '<td colspan="2"><div id="fms-chb-live-comment"></div></td>',
                '</tr>',
                '<tr class="comments">',
                    '<td colspan="2"><div id="fms-chb-resolved-comment"></div></td>',
                '</tr>',
                '<tr class ="collaboration divider-group"></tr>',
                '<tr class ="edit">',
                    '<td colspan="2" class="group-name proofing"><label><%= scope.txtProofing %></label></td>',
                '</tr>',
                '<tr class="edit spellcheck">',
                    '<td colspan="2"><div id="fms-chb-spell-check"></div></td>',
                '</tr>',
                '<tr class="edit spellcheck">',
                    '<td colspan="2"><span id="fms-chb-ignore-uppercase-words"></span></td>',
                '</tr>',
                '<tr class="edit spellcheck">',
                    '<td colspan="2"><span id="fms-chb-ignore-numbers-words"></span></td>',
                '</tr>',
                '<tr class="edit">',
                    '<td colspan="2"><button type="button" class="btn btn-text-default" id="fms-btn-auto-correct" style="width:auto; display: inline-block;padding-right: 10px;padding-left: 10px;" data-hint="2" data-hint-direction="bottom" data-hint-offset="medium"><%= scope.txtAutoCorrect %></button></div></td>',
                '</tr>',
                '<tr class ="edit divider-group"></tr>',
                '<tr>',
                    '<td colspan="2" class="group-name"><label><%= scope.txtWorkspace %></label></td>',
                '</tr>',
                '<tr class="edit">',
                    '<td colspan="2"><span id="fms-chb-align-guides"></span></td>',
                '</tr>',
                '<tr>',
                    '<td colspan="2"><div id="fms-chb-use-alt-key"></div></td>',
                '</tr>',
                '<tr class="quick-print">',
                    '<td colspan="2"><div style="display: flex;"><div id="fms-chb-quick-print"></div>',
                    '<span style ="display: flex; flex-direction: column;"><label><%= scope.txtQuickPrint %></label>',
                    '<label class="comment-text"><%= scope.txtQuickPrintTip %></label></span></div>',
                    '</td>',
                '</tr>',
                '<tr class="themes">',
                    '<td><label><%= scope.strTheme %></label></td>',
                    '<td>',
                        '<div><div id="fms-cmb-theme" style="display: inline-block; margin-right: 15px;vertical-align: middle;"></div>',
                        '<div id="fms-chb-dark-mode" style="display: inline-block; vertical-align: middle;margin-top: 2px;"></div></div></td>',
                '</tr>',
                '<tr class="edit">',
                    '<td><label><%= scope.strUnit %></label></td>',
                    '<td><span id="fms-cmb-unit"></span></td>',
                '</tr>',
                '<tr>',
                    '<td><label><%= scope.strZoom %></label></td>',
                    '<td><div id="fms-cmb-zoom" class="input-group-nr"></div></td>',
                '</tr>',
                '<tr>',
                    '<td><label><%= scope.strFontRender %></label></td>',
                    '<td><span id="fms-cmb-font-render"></span></td>',
                '</tr>',
                '<tr class="macros">',
                    '<td><label><%= scope.strMacrosSettings %></label></td>',
                    '<td>',
                        '<div><div id="fms-cmb-macros" style="display: inline-block; margin-right: 15px; vertical-align: middle;"></div>',
                '</tr>',
                '<tr class ="divider-group"></tr>',
                '<tr class="fms-btn-apply">',
                    '<td style="padding-top:15px; padding-bottom: 15px;"><button class="btn normal dlg-btn primary" data-hint="2" data-hint-direction="bottom" data-hint-offset="medium"><%= scope.okButtonText %></button></td>',
                    '<td></td>',
                '</tr>',
            '</tbody></table>',

        '</div>',
        '<div class="fms-flex-apply hidden">',
            '<table style="margin: 10px 14px;"><tbody>',
                '<tr>',
                    '<td><button class="btn normal dlg-btn primary" data-hint="2" data-hint-direction="bottom" data-hint-offset="big"><%= scope.okButtonText %></button></td>',
                    '<td></td>',
                '</tr>',
            '</tbody></table>',
        '</div>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;
        },

        render: function(node) {
            var me = this;
            var $markup = $(this.template({scope: this}));

            this.chUseAltKey = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-use-alt-key'),
                labelText: Common.Utils.isMac ? this.txtUseOptionKey : this.txtUseAltKey,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });
            (Common.Utils.isIE || Common.Utils.isMac && Common.Utils.isGecko) && this.chUseAltKey.$el.parent().parent().hide();

            /** coauthoring begin **/
            this.chLiveComment = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-live-comment'),
                labelText: this.strShowComments,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('change', function(field, newValue, oldValue, eOpts){
                me.chResolvedComment.setDisabled(field.getValue()!=='checked');
            });

            this.chResolvedComment = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-resolved-comment'),
                labelText: this.strShowResolvedComments,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });
            /** coauthoring end **/

            this.chSpell = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-spell-check'),
                labelText: this.txtSpellCheck,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('change', function(field, newValue, oldValue, eOpts){
                me.chIgnoreUppercase.setDisabled(field.getValue()!=='checked');
                me.chIgnoreNumbers.setDisabled(field.getValue()!=='checked');
            });

            this.chIgnoreUppercase = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-ignore-uppercase-words'),
                labelText: this.strIgnoreWordsInUPPERCASE,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.chIgnoreNumbers = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-ignore-numbers-words'),
                labelText: this.strIgnoreWordsWithNumbers,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.chCompatible = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-compatible'),
                labelText: this.textOldVersions,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.chAutosave = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-autosave'),
                labelText: this.textAutoSave,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('change', function(field, newValue, oldValue, eOpts){
                if (field.getValue()!=='checked' && me.rbCoAuthModeFast.getValue()) {
                    me.rbCoAuthModeStrict.setValue(true);
                    me.onChangeCoAuthMode(me.rbCoAuthModeFast.getValue()?1:0);
                }
            });

            this.chForcesave = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-forcesave'),
                labelText: this.textForceSave,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.chAlignGuides = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-align-guides'),
                labelText: this.textAlignGuides,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.cmbZoom = new Common.UI.ComboBox({
                el          : $markup.findById('#fms-cmb-zoom'),
                style       : 'width: 160px;',
                editable    : false,
                menuCls     : 'menu-aligned',
                cls         : 'input-group-nr',
                menuStyle   : 'min-width:100%; max-height: 157px;',
                data        : [
                    { value: -1, displayValue: this.txtFitPage },
                    { value: -2, displayValue: this.txtFitWidth },
                    { value: 50, displayValue: "50%" },
                    { value: 60, displayValue: "60%" },
                    { value: 70, displayValue: "70%" },
                    { value: 80, displayValue: "80%" },
                    { value: 90, displayValue: "90%" },
                    { value: 100, displayValue: "100%" },
                    { value: 110, displayValue: "110%" },
                    { value: 120, displayValue: "120%" },
                    { value: 150, displayValue: "150%" },
                    { value: 175, displayValue: "175%" },
                    { value: 200, displayValue: "200%" },
                    { value: 300, displayValue: "300%" },
                    { value: 400, displayValue: "400%" },
                    { value: 500, displayValue: "500%" }
                ],
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });

            this.rbCoAuthModeFast = new Common.UI.RadioBox({
                el          :$markup.findById('#fms-rb-coauth-mode-fast'),
                name        : 'coauth-mode',
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });
            this.rbCoAuthModeFast.on('change', function(){
                me.chAutosave.setValue(1);
                me.onChangeCoAuthMode(1);
            });
            this.rbCoAuthModeFast.$el.parent().on('click', function (){me.rbCoAuthModeFast.setValue(true);});

            this.rbCoAuthModeStrict = new Common.UI.RadioBox({
                el          :$markup.findById('#fms-rb-coauth-mode-strict'),
                name        : 'coauth-mode',
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });
            this.rbCoAuthModeStrict.on('change', _.bind(this.onChangeCoAuthMode, this,0));
            this.rbCoAuthModeStrict.$el.parent().on('click', function (){me.rbCoAuthModeStrict.setValue(true);});

            this.rbChangesBallons = new Common.UI.RadioBox({
                el          :$markup.findById('#fms-rb-show-track-ballons'),
                name        : 'show-track-changes',
                labelText   : this.txtChangesBalloons,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.rbChangesTip = new Common.UI.RadioBox({
                el          :$markup.findById('#fms-rb-show-track-tooltips'),
                name        : 'show-track-changes',
                labelText   : this.txtChangesTip,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.rbShowChangesNone = new Common.UI.RadioBox({
                el          :$markup.findById('#fms-rb-show-changes-none'),
                name        : 'show-changes',
                labelText   : this.txtNone,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.rbShowChangesAll = new Common.UI.RadioBox({
                el          :$markup.findById('#fms-rb-show-changes-all'),
                name        : 'show-changes',
                labelText   : this.txtAll,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.rbShowChangesLast = new Common.UI.RadioBox({
                el          :$markup.findById('#fms-rb-show-changes-last'),
                name        : 'show-changes',
                labelText   : this.txtLast,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            /** coauthoring end **/

            this.chLiveViewer = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-live-viewer'),
                labelText: this.strShowOthersChanges,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            var itemsTemplate =
                _.template([
                    '<% _.each(items, function(item) { %>',
                    '<li id="<%= item.id %>" data-value="<%= item.value %>" <% if (item.value === "custom") { %> class="border-top" style="margin-top: 5px;padding-top: 5px;" <% } %> ><a tabindex="-1" type="menuitem" <% if (typeof(item.checked) !== "undefined" && item.checked) { %> class="checked" <% } %> ><%= scope.getDisplayValue(item) %></a></li>',
                    '<% }); %>'
                ].join(''));
            this.cmbFontRender = new Common.UI.ComboBox({
                el          : $markup.find('#fms-cmb-font-render'),
                style       : 'width: 160px;',
                editable    : false,
                menuCls     : 'menu-aligned',
                menuStyle   : 'min-width:100%;',
                cls         : 'input-group-nr',
                itemsTemplate: itemsTemplate,
                data        : [
                    { value: 0, displayValue: this.txtWin },
                    { value: 1, displayValue: this.txtMac },
                    { value: 2, displayValue: this.txtNative },
                    { value: 'custom', displayValue: this.txtCacheMode }
                ],
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });
            this.cmbFontRender.on('selected', _.bind(this.onFontRenderSelected, this));

            this.cmbUnit = new Common.UI.ComboBox({
                el          : $markup.findById('#fms-cmb-unit'),
                style       : 'width: 160px;',
                menuCls     : 'menu-aligned',
                menuStyle   : 'min-width:100%;',
                editable    : false,
                cls         : 'input-group-nr',
                data        : [
                    { value: Common.Utils.Metric.c_MetricUnits['cm'], displayValue: this.txtCm },
                    { value: Common.Utils.Metric.c_MetricUnits['pt'], displayValue: this.txtPt },
                    { value: Common.Utils.Metric.c_MetricUnits['inch'], displayValue: this.txtInch }
                ],
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });

            this.cmbMacros = new Common.UI.ComboBox({
                el          : $markup.findById('#fms-cmb-macros'),
                style       : 'width: 160px;',
                editable    : false,
                menuCls     : 'menu-aligned',
                menuStyle   : 'min-width:100%;',
                cls         : 'input-group-nr',
                data        : [
                    { value: 2, displayValue: this.txtStopMacros, descValue: this.txtStopMacrosDesc },
                    { value: 0, displayValue: this.txtWarnMacros, descValue: this.txtWarnMacrosDesc },
                    { value: 1, displayValue: this.txtRunMacros, descValue: this.txtRunMacrosDesc }
                ],
                itemsTemplate: _.template([
                    '<% _.each(items, function(item) { %>',
                    '<li id="<%= item.id %>" data-value="<%- item.value %>"><a tabindex="-1" type="menuitem" style ="display: flex; flex-direction: column;">',
                    '<label><%= scope.getDisplayValue(item) %></label><label class="comment-text"><%= item.descValue %></label></a></li>',
                    '<% }); %>'
                ].join('')),
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });

            this.chPaste = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-paste-settings'),
                labelText: this.strPasteButton,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.btnAutoCorrect = new Common.UI.Button({
                el: $markup.findById('#fms-btn-auto-correct')
            });
            this.btnAutoCorrect.on('click', _.bind(this.autoCorrect, this));

            this.cmbTheme = new Common.UI.ComboBox({
                el          : $markup.findById('#fms-cmb-theme'),
                style       : 'width: 160px;',
                menuStyle   : 'min-width:100%;',
                editable    : false,
                menuCls     : 'menu-aligned',
                cls         : 'input-group-nr',
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            }).on('selected', function(combo, record) {
                me.chDarkMode.setDisabled(!Common.UI.Themes.isDarkTheme(record.value));
            });

            this.chDarkMode = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-dark-mode'),
                labelText: this.txtDarkMode,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });
            $markup.find('.btn.primary').each(function(index, el){
                (new Common.UI.Button({
                    el: $(el)
                })).on('click', _.bind(me.applySettings, me));
            });

            this.chQuickPrint = new Common.UI.CheckBox({
                el: $markup.findById('#fms-chb-quick-print'),
                labelText: '',
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });
            this.chQuickPrint.$el.parent().on('click', function (){
                me.chQuickPrint.setValue(!me.chQuickPrint.isChecked());
            });

            this.pnlSettings = $markup.find('.flex-settings').addBack().filter('.flex-settings');
            this.pnlApply = $markup.find('.fms-flex-apply').addBack().filter('.fms-flex-apply');
            this.pnlTable = this.pnlSettings.find('table');
            this.trApply = $markup.find('.fms-btn-apply');

            this.$el = $(node).html($markup);

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.pnlSettings,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            Common.NotificationCenter.on({
                'window:resize': function() {
                    me.isVisible() && me.updateScroller();
                }
            });

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);

            this.updateSettings();
            this.updateScroller();
        },

        updateScroller: function() {
            if (this.scroller) {
                Common.UI.Menu.Manager.hideAll();
                var scrolled = this.$el.height()< this.pnlTable.parent().height() + 25 + this.pnlApply.height();
                this.pnlApply.toggleClass('hidden', !scrolled);
                this.trApply.toggleClass('hidden', scrolled);
                this.pnlSettings.css('overflow', scrolled ? 'hidden' : 'visible');
                this.scroller.update();
                this.pnlSettings.toggleClass('bordered', this.scroller.isVisible());
            }
        },

        setMode: function(mode) {
            this.mode = mode;

            var fast_coauth = Common.Utils.InternalSettings.get("de-settings-coauthmode");

            $('tr.edit', this.el)[mode.isEdit?'show':'hide']();
            $('tr.autosave', this.el)[mode.isEdit && (mode.canChangeCoAuthoring || !fast_coauth) ? 'show' : 'hide']();
            $('tr.forcesave', this.el)[mode.canForcesave ? 'show' : 'hide']();
            $('tr.editsave',this.el)[mode.isEdit  || mode.canForcesave ? 'show' : 'hide']();
            if (this.mode.isDesktopApp && this.mode.isOffline) {
                this.chAutosave.setCaption(this.textAutoRecover);
            }
            /** coauthoring begin **/
            $('tr.collaboration', this.el)[mode.canCoAuthoring || mode.canViewReview ? 'show' : 'hide']();
            $('tr.coauth', this.el)[mode.isEdit && mode.canCoAuthoring ? 'show' : 'hide']();
            $('tr.coauth.changes-mode', this.el)[mode.isEdit && !mode.isOffline && mode.canCoAuthoring && mode.canChangeCoAuthoring ? 'show' : 'hide']();
            $('tr.coauth.changes-show', this.el)[mode.isEdit && !mode.isOffline && mode.canCoAuthoring ? 'show' : 'hide']();
            $('tr.live-viewer', this.el)[mode.canLiveView && !mode.isOffline && mode.canChangeCoAuthoring ? 'show' : 'hide']();
            $('tr.view-review', this.el)[mode.canViewReview ? 'show' : 'hide']();
            $('tr.spellcheck', this.el)[mode.isEdit && Common.UI.FeaturesManager.canChange('spellcheck') ? 'show' : 'hide']();
            $('tr.comments', this.el)[mode.canCoAuthoring ? 'show' : 'hide']();
            /** coauthoring end **/

            $('tr.quick-print', this.el)[mode.canQuickPrint && !(mode.customization && mode.customization.compactHeader && mode.isEdit) ? 'show' : 'hide']();
            $('tr.macros', this.el)[(mode.customization && mode.customization.macros===false) ? 'hide' : 'show']();
            if ( !Common.UI.Themes.available() ) {
                $('tr.themes, tr.themes + tr.divider', this.el).hide();
            }
        },

        setApi: function(o) {
            this.api = o;
            return this;
        },

        updateSettings: function() {
            this.chUseAltKey.setValue(Common.Utils.InternalSettings.get("de-settings-show-alt-hints"));

            var value = Common.Utils.InternalSettings.get("de-settings-zoom");
            value = (value!==null) ? parseInt(value) : (this.mode.customization && this.mode.customization.zoom ? parseInt(this.mode.customization.zoom) : 100);
            var item = this.cmbZoom.store.findWhere({value: value});
            this.cmbZoom.setValue(item ? parseInt(item.get('value')) : (value>0 ? value+'%' : 100));

            /** coauthoring begin **/
            this.chLiveComment.setValue(Common.Utils.InternalSettings.get("de-settings-livecomment"));
            this.chResolvedComment.setValue(Common.Utils.InternalSettings.get("de-settings-resolvedcomment"));

            var fast_coauth = Common.Utils.InternalSettings.get("de-settings-coauthmode");
            this.rbCoAuthModeFast.setValue(fast_coauth);
            this.rbCoAuthModeStrict.setValue(!fast_coauth);
            this.fillShowChanges(fast_coauth);

            this.chLiveViewer.setValue(Common.Utils.InternalSettings.get("de-settings-coauthmode"));

            value = Common.Utils.InternalSettings.get((fast_coauth) ? "de-settings-showchanges-fast" : "de-settings-showchanges-strict");

            this.rbShowChangesNone.setValue(value=='none');
            this.rbShowChangesLast.setValue(value=='last');
            this.rbShowChangesAll.setValue(value=='all');
            /** coauthoring end **/

            value = Common.Utils.InternalSettings.get("de-settings-fontrender");
            item = this.cmbFontRender.store.findWhere({value: parseInt(value)});
            this.cmbFontRender.setValue(item ? item.get('value') : 0);
            this._fontRender = this.cmbFontRender.getValue();

            value = Common.Utils.InternalSettings.get("de-settings-cachemode");
            item = this.cmbFontRender.store.findWhere({value: 'custom'});
            item && value && item.set('checked', !!value);
            item && value && this.cmbFontRender.cmpEl.find('#' + item.get('id') + ' a').addClass('checked');

            value = Common.Utils.InternalSettings.get("de-settings-unit");
            item = this.cmbUnit.store.findWhere({value: value});
            this.cmbUnit.setValue(item ? parseInt(item.get('value')) : Common.Utils.Metric.getDefaultMetric());
            this._oldUnits = this.cmbUnit.getValue();

            value = Common.Utils.InternalSettings.get("de-settings-autosave");
            this.chAutosave.setValue(value == 1);

            if (this.mode.canForcesave)
                this.chForcesave.setValue(Common.Utils.InternalSettings.get("de-settings-forcesave"));

            if (Common.UI.FeaturesManager.canChange('spellcheck')) {
                this.chSpell.setValue(Common.Utils.InternalSettings.get("de-settings-spellcheck"));
                this.chIgnoreUppercase.setValue(Common.Utils.InternalSettings.get("de-spellcheck-ignore-uppercase-words"));
                this.chIgnoreNumbers.setValue(Common.Utils.InternalSettings.get("de-spellcheck-ignore-numbers-words"));
            }
            this.chAlignGuides.setValue(Common.Utils.InternalSettings.get("de-settings-showsnaplines"));
            this.chCompatible.setValue(Common.Utils.InternalSettings.get("de-settings-compatible"));

            item = this.cmbMacros.store.findWhere({value: Common.Utils.InternalSettings.get("de-macros-mode")});
            this.cmbMacros.setValue(item ? item.get('value') : 0);

            this.chPaste.setValue(Common.Utils.InternalSettings.get("de-settings-paste-button"));
            this.chQuickPrint.setValue(Common.Utils.InternalSettings.get("de-settings-quick-print-button"));

            var data = [];
            for (var t in Common.UI.Themes.map()) {
                data.push({value: t, displayValue: Common.UI.Themes.get(t).text, themeType: Common.UI.Themes.get(t).type});
            }

            if ( data.length ) {
                this.cmbTheme.setData(data);
                item = this.cmbTheme.store.findWhere({value: Common.UI.Themes.currentThemeId()});
                this.cmbTheme.setValue(item ? item.get('value') : Common.UI.Themes.defaultThemeId());
            }
            this.chDarkMode.setValue(Common.UI.Themes.isContentThemeDark());
            this.chDarkMode.setDisabled(!Common.UI.Themes.isDarkTheme());

            if (this.mode.canViewReview) {
                value = Common.Utils.InternalSettings.get("de-settings-review-hover-mode");
                this.rbChangesTip.setValue(value);
                this.rbChangesBallons.setValue(!value);
            }
        },

        applySettings: function() {
            Common.UI.Themes.setTheme(this.cmbTheme.getValue());
            if (!this.chDarkMode.isDisabled() && (this.chDarkMode.isChecked() !== Common.UI.Themes.isContentThemeDark()))
                Common.UI.Themes.toggleContentTheme();
            Common.localStorage.setItem("de-settings-show-alt-hints", this.chUseAltKey.isChecked() ? 1 : 0);
            Common.Utils.InternalSettings.set("de-settings-show-alt-hints", Common.localStorage.getBool("de-settings-show-alt-hints"));
            Common.localStorage.setItem("de-settings-zoom", this.cmbZoom.getValue());
            Common.Utils.InternalSettings.set("de-settings-zoom", Common.localStorage.getItem("de-settings-zoom"));

            /** coauthoring begin **/
            Common.localStorage.setItem("de-settings-livecomment", this.chLiveComment.isChecked() ? 1 : 0);
            Common.localStorage.setItem("de-settings-resolvedcomment", this.chResolvedComment.isChecked() ? 1 : 0);
            if (this.mode.isEdit && !this.mode.isOffline && this.mode.canCoAuthoring) {
                this.mode.canChangeCoAuthoring && Common.localStorage.setItem("de-settings-coauthmode", this.rbCoAuthModeFast.getValue() ? 1 : 0 );
                Common.localStorage.setItem(this.rbCoAuthModeFast.getValue() ? "de-settings-showchanges-fast" : "de-settings-showchanges-strict",
                    this.rbShowChangesNone.getValue()?'none':this.rbShowChangesLast.getValue()?'last':'all');
            } else if (this.mode.canLiveView && !this.mode.isOffline && this.mode.canChangeCoAuthoring) { // viewer
                Common.localStorage.setItem("de-settings-view-coauthmode", this.chLiveViewer.isChecked() ? 1 : 0);
            }
            /** coauthoring end **/
            Common.localStorage.setItem("de-settings-fontrender", this.cmbFontRender.getValue());
            var item = this.cmbFontRender.store.findWhere({value: 'custom'});
            Common.localStorage.setItem("de-settings-cachemode", item && !item.get('checked') ? 0 : 1);
            Common.localStorage.setItem("de-settings-unit", this.cmbUnit.getValue());
            if (this.mode.isEdit && (this.mode.canChangeCoAuthoring || !Common.Utils.InternalSettings.get("de-settings-coauthmode")))
                Common.localStorage.setItem("de-settings-autosave", this.chAutosave.isChecked() ? 1 : 0);
            if (this.mode.canForcesave)
                Common.localStorage.setItem("de-settings-forcesave", this.chForcesave.isChecked() ? 1 : 0);
            if (Common.UI.FeaturesManager.canChange('spellcheck') && this.mode.isEdit) {
                Common.localStorage.setItem("de-settings-spellcheck", this.chSpell.isChecked() ? 1 : 0);
                Common.localStorage.setBool("de-spellcheck-ignore-uppercase-words", this.chIgnoreUppercase.isChecked());
                Common.localStorage.setBool("de-spellcheck-ignore-numbers-words", this.chIgnoreNumbers.isChecked());
            }
            Common.localStorage.setItem("de-settings-compatible", this.chCompatible.isChecked() ? 1 : 0);
            Common.Utils.InternalSettings.set("de-settings-compatible", this.chCompatible.isChecked() ? 1 : 0);
            Common.Utils.InternalSettings.set("de-settings-showsnaplines", this.chAlignGuides.isChecked());

            Common.localStorage.setItem("de-macros-mode", this.cmbMacros.getValue());
            Common.Utils.InternalSettings.set("de-macros-mode", this.cmbMacros.getValue());

            if (this.mode.canViewReview) {
                var val = this.rbChangesTip.getValue();
                Common.localStorage.setBool("de-settings-review-hover-mode", val);
                Common.Utils.InternalSettings.set("de-settings-review-hover-mode", val);
                this.mode.reviewHoverMode = val;
            }

            Common.localStorage.setItem("de-settings-paste-button", this.chPaste.isChecked() ? 1 : 0);
            Common.localStorage.setBool("de-settings-quick-print-button", this.chQuickPrint.isChecked());

            Common.localStorage.save();

            if (this.menu) {
                this.menu.fireEvent('settings:apply', [this.menu]);

                if (this._oldUnits !== this.cmbUnit.getValue())
                    Common.NotificationCenter.trigger('settings:unitschanged', this);
            }
        },

        fillShowChanges: function(fastmode) {
            if(fastmode)
                this.rbShowChangesLast.$el.parent().hide();
            else
                this.rbShowChangesLast.$el.parent().show();
        },

        onChangeCoAuthMode: function (val){
            this.fillShowChanges(val == 1);
            this.rbShowChangesNone.setValue(val == 1);
            this.rbShowChangesLast.setValue(val == 0);
        },

        onFontRenderSelected: function(combo, record) {
            if (record.value == 'custom') {
                var item = combo.store.findWhere({value: 'custom'});
                item && item.set('checked', !record.checked);
                combo.cmpEl.find('#' + record.id + ' a').toggleClass('checked', !record.checked);
                combo.setValue(this._fontRender);
            }
            this._fontRender = combo.getValue();
        },

        autoCorrect: function() {
            if (this.dlgAutoCorrect && this.dlgAutoCorrect.isVisible()) return;
            this.dlgAutoCorrect = new Common.Views.AutoCorrectDialog({
                api: this.api
            });
            this.dlgAutoCorrect.show();
        },

        strZoom: 'Default Zoom Value',
        /** coauthoring begin **/
        strShowChanges: 'Real-time Collaboration Changes',
        txtAll: 'View All',
        txtNone: 'View Nothing',
        txtLast: 'View Last',
        /** coauthoring end **/
        okButtonText: 'Apply',
        txtWin: 'as Windows',
        txtMac: 'as OS X',
        txtNative: 'Native',
        strFontRender: 'Font Hinting',
        strUnit: 'Unit of Measurement',
        txtCm: 'Centimeter',
        txtPt: 'Point',
        textAutoSave: 'Autosave',
        txtSpellCheck: 'Spell Checking',
        textAlignGuides: 'Alignment Guides',
        strCoAuthMode: 'Co-editing mode',
        strFast: 'Fast',
        strStrict: 'Strict',
        textAutoRecover: 'Autorecover',
        txtInch: 'Inch',
        txtFitPage: 'Fit to Page',
        txtFitWidth: 'Fit to Width',
        textForceSave: 'Save to Server',
        textOldVersions: 'Make the files compatible with older MS Word versions when saved as DOCX',
        txtCacheMode: 'Default cache mode',
        strMacrosSettings: 'Macros Settings',
        txtWarnMacros: 'Show Notification',
        txtRunMacros: 'Enable All',
        txtStopMacros: 'Disable All',
        txtWarnMacrosDesc: 'Disable all macros with notification',
        txtRunMacrosDesc: 'Enable all macros without notification',
        txtStopMacrosDesc: 'Disable all macros without notification',
        strPasteButton: 'Show Paste Options button when content is pasted',
        txtProofing: 'Proofing',
        strTheme: 'Theme',
        txtAutoCorrect: 'AutoCorrect options...',
        txtChangesTip: 'Show by hover in tooltips',
        txtChangesBalloons: 'Show by click in balloons',
        txtDarkMode: 'Turn on document dark mode',
        txtEditingSaving: 'Editing and saving',
        txtCollaboration: 'Collaboration',
        txtShowTrackChanges: 'Show track changes',
        txtWorkspace: 'Workspace',
        txtHieroglyphs: 'Hieroglyphs',
        txtUseAltKey: 'Use Alt key to navigate the user interface using the keyboard',
        txtUseOptionKey: 'Use ⌘F6 to navigate the user interface using the keyboard',
        strShowComments: 'Show comments in text',
        strShowResolvedComments: 'Show resolved comments',
        txtFastTip: 'Real-time co-editing. All changes are saved automatically',
        txtStrictTip: 'Use the \'Save\' button to sync the changes you and others make',
        strIgnoreWordsInUPPERCASE: 'Ignore words in UPPERCASE',
        strIgnoreWordsWithNumbers: 'Ignore words with numbers',
        strShowOthersChanges: 'Show changes from other users',
        txtQuickPrint: 'Show the Quick Print button in the editor header',
        txtQuickPrintTip: 'The document will be printed on the last selected or default printer'
    }, DE.Views.FileMenuPanels.Settings || {}));

    DE.Views.FileMenuPanels.RecentFiles = Common.UI.BaseView.extend({
        el: '#panel-recentfiles',
        menu: undefined,

        template: _.template([
            '<div id="id-recent-view" style="margin: 20px 0;"></div>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;
            this.recent = options.recent;
        },

        render: function() {
            this.$el.html(this.template());

            this.viewRecentPicker = new Common.UI.DataView({
                el: $('#id-recent-view'),
                store: new Common.UI.DataViewStore(this.recent),
                itemTemplate: _.template([
                    '<div class="recent-wrap">',
                        '<div class="recent-icon">',
                            '<div>',
                                '<div class="svg-file-recent"></div>',
                            '</div>',
                        '</div>',
                        '<div class="file-name"><% if (typeof title !== "undefined") {%><%= Common.Utils.String.htmlEncode(title || "") %><% } %></div>',
                        '<div class="file-info"><% if (typeof folder !== "undefined") {%><%= Common.Utils.String.htmlEncode(folder || "") %><% } %></div>',
                    '</div>'
                ].join(''))
            });

            this.viewRecentPicker.on('item:click', _.bind(this.onRecentFileClick, this));

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.$el,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.scroller && this.scroller.update();
        },

        onRecentFileClick: function(view, itemview, record){
            if ( this.menu )
                this.menu.fireEvent('recent:open', [this.menu, record.get('url')]);
        }
    });

    DE.Views.FileMenuPanels.CreateNew = Common.UI.BaseView.extend(_.extend({
        el: '#panel-createnew',
        menu: undefined,

        events: function() {
            return {
                'click .blank-document-btn':_.bind(this._onBlankDocument, this),
                'click .thumb-list .thumb-wrap': _.bind(this._onDocumentTemplate, this)
            };
        },

        template: _.template([
            '<h3 style="margin-top: 20px;"><%= scope.txtCreateNew %></h3>',
            '<div class="thumb-list">',
                '<% if (blank) { %> ',
                '<div class="blank-document">',
                    '<div class="blank-document-btn" data-hint="2" data-hint-direction="left-top" data-hint-offset="2, 10">',
                        '<div class="btn-blank-format"><div class ="svg-format-blank"></div></div>',
                    '</div>',
                    '<div class="title"><%= scope.txtBlank %></div>',
                '</div>',
                '<% } %>',
                '<% _.each(docs, function(item, index) { %>',
                '<div class="thumb-wrap" template="<%= item.url %>" data-hint="2" data-hint-direction="left-top" data-hint-offset="14, 22">',
                    '<div class="thumb" ',
                        '<% if (!_.isEmpty(item.image)) {%> ',
                        ' style="background-image: url(<%= item.image %>);">',
                        ' <%} else {' +
                        'print(\"><div class=\'btn-blank-format\'><div class=\'svg-file-template\'></div></div>\")' +
                        ' } %>',
                    '</div>',
                    '<div class="title"><%= Common.Utils.String.htmlEncode(item.title || item.name || "") %></div>',
                '</div>',
                '<% }) %>',
            '</div>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;
            this.docs = options.docs;
            this.blank = !!options.blank;
        },

        render: function() {
            this.$el.html(this.template({
                scope: this,
                docs: this.docs,
                blank: this.blank
            }));
            var docs = (this.blank ? [{title: this.txtBlank}] : []).concat(this.docs);
            var thumbsElm= this.$el.find('.thumb-wrap, .blank-document');
            _.each(thumbsElm, function (tmb, index){
                $(tmb).find('.title').tooltip({
                    title       : docs[index].title,
                    placement   : 'cursor'
                });
            });

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.$el,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.scroller && this.scroller.update();
        },

        _onBlankDocument: function() {
            if ( this.menu )
                this.menu.fireEvent('create:new', [this.menu, 'blank']);
        },

        _onDocumentTemplate: function(e) {
            if ( this.menu )
                this.menu.fireEvent('create:new', [this.menu, e.currentTarget.attributes['template'].value]);
        },

        txtBlank: 'Blank document',
        txtCreateNew: 'Create New'
    }, DE.Views.FileMenuPanels.CreateNew || {}));

    DE.Views.FileMenuPanels.DocumentInfo = Common.UI.BaseView.extend(_.extend({
        el: '#panel-info',
        menu: undefined,

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);
            this.rendered = false;

            this.template = _.template([
            '<div class="flex-settings">',
                '<table class="main" style="margin: 30px 0 0;">',
                    '<tr>',
                        '<td class="left"><label>' + this.txtPlacement + '</label></td>',
                        '<td class="right"><label id="id-info-placement">-</label></td>',
                    '</tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtOwner + '</label></td>',
                        '<td class="right"><label id="id-info-owner">-</label></td>',
                    '</tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtUploaded + '</label></td>',
                        '<td class="right"><label id="id-info-uploaded">-</label></td>',
                    '</tr>',
                    '<tr class="divider general"></tr>',
                    '<tr class="divider general"></tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtPages + '</label></td>',
                        '<td class="right"><label id="id-info-pages"></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtParagraphs + '</label></td>',
                        '<td class="right"><label id="id-info-paragraphs"></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtWords + '</label></td>',
                        '<td class="right"><label id="id-info-words"></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtSymbols + '</label></td>',
                        '<td class="right"><label id="id-info-symbols"></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtSpaces + '</label></td>',
                        '<td class="right"><label id="id-info-spaces"></label></td>',
                    '</tr>',
                    '<tr class="pdf-info">',
                        '<td class="left"><label>' + this.txtPageSize + '</label></td>',
                        '<td class="right"><label id="id-info-page-size"></label></td>',
                    '</tr>',
                    '<tr class="divider"></tr>',
                    '<tr class="divider"></tr>',
                    // '<tr>',
                    //     '<td class="left"><label>' + this.txtEditTime + '</label></td>',
                    //     '<td class="right"><label id="id-info-edittime"></label></td>',
                    // '</tr>',
                    '<tr class="docx-info">',
                        '<td class="left"><label>' + this.txtTitle + '</label></td>',
                        '<td class="right"><div id="id-info-title"></div></td>',
                    '</tr>',
                    '<tr class="docx-info">',
                        '<td class="left"><label>' + this.txtTags + '</label></td>',
                        '<td class="right"><div id="id-info-tags"></div></td>',
                    '</tr>',
                    '<tr class="docx-info">',
                        '<td class="left"><label>' + this.txtSubject + '</label></td>',
                        '<td class="right"><div id="id-info-subject"></div></td>',
                    '</tr>',
                    '<tr class="docx-info">',
                        '<td class="left"><label>' + this.txtComment + '</label></td>',
                        '<td class="right"><div id="id-info-comment"></div></td>',
                    '</tr>',
                    '<tr class="divider docx-info"></tr>',
                    '<tr class="divider docx-info"></tr>',
                    '<tr class="pdf-info">',
                        '<td class="left"><label>' + this.txtTitle + '</label></td>',
                        '<td class="right"><label id="id-lbl-info-title"></label></td>',
                    '</tr>',
                    '<tr class="pdf-info">',
                        '<td class="left"><label>' + this.txtSubject + '</label></td>',
                        '<td class="right"><label id="id-lbl-info-subject"></label></td>',
                    '</tr>',
                    '<tr class="divider pdf-info pdf-title"></tr>',
                    '<tr class="divider pdf-info pdf-title"></tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtModifyDate + '</label></td>',
                        '<td class="right"><label id="id-info-modify-date"></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtModifyBy + '</label></td>',
                        '<td class="right"><label id="id-info-modify-by"></label></td>',
                    '</tr>',
                    '<tr class="divider modify"></tr>',
                    '<tr class="divider modify"></tr>',
                    '<tr>',
                        '<td class="left"><label>' + this.txtCreated + '</label></td>',
                        '<td class="right"><label id="id-info-date"></label></td>',
                    '</tr>',
                    '<tr>',
                         '<td class="left"><label>' + this.txtAppName + '</label></td>',
                         '<td class="right"><label id="id-info-appname"></label></td>',
                    '</tr>',
                    '<tr class="pdf-info">',
                        '<td class="left"><label>' + this.txtAuthor + '</label></td>',
                        '<td class="right"><label id="id-lbl-info-author"></label></td>',
                    '</tr>',
                    '<tr class="divider pdf-info"></tr>',
                    '<tr class="pdf-info">',
                         '<td class="left"><label>' + this.txtPdfProducer + '</label></td>',
                         '<td class="right"><label id="id-info-pdf-produce"></label></td>',
                    '</tr>',
                    '<tr class="pdf-info">',
                         '<td class="left"><label>' + this.txtPdfVer + '</label></td>',
                         '<td class="right"><label id="id-info-pdf-ver"></label></td>',
                    '</tr>',
                    '<tr class="pdf-info">',
                         '<td class="left"><label>' + this.txtPdfTagged + '</label></td>',
                         '<td class="right"><label id="id-info-pdf-tagged"></label></td>',
                    '</tr>',
                    '<tr class="pdf-info">',
                         '<td class="left"><label>' + this.txtFastWV + '</label></td>',
                         '<td class="right"><label id="id-info-fast-wv"></label></td>',
                    '</tr>',
                    '<tr class="docx-info">',
                        '<td class="left" style="vertical-align: top;"><label style="margin-top: 3px;">' + this.txtAuthor + '</label></td>',
                        '<td class="right" style="vertical-align: top;"><div id="id-info-author">',
                            '<table>',
                            '<tr>',
                                '<td><div id="id-info-add-author"><input type="text" spellcheck="false" class="form-control" placeholder="' +  this.txtAddAuthor +'"></div></td>',
                            '</tr>',
                            '</table>',
                        '</div></td>',
                    '</tr>',
                    '<tr style="height: 5px;"></tr>',
                '</table>',
            '</div>',
            '<div id="fms-flex-apply">',
                '<table class="main" style="margin: 10px 0;">',
                    '<tr>',
                        '<td class="left"></td>',
                        '<td class="right"><button id="fminfo-btn-apply" class="btn normal dlg-btn primary" data-hint="2" data-hint-direction="bottom" data-hint-offset="big"><%= scope.okButtonText %></button></td>',
                    '</tr>',
                '</table>',
            '</div>'
            ].join(''));

            this.infoObj = {PageCount: 0, WordsCount: 0, ParagraphCount: 0, SymbolsCount: 0, SymbolsWSCount:0};
            this.menu = options.menu;
            this.coreProps = null;
            this.authors = [];
            this._state = {
                _locked: false,
                docProtection: {
                    isReadOnly: false,
                    isReviewOnly: false,
                    isFormsOnly: false,
                    isCommentsOnly: false
                },
                disableEditing: false
            };
        },

        render: function(node) {
            var me = this;
            var $markup = $(me.template({scope: me}));

            // server info
            this.lblPlacement = $markup.findById('#id-info-placement');
            this.lblOwner = $markup.findById('#id-info-owner');
            this.lblUploaded = $markup.findById('#id-info-uploaded');

            // statistic info
            this.lblStatPages = $markup.findById('#id-info-pages');
            this.lblStatWords = $markup.findById('#id-info-words');
            this.lblStatParagraphs = $markup.findById('#id-info-paragraphs');
            this.lblStatSymbols = $markup.findById('#id-info-symbols');
            this.lblStatSpaces = $markup.findById('#id-info-spaces');
            this.lblPageSize = $markup.findById('#id-info-pages-size');
            // this.lblEditTime = $markup.find('#id-info-edittime');

            // edited info
            var keyDownBefore = function(input, e){
                if (e.keyCode === Common.UI.Keys.ESC) {
                    var newVal = input._input.val(),
                        oldVal = input.getValue();
                    if (newVal !== oldVal) {
                        input.setValue(oldVal);
                        e.stopPropagation();
                    }
                }
            };

            this.inputTitle = new Common.UI.InputField({
                el          : $markup.findById('#id-info-title'),
                style       : 'width: 200px;',
                placeHolder : this.txtAddText,
                validateOnBlur: false,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('keydown:before', keyDownBefore);
            this.inputTags = new Common.UI.InputField({
                el          : $markup.findById('#id-info-tags'),
                style       : 'width: 200px;',
                placeHolder : this.txtAddText,
                validateOnBlur: false,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('keydown:before', keyDownBefore);
            this.inputSubject = new Common.UI.InputField({
                el          : $markup.findById('#id-info-subject'),
                style       : 'width: 200px;',
                placeHolder : this.txtAddText,
                validateOnBlur: false,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('keydown:before', keyDownBefore);
            this.inputComment = new Common.UI.InputField({
                el          : $markup.findById('#id-info-comment'),
                style       : 'width: 200px;',
                placeHolder : this.txtAddText,
                validateOnBlur: false,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('keydown:before', keyDownBefore);

            // modify info
            this.lblModifyDate = $markup.findById('#id-info-modify-date');
            this.lblModifyBy = $markup.findById('#id-info-modify-by');

            // creation info
            this.lblDate = $markup.findById('#id-info-date');
            this.lblApplication = $markup.findById('#id-info-appname');
            this.tblAuthor = $markup.findById('#id-info-author table');
            this.trAuthor = $markup.findById('#id-info-add-author').closest('tr');
            this.authorTpl = '<tr><td><div style="display: inline-block;width: 200px;"><input type="text" spellcheck="false" class="form-control" readonly="true" value="{0}"></div><div class="tool close img-commonctrl img-colored" data-hint="2" data-hint-direction="right" data-hint-offset="small"></div></td></tr>';

            this.tblAuthor.on('click', function(e) {
                var btn = $markup.find(e.target);
                if (btn.hasClass('close') && !btn.hasClass('disabled')) {
                    var el = btn.closest('tr'),
                        idx = me.tblAuthor.find('tr').index(el);
                    el.remove();
                    me.authors.splice(idx, 1);
                    me.updateScroller(true);
                }
            });

            this.inputAuthor = new Common.UI.InputField({
                el          : $markup.findById('#id-info-add-author'),
                style       : 'width: 200px;',
                validateOnBlur: false,
                placeHolder: this.txtAddAuthor,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            }).on('changed:after', function(input, newValue, oldValue, e) {
                if (newValue == oldValue) return;

                var val = newValue.trim();
                if (!!val && val !== oldValue.trim()) {
                    var isFromApply = e && e.relatedTarget && (e.relatedTarget.id == 'fminfo-btn-apply');
                    val.split(/\s*[,;]\s*/).forEach(function(item){
                        var str = item.trim();
                        if (str) {
                            me.authors.push(item);
                            if (!isFromApply) {
                                var div = $(Common.Utils.String.format(me.authorTpl, Common.Utils.String.htmlEncode(str)));
                                me.trAuthor.before(div);
                                me.updateScroller();
                            }
                        }
                    });
                    !isFromApply && me.inputAuthor.setValue('');
                }
            }).on('keydown:before', keyDownBefore);

            // pdf info
            this.lblPageSize = $markup.findById('#id-info-page-size');
            this.lblPdfTitle = $markup.findById('#id-lbl-info-title');
            this.lblPdfSubject = $markup.findById('#id-lbl-info-subject');
            this.lblPdfAuthor = $markup.findById('#id-lbl-info-author');
            this.lblPdfVer = $markup.findById('#id-info-pdf-ver');
            this.lblPdfTagged = $markup.findById('#id-info-pdf-tagged');
            this.lblPdfProducer = $markup.findById('#id-info-pdf-produce');
            this.lblFastWV = $markup.findById('#id-info-fast-wv');

            this.btnApply = new Common.UI.Button({
                el: $markup.findById('#fminfo-btn-apply')
            });
            this.btnApply.on('click', _.bind(this.applySettings, this));

            this.pnlInfo = $markup.find('.flex-settings').addBack().filter('.flex-settings');
            this.pnlApply = $markup.findById('#fms-flex-apply');

            this.rendered = true;

            this.updateInfo(this.doc);

            this.$el = $(node).html($markup);
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.pnlInfo,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            Common.NotificationCenter.on({
                'window:resize': function() {
                    me.isVisible() && me.updateScroller();
                }
            });

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);

            this.updateStatisticInfo();
            this.updateFileInfo();
            this.scroller && this.scroller.scrollTop(0);
            this.updateScroller();
        },

        hide: function() {
            Common.UI.BaseView.prototype.hide.call(this,arguments);

            this.stopUpdatingStatisticInfo();
        },

        updateScroller: function(destroy) {
            if (this.scroller) {
                this.scroller.update(destroy ? {} : undefined);
                this.pnlInfo.toggleClass('bordered', this.scroller.isVisible());
            }
        },

        updateInfo: function(doc) {
            this.doc = doc;
            if (!this.rendered)
                return;

            var visible = false;
            doc = doc || {};
            if (doc.info) {
                // server info
                if (doc.info.folder )
                    this.lblPlacement.text( doc.info.folder );
                visible = this._ShowHideInfoItem(this.lblPlacement, doc.info.folder!==undefined && doc.info.folder!==null) || visible;
                var value = doc.info.owner;
                if (value)
                    this.lblOwner.text(value);
                visible = this._ShowHideInfoItem(this.lblOwner, !!value) || visible;
                value = doc.info.uploaded;
                if (value)
                    this.lblUploaded.text(value);
                visible = this._ShowHideInfoItem(this.lblUploaded, !!value) || visible;
            } else
                this._ShowHideDocInfo(false);
            $('tr.divider.general', this.el)[visible?'show':'hide']();

            var pdfProps = (this.api) ? this.api.asc_getPdfProps() : null;
            var appname = (this.api) ? this.api.asc_getAppProps() : null;
            if (appname) {
                $('.pdf-info', this.el).hide();
                appname = (appname.asc_getApplication() || '') + (appname.asc_getAppVersion() ? ' ' : '') + (appname.asc_getAppVersion() || '');
                this.lblApplication.text(appname);
            } else if (pdfProps) {
                $('.docx-info', this.el).hide();
                appname = pdfProps ? pdfProps.Creator || '' : '';
                this.lblApplication.text(appname);
            }
            this._ShowHideInfoItem(this.lblApplication, !!appname);

            this.coreProps = (this.api) ? this.api.asc_getCoreProps() : null;
            if (this.coreProps) {
                var value = this.coreProps.asc_getCreated();
                if (value) {
                    var lang = (this.mode.lang || 'en').replace('_', '-').toLowerCase();
                    try {
                        this.lblDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    } catch (e) {
                        lang = 'en';
                        this.lblDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    }
                }
                this._ShowHideInfoItem(this.lblDate, !!value);
            } else if (pdfProps)
                this.updatePdfInfo(pdfProps);
        },

        updateFileInfo: function() {
            if (!this.rendered)
                return;

            var me = this,
                props = (this.api) ? this.api.asc_getCoreProps() : null,
                value;

            this.coreProps = props;
            if (props) {
                var visible = false;
                value = props.asc_getModified();

                if (value) {
                    var lang = (this.mode.lang || 'en').replace('_', '-').toLowerCase();
                    try {
                        this.lblModifyDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    } catch (e) {
                        lang = 'en';
                        this.lblModifyDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    }
                }
                visible = this._ShowHideInfoItem(this.lblModifyDate, !!value) || visible;
                value = props.asc_getLastModifiedBy();
                if (value)
                    this.lblModifyBy.text(AscCommon.UserInfoParser.getParsedName(value));
                visible = this._ShowHideInfoItem(this.lblModifyBy, !!value) || visible;
                $('tr.divider.modify', this.el)[visible?'show':'hide']();

                value = props.asc_getTitle();
                this.inputTitle.setValue(value || '');
                value = props.asc_getKeywords();
                this.inputTags.setValue(value || '');
                value = props.asc_getSubject();
                this.inputSubject.setValue(value || '');
                value = props.asc_getDescription();
                this.inputComment.setValue(value || '');

                this.inputAuthor.setValue('');
                this.tblAuthor.find('tr:not(:last-of-type)').remove();
                this.authors = [];
                value = props.asc_getCreator();//"123\"\"\"\<\>,456";
                value && value.split(/\s*[,;]\s*/).forEach(function(item) {
                    var div = $(Common.Utils.String.format(me.authorTpl, Common.Utils.String.htmlEncode(item)));
                    me.trAuthor.before(div);
                    me.authors.push(item);
                });
                this.tblAuthor.find('.close').toggleClass('hidden', !this.mode.isEdit);
                this._ShowHideInfoItem(this.tblAuthor, this.mode.isEdit || !!this.authors.length);
            }
            this.SetDisabled();
        },

        updatePdfInfo: function(props) {
            if (!this.rendered)
                return;

            var me = this,
                value;

            if (props) {
                value = props.CreationDate;
                if (value) {
                    value = new Date(value);
                    var lang = (this.mode.lang || 'en').replace('_', '-').toLowerCase();
                    try {
                        this.lblDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    } catch (e) {
                        lang = 'en';
                        this.lblDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    }
                }
                this._ShowHideInfoItem(this.lblDate, !!value);

                var visible = false;
                value = props.ModDate;
                if (value) {
                    value = new Date(value);
                    var lang = (this.mode.lang || 'en').replace('_', '-').toLowerCase();
                    try {
                        this.lblModifyDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    } catch (e) {
                        lang = 'en';
                        this.lblModifyDate.text(value.toLocaleString(lang, {year: 'numeric', month: '2-digit', day: '2-digit'}) + ' ' + value.toLocaleString(lang, {timeStyle: 'short'}));
                    }
                }
                visible = this._ShowHideInfoItem(this.lblModifyDate, !!value) || visible;
                visible = this._ShowHideInfoItem(this.lblModifyBy, false) || visible;
                $('tr.divider.modify', this.el)[visible?'show':'hide']();

                if (props.PageWidth && props.PageHeight && (typeof props.PageWidth === 'number') && (typeof props.PageHeight === 'number')) {
                    var w = props.PageWidth,
                        h = props.PageHeight;
                    switch (Common.Utils.Metric.getCurrentMetric()) {
                        case Common.Utils.Metric.c_MetricUnits.cm:
                            w = parseFloat((w* 25.4 / 72000.).toFixed(2));
                            h = parseFloat((h* 25.4 / 72000.).toFixed(2));
                            break;
                        case Common.Utils.Metric.c_MetricUnits.pt:
                            w = parseFloat((w/100.).toFixed(2));
                            h = parseFloat((h/100.).toFixed(2));
                            break;
                        case Common.Utils.Metric.c_MetricUnits.inch:
                            w = parseFloat((w/7200.).toFixed(2));
                            h = parseFloat((h/7200.).toFixed(2));
                            break;
                    }
                    this.lblPageSize.text(w + ' ' + Common.Utils.Metric.getCurrentMetricName() + ' x ' + h + ' ' + Common.Utils.Metric.getCurrentMetricName());
                    this._ShowHideInfoItem(this.lblPageSize, true);
                } else
                    this._ShowHideInfoItem(this.lblPageSize, false);

                value = props.Title;
                value && this.lblPdfTitle.text(value);
                visible = this._ShowHideInfoItem(this.lblPdfTitle, !!value);

                value = props.Subject;
                value && this.lblPdfSubject.text(value);
                visible = this._ShowHideInfoItem(this.lblPdfSubject, !!value) || visible;
                $('tr.divider.pdf-title', this.el)[visible?'show':'hide']();

                value = props.Author;
                value && this.lblPdfAuthor.text(value);
                this._ShowHideInfoItem(this.lblPdfAuthor, !!value);

                value = props.Version;
                value && this.lblPdfVer.text(value);
                this._ShowHideInfoItem(this.lblPdfVer, !!value);

                value = props.Tagged;
                if (value !== undefined)
                    this.lblPdfTagged.text(value===true ? this.txtYes : this.txtNo);
                this._ShowHideInfoItem(this.lblPdfTagged, value !== undefined);

                value = props.Producer;
                value && this.lblPdfProducer.text(value);
                this._ShowHideInfoItem(this.lblPdfProducer, !!value);

                value = props.FastWebView;
                if (value !== undefined)
                    this.lblFastWV.text(value===true ? this.txtYes : this.txtNo);
                this._ShowHideInfoItem(this.lblFastWV, value !== undefined);
            }
        },

        _ShowHideInfoItem: function(el, visible) {
            el.closest('tr')[visible?'show':'hide']();
            return visible;
        },

        _ShowHideDocInfo: function(visible) {
            this._ShowHideInfoItem(this.lblPlacement, visible);
            this._ShowHideInfoItem(this.lblOwner, visible);
            this._ShowHideInfoItem(this.lblUploaded, visible);
        },

        updateStatisticInfo: function() {
            if ( this.api && this.doc ) {
                this.api.startGetDocInfo();
            }
        },

        stopUpdatingStatisticInfo: function() {
            if ( this.api ) {
                this.api.stopGetDocInfo();
            }
        },

        setApi: function(o) {
            this.api = o;
            this.api.asc_registerCallback('asc_onGetDocInfoStart', _.bind(this._onGetDocInfoStart, this));
            this.api.asc_registerCallback('asc_onGetDocInfoStop', _.bind(this._onGetDocInfoEnd, this));
            this.api.asc_registerCallback('asc_onDocInfo', _.bind(this._onDocInfo, this));
            this.api.asc_registerCallback('asc_onGetDocInfoEnd', _.bind(this._onGetDocInfoEnd, this));
            // this.api.asc_registerCallback('asc_onDocumentName',  _.bind(this.onDocumentName, this));
            this.api.asc_registerCallback('asc_onLockCore',  _.bind(this.onLockCore, this));
            Common.NotificationCenter.on('protect:doclock', _.bind(this.onChangeProtectDocument, this));
            this.onChangeProtectDocument();
            this.updateInfo(this.doc);
            return this;
        },

        setMode: function(mode) {
            this.mode = mode;
            this.inputAuthor.setVisible(mode.isEdit);
            this.pnlApply.toggleClass('hidden', !mode.isEdit);
            this.tblAuthor.find('.close').toggleClass('hidden', !mode.isEdit);
            this.inputTitle._input.attr('placeholder', mode.isEdit ? this.txtAddText : '');
            this.inputTags._input.attr('placeholder', mode.isEdit ? this.txtAddText : '');
            this.inputSubject._input.attr('placeholder', mode.isEdit ? this.txtAddText : '');
            this.inputComment._input.attr('placeholder', mode.isEdit ? this.txtAddText : '');
            this.inputAuthor._input.attr('placeholder', mode.isEdit ? this.txtAddAuthor : '');
            this.SetDisabled();
            return this;
        },

        setPreviewMode: function(mode) {
            this._state.disableEditing = mode;
        },

        _onGetDocInfoStart: function() {
            var me = this;
            this.infoObj = {PageCount: 0, WordsCount: 0, ParagraphCount: 0, SymbolsCount: 0, SymbolsWSCount:0};
            this.timerLoading = setTimeout(function(){
                me.lblStatPages.text(me.txtLoading);
                me.lblStatWords.text(me.txtLoading);
                me.lblStatParagraphs.text(me.txtLoading);
                me.lblStatSymbols.text(me.txtLoading);
                me.lblStatSpaces.text(me.txtLoading);
            }, 2000);
        },

        _onDocInfo: function(obj) {
            if (obj) {
                clearTimeout(this.timerLoading);
                if (obj.get_PageCount()>-1)
                    this.infoObj.PageCount = obj.get_PageCount();
                if (obj.get_WordsCount()>-1)
                    this.infoObj.WordsCount = obj.get_WordsCount();
                if (obj.get_ParagraphCount()>-1)
                    this.infoObj.ParagraphCount = obj.get_ParagraphCount();
                if (obj.get_SymbolsCount()>-1)
                    this.infoObj.SymbolsCount = obj.get_SymbolsCount();
                if (obj.get_SymbolsWSCount()>-1)
                    this.infoObj.SymbolsWSCount = obj.get_SymbolsWSCount();
                if (!this.timerDocInfo) { // start timer for filling info
                    var me = this;
                    this.timerDocInfo = setInterval(function(){
                        me.fillDocInfo();
                    }, 300);
                    this.fillDocInfo();
                }
            }
        },

        _onGetDocInfoEnd: function() {
            clearTimeout(this.timerLoading);
            clearInterval(this.timerDocInfo);
            this.timerLoading = this.timerDocInfo = undefined;
            this.fillDocInfo();
        },

        fillDocInfo:  function() {
            this.lblStatPages.text(this.infoObj.PageCount);
            this.lblStatWords.text(this.infoObj.WordsCount);
            this.lblStatParagraphs.text(this.infoObj.ParagraphCount);
            this.lblStatSymbols.text(this.infoObj.SymbolsCount);
            this.lblStatSpaces.text(this.infoObj.SymbolsWSCount);
        },

        onDocumentName: function(name) {
            // this.lblTitle.text((name) ? name : '-');
        },

        onLockCore: function(lock) {
            this._state._locked = lock;
            this.updateFileInfo();
        },

        onChangeProtectDocument: function(props) {
            if (!props) {
                var docprotect = DE.getController('DocProtection');
                props = docprotect ? docprotect.getDocProps() : null;
            }
            if (props) {
                this._state.docProtection = props;
            }
        },

        SetDisabled: function() {
            var isProtected = this._state.docProtection.isReadOnly || this._state.docProtection.isFormsOnly || this._state.docProtection.isCommentsOnly;
            var disable = !this.mode.isEdit || this._state._locked || isProtected || this._state.disableEditing;
            this.inputTitle.setDisabled(disable);
            this.inputTags.setDisabled(disable);
            this.inputSubject.setDisabled(disable);
            this.inputComment.setDisabled(disable);
            this.inputAuthor.setDisabled(disable);
            this.tblAuthor.find('.close').toggleClass('disabled', this._state._locked);
            this.tblAuthor.toggleClass('disabled', disable);
            this.btnApply.setDisabled(this._state._locked);
        },

        applySettings: function() {
            if (this.coreProps && this.api) {
                this.coreProps.asc_putTitle(this.inputTitle.getValue());
                this.coreProps.asc_putKeywords(this.inputTags.getValue());
                this.coreProps.asc_putSubject(this.inputSubject.getValue());
                this.coreProps.asc_putDescription(this.inputComment.getValue());
                this.coreProps.asc_putCreator(this.authors.join(';'));
                this.api.asc_setCoreProps(this.coreProps);
            }
            this.menu.hide();
        },

        txtPlacement: 'Location',
        txtOwner: 'Owner',
        txtUploaded: 'Uploaded',
        txtPages: 'Pages',
        txtWords: 'Words',
        txtParagraphs: 'Paragraphs',
        txtSymbols: 'Symbols',
        txtSpaces: 'Symbols with spaces',
        txtLoading: 'Loading...',
        txtAppName: 'Application',
        txtEditTime: 'Total Editing time',
        txtTitle: 'Title',
        txtTags: 'Tags',
        txtSubject: 'Subject',
        txtComment: 'Comment',
        txtModifyDate: 'Last Modified',
        txtModifyBy: 'Last Modified By',
        txtCreated: 'Created',
        txtAuthor: 'Author',
        txtAddAuthor: 'Add Author',
        txtAddText: 'Add Text',
        txtMinutes: 'min',
        okButtonText: 'Apply',
        txtPageSize: 'Page Size',
        txtPdfVer: 'PDF Version',
        txtPdfTagged: 'Tagged PDF',
        txtFastWV: 'Fast Web View',
        txtYes: 'Yes',
        txtNo: 'No',
        txtPdfProducer: 'PDF Producer'

    }, DE.Views.FileMenuPanels.DocumentInfo || {}));

    DE.Views.FileMenuPanels.DocumentRights = Common.UI.BaseView.extend(_.extend({
        el: '#panel-rights',
        menu: undefined,

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);
            this.rendered = false;

            this.template = _.template([
                '<table class="main" style="margin: 30px 0;">',
                    '<tr class="rights">',
                        '<td class="left" style="vertical-align: top;"><label>' + this.txtRights + '</label></td>',
                        '<td class="right"><div id="id-info-rights"></div></td>',
                    '</tr>',
                    '<tr class="edit-rights">',
                        '<td class="left"></td><td class="right"><button id="id-info-btn-edit" class="btn normal dlg-btn primary custom" style="margin-right: 10px;">' + this.txtBtnAccessRights + '</button></td>',
                    '</tr>',
                '</table>'
            ].join(''));

            this.templateRights = _.template([
                '<table>',
                    '<% _.each(users, function(item) { %>',
                    '<tr>',
                        '<td><span class="userLink img-commonctrl  <% if (item.isLink) { %>sharedLink<% } %>"></span><span><%= Common.Utils.String.htmlEncode(item.user) %></span></td>',
                        '<td><%= Common.Utils.String.htmlEncode(item.permissions) %></td>',
                    '</tr>',
                    '<% }); %>',
                '</table>'
            ].join(''));

            this.menu = options.menu;
        },

        render: function(node) {
            var $markup = $(this.template());

            this.cntRights = $markup.findById('#id-info-rights');
            this.btnEditRights = new Common.UI.Button({
                el: $markup.elementById('#id-info-btn-edit')
            });
            this.btnEditRights.on('click', _.bind(this.changeAccessRights, this));

            this.rendered = true;

            this.updateInfo(this.doc);

            Common.NotificationCenter.on('collaboration:sharingupdate', this.updateSharingSettings.bind(this));
            Common.NotificationCenter.on('collaboration:sharingdeny', this.onLostEditRights.bind(this));

            this.$el = $(node).html($markup);

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.$el,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }
            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.scroller && this.scroller.update();
        },

        hide: function() {
            Common.UI.BaseView.prototype.hide.call(this,arguments);
        },

        updateInfo: function(doc) {
            this.doc = doc;
            if (!this.rendered)
                return;

            doc = doc || {};
            if (doc.info) {
                if (doc.info.sharingSettings)
                    this.cntRights.html(this.templateRights({users: doc.info.sharingSettings}));
                this._ShowHideInfoItem('rights', doc.info.sharingSettings!==undefined && doc.info.sharingSettings!==null && doc.info.sharingSettings.length>0);
                this._ShowHideInfoItem('edit-rights', (!!this.sharingSettingsUrl && this.sharingSettingsUrl.length || this.mode.canRequestSharingSettings) && this._readonlyRights!==true);
            } else
                this._ShowHideDocInfo(false);
        },

        _ShowHideInfoItem: function(cls, visible) {
            $('tr.'+cls, this.el)[visible?'show':'hide']();
        },

        _ShowHideDocInfo: function(visible) {
            this._ShowHideInfoItem('rights', visible);
            this._ShowHideInfoItem('edit-rights', visible);
        },

        setApi: function(o) {
            this.api = o;
            return this;
        },

        setMode: function(mode) {
            this.mode = mode;
            this.sharingSettingsUrl = mode.sharingSettingsUrl;
            return this;
        },

        changeAccessRights: function(btn,event,opts) {
            Common.NotificationCenter.trigger('collaboration:sharing');
        },

        updateSharingSettings: function(rights) {
            this._ShowHideInfoItem('rights', this.doc.info.sharingSettings!==undefined && this.doc.info.sharingSettings!==null && this.doc.info.sharingSettings.length>0);
            this.cntRights.html(this.templateRights({users: this.doc.info.sharingSettings}));
        },

        onLostEditRights: function() {
            this._readonlyRights = true;
            if (!this.rendered)
                return;

            this._ShowHideInfoItem('edit-rights', false);
        },

        txtRights: 'Persons who have rights',
        txtBtnAccessRights: 'Change access rights'
    }, DE.Views.FileMenuPanels.DocumentRights || {}));

    DE.Views.FileMenuPanels.Help = Common.UI.BaseView.extend({
        el: '#panel-help',
        menu: undefined,

        template: _.template([
            '<div style="width:100%; height:100%; position: relative;">',
                '<div id="id-help-contents" style="position: absolute; width:220px; top: 0; bottom: 0;" class="no-padding"></div>',
                '<div id="id-help-frame" style="position: absolute; left: 220px; top: 0; right: 0; bottom: 0;" class="no-padding"></div>',
            '</div>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;
            this.urlPref = 'resources/help/{{DEFAULT_LANG}}/';
            this.openUrl = null;

            this.en_data = [
                {"src": "ProgramInterface/ProgramInterface.htm", "name": "Introducing Document Editor user interface", "headername": "Program Interface"},
                {"src": "ProgramInterface/FileTab.htm", "name": "File tab"},
                {"src": "ProgramInterface/HomeTab.htm", "name": "Home Tab"},
                {"src": "ProgramInterface/InsertTab.htm", "name": "Insert tab"},
                {"src": "ProgramInterface/LayoutTab.htm", "name": "Layout tab"},
                {"src": "ProgramInterface/ReviewTab.htm", "name": "Review tab"},
                {"src": "ProgramInterface/PluginsTab.htm", "name": "Plugins tab"},
                {"src": "UsageInstructions/ChangeColorScheme.htm", "name": "Change color scheme", "headername": "Basic operations"},
                {"src": "UsageInstructions/CopyPasteUndoRedo.htm", "name": "Copy/paste text passages, undo/redo your actions"},
                {"src": "UsageInstructions/OpenCreateNew.htm", "name": "Create a new document or open an existing one"},
                {"src": "UsageInstructions/SetPageParameters.htm", "name": "Set page parameters", "headername": "Page formatting"},
                {"src": "UsageInstructions/NonprintingCharacters.htm", "name": "Show/hide nonprinting characters" },
                {"src": "UsageInstructions/SectionBreaks.htm", "name": "Insert section breaks" },
                {"src": "UsageInstructions/InsertHeadersFooters.htm", "name": "Insert headers and footers"},
                {"src": "UsageInstructions/InsertPageNumbers.htm", "name": "Insert page numbers"},
                {"src": "UsageInstructions/InsertFootnotes.htm", "name": "Insert footnotes"},
                {"src": "UsageInstructions/AlignText.htm", "name": "Align your text in a paragraph", "headername": "Paragraph formatting"},
                {"src": "UsageInstructions/BackgroundColor.htm", "name": "Select background color for a paragraph"},
                {"src": "UsageInstructions/ParagraphIndents.htm", "name": "Change paragraph indents"},
                {"src": "UsageInstructions/LineSpacing.htm", "name": "Set paragraph line spacing"},
                {"src": "UsageInstructions/PageBreaks.htm", "name": "Insert page breaks"},
                {"src": "UsageInstructions/AddBorders.htm", "name": "Add borders"},
                {"src": "UsageInstructions/SetTabStops.htm", "name": "Set tab stops"},
                {"src": "UsageInstructions/CreateLists.htm", "name": "Create lists"},
                {"src": "UsageInstructions/FormattingPresets.htm", "name": "Apply formatting styles", "headername": "Text formatting"},
                {"src": "UsageInstructions/FontTypeSizeColor.htm", "name": "Set font type, size, and color"},
                {"src": "UsageInstructions/DecorationStyles.htm", "name": "Apply font decoration styles"},
                {"src": "UsageInstructions/CopyClearFormatting.htm", "name": "Copy/clear text formatting" },
                {"src": "UsageInstructions/AddHyperlinks.htm", "name": "Add hyperlinks"},
                {"src": "UsageInstructions/InsertDropCap.htm", "name": "Insert a drop cap"},
                {"src": "UsageInstructions/InsertTables.htm", "name": "Insert tables", "headername": "Operations on objects"},
                {"src": "UsageInstructions/InsertImages.htm", "name": "Insert images"},
                {"src": "UsageInstructions/InsertAutoshapes.htm", "name": "Insert autoshapes"},
                {"src": "UsageInstructions/InsertCharts.htm", "name": "Insert charts" },
                {"src": "UsageInstructions/InsertTextObjects.htm", "name": "Insert text objects" },
                {"src": "UsageInstructions/AlignArrangeObjects.htm", "name": "Align and arrange objects on a page" },
                {"src": "UsageInstructions/ChangeWrappingStyle.htm", "name": "Change wrapping style" },
                {"src": "UsageInstructions/UseMailMerge.htm", "name": "Use mail merge", "headername": "Mail Merge"},
                {"src": "UsageInstructions/InsertEquation.htm", "name": "Insert equations", "headername": "Math equations"},
                {"src": "HelpfulHints/CollaborativeEditing.htm", "name": "Collaborative document editing", "headername": "Document co-editing"},
                {"src": "HelpfulHints/Review.htm", "name": "Document Review"},
                {"src": "UsageInstructions/ViewDocInfo.htm", "name": "View document information", "headername": "Tools and settings"},
                {"src": "UsageInstructions/SavePrintDownload.htm", "name": "Save/download/print your document" },
                {"src": "HelpfulHints/AdvancedSettings.htm", "name": "Advanced settings of Document Editor"},
                {"src": "HelpfulHints/Navigation.htm", "name": "View settings and navigation tools"},
                {"src": "HelpfulHints/Search.htm", "name": "Search and replace function"},
                {"src": "HelpfulHints/SpellChecking.htm", "name": "Spell-checking"},
                {"src": "HelpfulHints/About.htm", "name": "About Document Editor", "headername": "Helpful hints"},
                {"src": "HelpfulHints/SupportedFormats.htm", "name": "Supported formats of electronic documents" },
                {"src": "HelpfulHints/KeyboardShortcuts.htm", "name": "Keyboard shortcuts"}
            ];

            if (Common.Utils.isIE) {
                window.onhelp = function () { return false; }
            }
        },

        render: function() {
            var me = this;
            this.$el.html(this.template());

            this.viewHelpPicker = new Common.UI.DataView({
                el: $('#id-help-contents'),
                store: new Common.UI.DataViewStore([]),
                keyMoveDirection: 'vertical',
                itemTemplate: _.template([
                    '<div id="<%= id %>" class="help-item-wrap">',
                        '<div class="caption"><%= name %></div>',
                    '</div>'
                ].join(''))
            });
            this.viewHelpPicker.on('item:add', function(dataview, itemview, record) {
                if (record.has('headername')) {
                    $(itemview.el).before('<div class="header-name">' + record.get('headername') + '</div>');
                }
            });

            this.viewHelpPicker.on('item:select', function(dataview, itemview, record) {
                me.onSelectItem(record.get('src'));
            });

            this.iFrame = document.createElement('iframe');

            this.iFrame.src = "";
            this.iFrame.align = "top";
            this.iFrame.frameBorder = "0";
            this.iFrame.width = "100%";
            this.iFrame.height = "100%";
            Common.Gateway.on('internalcommand', function(data) {
                if (data.type == 'help:hyperlink') {
                    var src = data.data;
                    var rec = me.viewHelpPicker.store.find(function(record){
                        return (src.indexOf(record.get('src'))>0);
                    });
                    if (rec) {
                        me.viewHelpPicker.selectRecord(rec, true);
                        me.viewHelpPicker.scrollToRecord(rec);
                    }
                }
            });

            $('#id-help-frame').append(this.iFrame);

            return this;
        },

        setLangConfig: function(lang) {
            var me = this;
            var store = this.viewHelpPicker.store;
            if (lang) {
                lang = lang.split(/[\-\_]/)[0];
                var config = {
                    dataType: 'json',
                    error: function () {
                        if ( me.urlPref.indexOf('resources/help/{{DEFAULT_LANG}}/')<0 ) {
                            me.urlPref = 'resources/help/{{DEFAULT_LANG}}/';
                            store.url = 'resources/help/{{DEFAULT_LANG}}/Contents.json';
                            store.fetch(config);
                        } else {
                            me.urlPref = 'resources/help/{{DEFAULT_LANG}}/';
                            store.reset(me.en_data);
                        }
                    },
                    success: function () {
                        var rec = me.openUrl ? store.find(function(record){
                            return (me.openUrl.indexOf(record.get('src'))>=0);
                        }) : store.at(0);
                        if (rec) {
                            me.viewHelpPicker.selectRecord(rec, true);
                            me.viewHelpPicker.scrollToRecord(rec);
                        }
                        me.onSelectItem(me.openUrl ? me.openUrl : rec.get('src'));
                    }
                };

                if ( Common.Controllers.Desktop.isActive() ) {
                    if ( !Common.Controllers.Desktop.isHelpAvailable() ) {
                        me.noHelpContents = true;
                        me.iFrame.src = '../../common/main/resources/help/download.html';
                    } else {
                        me.urlPref = Common.Controllers.Desktop.helpUrl() + '/';
                        store.url = me.urlPref + 'Contents.json';
                        store.fetch(config);
                    }
                } else {
                    store.url = 'resources/help/' + lang + '/Contents.json';
                    store.fetch(config);
                    this.urlPref = 'resources/help/' + lang + '/';
                }
            }
        },

        show: function (url) {
            Common.UI.BaseView.prototype.show.call(this);
            if (!this._scrollerInited) {
                this.viewHelpPicker.scroller.update();
                this._scrollerInited = true;
            }
            if (url) {
                if (this.viewHelpPicker.store.length>0) {
                    var rec = this.viewHelpPicker.store.find(function(record){
                        return (url.indexOf(record.get('src'))>=0);
                    });
                    if (rec) {
                        this.viewHelpPicker.selectRecord(rec, true);
                        this.viewHelpPicker.scrollToRecord(rec);
                    }
                    this.onSelectItem(url);
                } else
                    this.openUrl = url;
            }
        },

        onSelectItem: function(src) {
            this.iFrame.src = this.urlPref + src;
        }
    });

    DE.Views.FileMenuPanels.ProtectDoc = Common.UI.BaseView.extend(_.extend({
        el: '#panel-protect',
        menu: undefined,

        template: _.template([
            '<label id="id-fms-lbl-protect-header" style="font-size: 18px;"><%= scope.strProtect %></label>',
            '<div id="id-fms-password">',
                '<label class="header"><%= scope.strEncrypt %></label>',
                '<div id="fms-btn-add-pwd" style="width:190px;"></div>',
                '<table id="id-fms-view-pwd" cols="2" width="300">',
                    '<tr>',
                        '<td colspan="2"><label style="cursor: default;"><%= scope.txtEncrypted %></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td><div id="fms-btn-change-pwd" style="width:190px;"></div></td>',
                        '<td align="right"><div id="fms-btn-delete-pwd" style="width:190px; margin-left:20px;"></div></td>',
                    '</tr>',
                '</table>',
            '</div>',
            '<div id="id-fms-signature">',
                '<label class="header"><%= scope.strSignature %></label>',
                '<div id="fms-btn-invisible-sign" style="width:190px; margin-bottom: 20px;"></div>',
                '<div id="id-fms-signature-view"></div>',
            '</div>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;

            var me = this;
            this.templateSignature = _.template([
                '<table cols="2" width="300" class="<% if (!hasRequested && !hasSigned) { %>hidden<% } %>"">',
                    '<tr>',
                        '<td colspan="2"><label style="cursor: default;"><%= tipText %></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td><label class="link signature-view-link" data-hint="2" data-hint-direction="bottom" data-hint-offset="medium">' + me.txtView + '</label></td>',
                        '<td align="right"><label class="link signature-edit-link <% if (!hasSigned) { %>hidden<% } %>" data-hint="2" data-hint-direction="bottom" data-hint-offset="medium">' + me.txtEdit + '</label></td>',
                    '</tr>',
                '</table>'
            ].join(''));
        },

        render: function() {
            this.$el.html(this.template({scope: this}));

            var protection = DE.getController('Common.Controllers.Protection').getView();

            this.btnAddPwd = protection.getButton('add-password');
            this.btnAddPwd.render(this.$el.find('#fms-btn-add-pwd'));
            this.btnAddPwd.on('click', _.bind(this.closeMenu, this));

            this.btnChangePwd = protection.getButton('change-password');
            this.btnChangePwd.render(this.$el.find('#fms-btn-change-pwd'));
            this.btnChangePwd.on('click', _.bind(this.closeMenu, this));

            this.btnDeletePwd = protection.getButton('del-password');
            this.btnDeletePwd.render(this.$el.find('#fms-btn-delete-pwd'));
            this.btnDeletePwd.on('click', _.bind(this.closeMenu, this));

            this.cntPassword = $('#id-fms-password');
            this.cntPasswordView = $('#id-fms-view-pwd');

            this.btnAddInvisibleSign = protection.getButton('signature');
            this.btnAddInvisibleSign.render(this.$el.find('#fms-btn-invisible-sign'));
            this.btnAddInvisibleSign.on('click', _.bind(this.closeMenu, this));

            this.cntSignature = $('#id-fms-signature');
            this.cntSignatureView = $('#id-fms-signature-view');
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.$el,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            this.$el.on('click', '.signature-edit-link', _.bind(this.onEdit, this));
            this.$el.on('click', '.signature-view-link', _.bind(this.onView, this));

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.updateSignatures();
            this.updateEncrypt();
            this.scroller && this.scroller.update();
        },

        setMode: function(mode) {
            this.mode = mode;
            this.cntSignature.toggleClass('hidden', !this.mode.isSignatureSupport);
            this.cntPassword.toggleClass('hidden', !this.mode.isPasswordSupport);
        },

        setApi: function(o) {
            this.api = o;
            return this;
        },

        closeMenu: function() {
            this.menu && this.menu.hide();
        },

        onEdit: function() {
            this.menu && this.menu.hide();

            var me = this;
            Common.UI.warning({
                title: this.notcriticalErrorTitle,
                msg: this.txtEditWarning,
                buttons: ['ok', 'cancel'],
                primary: 'ok',
                callback: function(btn) {
                    if (btn == 'ok') {
                        me.api.asc_RemoveAllSignatures();
                    }
                }
            });

        },

        onView: function() {
            this.menu && this.menu.hide();
            DE.getController('RightMenu').rightmenu.SetActivePane(Common.Utils.documentSettingsType.Signature, true);
        },

        updateSignatures: function(){
            var requested = this.api.asc_getRequestSignatures(),
                valid = this.api.asc_getSignatures(),
                hasRequested = requested && requested.length>0,
                hasValid = false,
                hasInvalid = false;

            _.each(valid, function(item, index){
                if (item.asc_getValid()==0)
                    hasValid = true;
                else
                    hasInvalid = true;
            });

            // hasRequested = true;
            // hasValid = true;
            // hasInvalid = true;

            var tipText = (hasInvalid) ? this.txtSignedInvalid : (hasValid ? this.txtSigned : "");
            if (hasRequested)
                tipText = this.txtRequestedSignatures + (tipText!="" ? "<br><br>" : "")+ tipText;

            this.cntSignatureView.html(this.templateSignature({tipText: tipText, hasSigned: (hasValid || hasInvalid), hasRequested: hasRequested}));
        },

        updateEncrypt: function() {
            this.cntPasswordView.toggleClass('hidden', this.btnAddPwd.isVisible());
        },

        strProtect: 'Protect Document',
        strSignature: 'With Signature',
        txtView: 'View signatures',
        txtEdit: 'Edit document',
        txtSigned: 'Valid signatures has been added to the document. The document is protected from editing.',
        txtSignedInvalid: 'Some of the digital signatures in document are invalid or could not be verified. The document is protected from editing.',
        txtRequestedSignatures: 'This document needs to be signed.',
        notcriticalErrorTitle: 'Warning',
        txtEditWarning: 'Editing will remove the signatures from the document.<br>Are you sure you want to continue?',
        strEncrypt: 'With Password',
        txtEncrypted: 'This document has been protected by password'

    }, DE.Views.FileMenuPanels.ProtectDoc || {}));

    DE.Views.PrintWithPreview = Common.UI.BaseView.extend(_.extend({
        el: '#panel-print',
        menu: undefined,

        template: _.template([
            '<div style="width:100%; height:100%; position: relative;">',
                '<div id="id-print-settings" class="no-padding">',
                    '<div class="print-settings">',
                        '<div class="flex-settings ps-container oo settings-container">',
                            '<table style="width: 100%;">',
                            '<tbody>',
                                '<tr><td><label class="header"><%= scope.txtPrintRange %></label></td></tr>',
                                '<tr><td class="padding-small"><div id="print-combo-range" style="width: 248px;"></div></td></tr>',
                                '<tr><td class="padding-large">',
                                    '<table style="width: 100%;"><tbody><tr>',
                                        '<td><%= scope.txtPages %></td><td><div id="print-txt-pages" style="width: 100%;padding-left: 5px;"></div></td>',
                                    '</tr></tbody></table>',
                                '</td></tr>',
                                '<tr><td><label class="header"><%= scope.txtPageSize %></label></td></tr>',
                                '<tr><td class="padding-large"><div id="print-combo-pages" style="width: 248px;"></div></td></tr>',
                                '<tr><td><label class="header"><%= scope.txtPageOrientation %></label></td></tr>',
                                '<tr><td class="padding-large"><div id="print-combo-orient" style="width: 150px;"></div></td></tr>',
                                '<tr><td><label class="header"><%= scope.txtMargins %></label></td></tr>',
                                '<tr><td class="padding-large"><div id="print-combo-margins" style="width: 248px;"></div></td></tr>',
                                '<tr class="fms-btn-apply"><td>',
                                    '<div class="footer justify">',
                                        '<button id="print-btn-print" class="btn normal dlg-btn primary" result="print" style="width: 96px;" data-hint="2" data-hint-direction="bottom" data-hint-offset="big"><%= scope.txtPrint %></button>',
                                        '<button id="print-btn-print-pdf" class="btn normal dlg-btn" result="pdf" style="min-width: 96px;width: auto;" data-hint="2" data-hint-direction="bottom" data-hint-offset="big"><%= scope.txtPrintPdf %></button>',
                                    '</div>',
                                '</td></tr>',
                            '</tbody>',
                            '</table>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="print-preview-box" style="position: absolute; left: 280px; top: 0; right: 0; bottom: 0;" class="no-padding">',
                    '<div id="print-preview"></div>',
                    '<div id="print-navigation">',
                        '<div id="print-prev-page" style="display: inline-block; margin-right: 4px;"></div>',
                        '<div id="print-next-page" style="display: inline-block;"></div>',
                        '<div class="page-number">',
                            '<label><%= scope.txtPage %></label>',
                            '<div id="print-number-page"></div>',
                            '<label id="print-count-page"><%= scope.txtOf %></label>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('')),

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.menu = options.menu;

            this._initSettings = true;
        },

        render: function(node) {
            var me = this;

            var $markup = $(this.template({scope: this}));

            this.cmbRange = new Common.UI.ComboBox({
                el: $markup.findById('#print-combo-range'),
                menuStyle: 'min-width: 248px;max-height: 280px;',
                editable: false,
                takeFocusOnClose: true,
                cls: 'input-group-nr',
                data: [
                    { value: 'all', displayValue: this.txtAllPages },
                    { value: 'current', displayValue: this.txtCurrentPage },
                    { value: -1, displayValue: this.txtCustomPages }
                ],
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });
            this.cmbRange.setValue('all');

            this.inputPages = new Common.UI.InputField({
                el: $markup.findById('#print-txt-pages'),
                allowBlank: true,
                validateOnChange: true,
                validateOnBlur: false,
                maskExp: /[0-9,\-]/,
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

            this.cmbPaperSize = new Common.UI.ComboBox({
                el: $markup.findById('#print-combo-pages'),
                menuStyle: 'max-height: 280px; min-width: 248px;',
                editable: false,
                takeFocusOnClose: true,
                cls: 'input-group-nr',
                data: [
                    { value: 0, displayValue:'US Letter (21,59 cm x 27,94 cm)', caption: 'US Letter', size: [215.9, 279.4]},
                    { value: 1, displayValue:'US Legal (21,59 cm x 35,56 cm)', caption: 'US Legal', size: [215.9, 355.6]},
                    { value: 2, displayValue:'A4 (21 cm x 29,7 cm)', caption: 'A4', size: [210, 297]},
                    { value: 3, displayValue:'A5 (14,8 cm x 21 cm)', caption: 'A5', size: [148, 210]},
                    { value: 4, displayValue:'B5 (17,6 cm x 25 cm)', caption: 'B5', size: [176, 250]},
                    { value: 5, displayValue:'Envelope #10 (10,48 cm x 24,13 cm)', caption: 'Envelope #10', size: [104.8, 241.3]},
                    { value: 6, displayValue:'Envelope DL (11 cm x 22 cm)', caption: 'Envelope DL', size: [110, 220]},
                    { value: 7, displayValue:'Tabloid (27,94 cm x 43,18 cm)', caption: 'Tabloid', size: [279.4, 431.8]},
                    { value: 8, displayValue:'A3 (29,7 cm x 42 cm)', caption: 'A3', size: [297, 420]},
                    { value: 9, displayValue:'Tabloid Oversize (30,48 cm x 45,71 cm)', caption: 'Tabloid Oversize', size: [304.8, 457.1]},
                    { value: 10, displayValue:'ROC 16K (19,68 cm x 27,3 cm)', caption: 'ROC 16K', size: [196.8, 273]},
                    { value: 11, displayValue:'Envelope Choukei 3 (11,99 cm x 23,49 cm)', caption: 'Envelope Choukei 3', size: [119.9, 234.9]},
                    { value: 12, displayValue:'Super B/A3 (33,02 cm x 48,25 cm)', caption: 'Super B/A3', size: [330.2, 482.5]},
                    { value: 13, displayValue:'A4 (84,1 cm x 118,9 cm)', caption: 'A0', size: [841, 1189]},
                    { value: 14, displayValue:'A4 (59,4 cm x 84,1 cm)', caption: 'A1', size: [594, 841]},
                    { value: 16, displayValue:'A4 (42 cm x 59,4 cm)', caption: 'A2', size: [420, 594]},
                    { value: 17, displayValue:'A4 (10,5 cm x 14,8 cm)', caption: 'A6', size: [105, 148]},
                    { value: -1, displayValue: this.txtCustom, caption: this.txtCustom, size: []}
                ],
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });

            this.cmbPaperOrientation = new Common.UI.ComboBox({
                el          : $markup.findById('#print-combo-orient'),
                menuStyle   : 'min-width: 150px;',
                editable    : false,
                takeFocusOnClose: true,
                cls         : 'input-group-nr',
                data        : [
                    { value: Asc.c_oAscPageOrientation.PagePortrait, displayValue: this.txtPortrait },
                    { value: Asc.c_oAscPageOrientation.PageLandscape, displayValue: this.txtLandscape }
                ],
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });

            this.cmbPaperMargins = new Common.UI.ComboBox({
                el: $markup.findById('#print-combo-margins'),
                menuStyle: 'max-height: 280px; min-width: 248px;',
                editable: false,
                takeFocusOnClose: true,
                cls: 'input-group-nr',
                data: [
                    { value: 0, displayValue: this.textMarginsNormal, size: [20, 30, 20, 15]},
                    { value: 1, displayValue: this.textMarginsUsNormal, size: [25.4, 25.4, 25.4, 25.4]},
                    { value: 2, displayValue: this.textMarginsNarrow, size: [12.7, 12.7, 12.7, 12.7]},
                    { value: 3, displayValue: this.textMarginsModerate, size: [25.4, 19.1, 25.4, 19.1]},
                    { value: 4, displayValue: this.textMarginsWide, size: [25.4, 50.8, 25.4, 50.8]},
                    { value: -1, displayValue: this.txtCustom, size: null}
                ],
                itemsTemplate: _.template([
                    '<% _.each(items, function(item) { %>',
                        '<li id="<%= item.id %>" data-value="<%- item.value %>"><a tabindex="-1" type="menuitem">',
                        '<div><b><%= scope.getDisplayValue(item) %></b></div>',
                        '<% if (item.size !== null) { %><div style="display: inline-block;margin-right: 20px;min-width: 80px;">' +
                        '<label style="display: block;">' + this.txtTop + ': <%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(item.size[0]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label>' +
                        '<label style="display: block;">' + this.txtLeft + ': <%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(item.size[1]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label></div><div style="display: inline-block;">' +
                        '<label style="display: block;">' + this.txtBottom + ': <%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(item.size[2]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label>' +
                        '<label style="display: block;">' + this.txtRight + ': <%= parseFloat(Common.Utils.Metric.fnRecalcFromMM(item.size[3]).toFixed(2)) %> <%= Common.Utils.Metric.getCurrentMetricName() %></label></div>' +
                        '<% } %>',
                    '<% }); %>'
                ].join('')),
                dataHint: '2',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });

            this.pnlSettings = $markup.find('.flex-settings').addBack().filter('.flex-settings');
            this.pnlTable = $(this.pnlSettings.find('table')[0]);
            this.trApply = $markup.find('.fms-btn-apply');

            this.btnPrint = new Common.UI.Button({
                el: $markup.findById('#print-btn-print')
            });
            this.btnPrintPdf = new Common.UI.Button({
                el: $markup.findById('#print-btn-print-pdf')
            });

            this.btnPrevPage = new Common.UI.Button({
                parentEl: $markup.findById('#print-prev-page'),
                cls: 'btn-prev-page',
                iconCls: 'arrow',
                dataHint: '2',
                dataHintDirection: 'top'
            });

            this.btnNextPage = new Common.UI.Button({
                parentEl: $markup.findById('#print-next-page'),
                cls: 'btn-next-page',
                iconCls: 'arrow',
                dataHint: '2',
                dataHintDirection: 'top'
            });

            this.countOfPages = $markup.findById('#print-count-page');

            this.txtNumberPage = new Common.UI.InputField({
                el: $markup.findById('#print-number-page'),
                allowBlank: true,
                validateOnChange: true,
                style: 'width: 50px;',
                maskExp: /[0-9]/,
                validation: function(value) {
                    if (/(^[0-9]+$)/.test(value)) {
                        value = parseInt(value);
                        if (undefined !== value && value > 0 && value <= me.pageCount)
                            return true;
                    }

                    return me.txtPageNumInvalid;
                },
                dataHint: '2',
                dataHintDirection: 'left',
                dataHintOffset: 'small'
            });

           this.$el = $(node).html($markup);
            this.$previewBox = $('#print-preview-box');

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: this.pnlSettings,
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
            }

            Common.NotificationCenter.on({
                'window:resize': function() {
                    me.isVisible() && me.updateScroller();
                }
            });

            this.updateMetricUnit();

            this.fireEvent('render:after', this);

            return this;
        },

        show: function() {
            Common.UI.BaseView.prototype.show.call(this,arguments);
            if (this._initSettings) {
                this.updateMetricUnit();
                this._initSettings = false;
            }
            this.updateScroller();
            this.fireEvent('show', this);
        },

        updateScroller: function() {
            if (this.scroller) {
                Common.UI.Menu.Manager.hideAll();
                var scrolled = this.$el.height()< this.pnlTable.height();
                this.pnlSettings.css('overflow', scrolled ? 'hidden' : 'visible');
                this.scroller.update();
            }
        },

        setMode: function(mode) {
            this.mode = mode;
        },

        setApi: function(api) {

        },

        updateMetricUnit: function() {
            if (!this.cmbPaperSize) return;
            var store = this.cmbPaperSize.store;
            for (var i=0; i<store.length-1; i++) {
                var item = store.at(i),
                    size = item.get('size'),
                    pagewidth = size[0],
                    pageheight = size[1];

                item.set('displayValue', item.get('caption') + ' (' + parseFloat(Common.Utils.Metric.fnRecalcFromMM(pagewidth).toFixed(2)) + ' ' + Common.Utils.Metric.getCurrentMetricName() + ' x ' +
                    parseFloat(Common.Utils.Metric.fnRecalcFromMM(pageheight).toFixed(2)) + ' ' + Common.Utils.Metric.getCurrentMetricName() + ')');
            }
            this.cmbPaperSize.onResetItems();
            this.cmbPaperMargins.onResetItems();
        },

        isVisible: function() {
            return (this.$el || $(this.el)).is(":visible");
        },

        setRange: function(value) {
            this.cmbRange.setValue(value);
        },

        getRange: function() {
            return this.cmbRange.getValue();
        },

        updateCountOfPages: function (count) {
            this.countOfPages.text(
                Common.Utils.String.format(this.txtOf, count)
            );
            this.pageCount = count;
        },

        updateCurrentPage: function (index) {
            this.txtNumberPage.setValue(index + 1);
        },

        txtPrint: 'Print',
        txtPrintPdf: 'Print to PDF',
        txtPrintRange: 'Print range',
        txtCurrentPage: 'Current page',
        txtAllPages: 'All pages',
        txtSelection: 'Selection',
        txtCustomPages: 'Custom print',
        txtPageSize: 'Page size',
        txtPageOrientation: 'Page orientation',
        txtPortrait: 'Portrait',
        txtLandscape: 'Landscape',
        txtCustom: 'Custom',
        txtMargins: 'Margins',
        txtTop: 'Top',
        txtBottom: 'Bottom',
        txtLeft: 'Left',
        txtRight: 'Right',
        txtPage: 'Page',
        txtOf: 'of {0}',
        txtPageNumInvalid: 'Page number invalid',
        txtPages: 'Pages',
        textMarginsLast: 'Last Custom',
        textMarginsNormal: 'Normal',
        textMarginsUsNormal: 'US Normal',
        textMarginsNarrow: 'Narrow',
        textMarginsModerate: 'Moderate',
        textMarginsWide: 'Wide'

    }, DE.Views.PrintWithPreview || {}));
});
