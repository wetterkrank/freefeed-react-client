/* global CONFIG */
import { Component } from 'react';
import { Link } from 'react-router';

import { preventDefault } from '../utils';
import { Throbber } from './throbber';

import GroupFeedTypePicker from './group-feed-type-picker';

export default class GroupCreateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      screenName: '',
      description: '',
      isPrivate: '0',
      isProtected: '0',
      isRestricted: '0',
    };
  }

  handleChange = (property) => (event) => {
    const newState = {};
    newState[property] = event.target.value;
    this.setState(newState);
  };

  handlePrivacyTypeChange = (privacySettings) => {
    this.setState(privacySettings);
  };

  saveSettings = () => {
    if (this.props.status !== 'loading') {
      this.props.createGroup(this.state);
    }
  };

  componentWillUnmount() {
    this.props.resetGroupCreateForm();
  }

  render() {
    return (
      <div>
        {this.props.status !== 'success' ? (
          <form onSubmit={preventDefault(this.saveSettings)}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                className="form-control"
                name="username"
                type="text"
                value={this.state.username}
                onChange={this.handleChange('username')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="screenName">Display name:</label>
              <input
                id="screenName"
                className="form-control"
                name="screenName"
                type="text"
                value={this.state.screenName}
                onChange={this.handleChange('screenName')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                className="form-control"
                name="description"
                value={this.state.description}
                onChange={this.handleChange('description')}
                maxLength={CONFIG.maxLength.description}
              />
            </div>
            <GroupFeedTypePicker
              isPrivate={this.state.isPrivate}
              isProtected={this.state.isProtected}
              isRestricted={this.state.isRestricted}
              updateGroupPrivacySettings={this.handlePrivacyTypeChange}
            />
            <p>
              <button className="btn btn-default" type="submit">
                Create
              </button>
              {this.props.status === 'loading' ? (
                <span className="settings-throbber">
                  <Throbber />
                </span>
              ) : (
                false
              )}
            </p>
          </form>
        ) : (
          false
        )}

        {this.props.status === 'success' ? (
          <div className="alert alert-info" role="alert">
            Group has been created. <Link to={this.props.groupUrl}>Go to the group page »</Link>
          </div>
        ) : this.props.status === 'error' ? (
          <div className="alert alert-danger" role="alert">
            {this.props.errorMessage}
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
