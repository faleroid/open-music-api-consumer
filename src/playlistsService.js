const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
  const queryPlaylist = {
    text: `SELECT playlists.id, playlists.name, users.username
           FROM playlists
           LEFT JOIN users ON users.id = playlists.owner
           WHERE playlists.id = $1`,
    values: [playlistId],
  };

  const resultPlaylist = await this._pool.query(queryPlaylist);
  if (!resultPlaylist.rowCount) throw new Error('Playlist not found');

  const querySongs = {
    text: `SELECT songs.id, songs.title, songs.performer
           FROM playlist_songs
           LEFT JOIN songs ON songs.id = playlist_songs.song_id
           WHERE playlist_songs.playlist_id = $1`,
    values: [playlistId],
  };

  const resultSongs = await this._pool.query(querySongs);

  return {
    playlist: {
      id: resultPlaylist.rows[0].id,
      name: resultPlaylist.rows[0].name,
      songs: resultSongs.rows,
    },
  };
}

}

module.exports = PlaylistsService;