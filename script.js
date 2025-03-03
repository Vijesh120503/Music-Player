let currentSongIndex = 0;
let songs = { anirudh: [], arijith: [], rahman: [], yuvan: [], latest: [] };
let searchResults = [];
const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const musicTitle = document.getElementById("music-title");
const musicImage = document.getElementById("music-image");
const progressBarContainer = document.getElementById("progress-bar-container");
const progressBar = document.getElementById("progress-bar");
const searchInput = document.getElementById("search");
const searchResultsContainer = document.getElementById("search-results");
musicImage.src ='https://raw.githubusercontent.com/vijesh0512/image/refs/heads/main/DALL%C2%B7E%202024-09-21%2012.26.50%20-%20A%20close-up%20of%20a%20black%20and%20white%20pitbull%20dog%20wearing%20a%20gold%20chain.%20The%20dog%20is%20sitting%20indoors%20and%20smiling%20with%20its%20tongue%20slightly%20out.%20The%20white%20fur%20o.webp'

const artistMap = {
  anirudh: "anirudh%20tamil",
  rahman: "rahman%20tamil",
  latest: "latest%20tamil",
  yuvan: "yuvan%20tamil",
  pradeep: "pradeepkumar%20tamil",
  sid:"sid%20tamil",
};

async function fetchSongs(artistKey, query) {
  const response = await fetch(`https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=${query}`);
  const data = await response.json();
  songs[artistKey] = data.data.results.map(song => ({
    name: song.name,
    image: song.image[2]?.link,
    audioUrl: song.downloadUrl?.find(url => url.quality === "320kbps")?.link || song.downloadUrl?.[0]?.link,
    primaryArtists: song.primaryArtists,
    year: song.year,
  }));
  displaySongs(artistKey);
}

function displaySongs(artistKey) {
  document.getElementById(artistKey).innerHTML = songs[artistKey]
    .map((song, index) => `
      <div class='song-card' onclick="playSong('${artistKey}', ${index})">
        <img src='${song.image}' alt='${song.name}'>
        <h3>${song.name}</h3>
        <p>${song.primaryArtists}</p>
        <span>${song.year}</span>
      </div>
    `).join('');
}

function playSong(artistKey, index) {
  currentSongIndex = index;
  const song = songs[artistKey][index];
  if (!song.audioUrl) return alert("Audio not available!");
  
  audioPlayer.src = song.audioUrl;
  audioPlayer.play();
  musicTitle.textContent = song.name;
  musicImage.src = song.image;
  playPauseBtn.textContent = "⏸";
}

async function searchSongs(query) {
  if (!query.trim()) {
    searchResultsContainer.innerHTML = ""; 
    return;
  }

  const response = await fetch(`https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=${encodeURIComponent(query)}`);
  const data = await response.json();

  if (!data.data || !data.data.results) return;

  searchResults = data.data.results.map(song => ({
    name: song.name,
    image: song.image[2]?.link,
    audioUrl: song.downloadUrl?.find(url => url.quality === "320kbps")?.link || song.downloadUrl?.[0]?.link,
    primaryArtists: song.primaryArtists,
    year: song.year,
  }));

  displaySearchResults();
}

function displaySearchResults() {
  searchResultsContainer.innerHTML = searchResults
    .map((song, index) => `
      <div class='song-card' onclick="playSearchSong(${index})">
        <img src='${song.image}' alt='${song.name}'>
        <h3>${song.name}</h3>
        <p>${song.primaryArtists}</p>
        <span>${song.year}</span>
      </div>
    `).join('');
}

function playSearchSong(index) {
  const song = searchResults[index];
  if (!song.audioUrl) return alert("Audio not available!");

  audioPlayer.src = song.audioUrl;
  audioPlayer.play();
  musicTitle.textContent = song.name;
  musicImage.src = song.image;
  playPauseBtn.textContent = "⏸";
}

searchInput.addEventListener("input", () => {
  searchSongs(searchInput.value);
});

playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audioPlayer.pause();
    playPauseBtn.textContent = "▶";
  }
});

nextBtn.addEventListener("click", () => playSong("anirudh", (currentSongIndex + 1) % songs.anirudh.length));
prevBtn.addEventListener("click", () => playSong("anirudh", (currentSongIndex - 1 + songs.anirudh.length) % songs.anirudh.length));

audioPlayer.addEventListener("timeupdate", () => {
  progressBar.style.width = `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`;
});

progressBarContainer.addEventListener("click", (event) => {
  audioPlayer.currentTime = (event.offsetX / progressBarContainer.clientWidth) * audioPlayer.duration;
});

Object.entries(artistMap).forEach(([key, query]) => fetchSongs(key, query));
