/*
    Called everything when the order of the list of selected items change.
    Inefficent, but easy to progam.
*/
/* These contains the name of the stations without the extra index and city*/
var station_id_map = new Map()
var id_station_map = new Map()

var selected_list = new Array()
var available_list = new Array()

var available_element = null
var selected_element = null

// var available_current = null
// var selected_current = null

function remove_extra_from_name(s) {
    return s.substring(s.indexOf('. ') + 2, s.lastIndexOf(' - '));
}

function get_station_name_from_option(option) {
    return remove_extra_from_name(option.innerHTML)
}

function get_position_of_option(option) {
    return index_of_option(option, selected_element)
//    return option.innerHTML.substring(0, option.innerHTML.indexOf(':'));
}

function current_option_of_avaliable() {
    return available_element.children[available_element.selectedIndex];
}

function current_option_of_selected() {
    return selected_element.children[selected_element.selectedIndex];
}

function change_pos(element, new_pos) {
    change_current_selected(element)
    cur_pos = get_position_of_option(element)
    
    up_btn = document.getElementsByClassName("dual-action-right")[0].children[0]
    down_btn = document.getElementsByClassName("dual-action-right")[0].children[1]

    console.log(up_btn)
    console.log(new_pos)
    console.log(cur_pos)

    while (new_pos < cur_pos) {
        cur_pos--;
        up_btn.click()
    }
    while (cur_pos < new_pos) {
        cur_pos++;
        down_btn.click()
    }
}

function index_of_option(opt, element) {
    return Array.prototype.indexOf.call(element.children, opt)
}


function move_from_av_to_selected(avaliable_option, pos) {
    change_current_avaliable(avaliable_option)
    document.getElementsByClassName("dual-action")[0].children[1].click()
    change_pos(selected_element.children[selected_element.childElementCount - 1], pos)
}

function fill_list(list, element) {
    for (var i = 0; i < element.childElementCount; i++) {

        var val = element.children[i].getAttribute("value");
        var id = val.substring(val.indexOf('\''), val.length - 1);
        var s = element.children[i].innerHTML;

        var pure_name = remove_extra_from_name(s);
        station_id_map.set(pure_name, id);
        id_station_map.set(id, pure_name);

        list.splice(list.length, 0, id);
    }
}

function change_current_selected(new_option) {
    new_option.click()
    selected_element.focus()
    new_option.focus()
    selected_element.selectedIndex = index_of_option(new_option, selected_element)
    selected_element.dispatchEvent(new Event('change', {bubbles: true}))
//    selected_element.selectedIndex = Array.prototype.indexOf.call(selected_element.children, new_option)
}

function change_current_avaliable(new_option) {
    available_element.selectedIndex = index_of_option(new_option, available_element)
    available_element.focus()
    available_element.dispatchEvent(new Event('change', {bubbles: true}))
    
//    available_element.selectedIndex = Array.prototype.indexOf.call(available_element.children, new_option)
}

function fillListsIfLoaded() {
    available_element = document.querySelector("select[formcontrolname='availableListBox']");
//    available_element.addEventListener("change", change_current_avaliable);
    selected_element = document.querySelector("select[formcontrolname='selectedListBox']");
//    selected_element.addEventListener("change", change_current_selected);

    var total_count = available_element.childElementCount + selected_element.childElementCount;

    if (total_count < 2) {
        return false
    }

    fill_list(available_list, available_element);   
    fill_list(selected_list, selected_element);

    return true
}

function init() {

//    available_element.add

    timer = setInterval(function() {
        if (fillListsIfLoaded()) {
            clearInterval(timer);
            
           move_from_av_to_selected(available_element.children[0], 10)
        }
    //    move_from_av_to_selected(available_element.children[0])

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
