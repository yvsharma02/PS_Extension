const DATA_URL = "https://yashvardhan.pythonanywhere.com/data"
var station_id_map = new Map()
var id_station_map = new Map()

var selected_list = new Array()
var available_list = new Array()

var available_element = null
var selected_element = null

var station_proj_map = new Map()

function populate_projects(proj_list) {
    for (var i = 0; i < proj_list.length; i++) {
        var key = proj_list[i]["Station Name"];
        if(!station_proj_map.has(key)) {
            station_proj_map.set(key, []);
        }
        station_proj_map.get(key).push(proj_list[i])
    }
}

async function load_data() {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    populate_projects(data)
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
var undo_btn = null
var redo_btn = null
//var courses_field = null
//var pref_field = null
var proj_field = null
var desc_field = null

var export_btn = null
var import_btn = null

var cur_proj_index = 0

var cur_selection = null

var MAX_STATES = 50
var cs = 0
var states = []

var observer = new MutationObserver(function(mutationsList, observer) { check_state() });
const observer_config = {childList: true, subtree: true, attributes: true}

function check_state() {
    
    identical = true;
    new_state = to_json_list(false)
    if (cs == 0) {
        identical = false;
    } else {
        if (new_state.length != states[cs - 1].length) {
            identical = false;
        } else {
            for (var i = 0; i < new_state.length; i++) {
                if (!(new_state[i]["STATION_ID"] === states[cs - 1][i]["STATION_ID"])) {
                    identical = false;
                    break;
                }
            }
        }
    }
    if (!identical) {
        if (cs != states.length) {
            states.splice(cs, states.length - cs)
        }
        states.push(new_state)
        if (cs == MAX_STATES) {
            states.splice(0, 1)
        } else {
            cs++
        }
        set_undo_redo_button_state()
    }
}

function extract_station_id_from_option(option) {
    str = option.getAttribute("value")
    return str.substring(str.indexOf("'") + 1, str.length - 1)
}

function import_exel() {
    alert("Note: This may take a while! You'll now need to select the input file. Another Alert alert appear when the process is complete. DO NOT MODIFY PAGE CONTENT TILL THEN")

    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        let files =   Array.from(input.files);
        var reader = new FileReader();
        reader.readAsArrayBuffer(input.files[0]);
        reader.onload = function (x) {
            var wb = XLSX.read(x.target.result);

            js = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
            from_json_list(js, true)
            alert("Import Finished!")
        }
    }
    input.click()

}

function from_json_list(js, monitor_state = false) {
    observer.disconnect()
    // Reset everything initially.    
    document.getElementsByClassName("dual-action")[0].children[3].click()
    for (var i = 0; i < js.length; i++) {
        var id = js[i]["STATION_ID"];

        if (!id) {
            for (var k = 0; k < available_element.childElementCount; k++) {
                if (get_station_name_from_option(available_element.children[k]) === js[i]["STATION_NAME"]) {
                    move_from_av_to_selected(available_element.children[k], selected_element.childElementCount)
                    break;
                }
            }
        } else {
            for (var k = 0; k < available_element.childElementCount; k++) {
                if (extract_station_id_from_option(available_element.children[k]) == id) {
                    move_from_av_to_selected(available_element.children[k], selected_element.childElementCount)
                    break;
                }
            }
        }

        // if(!station_proj_map.has(key)) {
        //     station_proj_map.set(key, []);
        // }
        // station_proj_map.get(key).push(js[i])
    }
    observer.observe(selected_element, observer_config)
    if (monitor_state) {
        check_state()
    }
}

function to_json_list(extra_details = true) {
    export_json = []
    for (var i = 0; i < selected_element.length; i++) {
        var name = remove_extra_from_name(selected_element.children[i].innerHTML)
        if (extra_details) {
            json_obj = {"STATION_ID": extract_station_id_from_option(selected_element.children[i]),
                        "STATION_NAME": name,
                        "STIPEND": station_proj_map.has(name) ? station_proj_map.get(name)[0]["Stipend"] : "N/A",
                        "DEGREE": station_proj_map.has(name) ? station_proj_map.get(name)[0]["Degree"] : "N/A",
                        "CITY": station_proj_map.has(name) ? station_proj_map.get(name)[0]["City"] : "N/A"
                }
        } else {
            json_obj = {"STATION_ID": extract_station_id_from_option(selected_element.children[i])}
        }
        export_json.push(json_obj)
    }
    return export_json
}

function export_exel() {
    export_json = to_json_list()

    const worksheet = XLSX.utils.json_to_sheet(export_json);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PREFERENCE");
    XLSX.writeFile(workbook, "PS2_Preference.xlsx", { compression: true });
    alert("Export successful. If you find any item(s) missing, make sure no filters were active during export.")
}

function set_undo_redo_button_state() {
    undo_btn.disabled = false;
    redo_btn.disabled = false;

    if (cs < 2) {
        undo_btn.disabled = true;
    }
    if (states.length == 0 || cs >= states.length) {
        redo_btn.disabled = true;
    }
}

function undo() {
    from_json_list(states[cs - 2], false)
    cs -= 1;
    set_undo_redo_button_state()
    alert("Undo Complete!")
    // todo: clear selection
}

function redo() {
    from_json_list(states[cs], false)
    cs += 1;
    set_undo_redo_button_state()
    alert("Redo Complete!")
    // todo: clear selection
}

function inject() {
    e = document.createElement("div")
    e.innerHTML = "<style> th, td, table { border: 1px solid; } ; th, td { border: 1px solid; padding: 10% } ; </style> <table class='fixed' , style='width: 100%; '> <col width='17.5%' /> <col width='17.5%' /> <col width='17.5%' /> <col width='17.5%' /> <col width='7.5%' /> <col width='7.5%' /> <col width='7.5%' /> <col width='7.5%' /> <col width='7.5%' /> <col width='7.5%' /> <tbody> <tr> <td style='padding-left: 5px; padding-top: 5px;'> <b> Station: </b> <div id='extension_stationname'> N/A </div> </td> <td style='padding-left: 5px; padding-top: 5px;'> <b> City: </b> <div id='extension_city'> N/A </div> </td> <td style='padding-left: 5px; padding-top: 5px;'> <b> Domain: </b> <div id='extension_domain'> N/A </div> </td> <td style='padding-left: 5px; padding-top: 5px;'> <b> Subdomain: </b> <div id='extension_subdomain'>N/A </div> </td> <td style='justify-content: center; padding:5px'> <button id='extension_switchtop'> INSERT TOP </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_moveup'> UP </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_movetop'> TOP </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_export'> EXPORT </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_undo'> UNDO </button> </td> </tr> <tr> <td style='padding-left: 5px; padding-top: 5px;'> <b> Stipend: </b> <div id='extension_stipend'> N/A </div> </td> <td style='padding-left: 5px; padding-top: 5px;'> <b> Branches: </b> <div id='extension_branches'> N/A </div> </td> <td style='padding-left: 5px; padding-top: 5px;'> <b> Office: </b> <div id='extension_office'> N/A </div> </td> <td style='padding-left: 5px; padding-top: 5px;'> <b> Holidays: </b> <div id='extension_holidays'> N/A </div> </td> <td style='justify-content: center; padding:5px'> <button id='extension_switchbtm'> INSERT BTM </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_movedown'> DOWN </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_movebtm'> BOTTOM </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_import'> IMPORT </button> </td> <td style='justify-content: center; padding:5px'> <button id='extension_redo'> REDO </button> </td> </tr> </tbody> </table> <div> <div id='extension_projlist'> <b> Projects: </b> <br /> <!-- <button> P1 </button> <br/> <button> P2 </button> <br/> <button> P3 </button> <br/> --> </div> <div id='extension_desc'> None </div> </div>"
    before = document.getElementsByClassName("page-form")[0]
    before.parentElement.insertBefore(e, before)

    switchtop_btn = document.getElementById('extension_switchtop')
    switchbtm_btn = document.getElementById('extension_switchbtm')

    btmbtn = document.getElementById('extension_movebtm')
    topbtn = document.getElementById('extension_movetop')
    upbtn  = document.getElementById('extension_moveup')
    dwnbtn = document.getElementById('extension_movedown')
    export_btn = document.getElementById('extension_export')
    import_btn = document.getElementById('extension_import')
    undo_btn = document.getElementById('extension_undo')
    redo_btn = document.getElementById('extension_redo')

    undo_btn.addEventListener("click", undo)
    redo_btn.addEventListener("click", redo)

    export_btn.addEventListener("click", export_exel)
    import_btn.addEventListener("click", import_exel)

    set_undo_redo_button_state()

    topbtn.addEventListener("click", function() {
        var ogindex = index_of_option(cur_selection, selected_element)
        change_pos(cur_selection, 0)
        change_current_selected(selected_element.children[ogindex])
    })

    btmbtn.addEventListener("click", function() {
        var ogindex = index_of_option(cur_selection, selected_element)
        change_pos(cur_selection, selected_element.childElementCount - 1)
        change_current_selected(selected_element.children[ogindex])
    })

    upbtn.addEventListener("click", function() {
        var curi = index_of_option(cur_selection, selected_element)
        change_pos(cur_selection, curi >= 1 ? curi - 1 : curi, true)
    })
    dwnbtn.addEventListener("click", function() {
        var curi = index_of_option(cur_selection, selected_element)
        change_pos(cur_selection, curi < selected_element.childElementCount - 1 ? curi + 1 : curi, true)
    })

    switchtop_btn.addEventListener("click", function() {
        if (index_of_option(cur_selection, available_element) != -1) {
            move_from_av_to_selected(cur_selection, 0)
        } else {
            move_from_selected_to_av(cur_selection, 0)
        }
    })
    switchbtm_btn.addEventListener("click", function() {
        if (index_of_option(cur_selection, available_element) != -1) {
            move_from_av_to_selected(cur_selection, selected_element.childElementCount)
        } else {
            move_from_selected_to_av(cur_selection, available_element.childElementCount)
        }
    })

    // var observer = new MutationObserver(function(mutationsList, observer) {
    //     check_state();
    // });
    // config = {childList: true, subtree: true, attributes: true}
    observer.observe(selected_element, observer_config);
    
    // document.getElementsByClassName("dual-action")[0].children[0].disabled = true
    // document.getElementsByClassName("dual-action")[0].children[3].disabled = true

    branch_field = document.getElementById('extension_branches')
    stipend_field = document.getElementById('extension_stipend')
    station_field = document.getElementById('extension_stationname')
    city_field = document.getElementById('extension_city')
    domain_field = document.getElementById('extension_domain')
    subdomain_field = document.getElementById('extension_subdomain')
    office_field = document.getElementById('extension_office')
    holidays_field = document.getElementById('extension_holidays')
//    courses_field = document.getElementById('extension_courses')
//    pref_field = document.getElementById('extension_pref')
    proj_field = document.getElementById('extension_projlist')
    desc_field = document.getElementById('extension_desc')

    btmbtn.disabled = true
    topbtn.disabled = true
    upbtn.disabled = true
    dwnbtn.disabled = true
    switchbtm_btn.disabled = true
    switchtop_btn.disabled = true
}

function fill_details(opt, proj_index) {
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
    switchbtm_btn.disabled = !on_ava_side
//    pref_field.disabled = on_ava_side

    switchtop_btn.innerHTML = on_ava_side ? "INSERT TOP" : "REMOVE"
    switchbtm_btn.innerHTML = on_ava_side ? "INSERT BTM" : "REMOVE"
    
    if (station_proj_map.has(opt_name)) {
        if (station_proj_map.get(opt_name).length > 0) {
            for (var i = 1; i < document.getElementById('extension_projlist').childElementCount; i++) {
                document.getElementById('extension_projlist').children[i].disabled = false;
            }
        }
        proj_field = document.getElementById('extension_projlist').children[proj_index + 1].disabled = true;

        branch_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Degree"]
        stipend_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Stipend"]
        station_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Station Name"]
        city_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["City"]
        domain_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Domain"]
        subdomain_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Domain"]
        office_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Office-Start-Time"] + "-" + station_proj_map.get(opt_name)[proj_index]["Office-End-Time"].substring(1)
        holidays_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Holidays"]
    //    courses_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Courses"]
    //    pref_field.innerHTML = on_ava_side ? 0 : index_of_option(opt, available_element)
        desc_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Project Details"]
    //    proj_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Degree"]
    } else {

    }
}

function resetFields() {
    branch_field.innerHTML = "N/A"
    stipend_field.innerHTML = "N/A"
    station_field.innerHTML = "N/A"
    city_field.innerHTML = "N/A"
    domain_field.innerHTML = "N/A"
    subdomain_field.innerHTML = "N/A"
    office_field.innerHTML = "N/A"
    holidays_field.innerHTML = "N/A"
    desc_field.innerHTML = "N/A"
}

function onSelectionChange(opt) {

    if (opt != null) {
        switchtop_btn.disabled = false
    }

    var opt_name = get_station_name_from_option(opt)
    proj_field = document.getElementById('extension_projlist')
    
    while (proj_field.childElementCount > 1) {
        proj_field.removeChild(proj_field.children[1])
    }
    if (!station_proj_map.get(opt_name) || station_proj_map.get(opt_name).length == 0) {
        //alert("Warning: The station " + opt_name + " seems to be missing details. It might be newely added and not yet scraped. Please contact admin")
        resetFields();
    } else {
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
    }

    cur_selection = opt
//    proj_field.innerHTML = station_proj_map.get(opt_name)[proj_index]["Degree"]
    fill_details(opt, 0)
}

function remove_extra_from_name(s) {
    res = s.substring(s.indexOf('. ') + 2, s.lastIndexOf(' - '));
    while (res.indexOf('&amp;') != -1) {
        res = res.substring(0, res.indexOf('&amp;')) +  '&' + res.substring(res.indexOf('&amp;') + 5)
    }

    return res
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

function change_pos(element, new_pos, select_item_at_new_pos) {
    change_current_selected(element)
    cur_pos = get_position_of_option(element)
    
    up_btn = document.getElementsByClassName("dual-action-right")[0].children[0]
    down_btn = document.getElementsByClassName("dual-action-right")[0].children[1]
    while (new_pos < cur_pos) {
        cur_pos--;
        up_btn.click()
    }
    while (cur_pos < new_pos) {
        cur_pos++;
        down_btn.click()
    }
    if (select_item_at_new_pos) {
        change_current_selected(selected_element.children[new_pos])
    }
}

function index_of_option(opt, element) {
    return Array.prototype.indexOf.call(element.children, opt)
}


function move_from_av_to_selected(avaliable_option, pos) {
    var index = index_of_option(avaliable_option, available_element)

    change_current_avaliable(avaliable_option)
    document.getElementsByClassName("dual-action")[0].children[1].click()
    change_pos(selected_element.children[selected_element.childElementCount - 1], pos)

    if (index < available_element.childElementCount) {
        change_current_avaliable(available_element.children[index])
    } else {
        if (available_element.childElementCount == 0) {
            return
        } else {
            change_current_avaliable(available_element.children[available_element.childElementCount - 1])
        }
    }
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
//   selected_element.focus()
//   new_option.focus()
    selected_element.selectedIndex = index_of_option(new_option, selected_element)
    selected_element.dispatchEvent(new Event('change', {bubbles: true}))
//    selected_element.selectedIndex = Array.prototype.indexOf.call(selected_element.children, new_option)
}

function change_current_avaliable(new_option) {
    available_element.selectedIndex = index_of_option(new_option, available_element)
//   available_element.focus()
    available_element.dispatchEvent(new Event('change', {bubbles: true}))
    
//    available_element.selectedIndex = Array.prototype.indexOf.call(available_element.children, new_option)
}

function clearDetails() {

}

function fillListsIfLoaded() {
    available_element = document.querySelector("select[formcontrolname='availableListBox']");
    if (!available_element) {
        return false;
    }
    available_element.addEventListener("change", function () {
    cur = current_option_of_avaliable()
    cur_selection = cur
    if (!cur) {
        clearDetails()
        return
    }
    onSelectionChange(cur, available_element)
   });
    selected_element = document.querySelector("select[formcontrolname='selectedListBox']");
    selected_element.addEventListener("change", function () {
    
    cur = current_option_of_selected()
    cur_selection = cur
    if (!cur) {
        clearDetails()
        return
    }
    onSelectionChange(cur, selected_element)
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
            check_state()
        }

    }, 1000)
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',afterDOMLoaded);
} else {
    afterDOMLoaded();
}

function afterDOMLoaded() {
    init();
}
