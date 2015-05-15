// var testData = [
//     {id: 1, name: ['!(A | !B) == !C','C','!(B -> (A | D) )','B','!(A | D)','!A','!D'], parent: 0},
//     // {id: 2, name: ['!(A | !B)','!C', ], parent: 1},
//     // {id: 3, name: ['!!(A | !B)', '!!C', 'A | !B', 'C'], parent: 1},
//     // {id: 4, name: ['A'], parent: 3},
//     // {id: 5, name: ['!B'],parent: 3}
// // !(((P && Q) >> R) == (P >>(!Q || R)))
// ];

var testData = [
    {id: 1, name: ['!(A | !B) == !C','C','!(B -> (A | D) )','B','!(A | D)','!A','!D'], parent: 0},
    {id: 2, name: ['!(A | !B)','!C', ], parent: 1},
    {id: 3, name: ['!!(A | !B)', '!!C', 'A | !B', 'C'], parent: 1},
    {id: 4, name: ['A'], parent: 3},
    {id: 5, name: ['!B'],parent: 3}
// !(((P && Q) >> R) == (P >>(!Q || R)))
];

// var testData = [
//     {id: 1, name: ['!(((P&Q)->R)==(P->(!Q|R)))'], parent: 0},
//     {id: 2, name: ['(P&Q)->R','!(P->(!Q|R))'],parent: 1},
//     {id: 3, name: ['!((P&Q)->R)','P->(!Q|R)'],parent: 1}

// ];
$(function(){
    org_chart = $('#orgChart').orgChart({
        data: testData,
        showControls: true,
        allowEdit: true,
        onAddNode: function(node){
            log('Created new node on node '+node.data.id);
            rightBoxList = document.getElementsByClassName("pp2")
            leftBoxList  = document.getElementsByClassName("pp")
            // console.log(rightBoxList)
            myRightBoxList = []
            myLeftBoxList = []
            for (i in rightBoxList){
                myRightBoxList.push( $('#'+rightBoxList[i].id+'.pp2').val() )
            }
            
            for (i in leftBoxList){
                myLeftBoxList.push( $('#'+leftBoxList[i].id).val() )
            }
            // console.log(myRightBoxList)
            org_chart.newNode(node.data.id);
            for(i in rightBoxList){
                $('#'+rightBoxList[i].id+'.pp2').val(myRightBoxList[i])
            }
            for(i in leftBoxList){
                $('#'+leftBoxList[i].id).val(myLeftBoxList[i])
            }
        },
        onDeleteNode: function(node){
            log('Deleted node '+node.data.id);
            rightBoxList = document.getElementsByClassName("pp2")
            leftBoxList  = document.getElementsByClassName("pp")
            // console.log(rightBoxList)
            myRightBoxList = []
            myLeftBoxList = []
            for (i in rightBoxList){
                myRightBoxList.push( $('#'+rightBoxList[i].id+'.pp2').val() )
            }
            
            for (i in leftBoxList){
                myLeftBoxList.push( $('#'+leftBoxList[i].id).val() )
            }

            org_chart.deleteNode(node.data.id);
            for(i in rightBoxList){
                $('#'+rightBoxList[i].id+'.pp2').val(myRightBoxList[i])
            }
            for(i in leftBoxList){
                $('#'+leftBoxList[i].id).val(myLeftBoxList[i])
            }

        },
        onClickNode: function(node){
            log('Clicked node '+node.data.id);
        }

    });
});

// just for example purpose
function log(text){
    $('#consoleOutput').append('<p>'+text+'</p>');
}

//console.log($('#orgChart').find('div[node-id=1] dd[ddid=3] pp[id=n1h3]').text('1'));
$( document ).ready(function() {
    // console.log( "ready!" );
    //console.log(document.getElementById("n1h3").set("value","1"));

    // -----------example one-----------------
    $("#n1h3.pp2").val("1");
    $("#n1h4.pp").val("1");
    $("#n1h5.pp").val("1");

    $("#n1h5.pp2").val("2");
    $("#n1h6.pp").val("2");
    $("#n1h7.pp").val("2");

    $("#n1h1.pp2").val("3");
    $("#n2h1.pp").val("3");
    $("#n2h2.pp").val("3");
    $("#n3h1.pp").val("3");
    $("#n3h2.pp").val("3");

    $("#n3h1.pp2").val("4");
    $("#n3h3.pp").val("4");

    $("#n3h2.pp2").val("5");
    $("#n3h4.pp").val("5");

    $("#n2h2.pp2").val("6");
    $("#n1h2.pp2").val("6");

    $("#n3h3.pp2").val("7");
    $("#n4h1.pp").val("7");
    $("#n5h1.pp").val("7");

    $("#n1h6.pp2").val("8");
    $("#n4h1.pp2").val("8");

    $("#n1h4.pp2").val("9");
    $("#n5h1.pp2").val("9");
    // -----------end example one-----------------

    // // -----------example two-----------------
    // $("#n1h1.pp2").val("1");
    // $("#n2h1.pp").val("1");
    // $("#n3h1.pp").val("1");

    // // $("#n1h5.pp2").val("2");
    // // $("#n1h6.pp").val("2");
    // // $("#n1h7.pp").val("2");

    // // $("#n1h1.pp2").val("3");
    // // $("#n2h1.pp").val("3");
    // // $("#n2h2.pp").val("3");
    // // $("#n3h1.pp").val("3");
    // // $("#n3h2.pp").val("3");

    // // $("#n3h1.pp2").val("4");
    // // $("#n3h3.pp").val("4");

    // // $("#n3h2.pp2").val("5");
    // // $("#n3h4.pp").val("5");

    // // $("#n2h2.pp2").val("6");
    // // $("#n1h2.pp2").val("6");

    // // $("#n3h3.pp2").val("7");
    // // $("#n4h1.pp").val("7");
    // // $("#n5h1.pp").val("7");

    // // $("#n1h6.pp2").val("8");
    // // $("#n4h1.pp2").val("8");

    // // $("#n1h4.pp2").val("9");
    // // $("#n5h1.pp2").val("9");
    // // -----------end example two-----------------

    //example three
    
});

jsep.addBinaryOp("<->", 10);
jsep.addBinaryOp("->", 10);

// log('123123')
// log('dsa')
// log('asd')
