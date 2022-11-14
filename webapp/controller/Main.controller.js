sap.ui.define([
    "../lib/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/m/MessageBox",
    "sap/ui/core/format/NumberFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FlattenedDataset, FeedItem, MessageBox, ODataModel, NumberFormat) {
        "use strict";

        return Controller.extend("SYNC.zcdmmim4000.controller.Main", {
            onInit: function () {
                let oView = this.getView(),   
                    oModel = oView.getModel('odataModel');

                const oComponent = this.getOwnerComponent(),
                oRouter = oComponent.getRouter();

                this._setInitModel();
                 
            },
            onAfterRendering : function(){
                this._setvizframe('원자재');
                this._setvizframe_multi('원자재');
                
                this._setTable('원자재');

            },           
            /**
             * 해당 화면에 대한 초기 모델 생성 함수
             */
            _setInitModel: function() {
                let aChartType = this._getChartType();
               
                this.getView()
                    .setModel(
                        new JSONModel({
                            typeList: aChartType,
                            selectedType: ""
                        }),
                        "DynamicType"
                    );

            },
            
            /**
             * 차트 타입을 제공하는 함수
             * @returns {array}
             */
            _getChartType: function() {
                return [
                    // { type: 'bar' },
                    
                    // { type: 'stacked_column' },
                    // { type: 'stacked_bar' },
                    
                    { type: '원자재'},
                    { type: '완제품' },
                ];
            },

            /**
             * 해당 페이지 url에 접근했을 때 실행될 함수.
             * 페이지에 접근시 모델에 데이터 세팅을 해준다.
             */
            _onPatternMatched: function(oEvent) {
                const oArguments = oEvent.getParameter('arguments'),
                      oView = this.getView(),
                      oModel = oView.getModel('DynamicType');

                oModel.setProperty('/selectedType', oArguments.type);

                
                let aItem = this.byId('DynamicType_Select')
                                  .getItems()
                                  .filter((oItem) => { return oItem.getKey() === 'line'} );
                
                this.byId('DynamicType_Select')
                    .fireChange(aItem);
            },
            _setvizframe: function(dataType){
                let oView = this.getView(),   
                    oModel = oView.getModel('odataModel');
                let oVizFrame = this.byId(sap.ui.core.Fragment.createId("DynamicTypeChart", "staticChart"));

                oVizFrame.destroyDataset( );    
                oVizFrame.removeAllFeeds( );
  
                if (dataType == "원자재"){
                    let chartTitle = dataType;    
                    let oDataset = new FlattenedDataset({
                        // stacked_column Section 
                    dimensions: [ 
                        {
                            name: "자재명",
                            value: "{odataModel>Maktx}"
                        }
                    ], 
                    // stacked_column Section Value 
                    measures: [
                        {
                            name: "수량",
                            value: "{odataModel>Maea}"
                            
                        },
                        {
                            name: "안전재고",
                            value: "{odataModel>Saveea}"
                            
                        },
                        {
                            name: "폐기율",
                            value: "{odataModel>Drate}"
                            
                        }
                        
                    ],
                        // stacked_column Data Location  
                    data: {
                            path: "odataModel>/maimInfoSet"
                        }
                    });
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);

                    oVizFrame.setVizProperties({
                        title: {
                            visible: true,
                            style: {
                                color: 'green'
                            },
                            text: chartTitle
                        },
                        legend: {
                            drawingEffect: 'glossy'
                        },
                        
                        plotArea: {
                            primaryValuesColorPalette: [ "#AED1DA",
                                            "#9CC677", 
                                            ],
                            secondaryValuesColorPalette: [ "#F48323" ],
                            drawingEffect: 'glossy',
                            dataLabel: {
                                visible: true
                            }
                        },
                        valueAxis: {
                            title: {
                                visible: false
                            }
                            
                        },
                        valueAxis2: {
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        },
                        
                    });
    
                    let feedvalueAxis= new FeedItem({
                            'uid': "valueAxis",
                            'type': "Measure",
                            'values': [
                                        "수량",
                                        "안전재고"
                                        ]
                                    
                    });
                    let feedvalueAxis2= new FeedItem({
                        'uid': "valueAxis2",
                        'type': "Measure",
                        'values': [
                                    "폐기율"
                                    ]
                                
                    });
                
                    let feedColor = new FeedItem({
                            'uid': "categoryAxis",
                            'type': "Dimension",
                            'values': ["자재명"]
                    });
                    
                    oVizFrame.addFeed(feedvalueAxis);
                    oVizFrame.addFeed(feedvalueAxis2);
                    oVizFrame.addFeed(feedColor);
                    
                }else if(dataType == "완제품"){
                    let chartTitle = dataType;    
                    let oDataset = new FlattenedDataset({
                        // stacked_column Section 
                    dimensions: [ 
                        {
                            name: "제품명",
                            value: "{odataModel>Fertname}"
                        }
                    ], 
                    // stacked_column Section Value 
                    measures: [
                        {
                            name: "수량",
                            value: "{odataModel>Feea}"
                            
                        },
                        {
                            name: "폐기율",
                            value: "{odataModel>Drate}"
                            
                        }
                        
                    ],
                        // stacked_column Data Location  
                    data: {
                            path: "odataModel>/feimInfoSet"
                        }
                    });
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);

                    oVizFrame.setVizProperties({
                        title: {
                            visible: true,
                            style: {
                                color: 'green'
                            },
                            text: chartTitle
                        },
                        legend: {
                            drawingEffect: 'glossy'
                        },
                    
                        plotArea: {
                            drawingEffect: 'glossy',
                            dataLabel: {
                                visible: true
                            },
                            
                        },
                        valueAxis: {
                            title: {
                                visible: false
                            }
                        },
                        valueAxis2: {
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        },
                        
                    });

                    let feedvalueAxis= new FeedItem({
                            'uid': "valueAxis",
                            'type': "Measure",
                            'values': [
                                        "수량"
                                        ]
                                    
                    });
                    let feedvalueAxis2= new FeedItem({
                        'uid': "valueAxis2",
                        'type': "Measure",
                        'values': [
                                    "폐기율"
                                    ]
                                
                    });
                
                    let feedColor = new FeedItem({
                            'uid': "categoryAxis",
                            'type': "Dimension",
                            'values': ["제품명"]
                    });
                    oVizFrame.addFeed(feedvalueAxis);
                    oVizFrame.addFeed(feedvalueAxis2);
                    oVizFrame.addFeed(feedColor);
  
                }
                

                var oPopover = new sap.viz.ui5.controls.Popover({});
                    oPopover.connect(oVizFrame.getVizUid());

                oVizFrame.setVizType("dual_stacked_bar");
            },
            _setvizframe_multi: function(dataType){
                let oView = this.getView(),   
                    oModel = oView.getModel('odataModel');
                let oVizFrame = this.byId(sap.ui.core.Fragment.createId("DynamicTypeChart_multi", "staticChart_multi"));
 
                oVizFrame.destroyDataset( );    
                oVizFrame.removeAllFeeds( );
                if (dataType == "원자재"){
                    let chartTitle = dataType;    
                    let oDataset = new FlattenedDataset({
                        // stacked_column Section 
                    dimensions: [ 
                        {
                            name: "자재명",
                            value: "{odataModel>Maktx}"
                        }
                    ], 
                    // stacked_column Section Value 
                    measures: [
                        {
                            name: "수량",
                            value: "{odataModel>Maea}"
                            
                        },
                        {
                            name: "안전재고",
                            value: "{odataModel>Saveea}"
                            
                        },
                        {
                            name: "폐기율",
                            value: "{odataModel>Drate}"
                            
                        }
                        
                    ],
                        // stacked_column Data Location  
                    data: {
                            path: "odataModel>/maimInfoSet"
                        }
                    });
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);

                    oVizFrame.setVizProperties({
                        title: {
                            visible: true,
                            style: {
                                color: 'green'
                            },
                            text: chartTitle
                        },
                        legend: {
                            drawingEffect: 'glossy'
                        },
                    
                        plotArea: {
                            primaryValuesColorPalette: [ "#AED1DA",
                                            "#9CC677", 
                                            ],
                            secondaryValuesColorPalette: [ "#F48323" ],
                            drawingEffect: 'glossy',
                            dataLabel: {
                                visible: true
                            }
                        },
                        valueAxis: {
                            title: {
                                visible: false
                            }
                        },
                        valueAxis2: {
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        },
                        
                    });

                    let feedvalueAxis= new FeedItem({
                            'uid': "valueAxis",
                            'type': "Measure",
                            'values': [
                                        "수량",
                                        "안전재고"
                                        ]
                                    
                    });
                    let feedvalueAxis2= new FeedItem({
                        'uid': "valueAxis2",
                        'type': "Measure",
                        'values': [
                                    "폐기율"
                                    ]
                                
                    });
                
                    let feedColor = new FeedItem({
                            'uid': "categoryAxis",
                            'type': "Dimension",
                            'values': ["자재명"]
                    });
                    
                    oVizFrame.addFeed(feedvalueAxis);
                    oVizFrame.addFeed(feedvalueAxis2);
                    oVizFrame.addFeed(feedColor);
                    
                }else if(dataType == "완제품"){
                    let chartTitle = dataType;    
                    let oDataset = new FlattenedDataset({
                        // stacked_column Section 
                    dimensions: [ 
                        {
                            name: "제품명",
                            value: "{odataModel>Fertname}"
                        }
                    ], 
                    // stacked_column Section Value 
                    measures: [
                        {
                            name: "수량",
                            value: "{odataModel>Feea}"
                            
                        },
                        {
                            name: "폐기율",
                            value: "{odataModel>Drate}"
                            
                        }
                        
                    ],
                        // stacked_column Data Location  
                    data: {
                            path: "odataModel>/feimInfoSet"
                        }
                    });
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);

                    oVizFrame.setVizProperties({
                        title: {
                            visible: true,
                            style: {
                                color: 'green'
                            },
                            text: chartTitle
                        },
                        legend: {
                            drawingEffect: 'glossy'
                        },
                    
                        plotArea: {
                            drawingEffect: 'glossy',
                            dataLabel: {
                                visible: true
                            },
                            
                        },
                        
                        valueAxis: {
                            title: {
                                visible: false
                            }
                        },
                        valueAxis2: {
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        },
                        
                    });

                    let feedvalueAxis= new FeedItem({
                            'uid': "valueAxis",
                            'type': "Measure",
                            'values': [
                                        "수량"
                                        ]
                                    
                    });
                    let feedvalueAxis2= new FeedItem({
                        'uid': "valueAxis2",
                        'type': "Measure",
                        'values': [
                                    "폐기율"
                                    ]
                                
                    });
                
                    let feedColor = new FeedItem({
                            'uid': "categoryAxis",
                            'type': "Dimension",
                            'values': ["제품명"]
                    });
                    oVizFrame.addFeed(feedvalueAxis);
                    oVizFrame.addFeed(feedvalueAxis2);
                    oVizFrame.addFeed(feedColor);
                }
                

                var oPopover = new sap.viz.ui5.controls.Popover({});
                    oPopover.connect(oVizFrame.getVizUid());

                oVizFrame.setVizType("dual_stacked_bar");
 
            },
            _setTable: function(dataType) {
                let oView = this.getView(),   
                    oModel = oView.getModel('odataModel');
    
                let oTable = this.getView().byId("idTable");
                let oTable_multi = this.getView().byId("idTable_multi");
                
                oTable.destroyColumns( ); 
                oTable.destroyItems();   

                oTable_multi.destroyColumns( ); 
                oTable_multi.destroyItems();

                if(dataType == "원자재")
                {
                    oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"자재코드"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"자재명"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고코드"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고명"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"폐기율"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"안전재고"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"수량"}),
                     }));
                    //  oTable.addColumn(new sap.m.Column({
                    //     header: new sap.m.Label({text:"단위"}),
                    //  }));
                                  
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"자재코드"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"자재명"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고코드"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고명"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"폐기율"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"안전재고"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"수량"}),
                     }));
                    //  oTable_multi.addColumn(new sap.m.Column({
                    //     header: new sap.m.Label({text:"단위"}),
                    //  }));

                    oTable.bindItems("/maimInfoSet", new sap.m.ColumnListItem({
                        cells : [ 
                            new sap.m.Text({
                                                text : "{Matnr}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Maktx}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Lgort}",
                                            }),
                            new sap.m.Text({
                                                text : "{Lotype}",
                                            }),  
                            new sap.m.ObjectNumber({
                                                    unit: "%",
                                                    number: {
                                                                path: 'Drate',
                                                                type:'sap.ui.model.type.Float', 
                                                                contraints: {maximum : 1}, 
                                                                formatter:'.formatPercentage'
                                                            } 
                                                }),                      
                            new sap.m.ObjectNumber({
                                                unit: "{Meins}",
                                                number: {
                                                            path: 'Saveea',
                                                            type: 'sap.ui.model.type.Float',
                                                            formatOptions: {showMeasure: false},
                                                            formatter: '.formatter.numberUnit'
                                                        } 
                                           }),                
                            new sap.m.ObjectNumber({
                                                unit: "{Meins}",
                                                number: {
                                                            path: 'Maea',
                                                            type: 'sap.ui.model.type.Float',
                                                            formatOptions: {showMeasure: false},
                                                            formatter: '.formatter.numberUnit'
                                                        } 
                                       }),                
                                           
                                ]
                    }));

                    oTable_multi.bindItems("/maimInfoSet", new sap.m.ColumnListItem({
                        cells : [ 
                            new sap.m.Text({
                                                text : "{Matnr}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Maktx}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Lgort}",
                                            }),
                            new sap.m.Text({
                                                text : "{Lotype}",
                                            }), 
                            new sap.m.ObjectNumber({
                                                unit: "%",
                                                number: {
                                                            path: 'Drate',
                                                            type:'sap.ui.model.type.Float', 
                                                            contraints: {maximum : 1}, 
                                                            formatter:'.formatPercentage'
                                                        } 
                                            }),
                            new sap.m.ObjectNumber({
                                                unit: "{Meins}",
                                                number: {
                                                            path: 'Saveea',
                                                            type: 'sap.ui.model.type.Float',
                                                            formatOptions: {showMeasure: false},
                                                            formatter: '.formatter.numberUnit'
                                                        } 
                                           }),                
                            new sap.m.ObjectNumber({
                                                unit: "{Meins}",
                                                number: {
                                                            path: 'Maea',
                                                            type: 'sap.ui.model.type.Float',
                                                            formatOptions: {showMeasure: false},
                                                            formatter: '.formatter.numberUnit'
                                                        } 
                                       }),                
                                ]
                    }));

                }else if(dataType == "완제품")
                {
                    oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"제품코드"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"제품명"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고코드"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고명"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"폐기율"}),
                     }));
                     oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"수량"}),
                     }));

                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"제품코드"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"제품명"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고코드"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"창고명"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"폐기율"}),
                     }));
                     oTable_multi.addColumn(new sap.m.Column({
                        header: new sap.m.Label({text:"수량"}),
                     }));

                                      
                    oTable.bindItems("/feimInfoSet", new sap.m.ColumnListItem({
                        cells : [ 
                            new sap.m.Text({
                                                text : "{Fertid}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Fertname}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Lgort}",
                                            }),
                            new sap.m.Text({
                                                text : "{Lotype}",
                                            }),                 
                            new sap.m.ObjectNumber({
                                                unit: "%",
                                                number: {
                                                            path: 'Drate',
                                                            type:'sap.ui.model.type.Float', 
                                                            contraints: {maximum : 1}, 
                                                            formatter:'.formatPercentage'
                                                        } 
                                            }),      
                            new sap.m.ObjectNumber({
                                                unit: "{Meins}",
                                                number: {
                                                            path: 'Feea',
                                                            type: 'sap.ui.model.type.Float',
                                                            formatOptions: {showMeasure: false},
                                                            formatter: '.formatter.numberUnit'
                                                        } 
                                       }),                
                                ]
                    }));

                    oTable_multi.bindItems("/feimInfoSet", new sap.m.ColumnListItem({
                        cells : [ 
                            new sap.m.Text({
                                                text : "{Fertid}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Fertname}"
                                            }), 
                            new sap.m.Text({
                                                text : "{Lgort}",
                                            }), 
                            new sap.m.Text({
                                                text : "{Lotype}",
                                            }), 
                            new sap.m.ObjectNumber({
                                                unit: "%",
                                                number: {
                                                            path: 'Drate',
                                                            type:'sap.ui.model.type.Float', 
                                                            contraints: {maximum : 1}, 
                                                            formatter:'.formatPercentage'
                                                        } 
                                            }),
                            new sap.m.ObjectNumber({
                                            unit: "{Meins}",
                                            number: {
                                                        path: 'Feea',
                                                        type: 'sap.ui.model.type.Float',
                                                        formatOptions: {showMeasure: false},
                                                        formatter: '.formatter.numberUnit'
                                                    } 
                                       }),                   
                                ]
                    }));
                }
                
                oTable.setModel(oModel);
                
                oTable_multi.setModel(oModel);
                
            },
            /**
             * 차트 타입 변경 이벤트
             * 차트 타입을 변경하면 해당 변경된 차트로 나타나게 만든다.
             * @param {sap.ui.base.Event} oEvent 
             */
            onTypeChange: function(oEvent) {
                const oControl = oEvent.getSource(),
                      sKey = oControl.getSelectedKey(),
                      oChart = this.getControl({
                        alias: 'DynamicTypeChart',
                        controlid: 'staticChart'
                      }); 
                this._setvizframe(sKey);
                this._setvizframe_multi(sKey);
                this._setTable(sKey);   
            },
            /**
             * 버튼 Press 이벤트
             * 사용자가 해당 이벤트를 발생시키면 이전페이지로 갈수 있도록 한다.
             */
            onNavBackPress: function() {
                /**
                 * parameter - string
                 * 해당 페이지의 이전 페이지 routing name을 넣어준다.
                 */
                this.backPage("Main");
            },
            formatPercentage: (number) => NumberFormat.getPercentInstance().format(number)
            
        });
    });
