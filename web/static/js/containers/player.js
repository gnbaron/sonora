import React, { Component, PropTypes } from 'react';
import { bindAsyncActionCreator} from '../utils';
import { connect } from 'react-redux';
import * as playlist from '../redux/modules/playlist';
import classnames from 'classnames';
import shuffle from 'shuffle-array';

const mapStateToProps = (state) => ({
  songs: state.playlist,
  artistsList: state.artists,
  genresList: state.genres
});

const mapDispatchToProps = (dispatch) => ({
  removeSong: bindAsyncActionCreator(playlist.removeSong, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
class PlayerContainer extends Component {

  _delete(e, data) {
    e.stopPropagation();
    this.props.removeSong(data);
  }

  state = {
    active: this.props.songs[0],
    current: 0,
    progress: 0,
    random: false,
    repeat: false,
    mute: false,
    play: this.props.autoplay || false,
    songs: this.props.songs
  }

  componentDidMount = () => {
    let playerElement = this.refs.player;
    playerElement.addEventListener('timeupdate', this.updateProgress);
    playerElement.addEventListener('ended', this.end);
    playerElement.addEventListener('error', this.next);
  }

  componentWillUnmount = () => {
    let playerElement = this.refs.player;
    playerElement.removeEventListener('timeupdate', this.updateProgress);
    playerElement.removeEventListener('ended', this.end);
    playerElement.removeEventListener('error', this.next);
  }

  setProgress = (e) => {
    let target = e.target.nodeName === 'SPAN' ? e.target.parentNode : e.target;
    let width = target.clientWidth;
    let rect = target.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    let duration = this.refs.player.duration;
    let currentTime = (duration * offsetX) / width;
    let progress = (currentTime * 100) / duration;

    this.refs.player.currentTime = currentTime;
    this.setState({ progress: progress });
    this.play();
  }

  updateProgress = () => {
    let duration = this.refs.player.duration;
    let currentTime = this.refs.player.currentTime;
    let progress = (currentTime * 100) / duration;

    this.setState({ progress: progress });
  }

  play = () => {
    this.setState({ play: true });
    this.refs.player.play();
  }

  pause = () => {
    this.setState({ play: false });
    this.refs.player.pause();
  }

  toggle = () => {
    this.state.play ? this.pause() : this.play();
  }

  end = () => {
    this.next();
  }

  next = () => {
    var total = this.state.songs.length;
    let current = this.state.current;
    if(!this.state.repeat){
      if(!this.state.random){
        current = this.state.current < total - 1 ? this.state.current + 1 : 0
      } else {
        current = Math.floor(Math.random() * total)
      }
    }
    var active = this.state.songs[current];
    this.setState({ current: current, active: active, progress: 0 });

    this.refs.player.src = active.url;
    this.play();
  }

  previous = () => {
    var total = this.state.songs.length;
    var current = (this.state.current > 0) ? this.state.current - 1 : total - 1;
    var active = this.state.songs[current];

    this.setState({ current: current, active: active, progress: 0 });

    this.refs.player.src = active.url;
    this.play();
  }

  randomize = () => {
    this.setState({ random: !this.state.random });
  }

  repeat = () => {
    this.setState({ repeat: !this.state.repeat });
  }

  toggleMute = () => {
    let mute = this.state.mute;
    this.setState({ mute: !this.state.mute });
    this.refs.player.volume = (mute) ? 1 : 0;
  }

  renderArtistInfo() {
    const { active } = this.state;
    let { artistsList } = this.props;
    return filterList(artistsList, active.artist_id).name;
  }

  render () {

    const { active, play, progress } = this.state;

    let playPauseClass = classnames('fa', {'fa-pause': play}, {'fa-play': !play});
    let volumeClass = classnames('fa', {'fa-volume-up': !this.state.mute}, {'fa-volume-off': this.state.mute});
    let volumeControlClass = classnames('player-btn small volume', {'active': !this.state.mute});
    let repeatClass = classnames('player-btn small repeat', {'active': this.state.repeat});
    let randomClass = classnames('player-btn small random', {'active': this.state.random });

    return (
      <div className="player-container">
        <audio src={active.url} autoPlay={this.state.play} preload="auto" ref="player"></audio>

        <div className="artist-info">
          <h2 className="artist-name">{::this.renderArtistInfo}</h2>
          <h3 className="artist-song-name">{active.title}</h3>
        </div>

        <div className="player-progress-container" onClick={this.setProgress}>
          <span className="player-progress-value" style={{width: progress + '%'}}></span>
        </div>

        <div className="player-options">
          <div className="player-buttons player-controls">
            <button onClick={this.toggle} className="player-btn big" title="Play/Pause">
              <i className={playPauseClass} />
            </button>

            <button onClick={this.previous} className="player-btn medium" title="Previous Song">
              <i className="fa fa-backward" />
            </button>

            <button onClick={this.next} className="player-btn medium" title="Next Song">
              <i className="fa fa-forward" />
            </button>
          </div>

          <div className="player-buttons">
            <button className={volumeControlClass} onClick={this.toggleMute} title="Mute/Unmute">
              <i className={volumeClass} />
            </button>

            <button className={repeatClass} onClick={this.repeat} title="Repeat">
              <i className="fa fa-repeat" />
            </button>

            <button className={randomClass} onClick={this.randomize} title="Shuffle">
              <i className="fa fa-random" />
            </button>
          </div>

        </div>
      </div>
    );
  }
}

let filterList = (list, id) => {
  return list.filter(a => a.id == id)[0];
}

PlayerContainer.propTypes = {
  autoplay: PropTypes.bool
};

export default PlayerContainer;
