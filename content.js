/*
    Called everything when the order of the list of selected items change.
    Inefficent, but easy to progam.
*/
/* These contains the name of the stations without the extra index and city*/
var station_id_map = new Map()
var id_station_map = new Map()

var selected_counter = 0;
var available_counter = 0;

var selected_list = new Array()
var available_list = new Array()

var available_element = null
var selected_element = null

function get_corresponding_element(element, index) {
    return element.children[index]
}

function remove_extra_from_name(s) {
    return s.substring(s.indexOf('. ') + 2, s.lastIndexOf(' - '));
}

function get_station_name(element) {
    return remove_extra_from_name(element.innerHTML)
}

function bound_index(index, list) {
    index = index < 0 ? 0 : index;
    index = index >= list.length ? list.length - 1 : index

    return index;
}

function change_pos(old_index, new_index, element, list) {
    old_index = bound_index(old_index, list);
    new_index = bound_index(new_index, list)

    if (new_index < old_index) {

        var olde = element.children[old_index];
        var newe = element.children[new_index]

        element.removeChild(olde);
        element.insertBefore(olde, newe);

        var temp_l = list[old_index];
        for (var i = old_index - 1; i >= new_index; i--) {
            list[i + 1] = list[i];
        }
        list[new_index] = temp_l;
    
        for (var i = new_index; i <= old_index; i++) {
            element.children[i].innerHTML = (i + 1) + ". " + element.children[i].innerHTML.substring(element.children[i].innerHTML.indexOf(". ") + 2)
            element.children[i].setAttribute("value", i + ": " + "'" + station_id_map.get(get_station_name(element.children[i])) + "'")
        }

    } else if (old_index < new_index) {
        console.log("B")

        var olde = element.children[old_index];
        var newe = element.children[new_index]

        element.removeChild(olde);
        var after_new = newe.nextSibiling;
        if (after_new) {
            element.insertBefore(olde, after_new);
        } else {
            element.appendChild(olde);
        }

        var temp_l = list[old_index];
        for (var i = old_index + 1; i < new_index; i++) {
            list[i - 1] = list[i];
        }
        list[new_index] = temp_l;

        for (var i = old_index; i <= new_index; i++) {
            element.children[i].innerHTML = (i + 1) + ". " + element.children[i].innerHTML.substring(element.children[i].innerHTML.indexOf(". ") + 2)
            element.children[i].setAttribute("value", i + ": " + "'" + station_id_map.get(get_station_name(element.children[i])) + "'")
        }
    }
}

function move_bw_list(src_index, dst_index, s_ele, d_ele, s_list, d_list) {
    src_index = bound_index(src_index, s_list)
    dst_index = bound_index(dst_index, d_list)

    change_pos(src_index, s_list.length - 1, s_ele, s_list)
    src_index = s_list.length - 1

    var e = get_corresponding_element(s_ele, src_index)
    console.log(e)
    s_ele.removeChild(e)
    d_ele.appendChild(e)

    var el = s_list[src_index];
    s_list.splice(src_index, 1)
    d_list.splice(d_list.length, 0, el)

    change_pos(d_list.length - 1, dst_index, d_ele, d_list);
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
    available_element = document.querySelector("select[formcontrolname='availableListBox']");
    selected_element = document.querySelector("select[formcontrolname='selectedListBox']");

    var total_count = available_element.childElementCount + selected_element.childElementCount;

    if (total_count < 2) {
        return false
    }

    fill_list(available_list, available_element);   
    available_counter += available_list.length;
    fill_list(selected_list, selected_element);
    selected_counter += selected_list.length;

    return true
}

// function insert_elements(element) {
// //    element.innerHTML += "bbbbbbbbbbbbbbbbbbbbbbbbbbbbb<br>bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
//     btn = document.createElement('BUTTON');
//     btn.appendChild(document.createTextNode("Hello!"));
//     element.appendChild(btn);
// }

// function insert_elements_all() {
//     fo
// }

function init() {

    timer = setInterval(function() {
        if (fillListsIfLoaded()) {
            clearInterval(timer);
        }
//        change_pos(0, available_list.length - 1, available_element, available_list)
        move_bw_list(0, 0, available_element, selected_element, available_list, selected_list)
//       insert_elements(get_corresponding_element(available_element, 0));

    }, 1000)
//    insert_elements(get_corresponding_element(available_element, 0))
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
