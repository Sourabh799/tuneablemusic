console.log('lets write javascript')



let x = document.getElementById('menu');
let micon = document.getElementById('menuicon');
let cicon = document.getElementById('closeicon');
let currentAudio = new Audio(); // Playbar's audio object
let currentSong = new Audio(); // Playbar's audio object
let play = document.getElementById("play"); // Playbar play button
let progress = document.getElementById("progress"); // Progress bar
let songIndex = null; // Track current song
let songs;









function openmenu() {
  x.style.display = 'block'
  cicon.style.display = 'block'
  micon.style.display = 'none'
}
function closemenu() {
  x.style.display = 'none'
  cicon.style.display = 'none'
  micon.style.display = 'block'
}




function togglePlay(songId) {
  let audio = document.getElementById(songId);

  if (currentSong && currentSong !== audio) {
    currentSong.pause();
    currentSong.currentTime = 0; // Reset previous song
    play.src = "playbar/pause-button.png"
  }

  if (audio.paused) {
    audio.currentTime = 0; // Restart the song
    audio.play();
    currentSong = audio;
    play.src = "playbar/pause-button.png"
  } else {
    audio.currentTime = 0; // Restart the song even if it's already playing
    audio.play();
  }

  // function secondsToMinutesSeconds(seconds) {
  //   if (isNaN(seconds) || seconds < 0) {
  //     return "invalid input";
  //   }

  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = Math.floor(seconds % 60);

  //   // Format minutes and seconds to always have two digits
  //   const formattedMinutes = String(minutes).padStart(2, '0');
  //   const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  //   return `${formattedMinutes}:${formattedSeconds}`;
  // }


  // document.querySelector(".songinfo").innerHTML = decodeURI(currentSong.currentSrc)
  // document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}








// Function to play a song from a card

function item(songSrc) {
  if (currentSong.src !== songSrc) {
    currentSong.src = songSrc; // Update playbar audio
    currentSong.play();
    play.src = "playbar/pause-button.png";
  }
}





function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds to always have two digits
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}





async function getSongs() {

  let a = await fetch('http://127.0.0.1:3000/songs/')
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1])
    }
  }
  return songs


}

const playMusic = (track, pause = false) => {
  // audioplayer = new Audio("/songs/" + track)
  currentSong.src = "/songs/" + track
  if (!pause) {
    currentSong.play()
    play.src = "playbar/pause-button.png";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {





  songs = await getSongs(); // Assuming this returns an array of song URLs
  playMusic(songs[0], true)

  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> <img src="sidebar/image4.png" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                
                            </div>
                            <div class="playnow">
                                <span>playnow</span>
                                <button><img src="playbar/play.png" alt=""></button>
                            </div></li>`;
  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "playbar/pause-button.png";
    } else {
      currentSong.pause();
      play.src = "playbar/play.png";
    }
  });


  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)
      }`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  previous.addEventListener("click", () => {
    console.log("previous clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0)
      playMusic(songs[index - 1])
  })

  forward.addEventListener("click", () => {
    console.log("forward clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    } else {
      playMusic(songs[0]);
    }
  })
  currentSong.addEventListener("ended", () => {
    console.log("Song ended. Playing next...");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    } else {
      playMusic(songs[0]);
    }
  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("setting volume to", e.target.value, "/100")
    currentSong.volume = parseInt(e.target.value) / 100

  })

}

main();



