
var testData = [
    {id: 1, name: ["My Organization",'bbb'], parent: 0},
    {id: 2, name: ['CEO Office'], parent: 1},
    {id: 3, name: ['Division 1'], parent: 1},
    {id: 4, name: ['Division 2'], parent: 1},
    {id: 6, name: ['Division 3'], parent: 1},
    {id: 7, name: ['Division 4'], parent: 1},
    {id: 8, name: ['Division 5'], parent: 1},
    {id: 5, name: ['Sub Division'], parent: 3},

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
