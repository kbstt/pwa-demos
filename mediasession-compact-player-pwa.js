//initialize the demo tracks
let tracks = [
	{title: "Random Song Demo", artist: "John Doe", album: "Random Album Name", source: "https://raw.githubusercontent.com/kbstt/pwa-demos/main/track1.mp3", artwork: [{ src: 'https://raw.githubusercontent.com/kbstt/pwa-demos/main/track1.jpg', sizes: '512x512', type: 'image/jpeg' }]},
	{title: "Awesome Track Demo", artist: "Jane Doe", album: "Another Album", source: "https://raw.githubusercontent.com/kbstt/pwa-demos/main/track2.mp3", artwork: [{ src:'https://raw.githubusercontent.com/kbstt/pwa-demos/main/track2.jpg', sizes: '512x512', type: 'image/jpeg' }]},
];
		
//these are our basic custom audio controls 
//in a real-world scenario, there would be more controls (previous track, next track, volume, etc)
//in this example, it only allows to pause and play
let playBtn = function(){return document.getElementById('play-btn');}
let pauseBtn = function(){return document.getElementById('pause-btn');}
		
//we create the <audio> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
let container = document.getElementById('player');
let audio = document.createElement('audio');
audio.setAttribute('controls', true);
container.appendChild(audio);
				
//this variable keeps in memory the index of the currently-playing song from the "tracks" array
//we get the first track in the list and set it as the current track
//you'd probably do this differently in a real-world scenario
let currentTrack = 0;
audio.src = tracks[currentTrack].source;
		
//this changes the src of the <audio> element to that of the next track (or back to the first once we've reached the end of the list)
function nextTrack(){
	currentTrack += 1;
	if (currentTrack >= tracks.length) { currentTrack = 0; }
	audio.src = tracks[currentTrack].source;
	playTrack();
}
		
//this changes the src of the <audio> element to that of the previous track (or the last one in the list if we're pressing previous when we're already playing the first)
function prevTrack(){
	currentTrack -= 1;
	if (currentTrack < 0) { currentTrack = tracks.length - 1; }
	audio.src = tracks[currentTrack].source;
	playTrack();
}
				
//call the play() function of the native <audio> element
//then update the compact player to show the details of the song with MediaSession
function playTrack(){
  	audio.play(); 
  	setMediaSession();
	//some utility functions to hide/show our play/pause buttons custom controls in our app
  	pauseBtn().classList.remove('hidden');
  	playBtn().classList.add('hidden');	
}
		
function pauseTrack(){
	audio.pause();
	//some utility functions to hide/show our play/pause buttons custom controls in our app
	playBtn().classList.remove('hidden');
	pauseBtn().classList.add('hidden');
	//we pause the playback state of the compact player
	navigator.mediaSession.playbackState = "paused";
}
		
//we reload the audio, and pause it.
function stopTrack(){
	audio.load();
	audio.pause();
}
		
//here is how you update the compact player with the details of the track/album/artist along with a artwork
//reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaSession
function setMediaSession(){
	//some browsers may not support this
	if (!navigator.mediaSession) {return;}
	let trackPlaying = tracks[currentTrack];			
	navigator.mediaSession.metadata = new MediaMetadata({ title: trackPlaying.title, artist: trackPlaying.artist, album: trackPlaying.album, artwork: trackPlaying.artwork});
	//you also need to tie the controls of the compact player back to the controls of the <audio> element on the page
	//haven't implemented functions for seekbackward, seekforward, and seekto. See reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaSession
	navigator.mediaSession.setActionHandler('play', playTrack);
	navigator.mediaSession.setActionHandler('pause', pauseTrack);
	navigator.mediaSession.setActionHandler('stop', stopTrack);
	navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
	navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
	//navigator.mediaSession.setActionHandler('seekbackward', function(){});
	//navigator.mediaSession.setActionHandler('seekforward',  function(){});
	//navigator.mediaSession.setActionHandler('seekto', function(){});
	navigator.mediaSession.playbackState = "playing";
}
		
//we report the playback position to compact player every 300ms
//if there is no audio playing or if the audio hasn't been fully parsed yet, we end the function earlier
//https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState
setInterval(function(){
 	if (!audio || audio.paused){return;}
	if (!navigator.mediaSession) {return;}
	if (audio.duration > 0 === false){return;}
	navigator.mediaSession.setPositionState({duration: parseInt(audio.duration), playbackRate: audio.playbackRate, position: parseInt(audio.currentTime) });
}, 300);
			
//when the player finishes a track, make the <audio> play the next one
//reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
audio.addEventListener("ended", nextTrack);
			
