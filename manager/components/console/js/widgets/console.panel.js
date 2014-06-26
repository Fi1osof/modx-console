ModConsole.panel.Console = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('console')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,width:'100%'
            ,height: '100%'
            ,stateful: true
            ,stateId: 'mod-console-home-tabpanel'
            ,stateEvents: ['tabchange']
            ,items: [{
                title: _('console_tab')
                ,defaults: { autoHeight: true }
                ,items: [{
                    xtype: 'mod-console-panel-codeeditor'
                }]
            }]
        }]
    });
    ModConsole.panel.Console.superclass.constructor.call(this,config);
};
Ext.extend(ModConsole.panel.Console,MODx.Panel);
Ext.reg('mod-console-panel-console',ModConsole.panel.Console);

ModConsole.panel.CodeEditor = function(config) {
    config = config || {};
    Ext.apply(config,{
        id: 'modxconsole-codeeditor'
        ,border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<p>'+_('console_desc')+'</p>'
            ,border: false
            ,bodyCssClass: 'panel-desc'
        },{
            id: 'mod-console-codeeditor'
            ,xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
            ,mimeType: 'application/x-php'
            ,height: 300
            ,width: '99%'
            ,enableKeyEvents: true
            ,listeners: {
                keydown: function(editor, e){
                    if (e && e.ctrlKey && e.keyCode == e.ENTER) {
                        this.request();
                    }
                }
                ,scope: this
            }
            ,value: this.getCodeEditorValue()
        },{
            xtype: 'button'
            ,text: _('console_exec')
            ,listeners: {
                click: function(){
                    this.request();
                }
                ,scope: this
            }
        },{
            id: 'mod-console-coderesult'
            ,xtype: 'panel'//Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'panel'
            ,border: false
            ,width: '99%'
            ,autoHeight: true
        }]
    });
    ModConsole.panel.CodeEditor.superclass.constructor.call(this,config);
};

Ext.extend(ModConsole.panel.CodeEditor,MODx.Panel, {
    request:function(){

        var area = Ext.getCmp('mod-console-codeeditor');
        var result = Ext.get('mod-console-coderesult');
        var code = area.getValue();

        var upd = result.getUpdater();
        upd.update({
            url: ModConsole.config.connector_url + 'console.php',
            params:{
                action: 'exec',
                code: code
            }
        })
        upd.on('update',function(){
            // result.setHeight(400)
        })
    },
    getCodeEditorValue:function(){
        MODx.Ajax.request({
            url: 'components/console/connectors/console.php',
            params: {
                action: 'getcode'
            },
            listeners: {
        		success: {fn: function(response) {
            		var el = Ext.getCmp('mod-console-codeeditor');
        			el.setValue(response.message);
        		}, scope: this}
        	}
        });
        return '<?php\n';
    }
});
Ext.reg('mod-console-panel-codeeditor',ModConsole.panel.CodeEditor);
