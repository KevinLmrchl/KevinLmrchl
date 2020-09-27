/*
 * Copyright (C) 2016 Patrick15a <patrick.loebbe@gmail.com>
 *
 * Ce programme est un logiciel libre: vous pouvez le redistribuer et / ou le * *  *  modifier
 * sous les termes de la GNU General Public License telle que publiée par
 * la Free Software Foundation, soit la version 3 de la licence, soit
 * (à votre choix) toute version ultérieure.
 *
 * ce programme est diffusé dans l'espoir qu'il sera utile,
 * mais SANS AUCUNE GARANTIE; sans même la garantie implicite
 * QUALITÉ MARCHANDE ou ADAPTATION À UN USAGE PARTICULIER.
 * Licence publique générale GNU pour plus de détails.
 *
 * Vous devriez avoir reçu une copie de la licence publique générale GNU
 * avec ce programme. Sinon, consultez <http://www.gnu.org/licenses/>.
 */
/*
 *
 * @Autheur Patrick15a <patrick15a@myfilehost.de>
 *
 * Traduction proposer par KevinLmrchl
 */
registerPlugin({
    name: 'YT-Search',
    version: '2.1',
    description: 'Recherche la playlist actuel sur Youtube!',
    author: 'Patrick15a <patrick15a@myfilehost.de>',
	vars: [
		{
			name: 'ytCommand',
			title: 'YouTube Search-Command',
			type: 'string',
			placeholder: 'Default: !ytsearch'
		},
		{
            name: 'scCommand',
            title: 'SoundCloud Search-Command',
            type: 'string',
            placeholder: 'Default: !scsearch'
		},
		{
			name: 'prefix',
			title: 'Prefix',
			type: 'string',
			placeholder: 'Default: [b][COLOR=#aa0000][[/COLOR][COLOR=#005500]YT-Search[/COLOR][COLOR=#aa0000]][/COLOR][/b]'
		}
	]
}, function(sinusbot, config) {
	
	var backend = require('backend');
	var event = require('event');
	var audio = require('audio');
	var media = require('media');
	
	//Set Default's
	if (typeof config.prefix == 'undefined' || config.prefix === '') {
		var prefix = '[b][COLOR=#aa0000][[/COLOR][COLOR=#005500]YTsearch[/COLOR][COLOR=#aa0000]][/COLOR][/b]';
	}
	if (typeof config.ytCommand == 'undefined' || config.ytCommand === '') {
		var ytcmd = '!ytsearch';
	}
	if (typeof config.scCommand == 'undefined' || config.scCommand === '') {
        var sccmd = '!scsearch';
	}
	
	//Get current TrackInfos
	function getTrack() {
		var track = media.getCurrentTrack();
		
		if (typeof track.tempTitle() != 'undefined' && track.tempTitle() != '') {
			var title = track.tempTitle();
		} else if (track.title() != 'undefined' && track.title() != '') {
			var title = track.title();
		} else {
			var title = '';
		}
		if (typeof track.tempArtist() != 'undefined' && track.tempArtist() != '') {
			var artist = track.tempArtist();
        } else if (track.artist() != 'undefined' && track.artist() != '') {
			var artist = track.artist();
		} else if (typeof track.album() != 'undefined' && track.album() != ''){
			var artist = track.album();
		} else {
			var artist = '';
		}
		
		title = title.replace(/ /g, '+');
		title = title.replace(/&/g, '%26');
		title = title.replace(/'?'/g, '%3F');
		
		artist = artist.replace(/ /g, '+');
		artist = artist.replace(/&/g, '%26');
		artist = artist.replace(/'?'/g, '%3F');
		
		var search = artist + '+-+' + title;
		
		return search;
	}
	
	//Create Search-link
	function getSearchLink(provider) {
        
        var search = getTrack();
        
		if (provider == 'youtube') {
            var track = media.getCurrentTrack();
			if (track.type() == 'ytdl' && typeof track.url() != 'undefined') {
				var ytwatch = 'https://www.youtube.com/watch?v='
				var ytlink = ytwatch + track.url().split('url=')[1];
				var finishlink = '[URL=' + ytlink + ']Youtube[/URL]';
			} else {
				
				var ytsearchquery = 'https://www.youtube.com/results?search_query=';
				var ytlink = ytsearchquery + search;
				var finishlink = '[URL=' + ytlink + ']Youtube[/URL]';
			}
			
            
			
		} else if (provider == 'soundcloud') {
            
            var scsearchquery = 'https://soundcloud.com/search?q=';
            var sclink = scsearchquery + search;
            
            var finishlink = '[URL=' + sclink + ']SoundCloud[/URL]';
			
		}
		
		return finishlink;
	}
	
	//Send Message with Search-Link to User
	event.on('chat', function(ev) {
		
		if (audio.isPlaying()) {
			switch (ev.text) {
				case ytcmd:
					link = getSearchLink('youtube');
					ev.client.chat(prefix + ' Recherche la playlist actuel sur ' + link + '.');
				break;
				
				case sccmd:
					link = getSearchLink('soundcloud');
					ev.client.chat(prefix + ' Recherche la playlist actuel sur ' + link + '.');
				break;
			}
		} else {
			switch (ev.text) {
				case ytcmd:
					ev.client.chat(prefix + ' Desoler mais le bot ne joue pas de musique actuellement.');
				break;
				
				case sccmd:
					ev.client.chat(prefix + ' Desoler mais le bot ne joue pas de musique actuellement.');
				break;
			}
		}
		
	});
});