(function($) {
    $.fn.orgChart = function(options) {
        var opts = $.extend({}, $.fn.orgChart.defaults, options);
        return new OrgChart($(this), opts);
    }

    $.fn.orgChart.defaults = {
        data: [{id:1, name:'Root', parent: 0}],
        showControls: false,
        allowEdit: false,
        onAddNode: null,
        onDeleteNode: null,
        onClickNode: null,
        newNodeText: 'Add Child',
        newTextText: 'Add Title'
    };

    function OrgChart($container, opts){
        var data = opts.data;
        var nodes = {};
        var rootNodes = [];
        this.opts = opts;
        this.$container = $container;
        var self = this;


        this.draw = function(){
            $container.empty().append(rootNodes[0].render(opts));
            $container.find('.node').click(function(){
                if(self.opts.onClickNode !== null){
                    self.opts.onClickNode(nodes[$(this).attr('node-id')]);
                }
            });

            if(opts.allowEdit){
                $container.find('.node h2').click(function(e){
                    var thisId = $(this).parent().attr('node-id');
                    var hid = $(this).attr('hid');
                    self.startEdit(thisId,hid);
                    e.stopPropagation();
                });
            }

            // add "add button" listener
            $container.find('.org-add-button').click(function(e){
                var thisId = $(this).parent().attr('node-id');

                if(self.opts.onAddNode !== null){
                    self.opts.onAddNode(nodes[thisId]);
                }
                else{
                    self.newNode(thisId);
                }
                e.stopPropagation();
            });

            $container.find('.org-text-button').click(function(e){
                var thisId = $(this).parent().attr('node-id');
                if(isNaN(this.iter))
                    this.iter = nodes[thisId].data.name.length;
                this.iter = this.iter+1;
                //self.data.name.push(this.iter);
                self.addnewtext(thisId, this.iter);
            });

            $container.find('.org-del-button').click(function(e){
                var thisId = $(this).parent().attr('node-id');

                if(self.opts.onDeleteNode !== null){
                    self.opts.onDeleteNode(nodes[thisId]);
                }
                else{
                    self.deleteNode(thisId);
                }
                e.stopPropagation();
            });
        }

        this.addnewtext = function(id, iter){
             var inputElement = $('<h2 hid='+iter+'>'+'sth'+'</h2>');
            $container.find('div[node-id='+id+'] h2[hid='+(iter-1)+']').parent().append(inputElement);
            $container.find('.node h2').click(function(e){
                    var thisId = $(this).parent().attr('node-id');
                    var hid = $(this).attr('hid');
                    self.startEdit(thisId,hid);
                    e.stopPropagation();
                });
        }

        this.startEdit = function(id,hid){
            var inputElement = $('<input class="org-input" type="text" value="'+''+'"/>'); //nodes[id].data.name
            $container.find('div[node-id='+id+'] h2[hid='+hid+']').replaceWith(inputElement);
            var commitChange = function(){
                var h2Element = $('<h2 hid='+hid+'>'+nodes[id].data.name[hid-1]+'</h2>');
                //var h2Element = $('<h2>'+adfasfsaf+'</h2>');
                if(opts.allowEdit){
                    h2Element.click(function(){
                        self.startEdit(id, hid);
                    })
                }
                inputElement.replaceWith(h2Element);
            }
            inputElement.focus();
            inputElement.keyup(function(event){
                var inp = '';
                if(event.which == 13){
                    commitChange();
                }
                else{
                    nodes[id].data.name[hid-1] = inputElement.val();

                    //nodes[id].data.name[hid-1] = inputElement.val();
                }
            });
            inputElement.blur(function(event){
                commitChange();
            })
        }

        this.newNode = function(parentId){
            var nextId = Object.keys(nodes).length;
            while(nextId in nodes){
                nextId++;
            }

            self.addNode({id: nextId, name: '', parent: parentId});
        }

        this.addNode = function(data){
            var newNode = new Node(data);
            nodes[data.id] = newNode;
            nodes[data.parent].addChild(newNode);

            self.draw();
            self.startEdit(data.id);
        }

        this.deleteNode = function(id){
            for(var i=0;i<nodes[id].children.length;i++){
                self.deleteNode(nodes[id].children[i].data.id);
            }
            nodes[nodes[id].data.parent].removeChild(id);
            delete nodes[id];
            self.draw();
        }

        this.getData = function(){
            var outData = [];
            for(var i in nodes){
                outData.push(nodes[i].data);
            }
            return outData;
        }

        // constructor
        for(var i in data){
            var node = new Node(data[i]);
            nodes[data[i].id] = node;
        }

        // generate parent child tree
        for(var i in nodes){
            if(nodes[i].data.parent == 0){
                rootNodes.push(nodes[i]);
            }
            else{
                nodes[nodes[i].data.parent].addChild(nodes[i]);
            }
        }

        // draw org chart
        $container.addClass('orgChart');
        self.draw();
    }

    function Node(data){
        this.data = data;
        this.children = [];
        var self = this;

        this.addChild = function(childNode){
            this.children.push(childNode);
        }

        this.removeChild = function(id){
            for(var i=0;i<self.children.length;i++){
                if(self.children[i].data.id == id){
                    self.children.splice(i,1);
                    return;
                }
            }
        }

        this.render = function(opts){
            var childLength = self.children.length,
                mainTable;

            mainTable = "<table cellpadding='0' cellspacing='0' border='0'>";
            var nodeColspan = childLength>0?2*childLength:2;
            mainTable += "<tr><td colspan='"+nodeColspan+"'>"+self.formatNode(opts)+"</td></tr>";

            if(childLength > 0){
                var downLineTable = "<table cellpadding='0' cellspacing='0' border='0'><tr class='lines x'><td class='line left half'></td><td class='line right half'></td></table>";
                mainTable += "<tr class='lines'><td colspan='"+childLength*2+"'>"+downLineTable+'</td></tr>';

                var linesCols = '';
                for(var i=0;i<childLength;i++){
                    if(childLength==1){
                        linesCols += "<td class='line left half'></td>";    // keep vertical lines aligned if there's only 1 child
                    }
                    else if(i==0){
                        linesCols += "<td class='line left'></td>";     // the first cell doesn't have a line in the top
                    }
                    else{
                        linesCols += "<td class='line left top'></td>";
                    }

                    if(childLength==1){
                        linesCols += "<td class='line right half'></td>";
                    }
                    else if(i==childLength-1){
                        linesCols += "<td class='line right'></td>";
                    }
                    else{
                        linesCols += "<td class='line right top'></td>";
                    }
                }
                mainTable += "<tr class='lines v'>"+linesCols+"</tr>";

                mainTable += "<tr>";
                for(var i in self.children){
                    mainTable += "<td colspan='2'>"+self.children[i].render(opts)+"</td>";
                }
                mainTable += "</tr>";
            }
            mainTable += '</table>';
            return mainTable;
        }

        this.formatNode = function(opts){
            var nameString = '',
                descString = '';
            if(typeof data.name[0] !== 'undefined'){
                for(i=0;i<data.name.length;i++)
                {
                nameString = nameString+ '<h2 hid='+(i+1)+'>'+self.data.name[i]+'</h2>';
                    this.iter = i+1;
                }
            }
            else if(typeof data.name[0] == 'undefined'){
                self.data.name = [];
                self.data.name.push('');
                nameString = nameString+ '<h2 hid='+1+'>'+self.data.name[0]+'</h2>';
            }
            if(typeof data.description !== 'undefined'){
                descString = '<p>'+self.data.description+'</p>';
            }
            if(opts.showControls){
                var buttonsHtml = "<div class='org-add-button'>"+opts.newNodeText+"</div><div class='org-del-button'></div>"+"<div class='org-text-button'>"+opts.newTextText;
            }
            else{
                buttonsHtml = '';
            }
            return "<div class='node' node-id='"+this.data.id+"'>"+nameString+descString+buttonsHtml+"</div>";
        }
    }

})(jQuery);

