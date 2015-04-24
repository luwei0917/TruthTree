
var testData = [
    {id: 1, name: ['(A | !B) == !C','C','!(B -> (A | D) )'], parent: 0},
    {id: 2, name: ['CEO Office'], parent: 1},
    {id: 3, name: ['Division 1'], parent: 1},

];
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
    $('#consoleOutput').append('<p>'+text+'</p>')
}

