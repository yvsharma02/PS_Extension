/*
    Called everything when the order of the list of selected items change.
    Inefficent, but easy to progam.
*/
/* These contains the name of the stations without the extra index and city*/
var station_id_map = new Map()
var id_station_map = new Map()
var selected_list = new Array()
var available_list = new Array()

function remove_extra_from_name(s) {
    return s.substring(s.indexOf('. ') + 2, s.lastIndexOf(' - '));
}

function move_station(src_list, dest_list, src_index, dest_index) {
    item = src_list[src_index]
    src_list.splice(src_index, 1)
    dest_list.splice(dest_index, 0, item)
}

function fill_list(list, element) {
//    console.log(element.childElementCount)
    for (var i = 0; i < element.childElementCount; i++) {

        var val = element.children[i].getAttribute("value");
        var id = val.substring(val.indexOf('\''), val.length - 1);
        var s = element.children[i].innerHTML;

        var pure_name = remove_extra_from_name(s);
//        console.log(val + " ,,, " + id + " ,,, " + pure_name);
        station_id_map.set(pure_name, id);
        id_station_map.set(id, pure_name);

        list.splice(list.length, 0, id);
    }
}

function fillListsIfLoaded() {
    var available_element =  document.querySelector("select[formcontrolname='availableListBox']");
    var selected_element =  document.querySelector("select[formcontrolname='selectedListBox']");

    var total_count = available_element.childElementCount + selected_element.childElementCount;

    if (total_count < 2) {
        return false
    }

    fill_list(available_list, available_element);   
    fill_list(selected_list, selected_element);   

    console.log(station_id_map)
    console.log(id_station_map)
    console.log(available_list)

//    console.log(available_list)
//    console.log(selected_list)

    return true
}



function init() {

    timer = setInterval(function() {
        if (fillListsIfLoaded()) {
            clearInterval(timer);
        }

    }, 1000)
}

async function onListReorder() {

}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',afterDOMLoaded);
} else {
    afterDOMLoaded();
}

function afterDOMLoaded() {
    init();
}
