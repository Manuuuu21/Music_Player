// Initialize audio object and interval variable
let aud = new Audio();
let audioInterval;

let lastPlayedIndex;

// Seek Progress bar and range of the music player
let progress = document.getElementById("myProgress");
let range = document.getElementById("myRange");

// Music Controllers (default value)
let isPlaying = false;
let isPause = true;
let isMuted = false;
let isShuffleEnabled = false;
let isLoopAllMusic = false;
let isLoopCurrentMusic = false;

let activeColorMusicList = "rgba(0, 0, 0, 0.2)";

// volume of the music player
// 0 equal to mute
// 1 equal to 100% Volume
let lastVolume = 1;

let volumeSliderProgress = document.getElementById("volumeSliderProgress");

/* Loop counter states:
 * 1 = isLoopAllMusic is set to true
 * 2 = isLoopCurrentMusic is set to true 
 * 3 = disable the loopButton */
let loopCounter = 0;

let seekBarColors = ["linear-gradient(to right, red, orange)", "#3232ff", "red", "#00bc00", "gold"];
let lastSeekBarColor;

// Music SVG Icons
const PAUSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/></svg>`;
const PLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
const MUTE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z"/></svg>`;
const MUTED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Z"/></svg>`;
const VOLUME_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M200-360v-240h160l200-200v640L360-360H200Zm440 40v-322q45 21 72.5 65t27.5 97q0 53-27.5 96T640-320Z"/></svg>`
const LOOP_CURRENT_MUSIC = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M460-360v-180h-60v-60h120v240h-60ZM280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/></svg>`;
const LOOP_ALL_MUSIC = `<svg class="disable" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/></svg>`;
const REPLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg>`;









