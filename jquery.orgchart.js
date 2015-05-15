(function($) {
    $.fn.orgChart = function(options) {
        var opts = $.extend({}, $.fn.orgChart.defaults, options);
        return new OrgChart($(this), opts);
    }

    $.fn.orgChart.defaults = {
        data: [{id:1, name:'Root', parent: 0, isEnd:false}],
        showControls: false,
        allowEdit: false,
        onAddNode: null,
        onDeleteNode: null,
        onClickNode: null,
        newNodeText: 'Add Child',
        newTextText: 'Add Title'
    };

    function rtcheckbox(nid, iter){
        var st = '<input type="checkbox">';
        var st2 = '<input type="text" class=pp2>';
        var h2 = '<h2 hid='+iter+'>'+'sth'+'</h2>';
        var div = '<div ddid=' + iter + '>' + st+h2 + st2+ '</div>';
        return div;
    }

    function rtcheckbox(nid, iter, content, pc, p2c){
        if (pc === undefined || p2c ===undefined)
        {
            pc = '';
            p2c = '';
        }
        var st = '<input type="text" class=pp id=n' + nid +'h'+iter + ' value=' +pc +'>';
        var st2 = '<input type="text" class=pp2 id=n' + nid +'h'+iter + ' value=' +p2c +'>';
        var h2 = '<h2 hid='+iter+'>'+content+'</h2>';
        var div = '<div class=dd ddid=' + iter + '>' + st+h2+st2 + '</div>';
        return div;
    }

    function rth2(iter, content){

        var h2 = '<h2 hid='+iter+'>'+content+'</h2>';
        return h2;
    }

    function showcheck()
    {
        $(".checkmark").show();
    }




    function OrgChart($container, opts){
        var data = opts.data;
        var nodes = {};
        var rootNodes = [];
        this.opts = opts;
        this.$container = $container;
        var self = this;


        this.draw = function(){
            $container.empty().append('<div class=dc><h2>Check</h2><button type="button" class=checkb>Click Me!</button><\div>');
            $container.append('<div class=dc><h2></h2><a class=saveb>Save!</button><\div>');
            $container.append('<div class=dc><h2></h2><a class=loadb>Load!</button><\div>');
            $container.append("<div class='checkmark'><\div>");

            $container.append(rootNodes[0].render(opts));
            $container.find('.node').click(function(){
                if(self.opts.onClickNode !== null){
                    self.opts.onClickNode(nodes[$(this).attr('node-id')]);
                }
            });


            if(opts.allowEdit){
                $container.find('.node .dd h2').click(function(e){
                    var thisId = $(this).parent().parent().attr('node-id');
                    var hid = $(this).attr('hid');
                    self.startEdit(thisId,hid);
                    e.stopPropagation();
                });

                $container.find('.node .dd .pp').focusout(function(e){
                    var thisId = $(this).parent().parent().attr('node-id');
                    var id = $(this).attr('id');
                    id = (id.split('h'))[1];
                    id = parseInt(id);
                    var value = $(this).val();
                    if (value === undefined)
                        value = '';
//                    nodes[id].data.pp[pid] = value;
                    self.savepp(thisId,id,value);
                });

                $container.find('.node .dd .pp2').focusout(function(e){
                    var thisId = $(this).parent().parent().attr('node-id');
                    var id = $(this).attr('id');
                    id = (id.split('h'))[1];
                    id = parseInt(id);
                    var value = $(this).val();
                    if (value === undefined)
                        value = '';
//                    nodes[id].data.pp2[pid] = value;


                    self.savepp2(thisId,id,value);
                });
            }

            this.savepp = function(id,pid,v){
                nodes[id].data.pp[pid-1] = v;
                // console.log(nodes[id].data);

            }
            this.savepp2 = function(id,pid,v){
                nodes[id].data.pp2[pid-1] = v;
            }




//---------below is the main logic function--------------

//branch close
function myClose(first, second){
    if(first.operator == '!'){
        if(JSON.stringify( first.argument) === JSON.stringify(second)){
            return true
        }
    }
    return false
}
function isBranchClose(originStatement){
    if(originStatement.length != 2){
        return false
    }

    var first = jsep(originStatement[0]);
    var second = jsep(originStatement[1]);

    if( myClose(first,second)){
        return true
    }
    if( myClose(second,first)){
        return true
    }
    return false
}

function myNotAndImply(origin,first,second){
    if(origin.operator == '!'){
        // alert('haapy')
        if(origin.argument.operator == "->"){
            // alert('->')
            if (JSON.stringify( origin.argument.left ) === JSON.stringify(first)){
                // alert('first')
                if(second.operator == '!'){
                    if(JSON.stringify( origin.argument.right ) === JSON.stringify(second.argument)){
                        // alert('real haapy')
                        return true
                    }
                }

            }
        }
    }
    return false
}
function myOr(origin,first,second){
    if(origin.operator == "|"){
        if( JSON.stringify( origin.left) === JSON.stringify( first)){
            if( JSON.stringify( origin.right) === JSON.stringify( second) ){
                return true
            }
        }
    }
    return false
}
function myNotOr(origin,first,second){
    if(origin.operator == '!'){
        // alert('haapy')
        if(origin.argument.operator == "|"){
            // alert('->')
            if(first.operator == "!"){
                if (JSON.stringify( origin.argument.left ) === JSON.stringify(first.argument)){
                    if(second.operator == '!'){
                        if(JSON.stringify( origin.argument.right ) === JSON.stringify(second.argument)){
                            // alert('real haapy')
                            return true
                        }
                    }

                }
            }

        }
    }
    return false
}

function myNotAnd(origin, first,second){
    if(origin.operator == '!'){
        if(origin.argument.operator == "&"){
            if(first.operator == "!"){
                if(JSON.stringify( origin.argument.left ) === JSON.stringify( first.argument ) ) {
                    if(second.operator == "!"){
                        if(JSON.stringify( origin.argument.right ) === JSON.stringify( second.argument ) ){
                            return true
                        }
                    }
                }
            }
        }
    }
    return false
}
function oneToTwo(origin,first,second){
    list = [myNotAndImply,myNotOr,myOr,myNotAnd];
    for (var i = list.length - 1; i >= 0; i--) {
        if( list[i](origin,first, second) )
            return true
        if( list[i](origin,second, first))
            return true
    };
    return false
}
function notNot(origin,first){
    if(origin.operator == '!'){
        if(origin.argument.operator == '!'){
            if( JSON.stringify( origin.argument.argument) == JSON.stringify( first) ) {
                return true
            }
        }
    }
    return false
}
function myEqual(origin, first, second, third, fourth){
    if(origin.operator == '=='){
        if(JSON.stringify( origin.left ) === JSON.stringify( first ) ){
            if( JSON.stringify( origin.right ) === JSON.stringify( second ) ){
                if( third.operator == '!' ){
                    if( JSON.stringify( origin.left ) === JSON.stringify( third.argument ) ){
                        if (fourth.operator == '!'){
                            if (JSON.stringify( origin.left ) === JSON.stringify( third.argument )){
                                return true
                            }
                        }
                    }
                }
            }
        }
    }
}
function equal(origin,first,second,third,fourth){
    if(myEqual(origin, first, second, third, fourth) ){
        return true
    }
    if(myEqual(origin, second,first, third, fourth) ){
        return true
    }
    if(myEqual(origin, first, second, fourth, third) ){
        return true
    }
    if(myEqual(origin, second,first, fourth, third) ){
        return true
    }
    return false
}

function isCorrect(originStatement,newStatements,originNodeList,newNodeList){
    // console.log(newNodeList);
    // number is the node number of the statement.
    Newnumbers = [];
    var myRe = /\d+/;
    if(newNodeList.length > 0){
        for (i in newNodeList) {
            numbers.push( parseInt(myRe.exec(newNodeList[i]) )  );
        }
    }
    originNumber = parseInt( myRe.exec(originNodeList[0])  )
    console.log(originNumber)
    console.log(Newnumbers)
    if (originStatement.length == 1){
        if(newStatements.length == 1){
            var origin = jsep(originStatement[0]);
            var firstNew = jsep(newStatements[0]);
            if (notNot(origin,firstNew) ){
                log(originStatement + ' -------> ' +newStatements + ' Check!');
                return true
            }
        }
        if(newStatements.length == 2){
            var origin = jsep(originStatement[0]);
            var firstNew = jsep(newStatements[0]);
            var secondNew = jsep(newStatements[1]);
            // console.log(origin)
            // console.log(firstNew)
            // console.log(secondNew)

            //try all possibility
            if (oneToTwo(origin,firstNew,secondNew) ){
                log(originStatement + ' -------> ' +newStatements + ' Check!');
                return true
            }
            // if (notOr(origin,firstNew,secondNew) ){
            //     log(originStatement + ' -------> ' +newStatements + ' Check!');
            // }

        }
        if(newStatements.length == 4){
            // alert(newStatements)
            var origin = jsep(originStatement[0]);
            var firstNew = jsep(newStatements[0]);
            var secondNew = jsep(newStatements[1]);
            var thirdNew = jsep(newStatements[2]);
            var fourthNew = jsep(newStatements[3]);
            // console.log(origin);
            if( equal(origin, firstNew,secondNew,thirdNew,fourthNew)){
                log(originStatement + ' -------> ' +newStatements + ' Check!');
                return true
            }
        }
    }
    log(originStatement + ' -------> ' +newStatements + ' Problem!');
    return false
}

// end of main logic function
            function rightdecision(num)
            {
                var newStatements = [];
                var originStatement = [];
                var originNodeList = [];
                var newNodeList = [];
                //alert('got ' + num);
                var x = document.getElementsByClassName("pp");
                for (var i = 0; i < x.length; i++)
                {
                    if ($(x[i]).val() == num){
                        newStatements.push($(x[i]).parent().find('h2').text());
                        newNodeList.push( $(x[i]).attr('id') )
                    }

                }
                // console.log($(x[0]))
                x = document.getElementsByClassName("pp2");
                for (var i = 0; i < x.length; i++)
                {
                    if ($(x[i]).val() == num){
                        originStatement.push($(x[i]).parent().find('h2').text());
                        originNodeList.push($(x[i]).attr('id') )
                    }
                }

                // alert(originStatement);
                // alert(newStatements);
                // alert(originNodeList);
                if(newStatements.length == 0){
                    isBranchClose(originStatement)
                        // console.log(nodes);
                        myMaxNumber = 0;
                        // console.log('-------------')
                        // console.log(originNodeList[0])
                        for(i in originNodeList){
                            number = parseInt (originNodeList[i].split(/(\d)/)[1]);
                            if (number > myMaxNumber ){
                                myMaxNumber = number;
                            }
                            // console.log(i);
                        }
                        nodes[myMaxNumber].data.isEnd = true;
                        // console.log(nodes);
                        log(originStatement + ' -------> '+  ' Branch ' +myMaxNumber+ ' Closed');
                        return true
                }
                return isCorrect(originStatement,newStatements,originNodeList,newNodeList)


            }


             $container.find('.saveb').click(function(e){
                 console.log(data);
                 dd = '';
//                 for (var i = 0; i < data.length ; i++)
//                 {
//                     dd = dd + data[i].map(String);
//                 }
                 dd = JSON.stringify(data);

                 //dd = data.map(String);//data.toString();
                 this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(dd);
             });

            $container.find('.loadb').click(function(e){
                 console.log(data);
                 dd = '';
//                 for (var i = 0; i < data.length ; i++)
//                 {
//                     dd = dd + data[i].map(String);
//                 }
                 dd = JSON.stringify(data);

                 //dd = data.map(String);//data.toString();
                 this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(dd);
             });

            $container.find('.checkb').click(function(e){
                //alert('ckb!!!');
                var ccc = $container;
                $('#consoleOutput').text("");
                for( key in nodes){
                    nodes[key].data.isEnd = false;
                 //ccc = $container.find('.pp2');
                }
                // callcheck();
                var x = document.getElementsByClassName("pp2");
                var myValueMap = new Map();
                var someFalse = false;
                for (var i = 0; i < x.length; i++)
                {
                    if(myValueMap.get( $(x[i]).val() ) === undefined){
                        myValueMap.set($(x[i]).val() , "exist");
                        if ($(x[i]).val() !== '')
                            if ( rightdecision($(x[i]).val()) === false){
                                someFalse = true;
                            }
                    }

                    //alert($(x[i]).val());

                }
                //alert('no input on right');


                var allDone = true;
                for( key in nodes){
                    if(nodes[key].children.length != 0){
                        nodes[key].data.isEnd = true
                    }
//                    console.log(node)
                    if (nodes[key].data.isEnd == false){
                        allDone = false
                    }
                }
                if(allDone == true && someFalse == false){
                    // alert('Congratulation');
                    $(".checkmark").show();

                }
                else{
                    $(".checkmark").hide();
                }
                // console.log(nodes);
            });



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
             var inputElement = $(rtcheckbox(id,iter));
            $container.find('div[node-id='+id+'] h2[hid='+(iter-1)+']').parent().parent().append(inputElement);
            $container.find('.node .dd h2').click(function(e){
                    var thisId = $(this).parent().parent().attr('node-id');
                    var hid = $(this).attr('hid');
                    self.startEdit(thisId,hid);
                    e.stopPropagation();
                });
            $container.find('.node .dd .pp').focusout(function(e){
                    var thisId = $(this).parent().parent().attr('node-id');
                    var id = $(this).attr('id');
                    id = (id.split('h'))[1];
                    id = parseInt(id);
                    var value = $(this).val();
                    if (value === undefined)
                        value = '';
//                    nodes[id].data.pp[pid] = value;
                    self.savepp(thisId,id,value);
                });

                $container.find('.node .dd .pp2').focusout(function(e){
                    var thisId = $(this).parent().parent().attr('node-id');
                    var id = $(this).attr('id');
                    id = (id.split('h'))[1];
                    id = parseInt(id);
                    var value = $(this).val();
                    if (value === undefined)
                        value = '';
//                    nodes[id].data.pp2[pid] = value;


                    self.savepp2(thisId,id,value);
                });
        }

        this.startEdit = function(id,hid){
             //nodes[id].data.name
            var xxx = $container.find('div[node-id='+id+'] div[ddid='+hid+'] h2[hid='+hid+']').text();
            var inputElement = $('<input class="org-input" type="text" value="'+xxx+'"/>');
            $container.find('div[node-id='+id+'] div[ddid='+hid+'] h2[hid='+hid+']').replaceWith(inputElement);
            //alert('div[node-id='+id+'] div[ddid='+hid+'] h2[hid='+hid+']');
            var commitChange = function(){
                var h2Element = $(rth2(hid,nodes[id].data.name[hid-1]));
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

            if(typeof self.data.pp == 'undefined')
            {
                self.data.pp = [];
                self.data.pp2 = [];
                if(typeof data.name[0] !== 'undefined'){
                for(i=0;i<data.name.length;i++)
                {
                self.data.pp.push('');
                self.data.pp2.push('');
                }
            }
            }

            if(typeof data.name[0] !== 'undefined'){
                for(i=0;i<data.name.length;i++)
                {
                    self.data.isEnd = false;
                    nameString = nameString + rtcheckbox(data.id, i+1, self.data.name[i],self.data.pp[i],self.data.pp2[i])
                    this.iter = i+1;
                }
            }
            else if(typeof data.name[0] == 'undefined'){
                self.data.isEnd = false;
                self.data.name = [];
                self.data.name.push('');
                self.data.pp.push('');
                self.data.pp2.push('');
                //nameString = nameString+ '<h2 hid='+1+'>'+self.data.name[0]+'</h2>';
                nameString = nameString + rtcheckbox(data.id, 1,self.data.name[0]);
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

