var testData = [
    {id: 1, name: ['!(A | !B) == !C','C','!(B -> (A | D) )','B','!(A | D)','!A','!D'], parent: 0},
    // {id: 2, name: ['!(A | !B)','!C', ], parent: 1},
    // {id: 3, name: ['!!(A | !B)', '!!C', 'A | !B', 'C'], parent: 1},
    // {id: 4, name: ['A'], parent: 3},
    // {id: 5, name: ['!B'],parent: 3}
// !(((P && Q) >> R) == (P >>(!Q || R)))
];

// var testData = [{"id":1,"name":["!(A | !B) == !C","C","!(B -> (A | D) )","B","!(A | D)","!A","!D"],"parent":0,"pp":["1","2","","","3","2",""],"pp2":["","3","4","","","",""],"isEnd":false},{"id":2,"name":["!(A | !B)","!C"],"parent":1,"pp":["",""],"pp2":["",""],"isEnd":false},{"id":3,"name":["!!(A | !B)","!!C","A | !B","C"],"parent":1,"pp":["","","",""],"pp2":["","","",""],"isEnd":false},{"id":4,"name":["A"],"parent":3,"pp":[""],"pp2":[""],"isEnd":false},{"id":5,"name":["!B"],"parent":3,"pp":[""],"pp2":[""],"isEnd":false}]

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
            org_chart.newNode(node.data.id);
        },
        onDeleteNode: function(node){
            log('Deleted node '+node.data.id);
            org_chart.deleteNode(node.data.id);
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

    // console.log( "ready!" );
    //console.log(document.getElementById("n1h3").set("value","1"));

    // -----------example one-----------------
    $(document).ready(function(){
        // $("#n1h3.pp2").val("1");
        // $("#n1h4.pp").val("1");
        // $("#n1h5.pp").val("1");

        // $("#n1h5.pp2").val("2");
        // $("#n1h6.pp").val("2");
        // $("#n1h7.pp").val("2");

        // $("#n1h1.pp2").val("3");
        // $("#n2h1.pp").val("3");
        // $("#n2h2.pp").val("3");
        // $("#n3h1.pp").val("3");
        // $("#n3h2.pp").val("3");

        // $("#n3h1.pp2").val("4");
        // $("#n3h3.pp").val("4");

        // $("#n3h2.pp2").val("5");
        // $("#n3h4.pp").val("5");

        // $("#n2h2.pp2").val("6");
        // $("#n1h2.pp2").val("6");

        // $("#n3h3.pp2").val("7");
        // $("#n4h1.pp").val("7");
        // $("#n5h1.pp").val("7");

        // $("#n1h6.pp2").val("8");
        // $("#n4h1.pp2").val("8");

        // $("#n1h4.pp2").val("9");
        // $("#n5h1.pp2").val("9");
        // var pp = document.getElementsByClassName('pp');
        // for ( var i=0 ; i< pp.length; i++ ){
        //     $(pp[i]).trigger('focusout');
        // }
        // var pp2 = document.getElementsByClassName('pp2');
        // for ( var i=0 ; i< pp2.length; i++ ){
        //     $(pp2[i]).trigger('focusout');
        // }
    });
  
    // -----------end example one-----------------

    // // -----------example two-----------------
    // $(document).ready(function(){
    //  $("#n1h1.pp2").val("1");
    //  $("#n2h1.pp").val("1");
    //  $("#n3h1.pp").val("1");

    //   $("#n1h5.pp2").val("2");
    //   $("#n1h6.pp").val("2");
    //   $("#n1h7.pp").val("2");

    //   $("#n1h1.pp2").val("3");
    //   $("#n2h1.pp").val("3");
    //   $("#n2h2.pp").val("3");
    //   $("#n3h1.pp").val("3");
    //   $("#n3h2.pp").val("3");

    //   $("#n3h1.pp2").val("4");
    //   $("#n3h3.pp").val("4");

    //   $("#n3h2.pp2").val("5");
    //   $("#n3h4.pp").val("5");

    //   $("#n2h2.pp2").val("6");
    //   $("#n1h2.pp2").val("6");

    //   $("#n3h3.pp2").val("7");
    //   $("#n4h1.pp").val("7");
    //   $("#n5h1.pp").val("7");

    //   $("#n1h6.pp2").val("8");
    //   $("#n4h1.pp2").val("8");

    //   $("#n1h4.pp2").val("9");
    //   $("#n5h1.pp2").val("9");
    // });
    // // -----------end example two-----------------

    //example three


jsep.addBinaryOp("<->", 10);
jsep.addBinaryOp("->", 10);

// log('123123')
// log('dsa')
// log('asd')
