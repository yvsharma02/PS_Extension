# PS2 Helper

![Alt text](assets/icon.png)
DISCLAIMER:

The extension is provided as it is, without any warrenty or libaility. <br/>
Although all effort has been put in to throughly test the extension, and make sure it is safe and error free, but in any case PLEASE DOUBLE CHECK EVERYTHING. <br/>
MAKE SURE TO ALWAYS DOUBLE CHECK IF IMPORTS AND EXPORTS ARE CORRECT. <br/>
MAKE SURE TO DOUBLE CHECK THAT ALL INFO PROVIDED BY THE EXTENSION. <br/>
I shall not be liable in case someone messes their PS because of using this extension. <br/>
That being said, if you found any issue, or have any suggesions, feel free to share them with me at f20212645@pilani.bits-pilani.ac.in
<br/>
<br/>
WHY USE THIS EXTENSION: <br/>
1) The Extension injects a new table at the top of PSMS site, which contains all the relavent information about each project of the currently selected station on PSMS site. (Stipend, Branches, Project Description, ect). <br/>
2) The injected pannel also provide new ways to add/remove items to the top or to the buttom of the already sorted list, helping in much faster. <br/>
3) The extension also allows you to save and load your preferences as an exel sheet. This way, you can share it with your friends, and also have a backup in case PSMS decides to not save your preferences, like it sometimes likes to do.

<br/>
<img src="https://imgur.com/a/jlmZUQz" width="1024" height="416" />
<br/>

HOW TO INSTALL/ENABLE: <br/>

While we wait for the extension to get approved on the Chrome Store, the only way to use it is as follows: <br/>
1) Download ZIP of this repo from github. <br/>
2) Extract the ZIP somewhere <br/>
3) Goto chrome://extensions, and make enable Developer mode. <br/>
4) Click on 'Load unpacked' and point to the extracted folder. <br/>
5) Goto https://psms-web.azureedge.net/stationpreference/selectpreference AND REFRESH THE PAGE ONCE. <br/>

HOW IT WORKS: <br/>
The data needs to be pre-dumped in an excel file for this extension to work. For that I made a web-scraper. You can check that out here: <br/>
https://github.com/yvsharma02/PS2DetailsScraper/ <br/>
<br/>
What this means for us, unfortunately, is that the extension will not be updated in realtime. I need to re-scrape new stations PS stations everything they are added. After that, people will need to manually re-update their extensions. That will be even more of a hassle until the extension is approved on Chrome WebStore. <br/>
In any case, the extension warns you whenever you select an option whose's data is not yet avaliable. You can inform me, or run alternatively, run the webscraper yourself to update the details. <br/>
I'll keep updating whever I get time.