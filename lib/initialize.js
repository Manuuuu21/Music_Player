/**
 * This function pauses the audio playback.
 */
function pauseAudio() {
    aud.pause();
}

/**
 * This function starts or resumes the audio playback.
 */
function playAudio() {
    aud.play();
}

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


// Play music via Music Playlist Card After it click the song
function playMusic(index) {
    // Stop the music current timer timer
    // To avoid double clicking of audioInterval
    clearInterval(audioInterval);

    // Play the music base on the index in music list
    playTheMusicByIndexNumber(index)

    audioInterval = setInterval(function() {
        // Check if the music has ended
        if (progress.value == progress.max) {
            if (isShuffleEnabled == true) {
                do {
                    randomIndex = Math.floor(Math.random() * data_music_list.length);
                } while (randomIndex === lastPlayedIndex && data_music_list.length > 1);
                playTheMusicByIndexNumber(randomIndex);
            }
            else if (isLoopAllMusic == true) {
                getNextMusic();
            }
            else if (isLoopCurrentMusic == true) {
                playTheMusicByIndexNumber(lastPlayedIndex);
            }
            else {
                // Set the Flag
                clearInterval(audioInterval);
                // Set the Flag first
                isPlaying = false;
                isPause = true;

                progress.value == progress.max;

                // Since it already done the music. We need to display the Play Icon.
                document.querySelector("#playMusicButton").innerHTML = REPLAY_ICON;
                console.log("It works FROM playMusic()");
            }
        }

        // Update the music current time
        update_music_currentTime();
    }, 16);
}

// This handle the datas of the duration
aud.onloadedmetadata = function() {
    // Set the max and value attribute of the progress and range
    progress.setAttribute("max", Math.floor(aud.duration));
    range.setAttribute("max", Math.floor(aud.duration));
    progress.value = 0;
    range.value = 0;
}

range.oninput = function() {
    aud.currentTime = range.value;
    progress.value = range.value;
    aud.pause();

    // We need to display the Pause Icon.
    document.querySelector("#playMusicButton").innerHTML = PLAY_ICON;

    // Callback to update music currentTime minutes and seconds
    update_music_currentTime();
};

// Range on mousedown and mouseup event
function mouseDown() {
    if (progress.value !== progress.max) {
        clearInterval(audioInterval);
        aud.pause();

        isPlaying = false;
        isPause = true;

        // Since it already pause the music. We need to display the Pause Icon.
        document.querySelector("#playMusicButton").innerHTML = PLAY_ICON;
    }
}

function mouseUp() {
    if (progress.value == progress.max) {
        isPlaying = false;
        isPause = true;

        // Since it already playing the music. We need to display the Pause Icon.
        document.querySelector("#playMusicButton").innerHTML = REPLAY_ICON;
                    
        // Stop the interval counting of video
        clearInterval(audioInterval);
        aud.currentTime = 0;
        aud.pause();
    }
    else {
        playTheCurrentMusic();
    }
}


function update_music_currentTime() {
    let secs = Math.floor(aud.currentTime % 60);
    let min = Math.floor(aud.currentTime / 60);

    // Update the progress bar and range input with the current time
    var currentTime = Math.floor(aud.currentTime);
    progress.value = currentTime > progress.max ? progress.max : currentTime;
    range.value = currentTime > range.max ? range.max : currentTime;

    // Convert the seconds and minutes to strings for display
    let secs_string = secs.toString();
    let min_string = min.toString();

    // Get the length of the seconds and minutes strings
    let secs_length = secs_string.length;
    let min_length = min_string.length;

    // Get the timer display elements
    var timerMinutes = document.getElementById("timerMinutes");
    var timerSeconds = document.getElementById("timerSeconds");

    // Update the seconds display, adding a leading zero for single-digit numbers
    if (secs_length == 1) {
        timerSeconds.innerHTML = "0" + Math.floor(progress.value % 60);
        timerMinutes.innerHTML = Math.floor(progress.value / 60);
    }
    else {
        timerSeconds.innerHTML = Math.floor(progress.value % 60);
        timerMinutes.innerHTML = Math.floor(progress.value / 60);
    }
}

// NOTE: THIS IS SUPER BUG
// Function to play the current music
function playTheCurrentMusic() {
    // Stop the interval counting of video
    clearInterval(audioInterval);

    if (isPlaying) {
        // Stop the interval counting of video
        clearInterval(audioInterval);
        aud.pause();

        isPlaying = false;
        isPause = true;

        // Since it already pause the music. We need to display the Pause Icon.
        document.querySelector("#playMusicButton").innerHTML = PLAY_ICON;
        console.log("You Paused the Music");
    }
    else {
        isPlaying = true;
        isPause = false;

        // Since it already playing the music. We need to display the Pause Icon.
        document.querySelector("#playMusicButton").innerHTML = PAUSE_ICON;
        aud.play();

        console.log("You Played the Music from playTheCurrentMusic");

        audioInterval = setInterval(function() {
            // Update the music current time
            update_music_currentTime();
            // Check if the music has ended
            if (progress.value == progress.max) {
                if (isShuffleEnabled == true) {
                    do {
                            randomIndex = Math.floor(Math.random() * data_music_list.length);
                    } 
                    while (randomIndex === lastPlayedIndex && data_music_list.length > 1);
                    playTheMusicByIndexNumber(randomIndex);
                }
                else if (isLoopAllMusic == true) {
                    getNextMusic();
                }
                else if (isLoopCurrentMusic == true) {
                    playTheMusicByIndexNumber(lastPlayedIndex);
                }
                else {
                    // Set the Flag
                    isPlaying = false;
                    isPause = true;

                    // Since it already playing the music. We need to display the Pause Icon.
                    document.querySelector("#playMusicButton").innerHTML = REPLAY_ICON;
                    console.log("Your Music display Replay the Music");
                    // Stop the interval counting of video
                    clearInterval(audioInterval);
                    aud.currentTime = 0;
                    aud.pause();
                }
            }
        }, 16);
    }
}

// Function to play the next music in the playlist
function getNextMusic() {
    // Set the Flag first
    isPlaying = true;
    isPause = false;

    // Increment the index of the last played music
    lastPlayedIndex++;

    // Check if the last played index has reached the end of the music list
    if (lastPlayedIndex == data_music_list.length) {
        // Reset the index to the start of the playlist
        lastPlayedIndex = 0;
    }

    playTheMusicByIndexNumber(lastPlayedIndex);
}

// Function to play the previous music in the playlist
function getPreviousMusic() {
    // Set the Flag first
    isPlaying = true;
    isPause = false;

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

        // Reset the loop button SVG
        document.querySelector("#loopButton").innerHTML = LOOP_ALL_MUSIC;
        document.querySelector("#loopButton svg").classList.add("disable");
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
            document.querySelector("#loopButton").innerHTML = LOOP_CURRENT_MUSIC;
        break;
        case 3:
            // Reset all loop statuses and loop counter
            isLoopAllMusic = false;
            isLoopCurrentMusic = false;
            loopCounter = 0;
            // Reset the loop button SVG
            document.querySelector("#loopButton").innerHTML = LOOP_ALL_MUSIC;
            document.querySelector("#loopButton svg").classList.add("disable");
        break;
    }
}

// Function to mute or unmute the music
function muteMusic() {
    // Check if the music is currently muted
    if (isMuted) {
        // If it is, unmute the music
        isMuted = false;
        aud.muted = false;
        aud.volume = lastVolume;
        document.getElementById('volumeSlider').value = lastVolume;
        volumeSliderProgress.value = lastVolume;

        if (lastVolume < 0.5) {
            document.querySelector("#muteButton").innerHTML = VOLUME_DOWN;
        }
        else {
            // Update the mute button to show the unmuted icon
            document.querySelector("#muteButton").innerHTML = MUTE_ICON;
        }
    } else {
        // If it is not, mute the music
        isMuted = true;
        aud.muted = true;
        lastVolume = aud.volume;
        aud.volume = 0;
        document.getElementById('volumeSlider').value = 0;
        volumeSliderProgress.value = 0;

        // Update the mute button to show the muted icon
        document.querySelector("#muteButton").innerHTML = MUTED_ICON;
    }
}

document.getElementById('volumeSlider').addEventListener('input', function(e) {
    aud.volume = e.target.value;
    volumeSliderProgress.value = e.target.value;
    if (e.target.value == 0) {
        isMuted = true;
        document.querySelector("#muteButton").innerHTML = MUTED_ICON;
    } 
    else if (e.target.value < 0.5) {
        isMuted = false;
        document.querySelector("#muteButton").innerHTML = VOLUME_DOWN;
    }
    else {
        isMuted = false;
        document.querySelector("#muteButton").innerHTML = MUTE_ICON;
    }
});


function playTheMusicByIndexNumber(indexNumber) {
    // Set the Flag first
    isPlaying = true;
    isPause = false;

    // Get elements from the DOM
    let topicElements = document.getElementsByClassName("music_data_list");
    let musicTitle = document.getElementsByClassName("music_data_title");

    // Get the timer display elements
    let timerEndMinutes = document.querySelector("#timerEndMinutes");
    let timerEndSeconds = document.querySelector("#timerEndSeconds");

    // Reset background color for all topics
    for (var i = 0; i < topicElements.length; i++) {
        topicElements[i].style.background = "";
    }
    // Highlight the selected element
    topicElements[indexNumber].style.background = activeColorMusicList;

    // Update titles
    $("title").text(musicTitle[indexNumber].innerText);
    $(".music_title").text(musicTitle[indexNumber].innerText);

    // Load and play the selected music
    aud.src = data_music_list[indexNumber].src;
    aud.load();
    aud.oncanplaythrough = function() {
        let secs = Math.floor(aud.duration % 60);
        let min = Math.floor(aud.duration / 60);

        // Set the max attribute of the progress and range
        progress.setAttribute("max", Math.floor(aud.duration));
        range.setAttribute("max", Math.floor(aud.duration));

        timerEndSeconds.innerHTML = secs;
        timerEndMinutes.innerHTML = min;
    };
    aud.play();

    // Since it already playing the music. We need to display the Pause Icon.
    document.querySelector("#playMusicButton").innerHTML = PAUSE_ICON;

    lastPlayedIndex = indexNumber;
}

window.onkeyup = function(e) {
    // Check if the event's target is an input field
    if (e.target.tagName.toLowerCase() !== 'input') {
        switch(e.keyCode) {
            /* SPACE */
            case 32:
                playTheCurrentMusic();
                break;
        }
    }
}

/* Bluetooth Earphone Play and Pause support code */
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', function() {    
    if(aud.paused) {
          playTheCurrentMusic();
          console.log("The audio is now playing via bluetooth earphone.");
        }
    });

    navigator.mediaSession.setActionHandler('pause', function() { 
    if(!aud.paused) {
            playTheCurrentMusic();
            console.log("The audio is now paused via bluetooth earphone.");
        }
    });
}

function changeSeekBarBGcolor() {
    // Select the root element
    var root = document.documentElement;
    var randomColor = Math.floor(Math.random() * seekBarColors.length);

    // Change the background color
    root.style.setProperty('--seekBarColor', `${seekBarColors[randomColor]}`);
}
// Callback
changeSeekBarBGcolor();