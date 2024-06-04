document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("export_btn").addEventListener('click', exportClick);
    document.getElementById("import_btn").addEventListener('click', importClick);
});

async function exportClick() {

    const url = "https://docs.sheetjs.com/executive.json";
    const raw_data = (await (await fetch(url)).json());
    console.log(raw_data)
    /* filter for the Presidents */
    const prez = raw_data.filter(row => row.terms.some(term => term.type === "prez"));
  
    /* sort by first presidential term */
    prez.forEach(row => row.start = row.terms.find(term => term.type === "prez").start);
    prez.sort((l,r) => l.start.localeCompare(r.start));
  
    /* flatten objects */
    const rows = prez.map(row => ({
      name: row.name.first + " " + row.name.last,
      birthday: row.bio.birthday
    }));
  
    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
  
    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });
  
    /* calculate column width */
    const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet["!cols"] = [ { wch: max_width } ];
  
    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, "Presidents.xlsx", { compression: true });

}

function save(wb) {
    XLSX.writeFile(wb, "Loaded.xlsx", { compression: true });
}

async function importClick() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        let files =   Array.from(input.files);
//        console.log(files[0].);
        var reader = new FileReader();
        console.log(input.files[0])
        reader.readAsArrayBuffer(input.files[0]);
        reader.onload = function (x) {
            console.log(x.target.result);
            // alert("File Read!");

           var wb = XLSX.read(x.target.result);
           wb.forEach()
           save(wb);
        }
        
        // const url = "https://docs.sheetjs.com/PortfolioSummary.xls";
        // const workbook = XLSX.read(data, opts);

        // /* get first worksheet */
        // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});

        // /* fill years */
        // var last_year = 0;
        // raw_data.forEach(r => last_year = r[0] = (r[0] != null ? r[0] : last_year));

        // /* select data rows */
        // const rows = raw_data.filter(r => r[0] >= 2007 && r[0] <= 2024 && r[2] > 0);

        // /* generate row objects */
        // const objects = rows.map(r => ({FY: r[0], FQ: r[1], total: r[8]}));

        // /* display data */
        // setRows(objects);
    };

    input.click();
}