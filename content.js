/*
    Called everything when the order of the list of selected items change.
    Inefficent, but easy to progam.
*/

selected_list = []
available_list = []

function remove_extra_from_name(s) {
    return s.substring(s.indexOf('. ') + 2, s.lastIndexOf(' - '));
}

function fillListsIfLoaded() {
    var available_element =  document.querySelector("select[formcontrolname='availableListBox']");
    var selected_element =  document.querySelector("select[formcontrolname='availableListBox']");

    var total_count = available_element.childElementCount + selected_element.childElementCount;

    if (total_count < 2) {
        return false
    }

    for (var i = 0; i < available_element.childElementCount; i++) {
        var s = available_element.children[i].innerHTML;
//        s = s.substring(s.indexOf('. ') + 2, s.lastIndexOf(' - '));
        available_list.push(s)
    }
    for (var i = 0; i < selected_element.childElementCount; i++) {
        var s = selected_element.children[i].innerHTML;
//        s = s.substring(s.indexOf('. ') + 2, s.lastIndexOf(' - '));
        selected_list.push(s)
    }

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
