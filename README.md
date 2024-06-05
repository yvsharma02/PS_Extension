# PS2 Helper

![Alt text](assets/icon.png) <br/> <br/>
DISCLAIMER:

The extension is provided as it is, without any warrenty or libaility. <br/>
Although all effort has been put in to throughly test the extension, and make sure it is safe and error free, but in any case **PLEASE DOUBLE CHECK EVERYTHING.** <br/>
**MAKE SURE TO ALWAYS DOUBLE CHECK IF IMPORTS AND EXPORTS ARE CORRECT.** <br/>
**MAKE SURE TO DOUBLE CHECK THAT ALL INFO PROVIDED BY THE EXTENSION.** <br/>
**I shall not be liable in case someone messes their PS because of using this extension.** <br/>
That being said, if you found any issue, or have any suggesions, feel free to share them with me at f20212645@pilani.bits-pilani.ac.in
<br/>
<br/>
WHY USE THIS EXTENSION: <br/>
1) The Extension injects a new table at the top of PSMS site, which contains all the relavent information about each project of the currently selected station on PSMS site. (Stipend, Branches, Project Description, ect). <br/>
2) The injected pannel also provide new ways to add/remove items to the top or to the buttom of the already sorted list, helping in much faster. <br/>
3) The extension also allows you to save and load your preferences as an exel sheet. This way, you can share it with your friends, and also have a backup in case PSMS decides to not save your preferences, like it sometimes likes to do.
4) Undo and redo incase you mess something up!

<br/>
<img src="https://i.imgur.com/Y8sYBaz.png" width="1024" height="416" />
<br/>

HOW TO INSTALL/ENABLE: <br/>

While we wait for the extension to get approved on the Chrome Store, the only way to use it is as follows: <br/>
1) Download ZIP of this repo from github. <br/>
2) Extract the ZIP somewhere <br/>
3) Goto chrome://extensions, and make enable Developer mode. <br/>
4) Click on 'Load unpacked' and point to the extracted folder. <br/>
5) Goto https://psms-web.azureedge.net/stationpreference/selectpreference AND REFRESH THE PAGE ONCE.
6) Until the extension is uplodaded on Chrome Store, you need to remove the old extension and repeat the steps to update it.
<br/>

HOW IT WORKS: <br/>
A pre-dumped database of all the stations is needed for this to work. The data is scrapped using the scraper I made along with this project: <br/>
https://github.com/yvsharma02/PS2DetailsScraper/ <br/>
<br/>
It scraps the PSMS website, gives out an exel file.
The exel file is converted to a json file, and is hosted at: <br/>
https://yashvardhan.pythonanywhere.com/data

Earlier, the extension itself needed a exel file dump to work. That meant updating the database meant updating the extension. This has been fixed now. I'll keep uploading the database occasionally from my side. The user does not have to do anything once this extension is installed.