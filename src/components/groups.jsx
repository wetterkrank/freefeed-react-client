import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

import { pluralForm } from '../utils';

import { acceptGroupRequest, rejectGroupRequest } from '../redux/action-creators';
import { tileUserListFactory, WITH_REQUEST_HANDLES, PLAIN } from './tile-user-list';
import ErrorBoundary from './error-boundary';

const TileListWithAcceptAndReject = tileUserListFactory({
  type: WITH_REQUEST_HANDLES,
  displayQuantity: true,
});
const TileList = tileUserListFactory({ type: PLAIN, displayQuantity: true });

class RequestsToGroup extends PureComponent {
  handleAccept = (username) => {
    this.props.accept(this.props.groupRequest.username, username);
  };

  handleReject = (username) => {
    this.props.reject(this.props.groupRequest.username, username);
  };

  render() {
    const { groupRequest } = this.props;

    const count = groupRequest.requests.length;
    const groupName = groupRequest.screenName;
    const header = `${pluralForm(count, 'Request', null, 'w')} to join ${groupName}`;

    return (
      <div>
        <TileListWithAcceptAndReject
          header={header}
          users={groupRequest.requests}
          acceptRequest={this.handleAccept}
          rejectRequest={this.handleReject}
        />
      </div>
    );
  }
}

const GroupsHandler = (props) => {
  const groupRequests = props.groupRequests.map((groupRequest) => {
    return (
      <RequestsToGroup
        key={groupRequest.id}
        accept={props.acceptGroupRequest}
        reject={props.rejectGroupRequest}
        groupRequest={groupRequest}
      />
    );
  });

  return (
    <div className="box">
      <ErrorBoundary>
        <div className="box-header-timeline" role="heading">
          Groups
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-8">All the groups you are subscribed to</div>
            <div className="col-md-4 text-right">
              <Link to="/groups/create">Create a group</Link>
            </div>
          </div>

          {groupRequests ? <div>{groupRequests}</div> : false}

          <TileList {...props.myGroups} />
          <TileList {...props.groupsIAmIn} />
        </div>
        <div className="box-footer" />
      </ErrorBoundary>
    </div>
  );
};

function selectState(state) {
  const groupRequests = state.managedGroups.filter((group) => group.requests.length) || [];

  const managedIds = new Set(_.map(state.managedGroups, (g) => g.id));
  const sortingRule = (g) => -(g.updatedAt || g.createdAt);

  const allGroups = Object.values(state.users).filter((u) => u.type === 'group');
  const adminGroups = allGroups.filter((g) => managedIds.has(g.id));
  const regularGroups = allGroups.filter((g) => !managedIds.has(g.id));

  const myGroups = {
    header: 'Groups you admin',
    users: _.sortBy(adminGroups, sortingRule),
  };

  const groupsIAmIn = {
    header: 'Groups you are in',
    users: _.sortBy(regularGroups, sortingRule),
  };

  return { groupRequests, myGroups, groupsIAmIn };
}

function selectActions(dispatch) {
  return {
    acceptGroupRequest: (...args) => dispatch(acceptGroupRequest(...args)),
    rejectGroupRequest: (...args) => dispatch(rejectGroupRequest(...args)),
  };
}

export default connect(selectState, selectActions)(GroupsHandler);
