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

var station_proj_map = new Map()

// var available_current = null
// var selected_current = null

async function load_data() {
    var path = chrome.runtime.getURL("assets/data.xlsx");

    function reqListener() {
        var buffer = this.response;
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

var branch_field = null
var stipend_field = null
var station_field = null
var city_field = null
var domain_field = null
var subdomain_field = null
var office_field = null
var holidays_field = null
var courses_field = null
var pref_field = null
var proj_field = null
var desc_field = null

var cur_proj_index = 0

function inject() {
    e = document.createElement("div")
    e.innerHTML = "<table> <tbody> <tr> <td> <b> Station: </b> <div id='extension_stationname'> None </div> </td> <td> <b> City: </b> <div id='extension_city'> </div> None </td> <td> <b> Domain: </b> <div id='extension_domain'> </div> None </td> <td> <b> Subdomain: </b> <div id='extension_subdomain'> </div> None </td> <td> <b> Prefrence No: </b> <div id='extension_pref'> </div> None </td> <td> <button id='extension_switchtop'> > </button> </td> <td> <button id='extension_moveup'> UP </button>  </td> <td> <button id='extension_movetop'> TP </button>  </td> </tr> <tr> <td> <b> Stipend: </b> <div id='extension_stipend'> </div> None </td> <td> <b> Branches: </b> <div id='extension_branches'> </div> None </td> <td> <b> Office: </b> <div id='extension_office'> </div> None </td> <td> <b> Holidays: </b> <div id='extension_holidays'> </div> None </td> <td> <b> Courses: </b> <div id='extension_courses'> </div> None </td> <td> <button id='extension_switchbtm'> > </button> </td> <td> <button id='extension_movedown'> DN </button> </td> <td> <button id='extension_movebtm'> BTM </button> </td> </tr> </tbody> </table> <div> <div id='extension_projlist'> <b> Projects: </b> <br/> <button> P1 </button> <br/> <button> P2 </button> <br/> <button> P3 </button> <br/> </div> <div id='extension_desc'> None </div> </div>"
    before = document.getElementsByClassName("page-form")[0]
    before.parentElement.insertBefore(e, before)

    switchtop_btn = document.getElementById('extension_switchtop')
    switchbtm_btn = document.getElementById('extension_switchbtm')

    btmbtn = document.getElementById('extension_movebtm')
    topbtn = document.getElementById('extension_movetop')
    upbtn  = document.getElementById('extension_moveup')
    dwnbtn = document.getElementById('extension_movedown')

    branch_field = document.getElementById('extension_branches')
    stipend_field = document.getElementById('extension_stipend')
    station_field = document.getElementById('extension_stationname')
    city_field = document.getElementById('extension_city')
    domain_field = document.getElementById('extension_domain')
    subdomain_field = document.getElementById('extension_subdomain')
    office_field = document.getElementById('extension_office')
    holidays_field = document.getElementById('extension_holidays')
    courses_field = document.getElementById('extension_courses')
    pref_field = document.getElementById('extension_pref')
    proj_field = document.getElementById('extension_projlist')
    desc_field = document.getElementById('extension_desc')
}

function fill_details(opt, proj_index) {
//    console.log(opt)
    var on_ava_side = index_of_option(opt, available_element) != -1
    var opt_name = get_station_name_from_option(opt)

    // if (proj_index < 0) {
    //     proj_index = 0;
    // }
    // if (proj_index >= station_proj_map.get(opt_name).length) {
    //     proj_index = 0
    // }

    btmbtn.disabled = on_ava_side
    topbtn.disabled = on_ava_side
    upbtn.disabled = on_ava_side
    dwnbtn.disabled = on_ava_side
    switchbtm_btn.disabled = on_ava_side
    pref_field.disabled = on_ava_side

    switchtop_btn.value = on_ava_side ? ">" : "<"
    switchbtm_btn.value = on_ava_side ? ">" : "<"
    
    console.log(proj_index + " vs " + station_proj_map.get(opt_name).length)
//    console.log(station_proj_map.get(opt_name)[proj_index])

    branch_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Degree"]
    stipend_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Stipend"]
    station_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Station Name"]
    city_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["City"]
    domain_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Domain"]
    subdomain_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Domain"]
    office_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Office-Start"] + "-" + station_proj_map.get(opt_name)[proj_index]["Office-End"]
    holidays_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Holidays"]
    courses_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Courses"]
    pref_field.innerHTML = on_ava_side ? 0 : index_of_option(opt, available_element)
    desc_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Project Details"]
//    proj_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Degree"]
}

function onSelectionChange(opt, element) {
    var opt_name = get_station_name_from_option(opt)
    proj_field = document.getElementById('extension_projlist')
    
    while (proj_field.childElementCount > 1) {
        proj_field.removeChild(proj_field.children[1])
    }



    for (var i = 0; i < station_proj_map.get(opt_name).length; i++) {
        (function(i) {
        b = document.createElement('button')
        b.innerHTML = station_proj_map.get(opt_name)[i]['Title']
        b.addEventListener('click', function() {
            fill_details(opt, i)
        })
        proj_field.appendChild(b)
    })(i);
    }
//    proj_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Degree"]
    fill_details(opt, 0)
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
   available_element.addEventListener("change", function () {
    onSelectionChange(current_option_of_avaliable(), available_element)
   });
    selected_element = document.querySelector("select[formcontrolname='selectedListBox']");
   selected_element.addEventListener("change", function () {
    onSelectionChange(current_option_of_selected(), selected_element)
   });

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
