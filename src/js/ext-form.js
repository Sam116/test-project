export default function () {
    if (document.getElementById('ext-form')) {
        Ext.create('Ext.form.Panel', {
            renderTo: document.getElementById('ext-form'),
            defaultType: 'textfield',
            defaults: {
                listeners: {
                    change: {
                        fn: function (field, newValue, oldValue, opts) {
                            Ext.toast(field.fieldLabel + ': ' + newValue);
                        }
                    },
                },
                enableKeyEvents: true
            },
            items: [
                {
                    fieldLabel: 'First Name',
                    name: 'firstName',
                },
                {
                    fieldLabel: 'Last Name',
                    name: 'lastName'
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Age',
                    name: 'age'
                }
            ]
        });
    }

}

