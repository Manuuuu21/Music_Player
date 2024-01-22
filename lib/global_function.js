// This function runs when the window has finished loading
window.onload = function() {
    // Sort the music list by the title in alphabetical order
    data_music_list.sort((a, b) => a.title.localeCompare(b.title));

    // Initialize an empty string to store the HTML for the music list
    let html = "";

    // Loop through each item in the music list
    for (let i = 0; i < data_music_list.length; i++) {
        // For each item, add a div to the HTML string. This div includes:
        // - an onclick attribute to play the music when clicked
        // - an id for the music title
        // - the music title and time
        html += `
            <div onclick="playMusic(${i})" class="music_data_list">
                <div id="music_title_${i}" class="music_data_title">${data_music_list[i].title}</div>
                <div class="music_data_time_con">
                    <div class="music_data_time">${data_music_list[i].time}</div>
                </div>
            </div>
        `;
    }

    // Insert the generated HTML into the element with class 'music_data_con'
    document.querySelector(".music_data_con").innerHTML = html;
}

/**
 * Function to filter music titles based on user search input.
 * It performs a case-insensitive search on the music titles.
 */
function searchFilterMusicTitle() {
    // Get the search input from the user and convert it to uppercase for case-insensitive search
    let searchFilter = $("#searchInput").val().toUpperCase();

    // Loop through all the items in the music data list
    $(".music_data_list").each(function() {
        // Extract the title of the music from the current list item
        let title = $(this).find(".music_data_title").text();

        // Convert the title to uppercase and check if it contains the search filter
        if (title.toUpperCase().indexOf(searchFilter) > -1) {
            // If the title matches the search filter, make the list item visible
            $(this).show();
        } else {
            // If the title does not match the search filter, hide the list item
            $(this).hide();
        }
    });
}

// Initialize audio object and interval variable
let aud = new Audio();
let audioInterval;

// Function to play music
function playMusic(num) {
    // Get elements from the DOM
    let topicElements = document.getElementsByClassName("music_data_list");
    let musicTitle = document.getElementsByClassName("music_data_title");
    let musicTimerEnd = document.getElementsByClassName("music_data_time");

    // Set play status
    isPlaying = true;
    isPause = false;

    // Update play button
    document.querySelector("#playMusicButton").innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/></svg>
    `;

    // Reset background color for all topics
    for (var i = 0; i < topicElements.length; i++) {
        topicElements[i].style.background = "";
    }

    // Highlight the selected element
    topicElements[num].style.background = "#ffdfa5";

    // Update title and timer
    $("title").text(musicTitle[num].innerText);
    $(".music_title").text(musicTitle[num].innerText);
    $("#timerEnd").text(musicTimerEnd[num].innerText);

    // Load and play the selected music
    aud.src = data_music_list[num].src;
    aud.load();
    aud.play();

    // Update progress bar and range when metadata is loaded
    aud.onloadedmetadata = function() {
        var progress = document.getElementById("myProgress");
        var range = document.getElementById("myRange");

        progress.setAttribute("max", Math.floor(aud.duration));
        range.setAttribute("max", Math.floor(aud.duration));

        progress.value = Math.floor(aud.currentTime);
        range.value = Math.floor(aud.currentTime);

        // Update current time when seekbar is moved
        range.oninput = function() {
            aud.currentTime = range.value;
            progress.value = range.value;
            update_music_currentTime();
        }
    };

    // Update current time every 100ms
    audioInterval = setInterval(function() {
        update_music_currentTime();

        // Check if the music has ended
        if (aud.ended) {
            if (isShuffleEnabled == true) {
                do {
                    randomIndex = Math.floor(Math.random() * data_music_list.length);
                } while (randomIndex === lastPlayedIndex && data_music_list.length > 1);

                playMusic(randomIndex);
            }
            else if (isLoopAllMusic == true) {
                getNextMusic();
            }
            else if (isLoopCurrentMusic == true) {
                playMusic(lastPlayedIndex);
            }
            else {
                clearInterval(audioInterval);
                isPlaying = false;
                isPause = true;

                // Update play button
                document.querySelector("#playMusicButton").innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M320-200v-560l440 280-440 280Z"/></svg>
                `;
            }
        }
    }, 16);

    // Remember the last played music
    lastPlayedIndex = num;
}

// Function to update the current time of the music
function update_music_currentTime() {
    // Get the current time of the audio in seconds
    var audSecs = Math.floor(aud.currentTime) % 60;
    
    // Convert the current time to a string
    var audSecs_string = audSecs.toString();
    
    // Get the length of the current time string
    var audSecs_length = audSecs_string.length;

    // Get the HTML elements for displaying the time and progress
    var timerMinutes = document.getElementById("timerMinutes");
    var timerSeconds = document.getElementById("timerSeconds");
    var progress = document.getElementById("myProgress");
    var range = document.getElementById("myRange");

    // Update the progress bar and range input with the current time
    progress.value = Math.floor(aud.currentTime);
    range.value = Math.floor(aud.currentTime);

    // Update the displayed time
    // If the seconds are less than 10, add a leading zero
    if (audSecs_length == 1) {
        timerMinutes.innerHTML = Math.floor(aud.currentTime / 60);
        timerSeconds.innerHTML = "0" + audSecs_string;
    }
    // Otherwise, display the time as is
    else {
        timerMinutes.innerHTML = Math.floor(aud.currentTime / 60);
        timerSeconds.innerHTML = audSecs_string;
    }
}

// Initialize the index of the last played music
let lastPlayedIndex = 0;

// Initialize the shuffle status
let isShuffleEnabled = false;

// Function to get random music
function getRandomMusic() {
    // If shuffle is not enabled
    if (isShuffleEnabled == false) {
        // Enable shuffle
        isShuffleEnabled = true;

        // Change the shuffle button to active state
        document.querySelector("#shuffleButton svg").classList.remove("disable");
        
        // Reset the loop status for all music and current music
        isLoopAllMusic = false;
        isLoopCurrentMusic = false;

        // Reset the loop counter
        loopCounter = 0;

        // Reset the loop button
        document.querySelector("#loopButton").innerHTML = `
            <svg class="disable" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/></svg>
        `;
    }
    // If shuffle is enabled
    else {
        // Disable shuffle
        isShuffleEnabled = false;

        // Change the shuffle button to inactive state
        document.querySelector("#shuffleButton svg").classList.add("disable");
    }

    // Return the index of the last played music
    return lastPlayedIndex;
}

// Initialize the loop status for all music and current music
let isLoopAllMusic = false;
let isLoopCurrentMusic = false;

/* Loop counter states:
 * 1 = isLoopAllMusic is set to true
 * 2 = isLoopCurrentMusic is set to true 
 * 3 = disable the loopButton */
let loopCounter = 0;

// Function to get loop music
function getLoopMusic() {
    // Reset the shuffle button
    isShuffleEnabled = false;
    document.querySelector("#shuffleButton svg").classList.add("disable");

    // Increment the loop counter
    loopCounter++;

    // Switch case for different loop counter states
    switch(loopCounter) {
        case 1:
            // Set loop all music to true and loop current music to false
            isLoopAllMusic = true;
            isLoopCurrentMusic = false;
            // Change the loop button to active state
            document.querySelector("#loopButton svg").classList.remove("disable");
            break;
        case 2:
            // Set loop all music to false and loop current music to true
            isLoopAllMusic = false;
            isLoopCurrentMusic = true;
            // Update the loop button SVG
            document.querySelector("#loopButton").innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M460-360v-180h-60v-60h120v240h-60ZM280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/></svg>
            `;
            break;
        case 3:
            // Reset all loop statuses and loop counter
            isLoopAllMusic = false;
            isLoopCurrentMusic = false;
            loopCounter = 0;
            // Reset the loop button SVG
            document.querySelector("#loopButton").innerHTML = `
                <svg class="disable" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/></svg>
            `;
            break;
    }
}

// Function to play the next music in the playlist
function getNextMusic() {
    // Increment the index of the last played music
    lastPlayedIndex++;

    // Check if the last played index has reached the end of the music list
    if (lastPlayedIndex == data_music_list.length) {
        // Reset the index to the start of the playlist
        lastPlayedIndex = 0;
    }

    // Play the music at the current index
    playMusic(lastPlayedIndex);
}

// Function to play the previous music in the playlist
function getPreviousMusic() {
    // Decrement the index of the last played music
    lastPlayedIndex--;

    // Check if the last played index has reached the start of the music list
    if (lastPlayedIndex < 0) {
        // Reset the index to the end of the playlist
        lastPlayedIndex = data_music_list.length - 1;
    }

    // Play the music at the current index
    playMusic(lastPlayedIndex);
}

// Initialize variables to keep track of the play and pause status
let isPlaying = false;
let isPause = true;

// Function to play the current music
function playTheCurrentMusic() {
    // Check if the music is currently paused
    if (isPause) {
        // If it is, play the music
        isPause = false;
        isPlaying = true;

        // Update the play button to show the pause icon
        document.querySelector("#playMusicButton").innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/></svg>
        `;
        aud.play();

        // Set an interval to update the music current time every second
        audioInterval = setInterval(function() {
            update_music_currentTime();

            // Check if the music has ended
            if (aud.ended) {
                // If shuffle is enabled, play a random music
                if (isShuffleEnabled) {
                    let randomIndex;
                    do {
                        randomIndex = Math.floor(Math.random() * data_music_list.length);
                    } while (randomIndex === lastPlayedIndex && data_music_list.length > 1);
                    playMusic(randomIndex);
                }
                // If loop all music is enabled, get the next music
                else if (isLoopAllMusic) {
                    getNextMusic();
                }
                // If loop current music is enabled, play the last played music
                else if (isLoopCurrentMusic) {
                    playMusic(lastPlayedIndex);
                }
                // If none of the above is enabled, stop the music and update the play button to show the play icon
                else {
                    clearInterval(audioInterval);
                    isPlaying = false;
                    isPause = true;
                    document.querySelector("#playMusicButton").innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M320-200v-560l440 280-440 280Z"/></svg>
                    `;
                }
            }

        }, 16);

    } else {
        // If the music is not paused, pause the music and update the play button to show the play icon
        isPause = true;
        isPlaying = false;
        document.querySelector("#playMusicButton").innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M320-200v-560l440 280-440 280Z"/></svg>
        `;
        aud.pause();

        // Stop the interval counting of video
        clearInterval(audioInterval);
    }
}

// Initialize a variable to keep track of the mute status
let isMuted = false;

// Function to mute or unmute the music
function muteMusic() {
    // Check if the music is currently muted
    if (isMuted) {
        // If it is, unmute the music
        isMuted = false;
        aud.muted = false;

        // Update the mute button to show the unmuted icon
        document.querySelector("#muteButton").innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z"/></svg>
        `;
    } else {
        // If it is not, mute the music
        isMuted = true;
        aud.muted = true;

        // Update the mute button to show the muted icon
        document.querySelector("#muteButton").innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Z"/></svg>
        `;
    }
}