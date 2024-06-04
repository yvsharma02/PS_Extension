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

station_proj_map = new Map()

// var available_current = null
// var selected_current = null

async function load_data() {
    var path = chrome.runtime.getURL("assets/data.xlsx");

    function reqListener() {
        var buffer = this.response;
        console.log("Load complete! Length = ", buffer.byteLength);
        var wb = XLSX.read(buffer);
        js = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        for (var i = 0; i < js.length; i++) {
            var key = js[i]["Station Name"];
            if(!station_proj_map.has(key)) {
                station_proj_map.set(key, []);
            }
            station_proj_map.get(key).push(js[i])
        }
        console.log(station_proj_map)
    }

    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
//    oReq.onerror = reqError;
    oReq.open("GET", path, true);
    oReq.responseType = "arraybuffer";
    oReq.send();
}

var switchtop_btn = null
var switchbtm_btn = null
var btmbtn = null
var topbtn = null
var upbtn = null
var dwnbtn = null

function inject() {
    e = document.createElement("div")
    e.innerHTML = "<table> <tr> <table> <tr> <td> <b> Station: </b> <div id='extension_stationname'> </div> </td> <td> <b> City: </b> <div id='extension_city'> </div> </td> <td> <b> Domain: </b> <div id='extension_domain'> </div> </td> <td> <b> Subdomain: </b> <div id='extension_subdomain'> </div> </td> <td> <b> Prefrence No: </b> <div id='extension_pref'> </div> </td> <td> <button> > </button> <div id='extension_switchtop'> </div> </td> <td> <button> UP </button> <div id='extension_moveup'> </div> </td> <td> <button> TP </button> <div id='extension_movetop'> </div> </td> </tr> <tr> <td> <b> Stipend: </b> <div id='extension_stipend'> </div> </td> <td> <b> Branches: </b> <div id='extension_branches'> </div> </td> <td> <b> Office: </b> <div id='extension_office'> </div> </td> <td> <b> Holidays: </b> <div id='extension_holidays'> </div> </td> <td> <b> Courses: </b> <div id='extension_subdomain'> </div> </td> <td> <button> > </button> <div id='extension_switchdwn'> </div> </td> <td> <button> DN </button> <div id='extension_movedown'> </div> </td> <td> <button> BTM </button> <div id='extension_movebtm'> </div> </td> </tr> </table> </tr> <tr> <td id='extension_projlist'> <b> Projects: </b> <br/> <button> P1 </button> </br> <button> P2 </button> </br> <button> P3 </button> </td> <td> <div id='extension_desc'> </div> </td> </tr> <table>"
    before = document.getElementsByClassName("page-form")[0]
    before.parentElement.insertBefore(e, before)

    switchtop_btn = e.getElementById('extension_switchtop')
    switchbtm_btn = e.getElementById('extension_switchbtm')
}

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

function move_from_selected_to_av(selected_op) {
    change_current_selected(selected_op)
    document.getElementsByClassName("dual-action")[0].children[2].click()
//    change_pos(selected_element.children[selected_element.childElementCount - 1], pos)
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

    load_data()

    timer = setInterval(function() {
        if (fillListsIfLoaded()) {
            clearInterval(timer);
        
            inject();
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
