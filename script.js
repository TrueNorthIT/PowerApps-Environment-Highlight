// ==UserScript==
// @name         PowerApps Environment Highlight
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A Tapermonkey userscript to provide environment specific highlighting for PowerApps
// @author       Joe Pitts @ TrueNorthIT
// @website      https://truenorthit.co.uk/
// @source       https://github.com/TrueNorthIT/PowerApps-Environment-Highlight
// @match        https://make.powerapps.com/environments/*
// @icon         view-source:https://truenorthit.co.uk/wp-content/themes/truenorth/img/icons/touch.png
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
//
// INSERT YOUR supportedEnvironments.js SCRIPT HERE!
//          \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/
// @require      
//          /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\
// ==/UserScript==


let setupDone = false;

function log(message) { console.log('TN: ' + message) }

function setup() {
    log("Loaded PowerApps Environment Highlight");
    let foundElements = 0;
    const requiredElements = ".o365sx-navbar, #shellHeaderSwitcherButton_container, #ppuxOfficeHeaderSearchBox_container, .ms-suiteux-search-box, .o365sx-appName, .o365sx-waffle, .o365cs-base, .o365sx-button, .ms-searchux-pG29q, #ppuxOfficeHeaderCenterRegion";
    waitForKeyElements(requiredElements, function () {
        foundElements++;
        if (foundElements === requiredElements.split(',').length) main();
    });


    let previousUrl = '';
    const observer = new MutationObserver(function (mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            console.log(`URL changed to ${location.href}`);
            if (setupDone) main();
        }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
    setupDone = true;

}

function setBackgroundColour(hex) {
    log("Setting nav bar colour...");

    $("#ppuxOfficeHeaderCenterRegion").css("background", `linear-gradient(90deg, #742774 0%, ${hex} 15%, ${hex} 85%, #742774 100%)`);
}

function setMessages(before, after = null) {

    function createElement(tag, text) {
        const el = document.createElement(tag);
        el.textContent = text;
        el.className = 'tn_text';
        return el;
    }
    if (!before) main();

    log("Setting message: " + before);

    const left = createElement('h1', before);

    // For some reason it needs to be prepended twice
    $('#ppuxOfficeHeaderSearchBox_container')[0].prepend(left);
    $('#ppuxOfficeHeaderSearchBox_container')[0].prepend(left);

    if (after) {
        log("Setting message: " + after);
        const right = createElement('h1', after);
        $('#ppuxOfficeHeaderSearchBox_container')[0].appendChild(right);
    }
}

function main() {
    setTimeout(function () {
        $('.tn_text').remove();
        log('Running PowerApps Environment Highlight...')
        // Let's get the environment
        const env = $('#shellHeaderSwitcherButton_container')[0].innerText.split('\n')[1];
        // Just try again if env isnt loaded yet 
        if (!env) main();
    
        const details = supportedEnvironments[env];
        // Unsupported Environment
    
        if (typeof (details) === 'undefined') {
            setBackgroundColour('#F34F41');
            setMessages(env, 'UNSUPPORTED ENVIRONMENT!');
        }
        else {
            setBackgroundColour(details.colour);
            setMessages(env, details.message);
        }
    },
    500)

}

setup();
